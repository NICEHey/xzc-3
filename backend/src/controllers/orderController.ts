import { Request, Response } from 'express'
import * as orderService from '../services/orderService'
import { success, error, notFound } from '../utils/response'

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return error(res, '用户ID不存在', 400)
    }

    const order = await orderService.createOrder(userId, req.body)
    success(res, order, '订单创建成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 20
    const status = req.query.status as string | undefined

    const result = await orderService.getOrders(userId, page, pageSize, status)
    success(res, result)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const order = await orderService.getOrderById(id)
    success(res, order)
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function getOrderByNo(req: Request, res: Response) {
  try {
    const orderNo = req.params.orderNo
    if (!orderNo) {
      return error(res, '参数错误', 400)
    }

    const order = await orderService.getOrderByNo(orderNo)
    success(res, order)
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function payOrder(req: Request, res: Response) {
  try {
    const { orderNo } = req.body
    if (!orderNo) {
      return error(res, '订单号不能为空', 400)
    }

    const order = await orderService.payOrder(orderNo)
    success(res, order, '支付成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function cancelOrder(req: Request, res: Response) {
  try {
    const orderNo = req.params.orderNo
    const userId = req.user?.userId

    if (!orderNo) {
      return error(res, '参数错误', 400)
    }

    const order = await orderService.cancelOrder(orderNo, userId)
    success(res, order, '订单已取消')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function refundOrder(req: Request, res: Response) {
  try {
    const orderNo = req.params.orderNo
    if (!orderNo) {
      return error(res, '参数错误', 400)
    }

    const order = await orderService.refundOrder(orderNo)
    success(res, order, '退款成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function deliverOrder(req: Request, res: Response) {
  try {
    const orderNo = req.params.orderNo
    if (!orderNo) {
      return error(res, '参数错误', 400)
    }

    const order = await orderService.deliverOrder(orderNo)
    success(res, order, '开始配送')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function completeOrder(req: Request, res: Response) {
  try {
    const orderNo = req.params.orderNo
    if (!orderNo) {
      return error(res, '参数错误', 400)
    }

    const order = await orderService.completeOrder(orderNo)
    success(res, order, '订单已完成')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function createEvaluation(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const { orderId, score, content, images } = req.body

    if (!userId || !orderId) {
      return error(res, '参数错误', 400)
    }

    const evaluation = await orderService.createEvaluation(orderId, userId, score, content, images)
    success(res, evaluation, '评价成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getEvaluations(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 20

    const result = await orderService.getEvaluations(page, pageSize)
    success(res, result)
  } catch (err: any) {
    error(res, err.message)
  }
}