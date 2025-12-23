// backend/src/workers/webhookWorker.ts
import { getRedis } from '../config/redis'
import { prisma } from '../config/database'
import { ExchangeFactory } from '../exchange/factory'
import { decrypt } from '../utils/encryption'
import { logger } from '../utils/logger'
import { emitToUser } from '../ws/socketServer'

interface WebhookJob {
  logId: string
  userId: string

  isSystemWebhook?: boolean
  payload: {
    // New simplified format
    action: 'open' | 'close' | 'slclose' | 'tpclose' | 'bep' | 'buy' | 'sell'
    symbol: string
    side: 'long' | 'short'
  }
  timestamp: number
}

class WebhookWorker {
  private isRunning: boolean = false
  private intervalId: NodeJS.Timeout | null = null

  start() {
    this.isRunning = true
    this.process()
  }

  stop() {
    this.isRunning = false
    if (this.intervalId) {
      clearTimeout(this.intervalId)
    }
  }

  private async process() {
    while (this.isRunning) {
      try {
        const redis = getRedis()
        const jobData = await redis.brpop('webhook:queue', 1) // 1 second timeout

        if (jobData) {
          const job: WebhookJob = JSON.parse(jobData[1])
          await this.executeJob(job)
        }
      } catch (error) {
        logger.error('Webhook worker error:', error)
        await this.sleep(1000)
      }
    }
  }

  private async executeJob(job: WebhookJob) {
    const startTime = Date.now()
    logger.info(`Processing webhook job ${job.logId}`)

    try {
      // Update log status to processing
      await prisma.webhookLog.update({
        where: { id: job.logId },
        data: { status: 'PROCESSING' }
      })

      // Get user's bot settings
      const botSettings = await prisma.botSettings.findUnique({
        where: { userId: job.userId }
      })

      if (!botSettings?.isEnabled) {
        throw new Error('Bot is disabled')
      }

      // Get user's API key
      const apiKey = await prisma.apiKey.findFirst({
        where: {
          userId: job.userId,
          isActive: true,
          isValid: true
        }
      })

      if (!apiKey) {
        throw new Error('No valid API key found')
      }

      // Create exchange instance
      const exchange = ExchangeFactory.create(
        apiKey.exchange.toLowerCase() as 'binance' | 'okx' | 'bitget',
        {
          apiKey: decrypt(apiKey.apiKey),
          secretKey: decrypt(apiKey.secretKey),
          passphrase: apiKey.passphrase ? decrypt(apiKey.passphrase) : undefined
        }
      )

      let result: any

      const { action, symbol, side } = job.payload

      // Execute based on action type
      switch (action) {
        case 'open':
        case 'buy':
        case 'sell':
          // Open new position - use user's bot settings for leverage and quantity
          result = await this.executeOpenPosition(exchange, job, botSettings)
          break

        case 'close':
          // Close all positions for this symbol/side
          result = await this.executeClosePosition(exchange, job.userId, symbol, side, 'close')
          break

        case 'slclose':
          // Stop Loss triggered - close position
          result = await this.executeClosePosition(exchange, job.userId, symbol, side, 'slclose')
          logger.info(`SL Close executed for ${symbol} ${side}`)
          break

        case 'tpclose':
          // Take Profit triggered - close position
          result = await this.executeClosePosition(exchange, job.userId, symbol, side, 'tpclose')
          logger.info(`TP Close executed for ${symbol} ${side}`)
          break

        case 'bep':
          // Move Stop Loss to entry price (Break Even Point)
          result = await this.executeBEP(exchange, job.userId, symbol, side)
          break

        default:
          throw new Error(`Unknown action: ${action}`)
      }

      // Update log as success
      await prisma.webhookLog.update({
        where: { id: job.logId },
        data: {
          status: 'SUCCESS',
          response: result as any,
          processedAt: new Date()
        }
      })

      // Notify user via WebSocket
      emitToUser(job.userId, 'trade:executed', {
        action: job.payload.action,
        symbol: job.payload.symbol,

        side: job.payload.side,
        result
      })

      const executionTime = Date.now() - startTime
      logger.info(`Webhook job ${job.logId} completed in ${executionTime}ms`)

    } catch (error: any) {
      logger.error(`Webhook job ${job.logId} failed:`, error)

      // Update log as failed
      await prisma.webhookLog.update({
        where: { id: job.logId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          processedAt: new Date()
        }
      })

      // Notify user of error
      emitToUser(job.userId, 'trade:error', {
        action: job.payload.action,
        symbol: job.payload.symbol,
        error: error.message
      })

      // Only retry on transient errors (network, exchange issues)
      // Don't retry on user-specific errors (insufficient balance, disabled bot, etc.)
      const isUserSpecificError = this.isNonRetryableError(error.message)
      if (!isUserSpecificError) {
        await this.handleRetry(job, error)
      } else {
        logger.info(`Webhook job ${job.logId} not retrying - user-specific error: ${error.message}`)
      }
    }
  }


  // Open position using user's bot settings for leverage and quantity
  private async executeOpenPosition(exchange: any, job: WebhookJob, botSettings: any) {
    const { symbol, side, action } = job.payload

    // Validate against bot settings
    if (botSettings.blacklistedSymbols?.includes(symbol)) {
      throw new Error(`Symbol ${symbol} is blacklisted`)
    }

    if (botSettings.allowedSymbols?.length > 0 &&
      !botSettings.allowedSymbols.includes(symbol)) {
      throw new Error(`Symbol ${symbol} is not in allowed list`)
    }

    // Check if already has open position for this symbol (prevent duplicate positions)
    const existingPosition = await prisma.position.findFirst({
      where: {
        userId: job.userId,
        symbol: symbol,
        isOpen: true
      }
    })

    if (existingPosition) {
      throw new Error(`Already has open ${existingPosition.side} position for ${symbol}. Close it first before opening new position.`)
    }

    // Check max positions limit (total across all symbols)
    const openPositions = await prisma.position.count({
      where: {
        userId: job.userId,
        isOpen: true
      }
    })

    if (openPositions >= botSettings.maxPositions) {
      throw new Error(`Max positions (${botSettings.maxPositions}) reached`)
    }


    // Use user's bot settings for leverage (NOT from webhook)
    const leverage = Math.min(botSettings.defaultLeverage, botSettings.maxLeverage)

    // Log user's settings being used
    logger.info(`User ${job.userId} settings: leverage=${leverage} (default=${botSettings.defaultLeverage}, max=${botSettings.maxLeverage}), riskPerTrade=${botSettings.riskPerTrade}%`)

    // Set leverage
    await exchange.setLeverage(symbol, leverage)

    // Calculate quantity based on user's risk settings (NOT from webhook)
    const balance = await exchange.getBalance()
    const riskAmount = balance.availableBalance * (botSettings.riskPerTrade / 100)

    logger.info(`User ${job.userId} balance: available=${balance.availableBalance}, riskAmount=${riskAmount} (${botSettings.riskPerTrade}% of balance)`)

    // Get current price for quantity calculation
    const ticker = await exchange.getTicker(symbol)
    const currentPrice = ticker.lastPrice || ticker.price

    // Calculate quantity based on risk amount and leverage
    let quantity = (riskAmount * leverage) / currentPrice

    // Round quantity to appropriate precision based on price level
    // This works for ANY symbol from TradingView
    const quantityPrecision = this.getQuantityPrecision(symbol, currentPrice)
    quantity = Math.floor(quantity * Math.pow(10, quantityPrecision)) / Math.pow(10, quantityPrecision)

    // Ensure minimum quantity is met (based on ~$5 minimum notional)
    const minQuantity = this.getMinQuantity(symbol, currentPrice)
    if (quantity < minQuantity) {
      throw new Error(`Calculated quantity (${quantity}) is below minimum (${minQuantity}) for ${symbol}. Increase risk % or account balance.`)
    }

    logger.info(`Opening position: ${symbol} ${side} - quantity: ${quantity}, price: ${currentPrice}, leverage: ${leverage}x`)

    // Determine order side
    const orderSide = side === 'long' ? 'buy' : 'sell'

    // Create the order
    const order = await exchange.createOrder({
      symbol,
      side: orderSide,
      type: 'market',
      quantity,
      leverage
    })

    // Save order to database
    await prisma.order.create({
      data: {
        userId: job.userId,
        exchange: exchange.getName().toUpperCase() as any,
        exchangeOrderId: order.id,

        symbol,
        side: orderSide.toUpperCase() as any,
        type: 'MARKET',
        status: 'FILLED',
        price: order.price,
        quantity: order.quantity || quantity,
        filledQuantity: order.filledQuantity || quantity,
        leverage,
        executedAt: new Date()
      }
    })


    // Create/update position record
    await prisma.position.upsert({
      where: {
        id: `${job.userId}-${symbol}-${side}`
      },
      update: {
        size: quantity,
        entryPrice: order.price || currentPrice,
        leverage,
        isOpen: true,
        openedAt: new Date()
      },
      create: {
        id: `${job.userId}-${symbol}-${side}`,
        userId: job.userId,
        exchange: exchange.getName().toUpperCase() as any,
        symbol,
        side: side.toUpperCase() as any,
        size: quantity,
        entryPrice: order.price || currentPrice,
        leverage,
        isOpen: true
      }
    })

    return order
  }

  // Close position for symbol/side and record to TradeHistory immediately
  private async executeClosePosition(exchange: any, userId: string, symbol: string, side: string, closeType: string = 'close') {
    try {
      // Find the open position in database BEFORE closing
      const position = await prisma.position.findFirst({
        where: {
          userId,
          symbol,
          side: side.toUpperCase() as any,
          isOpen: true
        }
      })

      // Execute close on exchange
      const result = await exchange.closePosition(symbol, side)
      
      // If we had an open position, record to TradeHistory immediately
      if (position) {
        // Get current/exit price from result or fetch ticker
        let exitPrice = result?.price || result?.exitPrice
        if (!exitPrice) {
          try {
            const ticker = await exchange.getTicker(symbol)
            exitPrice = ticker.lastPrice || ticker.price || position.markPrice
          } catch {
            exitPrice = position.markPrice || position.entryPrice
          }
        }
        
        // Calculate PnL
        let pnl = 0
        let pnlPercent = 0
        if (exitPrice && position.entryPrice) {
          const priceChange = exitPrice - position.entryPrice
          const direction = side.toLowerCase() === 'long' ? 1 : -1
          pnl = priceChange * position.size * direction
          pnlPercent = (priceChange / position.entryPrice) * 100 * direction
        }
        
        // Create TradeHistory record immediately
        await prisma.tradeHistory.create({
          data: {
            userId,
            exchange: position.exchange,
            symbol: position.symbol,
            side: position.side as any,
            entryPrice: position.entryPrice,
            exitPrice: exitPrice,
            quantity: position.size,
            leverage: position.leverage,
            pnl: pnl,
            pnlPercent: pnlPercent,
            duration: Math.floor((Date.now() - position.openedAt.getTime()) / 1000),
            openedAt: position.openedAt,
            closedAt: new Date()
          }
        })
        
        // Mark position as closed
        await prisma.position.update({
          where: { id: position.id },
          data: {
            isOpen: false,
            closedAt: new Date()
          }
        })
        
        logger.info(`TradeHistory created for ${symbol} ${side} - PnL: ${pnl.toFixed(2)} (${closeType})`)
      }
      
      return result
    } catch (error: any) {
      // If no position to close, that's okay
      if (error.message?.includes('no position') || error.message?.includes('not found')) {
        logger.info(`No position to close for ${symbol} ${side}`)
        return { message: 'No position to close' }
      }
      throw error
    }
  }

  // Move Stop Loss to entry price (Break Even Point)
  private async executeBEP(exchange: any, userId: string, symbol: string, side: string) {
    // Get position from database
    const position = await prisma.position.findFirst({
      where: {
        userId,
        symbol,
        side: side.toUpperCase() as any,
        isOpen: true
      }
    })

    if (!position) {
      throw new Error(`No open position found for ${symbol} ${side}`)
    }

    // Move stop loss to entry price
    const entryPrice = position.entryPrice

    // Update stop loss on exchange
    const result = await exchange.setStopLoss(symbol, side, entryPrice)

    // Update position in database
    await prisma.position.update({
      where: { id: position.id },
      data: { stopLoss: entryPrice }
    })

    logger.info(`BEP set for ${symbol} ${side} at ${entryPrice}`)

    return {
      message: 'BEP activated',
      symbol,
      side,
      entryPrice,
      newStopLoss: entryPrice
    }
  }

  private async handleRetry(job: WebhookJob, error: Error) {
    const redis = getRedis()
    const retryKey = `webhook:retry:${job.logId}`
    const retryCount = await redis.incr(retryKey)
    await redis.expire(retryKey, 3600) // 1 hour TTL

    if (retryCount <= 3) {
      // Add back to queue with delay
      const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff
      await this.sleep(delay)
      await redis.lpush('webhook:queue', JSON.stringify(job))
      logger.info(`Webhook job ${job.logId} requeued for retry ${retryCount}`)
    } else {
      logger.error(`Webhook job ${job.logId} max retries exceeded`)
    }
  }

  // Check if error should NOT be retried (user-specific issues)
  private isNonRetryableError(errorMessage: string): boolean {
    const nonRetryablePatterns = [
      'insufficient',
      'balance',
      'minimum',
      'not enough',
      'disabled',
      'blacklisted',
      'not in allowed',
      'already has open',
      'max positions',
      'no valid api key',
      'invalid api',
      'api key',
      'permission',
      'unauthorized'
    ]
    
    const lowerMessage = errorMessage.toLowerCase()
    return nonRetryablePatterns.some(pattern => lowerMessage.includes(pattern))
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get quantity precision (decimal places) based on price level
  // This works for ANY symbol - higher price = more decimals needed
  private getQuantityPrecision(symbol: string, price?: number): number {
    // If price provided, calculate based on price level
    if (price && price > 0) {
      if (price >= 10000) return 4  // BTC-like: 0.0001
      if (price >= 1000) return 3   // ETH-like: 0.001  
      if (price >= 100) return 2    // SOL-like: 0.01
      if (price >= 10) return 1     // LINK-like: 0.1
      if (price >= 1) return 0      // XRP-like: 1
      return 0                       // Very low price coins: 1
    }
    
    // Fallback to symbol-based for common pairs
    const upperSymbol = symbol.toUpperCase()
    if (upperSymbol.includes('BTC')) return 4
    if (upperSymbol.includes('ETH')) return 3
    
    // Default
    return 2
  }

  // Get minimum quantity based on price level
  // Works for ANY symbol - calculated dynamically
  private getMinQuantity(symbol: string, price?: number): number {
    // Calculate minimum based on ~$5 USD minimum notional value
    // Most exchanges require around $5-10 minimum order value
    const MIN_NOTIONAL_USD = 5
    
    if (price && price > 0) {
      const minQty = MIN_NOTIONAL_USD / price
      // Round up to a reasonable precision
      const precision = this.getQuantityPrecision(symbol, price)
      return Math.ceil(minQty * Math.pow(10, precision)) / Math.pow(10, precision)
    }
    
    // Fallback for known symbols
    const upperSymbol = symbol.toUpperCase()
    if (upperSymbol.includes('BTC')) return 0.0001
    if (upperSymbol.includes('ETH')) return 0.001
    
    // Default very small minimum
    return 0.01
  }
}

export const webhookWorker = new WebhookWorker()