// backend/src/services/auth.service.ts
import bcrypt from 'bcryptjs'
import { prisma } from '../config/database'
import { generateTokenPair, verifyRefreshToken, TokenPayload } from '../utils/jwt'
import { generateToken } from '../utils/encryption'

import { sendPasswordResetEmail } from '../utils/email'
import { logger } from '../utils/logger'

export class AuthService {
  async login(identifier: string, password: string, ipAddress: string) {
    // Find user by email, username, or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
          { phone: identifier }
        ]
      },
      include: {
        subscription: true
      }
    })


    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {

      throw new Error('Invalid credentials')
    }

    // Update last login and increment login count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),

        lastLoginIp: ipAddress,
        loginCount: {
          increment: 1
        }
      }
    })

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    const { password: _, emailVerifyCode: __, resetPasswordToken: ___, ...userWithoutSensitive } = user

    return {
      user: userWithoutSensitive,
      ...tokens
    }
  }


  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists
      return true
    }

    const resetToken = generateToken(32)
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetExpiry
      }
    })

    await sendPasswordResetEmail(email, resetToken)

    return true
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw new Error('Invalid or expired reset token')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null
      }
    })

    return true
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken)

      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role
      })

      return tokens
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const { password, emailVerifyCode, resetPasswordToken, ...userWithoutSensitive } = user

    return userWithoutSensitive
  }

  async updateProfile(userId: string, data: {
    fullName?: string

    username?: string
    phone?: string
    address?: string
    avatar?: string
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        subscription: true
      }
    })

    const { password, emailVerifyCode, resetPasswordToken, ...userWithoutSensitive } = user

    return userWithoutSensitive
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return true
  }
}