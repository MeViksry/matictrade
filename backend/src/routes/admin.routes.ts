// backend/src/routes/admin.routes.ts - UPDATED & COMPLETE VERSION
import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { validate } from '../middlewares/validate'
import { authenticate } from '../middlewares/auth'

import {
  requireAdmin,
  requireSuperAdmin,
  checkUserModificationPermission,
  logAdminAction,
  validateAdminSession
} from '../middlewares/admin.middleware'
import {
  adminSchemas,
  getUserListSchema,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  updateSubscriptionSchema,
  extendSubscriptionSchema,
  processPaymentSchema,
  sendPaymentReminderSchema,
  getPaymentsSchema,
  updatePaymentStatusSchema,
  getAnalyticsSchema,
  updateAdminProfileSchema,
  changePasswordSchema,
  getAdminLogsSchema,
  markNotificationAsReadSchema,
  archiveNotificationSchema
} from '../validators/admin.validator'

const router = Router()
const adminController = new AdminController()

// Apply authentication and admin middleware to all routes
router.use(authenticate, requireAdmin, validateAdminSession)

// ==================== DASHBOARD & ANALYTICS ====================

router.get('/stats',
  logAdminAction('GET_DASHBOARD_STATS'),
  adminController.getDashboardStats
)


router.get('/analytics/revenue',
  validate(getAnalyticsSchema),
  logAdminAction('GET_REVENUE_ANALYTICS'),
  adminController.getRevenueAnalytics
)


router.get('/analytics/users',
  validate(getAnalyticsSchema),
  logAdminAction('GET_USER_ANALYTICS'),
  adminController.getUserAnalytics
)


router.get('/analytics/transactions',
  validate(getAnalyticsSchema),
  logAdminAction('GET_TRANSACTION_ANALYTICS'),
  adminController.getTransactionAnalytics
)


router.get('/analytics/subscriptions',
  logAdminAction('GET_SUBSCRIPTION_ANALYTICS'),
  adminController.getSubscriptionAnalytics
)


router.get('/analytics/volume-stats',
  logAdminAction('GET_VOLUME_STATS'),
  adminController.getUserVolumeStats
)


router.get('/notifications/system',
  logAdminAction('GET_ADMIN_NOTIFICATIONS'),
  adminController.getAdminNotifications
)

// ==================== USER MANAGEMENT ====================

router.get('/users',
  validate(getUserListSchema),
  logAdminAction('GET_USERS'),
  adminController.getUsers
)


router.get('/users/:id',
  logAdminAction('GET_USER_BY_ID'),
  adminController.getUserById
)


router.post('/users',
  validate(createUserSchema),
  checkUserModificationPermission,
  logAdminAction('CREATE_USER'),
  adminController.createUser
)


router.patch('/users/:id',
  validate(updateUserSchema),
  checkUserModificationPermission,
  logAdminAction('UPDATE_USER'),
  adminController.updateUser
)


router.patch('/users/:id/activate',
  checkUserModificationPermission,
  logAdminAction('ACTIVATE_USER'),
  adminController.activateUser
)


router.patch('/users/:id/deactivate',
  checkUserModificationPermission,
  logAdminAction('DEACTIVATE_USER'),
  adminController.deactivateUser
)


router.patch('/users/:id/toggle-bot',
  checkUserModificationPermission,
  logAdminAction('TOGGLE_USER_BOT'),
  adminController.toggleUserBot
)


router.delete('/users/:id/reset-api-keys',
  checkUserModificationPermission,
  logAdminAction('RESET_API_KEYS'),
  adminController.resetUserApiKeys
)


router.patch('/users/:id/password',
  checkUserModificationPermission,
  logAdminAction('RESET_USER_PASSWORD'),
  adminController.resetUserPassword
)

// ==================== SUBSCRIPTION MANAGEMENT ====================

router.patch('/users/:id/subscription',
  validate(updateSubscriptionSchema),
  checkUserModificationPermission,
  logAdminAction('UPDATE_SUBSCRIPTION'),
  adminController.updateSubscription
)


router.post('/users/:id/subscription/extend',
  validate(extendSubscriptionSchema),
  checkUserModificationPermission,
  logAdminAction('EXTEND_SUBSCRIPTION'),
  adminController.extendSubscription
)

// ==================== PAYMENT MANAGEMENT ====================

router.post('/users/:id/payments',
  validate(processPaymentSchema),
  checkUserModificationPermission,
  logAdminAction('PROCESS_PAYMENT'),
  adminController.processPayment
)


router.post('/users/:id/payments/reminder',
  validate(sendPaymentReminderSchema),
  checkUserModificationPermission,
  logAdminAction('SEND_PAYMENT_REMINDER'),
  adminController.sendPaymentReminder
)

// Payment List & Management
router.get('/payments',
  validate(getPaymentsSchema),
  logAdminAction('GET_PAYMENTS'),
  adminController.getPayments
)

router.get('/payments/stats',
  logAdminAction('GET_PAYMENT_STATS'),
  adminController.getPaymentStats
)

router.patch('/payments/:id/status',
  validate(updatePaymentStatusSchema),
  logAdminAction('UPDATE_PAYMENT_STATUS'),
  adminController.updatePaymentStatus
)

// ==================== ADMIN PROFILE & SETTINGS ====================

router.get('/profile',
  logAdminAction('GET_ADMIN_PROFILE'),
  adminController.getAdminProfile
)


router.patch('/profile',
  validate(updateAdminProfileSchema),
  logAdminAction('UPDATE_ADMIN_PROFILE'),
  adminController.updateAdminProfile
)


router.patch('/profile/password',
  validate(changePasswordSchema),
  logAdminAction('CHANGE_PASSWORD'),
  adminController.changePassword
)


router.get('/notifications',
  logAdminAction('GET_NOTIFICATIONS'),
  adminController.getNotifications
)


router.patch('/notifications/:notificationId/read',
  validate(markNotificationAsReadSchema),
  logAdminAction('MARK_NOTIFICATION_READ'),
  adminController.markNotificationAsRead
)


router.patch('/notifications/:notificationId/archive',
  validate(archiveNotificationSchema),
  logAdminAction('ARCHIVE_NOTIFICATION'),
  adminController.archiveNotification
)

// ==================== ADMIN LOGS ====================

router.get('/logs',
  validate(getAdminLogsSchema),
  logAdminAction('GET_ADMIN_LOGS'),
  adminController.getAdminLogs
)

// ==================== SYSTEM ====================

router.get('/system/health',
  logAdminAction('GET_SYSTEM_HEALTH'),
  adminController.getSystemHealth
)


router.post('/system/cache/clear',
  requireSuperAdmin,
  logAdminAction('CLEAR_CACHE'),
  adminController.clearCache
)


// ==================== SYSTEM SETTINGS ====================
router.get('/system/settings',
  logAdminAction('GET_SYSTEM_SETTINGS'),
  adminController.getSystemSettings
)

router.put('/system/settings',
  logAdminAction('UPDATE_SYSTEM_SETTINGS'),
  adminController.updateSystemSettings
)

router.post('/system/webhook/regenerate',
  logAdminAction('REGENERATE_WEBHOOK'),
  adminController.regenerateWebhookToken
)

// ==================== SUPER ADMIN ONLY ROUTES ====================
router.use(requireSuperAdmin)

router.patch(
  '/users/:id/role',
  validate(adminSchemas.updateRole),
  checkUserModificationPermission,
  logAdminAction('UPDATE_USER_ROLE'),
  adminController.updateUserRole
)


router.delete('/users/:id',
  validate(deleteUserSchema),
  checkUserModificationPermission,
  logAdminAction('DELETE_USER'),
  adminController.deleteUser
)

export default router