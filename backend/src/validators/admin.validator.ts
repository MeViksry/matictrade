// backend/src/validators/admin.validator.ts - FULL VERSION
import { z } from 'zod'

// Common schemas
const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

const idParamSchema = z.object({
  params: z.object({

    id: z.string().min(1, 'ID is required')
  })
})

// User schemas
export const getUserListSchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    search: z.string().optional(),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
    isActive: z.coerce.boolean().optional(),
    botActive: z.coerce.boolean().optional(),
    subscriptionStatus: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING', 'SUSPENDED']).optional()
  })
})

export const getUserByIdSchema = idParamSchema

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(8).max(100),
    fullName: z.string().min(2).max(100),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).default('USER'),
    subscriptionPlan: z.enum(['FREE', 'MONTHLY', 'YEARLY', 'CUSTOM']).default('MONTHLY'),
    subscriptionPrice: z.coerce.number().nonnegative().default(250000),
    customDuration: z.coerce.number().int().positive().optional(),
    autoRenew: z.boolean().default(false),
    paymentMethod: z.enum(['BANK_TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'CRYPTO', 'MANUAL']).default('BANK_TRANSFER'),
    adminNotes: z.string().optional()
  })
})

export const updateUserSchema = idParamSchema.extend({
  body: z.object({
    fullName: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
    isActive: z.boolean().optional(),
    botActive: z.boolean().optional()
  })
})

export const deleteUserSchema = idParamSchema

// Subscription schemas
export const updateSubscriptionSchema = idParamSchema.extend({
  body: z.object({
    plan: z.enum(['FREE', 'MONTHLY', 'YEARLY', 'CUSTOM']).optional(),
    status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING', 'SUSPENDED']).optional(),
    price: z.coerce.number().nonnegative().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    autoRenew: z.boolean().optional(),
    customDuration: z.coerce.number().int().positive().optional(),
    adminNotes: z.string().optional()
  })
})

export const extendSubscriptionSchema = idParamSchema.extend({
  body: z.object({
    days: z.coerce.number().int().positive().max(365 * 5) // Max 5 years
  })
})

// Payment schemas
export const processPaymentSchema = idParamSchema.extend({
  body: z.object({
    amount: z.coerce.number().positive(),
    paymentMethod: z.enum(['BANK_TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'CRYPTO', 'MANUAL']),
    transactionId: z.string().optional(),
    paymentProof: z.string().url().optional(),
    adminNotes: z.string().optional()
  })
})

export const sendPaymentReminderSchema = idParamSchema

export const getPaymentsSchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    search: z.string().optional(),
    status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED', 'PROCESSING']).optional(),
    paymentMethod: z.enum(['BANK_TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'CRYPTO', 'MANUAL', 'SUBSCRIPTION']).optional(),
    period: z.enum(['today', 'week', 'month', 'year']).optional()
  })
})

export const updatePaymentStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Payment ID is required')
  }),
  body: z.object({
    status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED', 'PROCESSING']),
    adminNotes: z.string().optional()
  })
})

// Analytics schemas
export const getAnalyticsSchema = z.object({
  query: z.object({
    period: z.enum(['7d', '30d', '1y', 'custom']).default('30d'),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
  })
})

// Admin profile schemas
export const updateAdminProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    avatar: z.string().url().optional(),
    bio: z.string().optional(),
    website: z.string().url().optional(),
    social: z.object({
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional()
    }).optional(),
    settings: z.object({
      theme: z.enum(['light', 'dark', 'auto']).optional(),
      notifications: z.boolean().optional(),
      twoFactorEnabled: z.boolean().optional(),
      language: z.string().optional()
    }).optional()
  })
})

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password is required')
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
})

// Admin logs schemas
export const getAdminLogsSchema = paginationSchema.extend({
  query: paginationSchema.shape.query.extend({
    adminId: z.string().uuid().optional(),
    targetUserId: z.string().uuid().optional(),
    action: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
  })
})

// Notification schemas
export const markNotificationAsReadSchema = z.object({
  params: z.object({
    notificationId: z.string().uuid()
  })
})

export const archiveNotificationSchema = markNotificationAsReadSchema


// Update role schema (for super admin)
export const updateRoleSchema = idParamSchema.extend({
  body: z.object({
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN'])
  })
})

// Export all schemas
export const adminSchemas = {
  // User
  getUserListSchema,
  getUserByIdSchema,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,

  updateRole: updateRoleSchema,

  // Subscription
  updateSubscriptionSchema,
  extendSubscriptionSchema,

  // Payment
  processPaymentSchema,
  sendPaymentReminderSchema,
  getPaymentsSchema,
  updatePaymentStatusSchema,

  // Analytics
  getAnalyticsSchema,

  // Admin profile
  updateAdminProfileSchema,
  changePasswordSchema,

  // Logs
  getAdminLogsSchema,

  // Notifications
  markNotificationAsReadSchema,
  archiveNotificationSchema
}

// Type inference
export type GetUserListInput = z.infer<typeof getUserListSchema>['query']
export type CreateUserInput = z.infer<typeof createUserSchema>['body']
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body']
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>['body']
export type ExtendSubscriptionInput = z.infer<typeof extendSubscriptionSchema>['body']
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>['body']
export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>['body']
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body']
export type GetAnalyticsInput = z.infer<typeof getAnalyticsSchema>['query']
export type GetAdminLogsInput = z.infer<typeof getAdminLogsSchema>['query']
export type GetPaymentsInput = z.infer<typeof getPaymentsSchema>['query']
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>['body']