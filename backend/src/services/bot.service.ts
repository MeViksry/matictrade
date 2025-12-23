// backend/src/services/bot.service.ts
import { prisma } from '../config/database'
import { getRedis } from '../config/redis'
import { logger } from '../utils/logger'

export class BotService {
  async getSettings(userId: string) {
    let settings = await prisma.botSettings.findUnique({
      where: { userId }
    })

    if (!settings) {
      settings = await prisma.botSettings.create({
        data: { userId }
      })
    }

    return settings
  }

  async updateSettings(userId: string, data: {
    isEnabled?: boolean
    maxPositions?: number
    defaultLeverage?: number
    maxLeverage?: number
    riskPerTrade?: number
    stopLossPercent?: number
    takeProfitPercent?: number
    trailingStop?: boolean
    trailingStopPercent?: number
    allowedSymbols?: string[]
    blacklistedSymbols?: string[]
  }) {

    // Validate and enforce limits
    const validatedData = { ...data }

    // Max leverage limit: 3x for users
    const MAX_USER_LEVERAGE = 3
    if (validatedData.defaultLeverage !== undefined) {
      validatedData.defaultLeverage = Math.min(Math.max(validatedData.defaultLeverage, 1), MAX_USER_LEVERAGE)
    }
    if (validatedData.maxLeverage !== undefined) {
      validatedData.maxLeverage = Math.min(Math.max(validatedData.maxLeverage, 1), MAX_USER_LEVERAGE)
    }

    // Max positions limit: Always 1 (not configurable by user)
    validatedData.maxPositions = 1

    // Risk per trade: 1-100%
    if (validatedData.riskPerTrade !== undefined) {
      validatedData.riskPerTrade = Math.min(Math.max(validatedData.riskPerTrade, 1), 100)
    }

    const settings = await prisma.botSettings.upsert({
      where: { userId },
      update: validatedData,
      create: {
        userId,
        maxPositions: validatedData.maxPositions || 1,
        defaultLeverage: validatedData.defaultLeverage || 1,
        maxLeverage: validatedData.maxLeverage || 1,
        riskPerTrade: validatedData.riskPerTrade || 10,
        ...validatedData
      }
    })

    // If bot is being enabled/disabled, update Redis

    if (typeof validatedData.isEnabled !== 'undefined') {
      const redis = getRedis()
      if (validatedData.isEnabled) {
        await redis.sadd('bot:active_users', userId)
      } else {
        await redis.srem('bot:active_users', userId)
      }
    }

    return settings
  }

  async toggleBot(userId: string, enabled: boolean) {
    // Check if user has valid API key
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        userId,
        isActive: true,
        isValid: true
      }
    })

    if (enabled && !apiKey) {
      throw new Error('Please add a valid API key before enabling the bot')
    }

    const settings = await prisma.botSettings.update({
      where: { userId },
      data: { isEnabled: enabled }
    })

    // Update Redis
    const redis = getRedis()
    if (enabled) {
      await redis.sadd('bot:active_users', userId)
      logger.info(`Bot enabled for user ${userId}`)
    } else {
      await redis.srem('bot:active_users', userId)
      logger.info(`Bot disabled for user ${userId}`)
    }

    return { isEnabled: settings.isEnabled }
  }

  async getStatus(userId: string) {
    const settings = await prisma.botSettings.findUnique({
      where: { userId }
    })

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        userId,
        isActive: true,
        isValid: true
      }
    })

    const openPositions = await prisma.position.count({
      where: {
        userId,
        isOpen: true
      }
    })

    const redis = getRedis()
    const isInActiveList = await redis.sismember('bot:active_users', userId)

    return {
      isEnabled: settings?.isEnabled || false,
      isRunning: isInActiveList === 1,
      hasValidApiKey: !!apiKey,
      openPositions,
      settings
    }
  }

  async getLogs(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit

    const logs = await prisma.webhookLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    return logs
  }
}