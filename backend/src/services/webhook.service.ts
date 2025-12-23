// backend/src/services/webhook.service.ts
import { prisma } from '../config/database'
import { getRedis } from '../config/redis'
import { generateToken } from '../utils/encryption'
import { logger } from '../utils/logger'
import { config } from '../config/env'


// New simplified webhook payload format
interface WebhookPayload {
  action: 'open' | 'close' | 'slclose' | 'tpclose' | 'bep'
  symbol: string
  side: 'long' | 'short'
  entryPrice?: number // Price captured when signal is received
}

// Legacy format (for backward compatibility)
interface LegacyWebhookPayload {
  action: 'buy' | 'sell' | 'close'
  symbol: string
  side?: 'long' | 'short'
  quantity?: number
  leverage?: number
  stopLoss?: number
  takeProfit?: number
  price?: number
  orderType?: 'market' | 'limit'
}

// Helper function to get current price from Binance Futures API
async function getBinancePrice(symbol: string): Promise<number> {
  try {
    const response = await fetch(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol.toUpperCase()}`)
    if (response.ok) {
      const data = await response.json()
      return parseFloat(data.price) || 0
    }
    return 0
  } catch (error) {
    logger.error('Failed to fetch Binance price:', error)
    return 0
  }
}

export class WebhookService {

  // Process system-wide webhook - broadcasts to ALL active users with bot enabled
  async processSystemWebhook(token: string, payload: WebhookPayload) {
    // Validate system webhook token
    const systemSettings = await prisma.systemSettings.findFirst()

    if (!systemSettings || systemSettings.webhookToken !== token) {
      throw new Error('Invalid system webhook token')
    }

    // Validate payload
    if (!payload.action || !payload.symbol || !payload.side) {
      throw new Error('Missing required fields: action, symbol, side')
    }

    const validActions = ['open', 'close', 'slclose', 'tpclose', 'bep']
    if (!validActions.includes(payload.action)) {
      throw new Error(`Invalid action: ${payload.action}. Valid actions: ${validActions.join(', ')}`)
    }

    // Fetch entry price from Binance when action is 'open'
    let entryPrice = 0
    if (payload.action === 'open') {
      entryPrice = await getBinancePrice(payload.symbol)
      logger.info(`Fetched entry price for ${payload.symbol}: ${entryPrice}`)
    }

    // Always create a system-level signal log for tracking (even if no users match)
    // First, ensure a system webhook config exists
    let systemWebhookConfig = await prisma.webhookConfig.findFirst({
      where: { userId: 'system' }
    })
    
    if (!systemWebhookConfig) {
      // Create a system webhook config to track all incoming signals
      const adminUser = await prisma.user.findFirst({
        where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
      })
      
      if (adminUser) {
        systemWebhookConfig = await prisma.webhookConfig.upsert({
          where: { userId: adminUser.id },
          update: {
            lastTriggered: new Date(),
            totalTriggers: { increment: 1 }
          },
          create: {
            userId: adminUser.id,
            token: generateToken(32)
          }
        })
        
        // Create log entry for tracking all signals
        await prisma.webhookLog.create({
          data: {
            webhookId: systemWebhookConfig.id,
            userId: adminUser.id,
            payload: { ...payload, isSystemSignal: true, entryPrice } as any,
            status: 'SUCCESS' // Mark as success since signal was received
          }
        })
      }
    } else {
      // Update existing system webhook config
      await prisma.webhookConfig.update({
        where: { id: systemWebhookConfig.id },
        data: {
          lastTriggered: new Date(),
          totalTriggers: { increment: 1 }
        }
      })
      
      // Create log entry
      await prisma.webhookLog.create({
        data: {
          webhookId: systemWebhookConfig.id,
          userId: systemWebhookConfig.userId,
          payload: { ...payload, isSystemSignal: true, entryPrice } as any,
          status: 'SUCCESS'
        }
      })
    }

    // Get all active users with bot enabled
    const activeUsers = await prisma.user.findMany({
      where: {
        isActive: true,
        botActive: true,
        botSettings: {
          isEnabled: true
        },
        // Must have active subscription
        subscription: {
          status: 'ACTIVE'
        }
      },
      include: {
        webhookConfig: true,
        botSettings: true
      }
    })

    if (activeUsers.length === 0) {
      logger.warn('No active users with bot enabled found for system webhook, signal logged')
      return { usersQueued: 0, signalLogged: true }
    }

    const redis = getRedis()
    let queuedCount = 0

    // Queue trade for each active user
    for (const user of activeUsers) {
      try {
        // Check if user has webhook config, create if not
        let webhookConfig = user.webhookConfig
        if (!webhookConfig) {
          webhookConfig = await prisma.webhookConfig.create({
            data: {
              userId: user.id,
              token: generateToken(32)
            }
          })
        }

        if (!webhookConfig.isActive) {
          continue
        }

        // Create webhook log
        const log = await prisma.webhookLog.create({
          data: {
            webhookId: webhookConfig.id,
            userId: user.id,
            payload: payload as any,
            status: 'PENDING'
          }
        })

        // Update webhook stats
        await prisma.webhookConfig.update({
          where: { id: webhookConfig.id },
          data: {
            lastTriggered: new Date(),
            totalTriggers: { increment: 1 }
          }
        })

        // Add to Redis queue for processing
        await redis.lpush('webhook:queue', JSON.stringify({
          logId: log.id,
          userId: user.id,
          payload,
          isSystemWebhook: true,
          timestamp: Date.now()
        }))

        queuedCount++
      } catch (error: any) {
        logger.error(`Failed to queue webhook for user ${user.id}:`, error)
      }
    }

    logger.info(`System webhook queued for ${queuedCount} users`, { action: payload.action, symbol: payload.symbol })

    return { usersQueued: queuedCount, signalLogged: true }
  }

  // Process individual user webhook (legacy support)
  async processWebhook(userId: string, token: string, payload: LegacyWebhookPayload | WebhookPayload) {
    // Validate webhook
    const webhook = await prisma.webhookConfig.findFirst({
      where: {
        userId,
        token,
        isActive: true
      }
    })

    if (!webhook) {
      throw new Error('Invalid webhook')
    }

    // Check if user is active
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        botSettings: true
      }
    })

    if (!user || !user.isActive) {
      throw new Error('User account not active')
    }

    if (!user.botSettings?.isEnabled) {
      throw new Error('Bot is disabled')
    }

    // Create webhook log
    const log = await prisma.webhookLog.create({
      data: {
        webhookId: webhook.id,
        userId,
        payload: payload as any,
        status: 'PENDING'
      }
    })

    // Update webhook stats
    await prisma.webhookConfig.update({
      where: { id: webhook.id },
      data: {
        lastTriggered: new Date(),
        totalTriggers: { increment: 1 }
      }
    })

    // Add to Redis queue for processing
    const redis = getRedis()
    await redis.lpush('webhook:queue', JSON.stringify({
      logId: log.id,
      userId,
      payload,

      isSystemWebhook: false,
      timestamp: Date.now()
    }))

    logger.info(`Webhook queued for user ${userId}`, { logId: log.id })

    return { logId: log.id }
  }

  async getConfig(userId: string) {
    let webhook = await prisma.webhookConfig.findUnique({
      where: { userId }
    })

    if (!webhook) {
      webhook = await this.generateWebhook(userId)
    }

    return {
      id: webhook.id,
      token: webhook.token,
      url: `${config.frontendUrl.replace('3000', '3001')}/api/webhook/${userId}/${webhook.token}`,
      isActive: webhook.isActive,
      lastTriggered: webhook.lastTriggered,
      totalTriggers: webhook.totalTriggers,
      createdAt: webhook.createdAt
    }
  }

  async generateWebhook(userId: string) {
    const existingWebhook = await prisma.webhookConfig.findUnique({
      where: { userId }
    })

    if (existingWebhook) {
      return existingWebhook
    }

    const token = generateToken(32)

    const webhook = await prisma.webhookConfig.create({
      data: {
        userId,
        token
      }
    })

    return webhook
  }

  async regenerateWebhook(userId: string) {
    const token = generateToken(32)

    const webhook = await prisma.webhookConfig.upsert({
      where: { userId },
      update: { token },
      create: {
        userId,
        token
      }
    })

    return {
      id: webhook.id,
      token: webhook.token,
      url: `${config.frontendUrl.replace('3000', '3001')}/api/webhook/${userId}/${webhook.token}`,
      isActive: webhook.isActive,
      createdAt: webhook.createdAt
    }
  }

  async getLogs(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      prisma.webhookLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.webhookLog.count({ where: { userId } })
    ])

    return { logs, total }
  }

  async toggleWebhook(userId: string, isActive: boolean) {
    const webhook = await prisma.webhookConfig.update({
      where: { userId },
      data: { isActive }
    })

    return webhook
  }
}