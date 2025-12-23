// backend/src/utils/apiResponse.ts
import { Response } from 'express'

export interface ApiResponseData<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200,
  meta?: ApiResponseData['meta']
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    meta
  })
}

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  error?: string
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error
  })
}

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response => {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })

}

// ApiResponse class for middleware usage
export class ApiResponse {
  static success<T>(res: Response, data?: T, message?: string, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: true,
      data,
      message
    })
  }

  static error(res: Response, message: string, statusCode: number = 500): Response {
    return res.status(statusCode).json({
      success: false,
      message
    })
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return res.status(401).json({
      success: false,
      message
    })
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return res.status(403).json({
      success: false,
      message
    })
  }

  static notFound(res: Response, message: string = 'Not found'): Response {
    return res.status(404).json({
      success: false,
      message
    })
  }

  static badRequest(res: Response, message: string = 'Bad request'): Response {
    return res.status(400).json({
      success: false,
      message
    })
  }
}