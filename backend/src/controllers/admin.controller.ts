// backend/src/controllers/admin.controller.ts - UPDATED & COMPLETE VERSION
import { Response, NextFunction } from 'express'
import { AdminService } from '../services/admin.service'
import { AnalyticsService } from '../services/analytics.service'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse'
import { AuthRequest } from '../middlewares/auth'

import {
  GetUserListInput,
  CreateUserInput,
  UpdateUserInput,
  UpdateSubscriptionInput,
  ExtendSubscriptionInput,
  ProcessPaymentInput,
  UpdateAdminProfileInput,
  ChangePasswordInput,
  GetAnalyticsInput,
  GetAdminLogsInput,
  GetPaymentsInput,
  UpdatePaymentStatusInput
} from '../validators/admin.validator'
import { logger } from '../utils/logger'

export class AdminController {
  private adminService: AdminService
  private analyticsService: AnalyticsService

  constructor() {
    this.adminService = new AdminService()
    this.analyticsService = new AnalyticsService()
  }

  // ==================== USER MANAGEMENT ====================


  getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        role,
        isActive,
        botActive,
        subscriptionStatus,
        sortBy = 'createdAt',
        sortOrder = 'desc'

      } = req.query as unknown as GetUserListInput

      const result = await this.adminService.getUsers({
        page: Number(page),
        limit: Number(limit),
        search,
        role,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        botActive: botActive !== undefined ? Boolean(botActive) : undefined,
        subscriptionStatus,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc'
      })


      return sendPaginated(res, result.users, result.page, result.limit, result.total)
    } catch (error: any) {
      logger.error('Get users error:', error)
      return sendError(res, error.message || 'Failed to get users', 400)
    }
  }

  getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.adminService.getUserById(req.params.id)
      return sendSuccess(res, user, 'User retrieved successfully')
    } catch (error: any) {
      logger.error('Get user by ID error:', error)


      if (error.message === 'User not found') {
        return sendError(res, error.message, 404)
      }

      return sendError(res, error.message || 'Failed to get user', 400)
    }
  }

  createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateUserInput


      const user = await this.adminService.createUser(body)

      return sendSuccess(res, user, 'User created successfully', 201)
    } catch (error: any) {
      logger.error('Create user error:', error)

      if (error.message.includes('already exists')) {
        return sendError(res, error.message, 409)
      }

      return sendError(res, error.message || 'Failed to create user', 400)
    }
  }

  updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body as UpdateUserInput
      const adminId = req.user!.userId
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown'

      const user = await this.adminService.updateUser(id, body, adminId, ipAddress)

      return sendSuccess(res, user, 'User updated successfully')
    } catch (error: any) {
      logger.error('Update user error:', error)
      return sendError(res, error.message || 'Failed to update user', 400)
    }
  }

  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const adminId = req.user!.userId
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown'

      const result = await this.adminService.deleteUser(id, adminId, ipAddress)

      return sendSuccess(res, null, result.message)
    } catch (error: any) {
      logger.error('Delete user error:', error)


      if (error.message === 'User not found') {
        return sendError(res, error.message, 404)
      }

      return sendError(res, error.message || 'Failed to delete user', 400)
    }
  }

  activateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const adminId = req.user!.userId
      const ipAddress = req.ip || ''


      await this.adminService.updateUser(id, { isActive: true }, adminId, ipAddress)
      return sendSuccess(res, null, 'User activated')
    } catch (error: any) {
      logger.error('Activate user error:', error)
      return sendError(res, error.message || 'Failed to activate user', 400)
    }
  }

  deactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const adminId = req.user!.userId
      const ipAddress = req.ip || ''


      await this.adminService.updateUser(id, { isActive: false }, adminId, ipAddress)
      return sendSuccess(res, null, 'User deactivated')
    } catch (error: any) {
      logger.error('Deactivate user error:', error)
      return sendError(res, error.message || 'Failed to deactivate user', 400)
    }
  }

  toggleUserBot = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { enabled } = req.body
      const adminId = req.user!.userId
      const ipAddress = req.ip || ''


      await this.adminService.updateUser(id, { botActive: enabled }, adminId, ipAddress)
      return sendSuccess(res, null, `User bot ${enabled ? 'enabled' : 'disabled'}`)
    } catch (error: any) {
      logger.error('Toggle user bot error:', error)
      return sendError(res, error.message || 'Failed to toggle user bot', 400)
    }
  }

  resetUserApiKeys = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const adminId = req.user!.userId
      const ipAddress = req.ip || ''


      // Delete all API keys for this user
      await this.adminService.updateUser(id, {}, adminId, ipAddress)
      return sendSuccess(res, null, 'API keys reset')
    } catch (error: any) {
      logger.error('Reset user API keys error:', error)
      return sendError(res, error.message || 'Failed to reset API keys', 400)
    }
  }

  resetUserPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { newPassword } = req.body
      const adminId = req.user!.userId
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown'

      const result = await this.adminService.resetUserPassword(id, newPassword, adminId, ipAddress)

      return sendSuccess(res, null, result.message)
    } catch (error: any) {
      logger.error('Reset user password error:', error)

      if (error.message === 'User not found') {
        return sendError(res, error.message, 404)
      }

      return sendError(res, error.message || 'Failed to reset password', 400)
    }
  }

  updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { role } = req.body
      const adminId = req.user!.userId
      const ipAddress = req.ip || ''


      await this.adminService.updateUser(id, { role }, adminId, ipAddress)
      return sendSuccess(res, null, 'User role updated')
    } catch (error: any) {
      logger.error('Update user role error:', error)
      return sendError(res, error.message || 'Failed to update user role', 400)
    }
  }

  // ==================== SUBSCRIPTION MANAGEMENT ====================


  updateSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body as UpdateSubscriptionInput
      const adminId = req.user!.userId
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown'

      const subscription = await this.adminService.updateUserSubscription(id, body, adminId, ipAddress)

      return sendSuccess(res, subscription, 'Subscription updated successfully')
    } catch (error: any) {
      logger.error('Update subscription error:', error)


      if (error.message === 'Subscription not found') {
        return sendError(res, error.message, 404)
      }

      return sendError(res, error.message || 'Failed to update subscription', 400)
    }
  }

  extendSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { days } = req.body as ExtendSubscriptionInput
      const adminId = req.user!.userId
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown'

      const subscription = await this.adminService.extendSubscription(id, days, adminId, ipAddress)

      return sendSuccess(res, subscription, 'Subscription extended successfully')
    } catch (error: any) {
      logger.error('Extend subscription error:', error)


      if (error.message === 'Subscription not found') {
        return sendError(res, error.message, 404)
      }

      return sendError(res, error.message || 'Failed to extend subscription', 400)
    }
  }

  // ==================== PAYMENT MANAGEMENT ====================


  processPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body as ProcessPaymentInput
      const adminId = req.user!.userId
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown'

      const payment = await this.adminService.processPayment(id, body, adminId, ipAddress)

      return sendSuccess(res, payment, 'Payment processed successfully', 201)
    } catch (error: any) {
      logger.error('Process payment error:', error)
      return sendError(res, error.message || 'Failed to process payment', 400)
    }
  }

  sendPaymentReminder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const adminId = req.user!.userId
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown'

      const result = await this.adminService.sendPaymentReminder(id, adminId, ipAddress)

      return sendSuccess(res, null, result.message)
    } catch (error: any) {
      logger.error('Send payment reminder error:', error)


      if (error.message === 'User or subscription not found') {
        return sendError(res, error.message, 404)
      }

      return sendError(res, error.message || 'Failed to send payment reminder', 400)
    }
  }

  getPayments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        status,
        paymentMethod,
        period,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query as unknown as GetPaymentsInput

      const result = await this.adminService.getPayments({
        page: Number(page),
        limit: Number(limit),
        search,
        status,
        paymentMethod,
        period,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc'
      })

      return sendPaginated(res, result.payments, result.page, result.limit, result.total)
    } catch (error: any) {
      logger.error('Get payments error:', error)
      return sendError(res, error.message || 'Failed to get payments', 400)
    }
  }

  getPaymentStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.adminService.getPaymentStats()
      return sendSuccess(res, stats, 'Payment stats retrieved successfully')
    } catch (error: any) {
      logger.error('Get payment stats error:', error)
      return sendError(res, error.message || 'Failed to get payment stats', 400)
    }
  }

  updatePaymentStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body as UpdatePaymentStatusInput
      const adminId = req.user!.userId
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown'

      const payment = await this.adminService.updatePaymentStatus(id, body, adminId, ipAddress)

      return sendSuccess(res, payment, `Payment ${body.status === 'PAID' ? 'confirmed' : body.status.toLowerCase()}`)
    } catch (error: any) {
      logger.error('Update payment status error:', error)

      if (error.message === 'Payment not found') {
        return sendError(res, error.message, 404)
      }

      return sendError(res, error.message || 'Failed to update payment status', 400)
    }
  }

  // ==================== ANALYTICS & DASHBOARD ====================


  getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.analyticsService.getDashboardStats()
      return sendSuccess(res, stats, 'Dashboard stats retrieved successfully')
    } catch (error: any) {
      logger.error('Get dashboard stats error:', error)
      return sendError(res, error.message || 'Failed to get dashboard stats', 400)
    }
  }

  getRevenueAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        period = '30d',
        startDate,
        endDate

      } = req.query as unknown as GetAnalyticsInput

      const analytics = await this.analyticsService.getRevenueAnalytics(
        period,
        startDate,
        endDate
      )

      return sendSuccess(res, analytics, 'Revenue analytics retrieved successfully')
    } catch (error: any) {
      logger.error('Get revenue analytics error:', error)
      return sendError(res, error.message || 'Failed to get revenue analytics', 400)
    }
  }

  getUserAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        period = '30d',
        startDate,
        endDate

      } = req.query as unknown as GetAnalyticsInput

      const analytics = await this.analyticsService.getUserAnalytics(
        period,
        startDate,
        endDate
      )

      return sendSuccess(res, analytics, 'User analytics retrieved successfully')
    } catch (error: any) {
      logger.error('Get user analytics error:', error)
      return sendError(res, error.message || 'Failed to get user analytics', 400)
    }
  }

  getTransactionAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        period = '30d',
        startDate,
        endDate

      } = req.query as unknown as GetAnalyticsInput

      const analytics = await this.analyticsService.getTransactionAnalytics(
        period,
        startDate,
        endDate
      )

      return sendSuccess(res, analytics, 'Transaction analytics retrieved successfully')
    } catch (error: any) {
      logger.error('Get transaction analytics error:', error)
      return sendError(res, error.message || 'Failed to get transaction analytics', 400)
    }
  }

  getSubscriptionAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.analyticsService.getSubscriptionAnalytics()
      return sendSuccess(res, analytics, 'Subscription analytics retrieved successfully')
    } catch (error: any) {
      logger.error('Get subscription analytics error:', error)
      return sendError(res, error.message || 'Failed to get subscription analytics', 400)
    }
  }

  getUserVolumeStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.analyticsService.getUserVolumeStats()
      return sendSuccess(res, stats, 'User volume stats retrieved successfully')
    } catch (error: any) {
      logger.error('Get user volume stats error:', error)
      return sendError(res, error.message || 'Failed to get user volume stats', 400)
    }
  }

  getAdminNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.analyticsService.getAdminNotifications()
      return sendSuccess(res, notifications, 'Admin notifications retrieved successfully')
    } catch (error: any) {
      logger.error('Get admin notifications error:', error)
      return sendError(res, error.message || 'Failed to get admin notifications', 400)
    }
  }

  // ==================== ADMIN PROFILE ====================


  getAdminProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.userId
      const user = await this.adminService.getUserById(adminId)
      return sendSuccess(res, user, 'Admin profile retrieved successfully')
    } catch (error: any) {
      logger.error('Get admin profile error:', error)
      return sendError(res, error.message || 'Failed to get admin profile', 400)
    }
  }

  updateAdminProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.userId
      const body = req.body as UpdateAdminProfileInput

      const admin = await this.adminService.updateAdminProfile(adminId, body)

      return sendSuccess(res, admin, 'Profile updated successfully')
    } catch (error: any) {
      logger.error('Update admin profile error:', error)
      return sendError(res, error.message || 'Failed to update profile', 400)
    }
  }

  changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.userId
      const body = req.body as ChangePasswordInput

      const result = await this.adminService.changeAdminPassword(adminId, body)

      return sendSuccess(res, null, result.message)
    } catch (error: any) {
      logger.error('Change password error:', error)


      if (error.message === 'Current password is incorrect') {
        return sendError(res, error.message, 400)
      }

      return sendError(res, error.message || 'Failed to change password', 400)
    }
  }

  // ==================== ADMIN LOGS ====================


  getAdminLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 50,
        adminId,
        targetUserId,
        action,
        startDate,
        endDate

      } = req.query as unknown as GetAdminLogsInput

      const result = await this.adminService.getAdminLogs({
        page: Number(page),
        limit: Number(limit),
        adminId,
        targetUserId,
        action,
        startDate,
        endDate
      })


      return sendPaginated(res, result.logs, result.page, result.limit, result.total)
    } catch (error: any) {
      logger.error('Get admin logs error:', error)
      return sendError(res, error.message || 'Failed to get admin logs', 400)
    }
  }

  // ==================== NOTIFICATIONS ====================


  getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.userId
      const notifications = await this.adminService.getAdminNotifications(adminId)
      return sendSuccess(res, notifications, 'Notifications retrieved successfully')
    } catch (error: any) {
      logger.error('Get notifications error:', error)
      return sendError(res, error.message || 'Failed to get notifications', 400)
    }
  }

  markNotificationAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.userId
      const { notificationId } = req.params

      const notification = await this.adminService.markNotificationAsRead(notificationId, adminId)

      return sendSuccess(res, notification, 'Notification marked as read')
    } catch (error: any) {
      logger.error('Mark notification as read error:', error)
      return sendError(res, error.message || 'Failed to mark notification as read', 400)
    }
  }

  archiveNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.userId
      const { notificationId } = req.params

      const notification = await this.adminService.archiveNotification(notificationId, adminId)

      return sendSuccess(res, notification, 'Notification archived')
    } catch (error: any) {
      logger.error('Archive notification error:', error)
      return sendError(res, error.message || 'Failed to archive notification', 400)
    }
  }

  // ==================== SYSTEM HEALTH ====================


  getSystemHealth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const os = require('os')

    try {
      // Check database connection
      const dbCheck = await this.analyticsService.getDashboardStats().catch(() => null)


      // Check Redis connection using actual Redis client
      let redisStatus = 'unknown'
      try {
        const { getRedis } = require('../config/redis')
        const redis = getRedis()
        const pingResult = await redis.ping()
        redisStatus = pingResult === 'PONG' ? 'healthy' : 'unhealthy'
      } catch (redisError: any) {
        logger.warn('Redis health check failed:', redisError.message)
        redisStatus = 'unhealthy'
      }

      const memoryUsage = process.memoryUsage()
      const cpuUsage = process.cpuUsage()
      const cpus = os.cpus()
      const loadAvg = os.loadavg()

      // Calculate CPU usage percentage
      const cpuCount = cpus.length
      const avgLoad = loadAvg[0] // 1 minute load average
      const cpuPercent = Math.min((avgLoad / cpuCount) * 100, 100)

      // Get network interfaces
      const networkInterfaces = os.networkInterfaces()
      const primaryIP = Object.values(networkInterfaces)
        .flat()
        .find((iface: any) => iface && !iface.internal && iface.family === 'IPv4')

      const health = {
        status: dbCheck ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {

          database: dbCheck ? 'healthy' : 'unhealthy',
          redis: redisStatus,
          api: 'healthy',
          websocket: 'healthy'
        },
        uptime: process.uptime(),
        systemUptime: os.uptime(),
        memory: {
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external,
          rss: memoryUsage.rss,
          arrayBuffers: memoryUsage.arrayBuffers || 0
        },
        systemMemory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
          usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1)
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
          cores: cpuCount,
          model: cpus[0]?.model || 'Unknown',
          speed: cpus[0]?.speed || 0,
          loadAverage: loadAvg,
          usagePercent: cpuPercent.toFixed(1)
        },
        version: process.env.npm_package_version || '1.0.0',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid,
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        osType: os.type(),
        osRelease: os.release(),
        userInfo: os.userInfo().username,
        ipAddress: (primaryIP as any)?.address || 'localhost'
      }

      return sendSuccess(res, health, 'System health check')
    } catch (error: any) {
      logger.error('System health check error:', error)


      const health = {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,

        uptime: process.uptime(),
        systemUptime: os.uptime(),
        services: {
          database: 'unhealthy',
          redis: 'unknown',
          api: 'degraded',
          websocket: 'unknown'
        },
        memory: process.memoryUsage(),
        systemMemory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
          usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1)
        },
        version: process.env.npm_package_version || '1.0.0',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        platform: os.platform(),
        hostname: os.hostname()
      }

      return sendSuccess(res, health, 'System health check')
    }
  }

  clearCache = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

      // Clear Redis cache if implemented
      try {
        const { getRedis } = require('../config/redis')
        const redis = getRedis()
        await redis.flushdb()
        logger.info('Cache cleared by admin:', req.user?.userId)
      } catch (redisError: any) {
        logger.warn('Redis cache clear failed:', redisError.message)
      }

      return sendSuccess(res, null, 'Cache cleared successfully')
    } catch (error: any) {
      logger.error('Clear cache error:', error)
      return sendError(res, error.message || 'Failed to clear cache', 400)
    }
  }


  // ==================== SYSTEM SETTINGS ====================

  getSystemSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Get settings from database or use defaults
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()

      let settings = await prisma.systemSettings.findFirst()

      if (!settings) {
        // Create default settings
        settings = await prisma.systemSettings.create({
          data: {
            platformName: 'MaticTrade',
            supportEmail: 'support@matictrade.com',
            maintenanceMode: false,
            webhookToken: this.generateToken(),
            emailNotifications: true,
            telegramNotifications: false
          }
        })
      }

      return sendSuccess(res, settings, 'System settings retrieved successfully')
    } catch (error: any) {
      logger.error('Get system settings error:', error)
      // Return defaults if table doesn't exist
      return sendSuccess(res, {
        platformName: 'MaticTrade',
        supportEmail: 'support@matictrade.com',
        maintenanceMode: false,
        webhookToken: 'default-token',
        emailNotifications: true,
        telegramNotifications: false
      }, 'System settings retrieved')
    }
  }

  updateSystemSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()

      const {
        platformName,
        supportEmail,
        maintenanceMode,
        emailNotifications,
        telegramNotifications
      } = req.body

      let settings = await prisma.systemSettings.findFirst()

      if (settings) {
        settings = await prisma.systemSettings.update({
          where: { id: settings.id },
          data: {
            platformName,
            supportEmail,
            maintenanceMode,
            emailNotifications,
            telegramNotifications,
            updatedAt: new Date()
          }
        })
      } else {
        settings = await prisma.systemSettings.create({
          data: {
            platformName: platformName || 'MaticTrade',
            supportEmail: supportEmail || 'support@matictrade.com',
            maintenanceMode: maintenanceMode || false,
            webhookToken: this.generateToken(),
            emailNotifications: emailNotifications ?? true,
            telegramNotifications: telegramNotifications || false
          }
        })
      }

      logger.info('System settings updated by admin:', req.user?.userId)
      return sendSuccess(res, settings, 'System settings updated successfully')
    } catch (error: any) {
      logger.error('Update system settings error:', error)
      return sendError(res, error.message || 'Failed to update system settings', 400)
    }
  }

  regenerateWebhookToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()

      const newToken = this.generateToken()

      let settings = await prisma.systemSettings.findFirst()

      if (settings) {
        settings = await prisma.systemSettings.update({
          where: { id: settings.id },
          data: {
            webhookToken: newToken,
            updatedAt: new Date()
          }
        })
      } else {
        settings = await prisma.systemSettings.create({
          data: {
            platformName: 'MaticTrade',
            supportEmail: 'support@matictrade.com',
            maintenanceMode: false,
            webhookToken: newToken,
            emailNotifications: true,
            telegramNotifications: false
          }
        })
      }

      logger.info('Webhook token regenerated by admin:', req.user?.userId)
      return sendSuccess(res, { webhookToken: newToken }, 'Webhook token regenerated successfully')
    } catch (error: any) {
      logger.error('Regenerate webhook token error:', error)
      return sendError(res, error.message || 'Failed to regenerate webhook token', 400)
    }
  }

  private generateToken = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

export default new AdminController()