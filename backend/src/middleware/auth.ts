import { Request, Response, NextFunction } from 'express'
import { verifyToken, TokenPayload } from '../utils/jwt'
import { unauthorized } from '../utils/response'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    unauthorized(res, '请先登录')
    return
  }

  const decoded = verifyToken(token)
  
  if (!decoded) {
    unauthorized(res, '无效的token')
    return
  }

  req.user = decoded
  next()
}

export function vipMiddleware(req: Request, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    if (req.user?.level !== 'VIP') {
      unauthorized(res, '需要VIP权限')
      return
    }
    next()
  })
}