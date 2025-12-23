// backend/src/routes/auth.routes.ts
import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middlewares/validate'
import { authenticate } from '../middlewares/auth'
import { authLimiter } from '../middlewares/rateLimiter'
import { authSchemas } from '../validators/auth.validator'

const router = Router()
const authController = new AuthController()

router.post(
  '/login',
  validate(authSchemas.login),
  authController.login
)

router.post(
  '/refresh',
  validate(authSchemas.refresh),
  authController.refreshToken
)

router.get(
  '/profile',
  authenticate,
  authController.getProfile
)

router.put(
  '/profile',
  authenticate,
  validate(authSchemas.updateProfile),
  authController.updateProfile
)

router.post(
  '/change-password',
  authenticate,
  validate(authSchemas.changePassword),
  authController.changePassword
)

router.post(
  '/logout',
  authenticate,
  authController.logout
)

// Public endpoint to check maintenance mode (no auth required)
router.get('/status', async (req, res) => {
  try {
    const { prisma } = require('../config/database')
    const settings = await prisma.systemSettings.findFirst()
    
    res.json({
      success: true,
      data: {
        maintenanceMode: settings?.maintenanceMode || false,
        platformName: settings?.platformName || 'MaticTrade'
      }
    })
  } catch (error) {
    res.json({
      success: true,
      data: {
        maintenanceMode: false,
        platformName: 'MaticTrade'
      }
    })
  }
})

export default router