// backend/src/controllers/webhook.controller.ts
import { Request, Response, NextFunction } from 'express'
import { WebhookService } from '../services/webhook.service'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse'
import { AuthRequest } from '../middlewares/auth'
import { logger } from '../utils/logger'

export class WebhookController {
  private webhookService: WebhookService

  constructor() {
    this.webhookService = new WebhookService()
  }


  // System-wide webhook endpoint for TradingView - broadcasts to ALL active users
  handleSystemWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()

    try {
      const { token } = req.params
      const payload = req.body

      logger.info('System webhook received', { payload })

      // Process system webhook - broadcasts to all users
      const result = await this.webhookService.processSystemWebhook(token, payload)

      const responseTime = Date.now() - startTime
      logger.info(`System webhook processed in ${responseTime}ms, queued for ${result.usersQueued} users`)

      return res.status(200).json({
        success: true,
        message: 'System webhook received',
        usersQueued: result.usersQueued,
        responseTime: `${responseTime}ms`
      })
    } catch (error: any) {
      logger.error('System webhook error:', error)
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  // Individual user webhook endpoint for TradingView
  handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()

    try {
      const { userId, token } = req.params
      const payload = req.body

      logger.info(`Webhook received for user ${userId}`, { payload })

      // Quick validation and queue
      await this.webhookService.processWebhook(userId, token, payload)

      // Response within 100-200ms
      const responseTime = Date.now() - startTime
      logger.info(`Webhook processed in ${responseTime}ms`)

      return res.status(200).json({
        success: true,
        message: 'Webhook received',
        responseTime: `${responseTime}ms`
      })
    } catch (error: any) {
      logger.error('Webhook error:', error)
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  getConfig = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const config = await this.webhookService.getConfig(req.user!.userId)
      return sendSuccess(res, config)
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  generateWebhook = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const webhook = await this.webhookService.generateWebhook(req.user!.userId)
      return sendSuccess(res, webhook, 'Webhook generated', 201)
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  regenerateWebhook = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const webhook = await this.webhookService.regenerateWebhook(req.user!.userId)
      return sendSuccess(res, webhook, 'Webhook regenerated')
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  getLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20


      const result = await this.webhookService.getLogs(req.user!.userId, page, limit)
      return sendPaginated(res, result.logs, page, limit, result.total)
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  toggleWebhook = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.body
      const webhook = await this.webhookService.toggleWebhook(req.user!.userId, isActive)
      return sendSuccess(res, webhook, `Webhook ${isActive ? 'enabled' : 'disabled'}`)
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }
}