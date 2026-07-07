import { Request, Response, NextFunction } from 'express'
import { error } from '../utils/response'

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', err)
  
  if (err.code === 'P2002') {
    error(res, '数据已存在', 400)
    return
  }
  
  if (err.code === 'P2025') {
    error(res, '数据不存在', 404)
    return
  }

  if (err.name === 'ZodError') {
    error(res, err.errors.map((e: any) => e.message).join(', '), 400)
    return
  }

  error(res, err.message || '服务器错误', 500)
}