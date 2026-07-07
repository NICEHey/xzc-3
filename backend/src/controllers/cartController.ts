import { Request, Response } from 'express'
import * as cartService from '../services/cartService'
import { success, error, notFound } from '../utils/response'

export async function addCartItem(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const { productId, quantity } = req.body

    if (!userId || !productId) {
      return error(res, '参数错误', 400)
    }

    const item = await cartService.addCartItem(userId, productId, quantity || 1)
    success(res, item, '添加成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function updateCartItem(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const cartItemId = parseInt(req.params.id)
    const { quantity } = req.body

    if (!userId || isNaN(cartItemId) || quantity === undefined) {
      return error(res, '参数错误', 400)
    }

    const item = await cartService.updateCartItem(userId, cartItemId, quantity)
    success(res, item, '更新成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function deleteCartItem(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const cartItemId = parseInt(req.params.id)

    if (!userId || isNaN(cartItemId)) {
      return error(res, '参数错误', 400)
    }

    await cartService.deleteCartItem(userId, cartItemId)
    success(res, null, '删除成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function clearCart(req: Request, res: Response) {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return error(res, '参数错误', 400)
    }

    await cartService.clearCart(userId)
    success(res, null, '清空成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return error(res, '参数错误', 400)
    }

    const items = await cartService.getCart(userId)
    success(res, items)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getCartCount(req: Request, res: Response) {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return error(res, '参数错误', 400)
    }

    const count = await cartService.getCartCount(userId)
    success(res, { count })
  } catch (err: any) {
    error(res, err.message)
  }
}