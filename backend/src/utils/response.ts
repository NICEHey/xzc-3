import { Response } from 'express'

export interface ApiResponse {
  code: number
  message: string
  data?: any
}

export function success(res: Response, data?: any, message: string = 'success'): void {
  res.json({ code: 200, message, data })
}

export function error(res: Response, message: string = 'error', code: number = 400): void {
  res.status(code).json({ code, message })
}

export function notFound(res: Response, message: string = 'not found'): void {
  error(res, message, 404)
}

export function unauthorized(res: Response, message: string = 'unauthorized'): void {
  error(res, message, 401)
}

export function forbidden(res: Response, message: string = 'forbidden'): void {
  error(res, message, 403)
}