// backend/src/middlewares/admin.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../utils/apiResponse'
import { logger } from '../utils/logger'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Middleware to check if user is authenticated and is ADMIN or SUPER_ADMIN
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated

    if (!req.user || !req.user.userId) {
      return ApiResponse.unauthorized(res, 'Authentication required')
    }

    const userId = req.user.userId

    // Get user from database to verify role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        isActive: true
      }
    })

    if (!user) {
      return ApiResponse.notFound(res, 'User not found')
    }

    if (!user.isActive) {
      return ApiResponse.forbidden(res, 'Account is not active')
    }

    // Check if user has admin privileges
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      logger.warn(`Unauthorized admin access attempt by user ${userId}`)
      return ApiResponse.forbidden(res, 'Admin access required')
    }

    // Attach user role to request for further use
    req.user.role = user.role

    next()
  } catch (error) {
    logger.error('Admin middleware error:', error)
    return ApiResponse.error(res, 'Internal server error')
  }
}

/**
 * Middleware to check if user is SUPER_ADMIN only
 */
export const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated

    if (!req.user || !req.user.userId) {
      return ApiResponse.unauthorized(res, 'Authentication required')
    }

    const userId = req.user.userId

    // Get user from database to verify role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        isActive: true
      }
    })

    if (!user) {
      return ApiResponse.notFound(res, 'User not found')
    }

    if (!user.isActive) {
      return ApiResponse.forbidden(res, 'Account is not active')
    }

    // Check if user is SUPER_ADMIN
    if (user.role !== 'SUPER_ADMIN') {
      logger.warn(`Unauthorized super admin access attempt by user ${userId}`)
      return ApiResponse.forbidden(res, 'Super admin access required')
    }

    next()
  } catch (error) {
    logger.error('Super admin middleware error:', error)
    return ApiResponse.error(res, 'Internal server error')
  }
}

/**
 * Middleware to check admin permissions for specific actions
 */
export const checkAdminPermission = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.user || !req.user.userId) {
        return ApiResponse.unauthorized(res, 'Authentication required')
      }

      const userId = req.user.userId

      // Get user permissions based on role
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          role: true,
          isActive: true
        }
      })

      if (!user || !user.isActive) {
        return ApiResponse.forbidden(res, 'Account is not active')
      }

      // Define role-based permissions
      const rolePermissions: Record<string, string[]> = {
        SUPER_ADMIN: [
          'manage_users',
          'manage_subscriptions',
          'manage_payments',
          'view_analytics',
          'manage_admins',
          'system_settings',
          'view_logs',
          'delete_users',
          'update_roles'
        ],
        ADMIN: [
          'manage_users',
          'manage_subscriptions',
          'manage_payments',
          'view_analytics',
          'view_logs'
        ]
      }

      const userPermissions = rolePermissions[user.role] || []

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      )

      if (!hasAllPermissions) {
        logger.warn(`Permission denied for user ${userId}. Required: ${requiredPermissions.join(', ')}`)
        return ApiResponse.forbidden(res, 'Insufficient permissions')
      }

      next()
    } catch (error) {
      logger.error('Permission middleware error:', error)
      return ApiResponse.error(res, 'Internal server error')
    }
  }
}

/**
 * Middleware to check if admin can modify target user
 * (Prevents admins from modifying super admins or other admins)
 */
export const checkUserModificationPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (!req.user || !req.user.userId) {
      return ApiResponse.unauthorized(res, 'Authentication required')
    }

    const adminId = req.user.userId
    const targetUserId = req.params.id

    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      select: {
        role: true,
        isActive: true
      }
    })

    if (!adminUser || !adminUser.isActive) {
      return ApiResponse.forbidden(res, 'Admin account is not active')
    }

    // If no target user ID (e.g., creating new user), proceed
    if (!targetUserId) {
      return next()
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        role: true,
        isActive: true
      }
    })

    if (!targetUser) {
      return ApiResponse.notFound(res, 'Target user not found')
    }

    // Permission rules:
    // 1. SUPER_ADMIN can modify anyone
    // 2. ADMIN can only modify USER role
    // 3. No one can modify SUPER_ADMIN except SUPER_ADMIN

    if (adminUser.role === 'SUPER_ADMIN') {
      // SUPER_ADMIN can modify anyone
      return next()
    }

    if (adminUser.role === 'ADMIN') {
      // ADMIN can only modify USER role
      if (targetUser.role === 'USER') {
        return next()
      }


      // ADMIN cannot modify other ADMINS or SUPER_ADMINS
      logger.warn(`Admin ${adminId} attempted to modify ${targetUser.role} ${targetUserId}`)
      return ApiResponse.forbidden(res, 'Cannot modify admin users')
    }

    // Should not reach here due to requireAdmin middleware
    return ApiResponse.forbidden(res, 'Insufficient permissions')
  } catch (error) {
    logger.error('User modification permission middleware error:', error)
    return ApiResponse.error(res, 'Internal server error')
  }
}

/**
 * Middleware to log admin actions
 */
export const logAdminAction = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()

    // Capture response data
    const originalSend = res.send
    let responseBody: any


    res.send = function (body: any): Response {
      responseBody = body
      return originalSend.call(this, body)
    }

    // After response is sent, log the action
    res.on('finish', async () => {
      try {
        const duration = Date.now() - startTime
        const statusCode = res.statusCode

        const userId = req.user?.userId
        const targetUserId = req.params?.id || null
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const userAgent = req.headers['user-agent']

        // Don't log successful health checks or static assets
        if (req.path.includes('health') || req.path.includes('assets')) {
          return
        }

        // Log admin action
        if (userId && (req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN')) {
          await prisma.adminLog.create({
            data: {
              adminId: userId,
              targetUserId,
              action,
              details: {
                method: req.method,
                path: req.path,
                params: req.params,
                query: req.query,
                statusCode,
                duration,
                ipAddress,
                userAgent
              },
              ipAddress: ipAddress as string,
              userAgent
            }
          })

          logger.info(`Admin action: ${action} by ${userId} - ${statusCode} ${req.method} ${req.path} - ${duration}ms`)
        }
      } catch (error) {
        logger.error('Failed to log admin action:', error)
      }
    })

    next()
  }
}

/**
 * Middleware to rate limit admin actions
 */
export const adminRateLimit = {
  // Different limits for different actions
  limits: {
    createUser: { windowMs: 60 * 1000, max: 5 }, // 5 per minute
    deleteUser: { windowMs: 60 * 1000, max: 3 }, // 3 per minute
    updateSubscription: { windowMs: 30 * 1000, max: 10 }, // 10 per 30 seconds
    processPayment: { windowMs: 60 * 1000, max: 20 }, // 20 per minute
    sendNotification: { windowMs: 60 * 1000, max: 30 } // 30 per minute
  }
}

/**
 * Middleware to validate admin session
 */
export const validateAdminSession = async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (!req.user || !req.user.userId) {
      return ApiResponse.unauthorized(res, 'Session expired')
    }

    const userId = req.user.userId

    // Check if user session is still valid
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        isActive: true,
        lastLoginAt: true
      }
    })

    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found')
    }

    if (!user.isActive) {
      return ApiResponse.forbidden(res, 'Account is deactivated')
    }

    // Check if last login was more than 24 hours ago (require re-login)
    if (user.lastLoginAt) {
      const hoursSinceLastLogin = (Date.now() - new Date(user.lastLoginAt).getTime()) / (1000 * 60 * 60)
      if (hoursSinceLastLogin > 24) {
        return ApiResponse.unauthorized(res, 'Session expired. Please login again.')
      }
    }

    next()
  } catch (error) {
    logger.error('Admin session validation error:', error)
    return ApiResponse.error(res, 'Internal server error')
  }
}

// Export all middleware
export const adminMiddleware = {
  requireAdmin,
  requireSuperAdmin,
  checkAdminPermission,
  checkUserModificationPermission,
  logAdminAction,
  validateAdminSession
}

export default adminMiddleware