import { Request, Response } from 'express'
import * as statsService from '../services/statsService'
import { success, error } from '../utils/response'

export async function getDashboard(req: Request, res: Response) {
  try {
    const stats = await statsService.getDashboardStats()
    success(res, stats)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getOrderStats(req: Request, res: Response) {
  try {
    const type = (req.query.type as string) || 'week'
    if (!['day', 'week', 'month'].includes(type)) {
      return error(res, '无效的类型参数', 400)
    }

    const stats = await statsService.getOrderStats(type as 'day' | 'week' | 'month')
    success(res, stats)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getUserStats(req: Request, res: Response) {
  try {
    const type = (req.query.type as string) || 'week'
    if (!['day', 'week', 'month'].includes(type)) {
      return error(res, '无效的类型参数', 400)
    }

    const stats = await statsService.getUserStats(type as 'day' | 'week' | 'month')
    success(res, stats)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getProductSalesTop(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const stats = await statsService.getProductSalesTop(limit)
    success(res, stats)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getDeliveryStats(req: Request, res: Response) {
  try {
    const stats = await statsService.getDeliveryStats()
    success(res, stats)
  } catch (err: any) {
    error(res, err.message)
  }
}