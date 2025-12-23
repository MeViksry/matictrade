import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { sendSuccess, sendError } from '../utils/apiResponse'
import { prisma } from '../config/database'

const router = Router()

// Get current user
router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { subscription: true }
    })

    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    const { password, emailVerifyCode, resetPasswordToken, ...userWithoutSensitive } = user
    return sendSuccess(res, userWithoutSensitive)
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
})

// Update user profile
router.put('/me', authenticate, async (req: any, res) => {
  try {
    const { fullName, phone, address } = req.body

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { fullName, phone, address },
      include: { subscription: true }
    })

    const { password, emailVerifyCode, resetPasswordToken, ...userWithoutSensitive } = user
    return sendSuccess(res, userWithoutSensitive, 'Profile updated')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
})

// Get user notifications
router.get('/notifications', authenticate, async (req: any, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return sendSuccess(res, notifications)
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
})

// Mark notification as read
router.patch('/notifications/:id/read', authenticate, async (req: any, res) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    })

    return sendSuccess(res, null, 'Notification marked as read')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
})

// Mark all notifications as read
router.patch('/notifications/read-all', authenticate, async (req: any, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, isRead: false },
      data: { isRead: true }
    })

    return sendSuccess(res, null, 'All notifications marked as read')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
})

// Delete a single notification
router.delete('/notifications/:id', authenticate, async (req: any, res) => {
  try {
    // Verify the notification belongs to this user
    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    })

    if (!notification) {
      return sendError(res, 'Notification not found', 404)
    }

    await prisma.notification.delete({
      where: { id: req.params.id }
    })

    return sendSuccess(res, null, 'Notification deleted')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
})

// Delete all notifications for user
router.delete('/notifications', authenticate, async (req: any, res) => {
  try {
    await prisma.notification.deleteMany({
      where: { userId: req.user.userId }
    })

    return sendSuccess(res, null, 'All notifications deleted')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
})

export default router