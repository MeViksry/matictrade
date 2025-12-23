// backend/src/services/admin.service.ts - FULL UPDATED VERSION
import { PrismaClient, Prisma, UserRole, SubscriptionStatus, PaymentStatus, SubscriptionPlan } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, subDays, format } from 'date-fns'
import { logger } from '../utils/logger'
import { sendEmail } from '../utils/email'

const prisma = new PrismaClient()

export class AdminService {
  /**
   * Get users with filtering and pagination
   */
  async getUsers(params: {
    page: number
    limit: number
    search?: string
    role?: UserRole
    isActive?: boolean
    botActive?: boolean
    subscriptionStatus?: SubscriptionStatus
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page, limit, search, role, isActive, botActive, subscriptionStatus, sortBy = 'createdAt', sortOrder = 'desc' } = params
    const skip = (page - 1) * limit


    // Subscription fields that need special handling for sorting
    const subscriptionSortFields = ['endDate', 'startDate', 'price', 'plan', 'status', 'paymentStatus']
    const isSubscriptionSort = subscriptionSortFields.includes(sortBy)

    // Build orderBy based on whether it's a subscription field or user field
    let orderBy: Prisma.UserOrderByWithRelationInput
    if (isSubscriptionSort) {
      orderBy = {
        subscription: {
          [sortBy]: sortOrder
        }
      }
    } else {
      orderBy = { [sortBy]: sortOrder }
    }

    const where: Prisma.UserWhereInput = {}

    // Search by email, username, or fullName
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by role
    if (role) {
      where.role = role
    }

    // Filter by active status
    if (isActive !== undefined) {
      where.isActive = isActive
    }

    // Filter by bot active status
    if (botActive !== undefined) {
      where.botActive = botActive
    }

    // Filter by subscription status
    if (subscriptionStatus) {
      where.subscription = {
        status: subscriptionStatus
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          phone: true,
          address: true,
          role: true,
          isActive: true,
          botActive: true,
          isEmailVerified: true,
          lastLoginAt: true,
          lastActiveAt: true,
          loginCount: true,
          totalSpent: true,
          createdAt: true,
          updatedAt: true,
          subscription: {
            select: {
              id: true,
              plan: true,
              status: true,
              price: true,
              startDate: true,
              endDate: true,
              paymentStatus: true
            }
          },
          profile: {
            select: {
              avatar: true
            }
          },
          _count: {
            select: {
              apiKeys: true,
              orders: true,
              tradeHistory: true,
              notifications: true
            }
          }
        },

        orderBy,
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Add computed fields
    const usersWithComputed = users.map(user => ({
      ...user,
      subscription: user.subscription ? {
        ...user.subscription,

        daysRemaining: user.subscription.endDate
          ? Math.ceil((new Date(user.subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null,
        isExpiringSoon: user.subscription.endDate
          ? (new Date(user.subscription.endDate).getTime() - Date.now()) <= (3 * 24 * 60 * 60 * 1000)
          : false
      } : null
    }))


    return {
      users: usersWithComputed,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  /**
   * Get user by ID with full details
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        subscription: {
          include: {
            payments: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 10
            }
          }
        },
        apiKeys: {
          select: {
            id: true,
            exchange: true,
            isActive: true,
            isValid: true,
            lastValidated: true,
            createdAt: true
          }
        },
        portfolio: true,
        botSettings: true,
        notifications: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        },
        adminLogs: {
          where: {
            targetUserId: userId
          },
          include: {
            admin: {
              select: {
                id: true,
                email: true,
                fullName: true,
                username: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        },
        _count: {
          select: {
            orders: true,
            tradeHistory: true,
            webhookLogs: true,
            positions: true,
            notifications: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Get performance metrics
    const metrics = await prisma.performanceMetrics.findUnique({
      where: { userId }
    })

    // Get recent trade history
    const recentTrades = await prisma.tradeHistory.findMany({
      where: { userId },
      orderBy: { closedAt: 'desc' },
      take: 10
    })


    // Calculate total volume from all trades
    const allTrades = await prisma.tradeHistory.findMany({
      where: { userId },
      select: {
        quantity: true,
        entryPrice: true,
        leverage: true
      }
    })

    const totalVolume = allTrades.reduce((sum, trade) => {
      return sum + (trade.quantity * trade.entryPrice * trade.leverage)
    }, 0)

    // Get payment history
    const paymentHistory = await prisma.paymentHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Remove sensitive data
    const { password, emailVerifyCode, resetPasswordToken, resetPasswordExpiry, ...userWithoutSensitive } = user

    return {
      ...userWithoutSensitive,

      metrics: {
        ...metrics,
        totalVolume
      },
      recentTrades,
      paymentHistory
    }
  }

  /**
   * Create user manually by admin
   */
  async createUser(data: {
    email: string
    username: string
    password: string
    fullName: string
    phone?: string
    address?: string
    role: UserRole
    subscriptionPlan: SubscriptionPlan
    subscriptionPrice: number
    customDuration?: number
    autoRenew?: boolean
    paymentMethod: string
    adminNotes?: string
  }) {
    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    })

    if (existingUser) {
      throw new Error('Email or username already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Calculate end date based on plan
    const startDate = new Date()
    let endDate: Date
    let duration: number

    switch (data.subscriptionPlan) {
      case 'MONTHLY':
        duration = data.customDuration || 30
        endDate = addDays(startDate, duration)
        break
      case 'YEARLY':
        duration = data.customDuration || 365
        endDate = addDays(startDate, duration)
        break
      case 'CUSTOM':
        duration = data.customDuration || 30
        endDate = addDays(startDate, duration)
        break
      default: // FREE
        duration = 0
        endDate = addDays(startDate, 9999) // Far future
    }

    // Create user with all related data
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        role: data.role,
        isActive: data.role === 'USER' ? true : true, // Auto activate for users
        isEmailVerified: true, // Auto verify for admin-created users
        botActive: data.role === 'USER', // Enable bot for regular users
        profile: {
          create: {
            phone: data.phone,
            address: data.address
          }
        },
        subscription: {
          create: {
            plan: data.subscriptionPlan,
            status: 'ACTIVE',
            price: data.subscriptionPrice,
            startDate: startDate,
            endDate: endDate,
            autoRenew: data.autoRenew || false,
            paymentMethod: data.paymentMethod as any,
            paymentStatus: 'PAID',
            paymentDate: startDate,
            customDuration: data.customDuration,
            adminNotes: data.adminNotes,
            nextReminderDate: addDays(endDate, -3) // Set reminder 3 days before expiry
          }
        },
        portfolio: {
          create: {
            totalBalance: 0,
            availableBalance: 0,
            equity: 0
          }
        },
        botSettings: {
          create: {
            isEnabled: data.role === 'USER',
            maxPositions: 1, // Fixed at 1 for users
            defaultLeverage: 1, // User can set 1-3x
            maxLeverage: 3, // Max 3x for users
            riskPerTrade: 10, // Default 10% for Order Size
            stopLossPercent: 5,
            takeProfitPercent: 10
          }
        }
      },
      include: {
        subscription: true,
        profile: true
      }
    })

    // Create payment record
    if (data.subscriptionPrice > 0) {
      await prisma.paymentHistory.create({
        data: {
          userId: user.id,
          amount: data.subscriptionPrice,
          currency: 'IDR',
          paymentMethod: data.paymentMethod as any,
          status: 'PAID',
          paidAt: new Date(),
          adminNotes: data.adminNotes || 'Account created by admin'
        }
      })
    }

    // Send welcome email
    try {

      const welcomeHtml = `
        <h1>Welcome to Matic-Trade!</h1>
        <p>Hello ${data.fullName},</p>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Username:</strong> ${data.username}</p>
        <p><strong>Password:</strong> ${data.password}</p>
        <p><strong>Subscription Plan:</strong> ${data.subscriptionPlan}</p>
        <p><strong>Subscription End Date:</strong> ${format(endDate, 'dd MMMM yyyy')}</p>
        <p>Login at: <a href="${process.env.FRONTEND_URL}/auth/login">${process.env.FRONTEND_URL}/auth/login</a></p>
      `
      await sendEmail(data.email, 'Your Matic-Trade Account Has Been Created', welcomeHtml)
    } catch (error) {
      logger.error('Failed to send welcome email:', error)
    }

    logger.info(`User ${user.id} created manually by admin`)

    return user
  }

  /**
   * Update user profile
   */
  async updateUser(

    userId: string,
    data: {
      fullName?: string
      phone?: string
      address?: string
      role?: UserRole
      isActive?: boolean
      botActive?: boolean
    },
    adminId: string,
    ipAddress: string
  ) {
    const updateData: Prisma.UserUpdateInput = {}

    if (data.fullName !== undefined) updateData.fullName = data.fullName
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address
    if (data.role !== undefined) updateData.role = data.role
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.botActive !== undefined) {
      updateData.botActive = data.botActive
      // Also update bot settings
      await prisma.botSettings.update({
        where: { userId },
        data: { isEnabled: data.botActive }
      })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    // Log admin action
    await this.logAdminAction(
      adminId,
      userId,
      'UPDATE_USER',
      data,
      ipAddress
    )

    logger.info(`User ${userId} updated by admin ${adminId}`)

    return user
  }

  /**
   * Update user subscription
   */
  async updateUserSubscription(
    userId: string,
    data: {
      plan?: SubscriptionPlan
      status?: SubscriptionStatus
      price?: number
      startDate?: Date
      endDate?: Date
      autoRenew?: boolean
      customDuration?: number
      adminNotes?: string
    },
    adminId: string,
    ipAddress: string
  ) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    const updateData: Prisma.SubscriptionUpdateInput = {}

    if (data.plan !== undefined) updateData.plan = data.plan
    if (data.status !== undefined) updateData.status = data.status
    if (data.price !== undefined) updateData.price = data.price
    if (data.startDate !== undefined) updateData.startDate = data.startDate
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate
      // Update next reminder date (3 days before end date)
      updateData.nextReminderDate = addDays(data.endDate, -3)
    }
    if (data.autoRenew !== undefined) updateData.autoRenew = data.autoRenew
    if (data.customDuration !== undefined) updateData.customDuration = data.customDuration
    if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes

    const updatedSubscription = await prisma.subscription.update({
      where: { userId },
      data: updateData
    })

    // If subscription is expired or cancelled, disable bot
    if (data.status === 'EXPIRED' || data.status === 'CANCELLED') {
      await prisma.user.update({
        where: { id: userId },
        data: { botActive: false }
      })

      await prisma.botSettings.update({
        where: { userId },
        data: { isEnabled: false }
      })
    }

    // If subscription is activated, enable bot
    if (data.status === 'ACTIVE') {
      await prisma.user.update({
        where: { id: userId },
        data: { botActive: true }
      })

      await prisma.botSettings.update({
        where: { userId },
        data: { isEnabled: true }
      })
    }

    // Log admin action
    await this.logAdminAction(
      adminId,
      userId,
      'UPDATE_SUBSCRIPTION',
      data,
      ipAddress
    )

    logger.info(`Subscription for user ${userId} updated by admin ${adminId}`)

    return updatedSubscription
  }

  /**
   * Extend user subscription
   */
  async extendSubscription(
    userId: string,
    days: number,
    adminId: string,
    ipAddress: string
  ) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    const currentEndDate = subscription.endDate || new Date()
    const newEndDate = addDays(currentEndDate, days)

    const updatedSubscription = await prisma.subscription.update({
      where: { userId },
      data: {
        endDate: newEndDate,
        nextReminderDate: addDays(newEndDate, -3),
        status: 'ACTIVE',
        renewalCount: subscription.renewalCount + 1,
        lastRenewalDate: new Date()
      }
    })

    // Enable bot if it was disabled
    await prisma.user.update({
      where: { id: userId },
      data: { botActive: true }
    })

    await prisma.botSettings.update({
      where: { userId },
      data: { isEnabled: true }
    })

    // Log admin action
    await this.logAdminAction(
      adminId,
      userId,
      'EXTEND_SUBSCRIPTION',
      { days, oldEndDate: currentEndDate, newEndDate },
      ipAddress
    )

    logger.info(`Subscription for user ${userId} extended by ${days} days by admin ${adminId}`)

    return updatedSubscription
  }

  /**
   * Process payment manually
   */
  async processPayment(
    userId: string,
    data: {
      amount: number
      paymentMethod: string
      transactionId?: string
      paymentProof?: string
      adminNotes?: string
    },
    adminId: string,
    ipAddress: string
  ) {
    // Create payment record
    const payment = await prisma.paymentHistory.create({
      data: {
        userId,
        amount: data.amount,
        currency: 'IDR',
        paymentMethod: data.paymentMethod as any,
        status: 'PAID',
        transactionId: data.transactionId,
        paymentProof: data.paymentProof,
        adminNotes: data.adminNotes,
        paidAt: new Date()
      }
    })

    // Update user total spent
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalSpent: {
          increment: data.amount
        }
      }
    })

    // Update subscription if exists
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (subscription) {
      const newEndDate = addDays(new Date(), 30) // Extend by 30 days


      await prisma.subscription.update({
        where: { userId },
        data: {
          paymentStatus: 'PAID',
          paymentDate: new Date(),
          paymentProof: data.paymentProof,
          status: 'ACTIVE',
          endDate: newEndDate,
          nextReminderDate: addDays(newEndDate, -3)
        }
      })

      // Enable bot
      await prisma.user.update({
        where: { id: userId },
        data: { botActive: true }
      })

      await prisma.botSettings.update({
        where: { userId },
        data: { isEnabled: true }
      })
    }

    // Send payment confirmation email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true }
    })

    if (user) {
      try {

        const paymentHtml = `
          <h1>Payment Confirmed</h1>
          <p>Hello ${user.fullName},</p>
          <p>Your payment has been confirmed.</p>
          <p><strong>Amount:</strong> ${data.amount}</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId || 'N/A'}</p>
          <p><strong>Payment Date:</strong> ${format(new Date(), 'dd MMMM yyyy HH:mm')}</p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
        `
        await sendEmail(user.email, 'Payment Confirmed - Matic-Trade', paymentHtml)
      } catch (error) {
        logger.error('Failed to send payment confirmation email:', error)
      }
    }

    // Log admin action
    await this.logAdminAction(
      adminId,
      userId,
      'PROCESS_PAYMENT',
      { amount: data.amount, paymentMethod: data.paymentMethod },
      ipAddress
    )

    logger.info(`Payment processed for user ${userId} by admin ${adminId}`)

    return payment
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(
    userId: string,
    adminId: string,
    ipAddress: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    })

    if (!user || !user.subscription) {
      throw new Error('User or subscription not found')
    }


    const daysRemaining = user.subscription.endDate
      ? Math.ceil((user.subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'PAYMENT_REMINDER',
        title: 'Subscription Payment Reminder',
        message: `Your subscription will expire in ${daysRemaining} day(s). Please renew to continue using our services.`,
        data: {
          daysRemaining,
          endDate: user.subscription.endDate
        }
      }
    })

    // Send email reminder
    try {

      const reminderHtml = `
        <h1>Subscription Expiring Soon</h1>
        <p>Hello ${user.fullName},</p>
        <p>Your subscription will expire in ${daysRemaining} day(s) on ${format(user.subscription.endDate!, 'dd MMMM yyyy')}.</p>
        <p>Please renew to continue using our services.</p>
        <p><a href="${process.env.FRONTEND_URL}/dashboard/subscription">Renew Subscription</a></p>
      `
      await sendEmail(user.email, 'Payment Reminder - Your Subscription is Expiring Soon', reminderHtml)
    } catch (error) {
      logger.error('Failed to send payment reminder email:', error)
    }

    // Update last payment reminder date
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastPaymentReminderAt: new Date()
      }
    })

    // Log admin action
    await this.logAdminAction(
      adminId,
      userId,
      'SEND_PAYMENT_REMINDER',
      { daysRemaining },
      ipAddress
    )

    logger.info(`Payment reminder sent to user ${userId} by admin ${adminId}`)

    return { success: true, message: 'Payment reminder sent' }
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string, adminId: string, ipAddress: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Log admin action BEFORE deleting user to avoid foreign key constraint violation
    // Set targetUserId to null since user will be deleted, store user info in details
    await this.logAdminAction(
      adminId,
      null, // Set to null to avoid FK constraint on deleted user
      'DELETE_USER',
      { 
        deletedUserId: userId,
        email: user.email, 
        username: user.username,
        fullName: user.fullName
      },
      ipAddress
    )

    // Delete user (cascade will delete related records)
    await prisma.user.delete({
      where: { id: userId }
    })

    logger.info(`User ${userId} deleted by admin ${adminId}`)

    return { success: true, message: 'User deleted successfully' }
  }

  /**
   * Reset user password (admin action)
   */
  async resetUserPassword(
    userId: string,
    newPassword: string,
    adminId: string,
    ipAddress: string
  ) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    // Log admin action
    await this.logAdminAction(
      adminId,
      userId,
      'RESET_USER_PASSWORD',
      { userEmail: user.email },
      ipAddress
    )

    logger.info(`Password reset for user ${userId} by admin ${adminId}`)

    return { success: true, message: 'Password reset successfully' }
  }

  /**
   * Update admin profile
   */
  async updateAdminProfile(
    adminId: string,
    data: {
      fullName?: string
      phone?: string
      address?: string
      avatar?: string
      bio?: string
      website?: string
      social?: any
      settings?: any
    }
  ) {
    const updateData: any = {}
    const profileUpdateData: any = {}

    if (data.fullName !== undefined) updateData.fullName = data.fullName
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address

    // Update user data
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: adminId },
        data: updateData
      })
    }

    // Update profile data
    if (data.avatar !== undefined) profileUpdateData.avatar = data.avatar
    if (data.bio !== undefined) profileUpdateData.bio = data.bio
    if (data.website !== undefined) profileUpdateData.website = data.website
    if (data.social !== undefined) profileUpdateData.social = data.social
    if (data.settings !== undefined) profileUpdateData.settings = data.settings

    if (Object.keys(profileUpdateData).length > 0) {
      await prisma.userProfile.upsert({
        where: { userId: adminId },
        update: profileUpdateData,
        create: {
          userId: adminId,
          ...profileUpdateData
        }
      })
    }

    const updatedAdmin = await prisma.user.findUnique({
      where: { id: adminId },
      include: { profile: true }
    })

    logger.info(`Admin profile ${adminId} updated`)

    return updatedAdmin
  }

  /**
   * Change admin password
   */
  async changeAdminPassword(
    adminId: string,
    data: {
      currentPassword: string
      newPassword: string
    }
  ) {
    // Get admin with password
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { id: true, password: true }
    })

    if (!admin) {
      throw new Error('Admin not found')
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(data.currentPassword, admin.password)
    if (!isValidPassword) {
      throw new Error('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    })

    logger.info(`Admin password changed for ${adminId}`)

    return { success: true, message: 'Password changed successfully' }
  }

  /**
   * Get admin logs
   */
  async getAdminLogs(params: {
    page: number
    limit: number
    adminId?: string
    targetUserId?: string
    action?: string
    startDate?: Date
    endDate?: Date
  }) {
    const { page, limit, adminId, targetUserId, action, startDate, endDate } = params
    const skip = (page - 1) * limit

    const where: Prisma.AdminLogWhereInput = {}

    if (adminId) where.adminId = adminId
    if (targetUserId) where.targetUserId = targetUserId
    if (action) where.action = { contains: action, mode: 'insensitive' }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              username: true,
              fullName: true
            }
          },
          targetUser: {
            select: {
              id: true,
              email: true,
              username: true,
              fullName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.adminLog.count({ where })
    ])


    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  /**
   * Get admin notifications
   */
  async getAdminNotifications(adminId: string) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: adminId,
        isArchived: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    // Mark as read
    await prisma.notification.updateMany({
      where: {
        userId: adminId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return notifications
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string, adminId: string) {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: adminId
      },
      data: {
        isRead: true
      }
    })

    return notification
  }

  /**
   * Archive notification
   */
  async archiveNotification(notificationId: string, adminId: string) {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: adminId
      },
      data: {
        isArchived: true
      }
    })

    return notification
  }

  /**
   * Get all payments with filtering and pagination
   */
  async getPayments(params: {
    page: number
    limit: number
    search?: string
    status?: PaymentStatus
    paymentMethod?: string
    period?: 'today' | 'week' | 'month' | 'year'
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page, limit, search, status, paymentMethod, period, sortBy = 'createdAt', sortOrder = 'desc' } = params
    const skip = (page - 1) * limit

    const where: Prisma.PaymentHistoryWhereInput = {}

    // Search by user name, email, or transaction ID
    if (search) {
      where.OR = [
        { transactionId: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Filter by status
    if (status) {
      where.status = status
    }

    // Filter by payment method
    if (paymentMethod) {
      where.paymentMethod = paymentMethod as any
    }

    // Filter by period
    if (period) {
      const now = new Date()
      let startDate: Date

      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = subDays(now, 7)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
      }

      where.createdAt = {
        gte: startDate
      }
    }

    const [payments, total] = await Promise.all([
      prisma.paymentHistory.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              username: true
            }
          },
          subscription: {
            select: {
              plan: true,
              status: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      }),
      prisma.paymentHistory.count({ where })
    ])

    return {
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get all paid payments
    const paidPayments = await prisma.paymentHistory.findMany({
      where: { status: 'PAID' }
    })

    // Get pending payments
    const pendingPayments = await prisma.paymentHistory.findMany({
      where: { status: 'PENDING' }
    })

    // Calculate totals
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

    // This month revenue
    const thisMonthPayments = paidPayments.filter(p => 
      p.paidAt && p.paidAt >= startOfMonth
    )
    const thisMonthRevenue = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0)

    // Last month revenue for growth calculation
    const lastMonthPayments = paidPayments.filter(p =>
      p.paidAt && p.paidAt >= startOfLastMonth && p.paidAt <= endOfLastMonth
    )
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + p.amount, 0)

    // Calculate growth percentage
    const revenueGrowth = lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
      : 0

    // Average transaction
    const avgTransaction = paidPayments.length > 0
      ? totalRevenue / paidPayments.length
      : 0

    return {
      totalRevenue,
      thisMonthRevenue,
      pendingCount: pendingPayments.length,
      pendingAmount,
      avgTransaction,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      totalTransactions: paidPayments.length
    }
  }

  /**
   * Update payment status (confirm/reject/refund)
   */
  async updatePaymentStatus(
    paymentId: string,
    data: {
      status: PaymentStatus
      adminNotes?: string
    },
    adminId: string,
    ipAddress: string
  ) {
    const payment = await prisma.paymentHistory.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    })

    if (!payment) {
      throw new Error('Payment not found')
    }

    const updateData: Prisma.PaymentHistoryUpdateInput = {
      status: data.status,
      adminNotes: data.adminNotes
    }

    // If confirming payment (PENDING -> PAID)
    if (data.status === 'PAID' && payment.status === 'PENDING') {
      updateData.paidAt = new Date()

      // Update user total spent
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          totalSpent: { increment: payment.amount },
          isActive: true,
          botActive: true
        }
      })

      // Update subscription
      const subscription = await prisma.subscription.findUnique({
        where: { userId: payment.userId }
      })

      if (subscription) {
        const newEndDate = addDays(new Date(), 30)

        await prisma.subscription.update({
          where: { userId: payment.userId },
          data: {
            paymentStatus: 'PAID',
            paymentDate: new Date(),
            status: 'ACTIVE',
            endDate: newEndDate,
            nextReminderDate: addDays(newEndDate, -3)
          }
        })
      }

      // Enable bot settings
      await prisma.botSettings.upsert({
        where: { userId: payment.userId },
        update: { isEnabled: true },
        create: {
          userId: payment.userId,
          isEnabled: true
        }
      })

      // Send confirmation email
      if (payment.user) {
        try {
          const paymentHtml = `
            <h1>Payment Confirmed</h1>
            <p>Hello ${payment.user.fullName},</p>
            <p>Your payment has been confirmed and your account is now active!</p>
            <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
            <p><strong>Transaction ID:</strong> ${payment.transactionId || payment.id.slice(0, 8)}</p>
            <p><strong>Payment Date:</strong> ${format(new Date(), 'dd MMMM yyyy HH:mm')}</p>
            <p>You can now start using all features of your subscription.</p>
          `
          await sendEmail(payment.user.email, 'Payment Confirmed - Matic-Trade', paymentHtml)
        } catch (error) {
          logger.error('Failed to send payment confirmation email:', error)
        }
      }
    }

    // If rejecting payment (PENDING -> FAILED)
    if (data.status === 'FAILED' && payment.status === 'PENDING') {
      // Send rejection email
      if (payment.user) {
        try {
          const rejectHtml = `
            <h1>Payment Rejected</h1>
            <p>Hello ${payment.user.fullName},</p>
            <p>Unfortunately, your payment could not be verified.</p>
            <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
            <p><strong>Reason:</strong> ${data.adminNotes || 'Payment verification failed'}</p>
            <p>Please contact support if you believe this is an error.</p>
          `
          await sendEmail(payment.user.email, 'Payment Rejected - Matic-Trade', rejectHtml)
        } catch (error) {
          logger.error('Failed to send payment rejection email:', error)
        }
      }
    }

    // If refunding payment (PAID -> REFUNDED)
    if (data.status === 'REFUNDED' && payment.status === 'PAID') {
      // Decrease user total spent
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          totalSpent: { decrement: payment.amount }
        }
      })

      // Send refund email
      if (payment.user) {
        try {
          const refundHtml = `
            <h1>Payment Refunded</h1>
            <p>Hello ${payment.user.fullName},</p>
            <p>Your payment has been refunded.</p>
            <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
            <p><strong>Reason:</strong> ${data.adminNotes || 'Refund processed'}</p>
          `
          await sendEmail(payment.user.email, 'Payment Refunded - Matic-Trade', refundHtml)
        } catch (error) {
          logger.error('Failed to send refund email:', error)
        }
      }
    }

    const updatedPayment = await prisma.paymentHistory.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    })

    // Log admin action
    await this.logAdminAction(
      adminId,
      payment.userId,
      'UPDATE_PAYMENT_STATUS',
      { paymentId, oldStatus: payment.status, newStatus: data.status, adminNotes: data.adminNotes },
      ipAddress
    )

    logger.info(`Payment ${paymentId} status updated to ${data.status} by admin ${adminId}`)

    return updatedPayment
  }

  /**
   * Log admin action
   */
  private async logAdminAction(
    adminId: string,
    targetUserId: string | null,
    action: string,
    details: any,
    ipAddress: string
  ) {
    await prisma.adminLog.create({
      data: {
        adminId,
        targetUserId,
        action,
        details,
        ipAddress
      }
    })
  }
}

export default new AdminService()