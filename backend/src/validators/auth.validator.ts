
import { z } from 'zod'

export const authSchemas = {

  login: z.object({
    body: z.object({
      identifier: z.string().min(1, 'Email, username, or phone is required'),
      password: z.string().min(1, 'Password is required')
    })
  }),


  forgotPassword: z.object({
    body: z.object({
      email: z.string().email('Invalid email address')
    })
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string().min(1, 'Token is required'),
      password: z.string().min(8, 'Password must be at least 8 characters')
    })
  }),

  refresh: z.object({
    body: z.object({
      refreshToken: z.string().min(1, 'Refresh token is required')
    })
  }),

  updateProfile: z.object({
    body: z.object({
      fullName: z.string().min(2).optional(),

      username: z.string().min(3).max(30).optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      avatar: z.string().optional()
    })
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters')
    })
  })
}