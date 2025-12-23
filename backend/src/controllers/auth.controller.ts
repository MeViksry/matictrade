import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { sendSuccess, sendError } from '../utils/apiResponse'
import { AuthRequest } from '../middlewares/auth'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }




  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { identifier, password } = req.body
      const result = await this.authService.login(identifier, password, req.ip || '')
      return sendSuccess(res, result, 'Login successful')
    } catch (error: any) {
      return sendError(res, error.message, 401)
    }
  }




  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body
      await this.authService.forgotPassword(email)
      return sendSuccess(res, null, 'Password reset email sent')
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body
      await this.authService.resetPassword(token, password)
      return sendSuccess(res, null, 'Password reset successful')
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body
      const result = await this.authService.refreshToken(refreshToken)
      return sendSuccess(res, result, 'Token refreshed')
    } catch (error: any) {
      return sendError(res, error.message, 401)
    }
  }

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.getProfile(req.user!.userId)
      return sendSuccess(res, user)
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.updateProfile(req.user!.userId, req.body)
      return sendSuccess(res, user, 'Profile updated')
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body
      await this.authService.changePassword(req.user!.userId, currentPassword, newPassword)
      return sendSuccess(res, null, 'Password changed successfully')
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Add token to blacklist if needed
      return sendSuccess(res, null, 'Logged out successfully')
    } catch (error: any) {
      return sendError(res, error.message, 400)
    }
  }
}