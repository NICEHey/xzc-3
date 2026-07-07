import prisma from '../utils/prisma'
import { OrderCreateInput } from '../types'
import { generateOrderNo, calculateDiscount, calculatePoints, pointsToAmount } from '../utils/utils'
import * as userService from './userService'
import * as deliveryService from './deliveryService'

interface OrderCreateInputWithCart extends OrderCreateInput {
  useCart?: boolean
}

export async function createOrder(userId: number, input: OrderCreateInputWithCart) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new Error('用户不存在')
  }

  const address = await prisma.userAddress.findUnique({ where: { id: input.addressId, userId } })
  if (!address) {
    throw new Error('收货地址不存在')
  }

  let cartItems: any[] = []
  
  if (input.useCart) {
    cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    })

    if (cartItems.length === 0) {
      throw new Error('购物车为空')
    }
  } else if (!input.items || input.items.length === 0) {
    throw new Error('请选择商品')
  }

  const items: any[] = []
  let totalAmount = 0
  const orderItems = input.useCart ? cartItems : input.items

  for (const item of orderItems) {
    const product = input.useCart ? item.product : await prisma.product.findUnique({ where: { id: item.productId } })
    
    if (!product || product.status !== 'ON_SALE') {
      throw new Error(`商品不存在或已下架`)
    }

    const quantity = input.useCart ? item.quantity : item.quantity

    const price = user.level === 'VIP' ? product.vipPrice : product.salePrice
    const itemTotal = Number(price) * quantity

    items.push({
      productId: product.id,
      name: product.name,
      price: price,
      quantity,
      image: product.image
    })

    totalAmount += itemTotal
  }

  const discountAmount = calculateDiscount(totalAmount, user.level)
  const maxPoints = Math.floor(totalAmount * 0.1 * 100)
  const requestedPoints = input.pointUsed || 0
  
  if (requestedPoints > 0) {
    if (requestedPoints > user.points) {
      throw new Error('积分不足')
    }
    if (requestedPoints > maxPoints) {
      throw new Error(`积分抵扣不能超过订单金额的10%，最多可使用${maxPoints}积分`)
    }
  }
  
  const pointUsed = Math.min(requestedPoints, maxPoints, user.points)
  const pointsDiscount = pointsToAmount(pointUsed)
  const payAmount = Math.max(0, totalAmount - discountAmount - pointsDiscount)

  const orderNo = generateOrderNo()

  const transaction = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const result = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } }
      })

      if (result.count === 0) {
        const product = await tx.product.findUnique({ where: { id: item.productId } })
        throw new Error(`商品 ${product?.name || item.name} 库存不足`)
      }
    }

    const order = await tx.order.create({
      data: {
        orderNo,
        userId,
        addressId: input.addressId,
        totalAmount: totalAmount,
        discountAmount: discountAmount,
        pointUsed,
        payAmount: payAmount
      }
    })

    await tx.orderItem.createMany({
      data: items.map(item => ({
        orderId: order.id,
        ...item
      }))
    })

    if (pointUsed > 0) {
      await userService.addPoints(userId, -pointUsed, '订单抵扣', order.id)
    }

    if (input.useCart) {
      await tx.cartItem.deleteMany({ where: { userId } })
    }

    return order
  })

  return await getOrderById(transaction.id)
}

export async function getOrders(userId?: number, page: number = 1, pageSize: number = 20, status?: string) {
  const skip = (page - 1) * pageSize

  const where: any = {}
  if (userId) where.userId = userId
  if (status) where.status = status

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
      address: true,
      delivery: { select: { name: true, phone: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize
  })

  const total = await prisma.order.count({ where })

  return { orders, total, page, pageSize }
}

export async function getOrderById(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      delivery: { select: { name: true, phone: true } },
      evaluation: true,
      deliveryTraces: { orderBy: { createdAt: 'asc' } }
    }
  })

  if (!order) {
    throw new Error('订单不存在')
  }

  return order
}

export async function getOrderByNo(orderNo: string) {
  const order = await prisma.order.findUnique({
    where: { orderNo },
    include: {
      items: true,
      address: true,
      delivery: { select: { name: true, phone: true } },
      evaluation: true,
      deliveryTraces: { orderBy: { createdAt: 'asc' } }
    }
  })

  if (!order) {
    throw new Error('订单不存在')
  }

  return order
}

export async function payOrder(orderNo: string) {
  const order = await prisma.order.findUnique({ where: { orderNo } })
  if (!order) {
    throw new Error('订单不存在')
  }

  if (order.status !== 'PENDING_PAY') {
    throw new Error('订单状态不允许支付')
  }

  const updatedOrder = await prisma.order.update({
    where: { orderNo },
    data: {
      status: 'PAID',
      payTime: new Date()
    }
  })

  const points = calculatePoints(Number(order.payAmount))
  await userService.addPoints(order.userId, points, '订单支付奖励', order.id)

  await deliveryService.autoAssignDelivery(order.id)

  return await getOrderByNo(orderNo)
}

export async function cancelOrder(orderNo: string, userId?: number) {
  const order = await prisma.order.findUnique({ 
    where: { orderNo },
    include: { items: true }
  })
  if (!order) {
    throw new Error('订单不存在')
  }

  if (userId && order.userId !== userId) {
    throw new Error('无权操作该订单')
  }

  if (order.status === 'COMPLETED' || order.status === 'REFUNDED') {
    throw new Error('订单已完成或已退款，无法取消')
  }

  if (order.status === 'DELIVERING') {
    throw new Error('订单配送中，无法取消')
  }

  const transaction = await prisma.$transaction(async (tx) => {
    if (order.status === 'PAID' || order.status === 'PENDING_DELIVERY') {
      await tx.order.update({
        where: { orderNo },
        data: {
          status: 'CANCELLED',
          cancelTime: new Date(),
          refundAmount: order.payAmount,
          refundTime: new Date()
        }
      })

      if (order.pointUsed > 0) {
        await userService.addPoints(order.userId, order.pointUsed, '订单取消返还积分', order.id)
      }
    } else {
      await tx.order.update({
        where: { orderNo },
        data: {
          status: 'CANCELLED',
          cancelTime: new Date()
        }
      })
    }

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      })
    }
  })

  return await getOrderByNo(orderNo)
}

export async function refundOrder(orderNo: string) {
  const order = await prisma.order.findUnique({ 
    where: { orderNo },
    include: { items: true }
  })
  if (!order) {
    throw new Error('订单不存在')
  }

  if (order.status !== 'PAID' && order.status !== 'PENDING_DELIVERY') {
    throw new Error('订单状态不允许退款')
  }

  const refundAmount = Number(order.payAmount) - Number(order.refundAmount)

  const updatedOrder = await prisma.order.update({
    where: { orderNo },
    data: {
      status: 'REFUNDED',
      refundAmount: order.payAmount,
      refundTime: new Date()
    }
  })

  if (order.pointUsed > 0) {
    await userService.addPoints(order.userId, order.pointUsed, '订单退款返还积分', order.id)
  }

  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } }
    })
  }

  return await getOrderByNo(orderNo)
}

export async function deliverOrder(orderNo: string) {
  const order = await prisma.order.findUnique({ where: { orderNo } })
  if (!order) {
    throw new Error('订单不存在')
  }

  if (order.status !== 'PENDING_DELIVERY') {
    throw new Error('订单状态不允许配送')
  }

  if (!order.deliveryId) {
    throw new Error('配送员未分配')
  }

  const updatedOrder = await prisma.order.update({
    where: { orderNo },
    data: {
      status: 'DELIVERING',
      deliveryTime: new Date()
    }
  })

  await deliveryService.addDeliveryTrace(order.id, order.deliveryId, 39.9042, 116.4074, 'DELIVERING', '配送员已取货，正在配送中')

  return await getOrderByNo(orderNo)
}

export async function completeOrder(orderNo: string) {
  const order = await prisma.order.findUnique({ where: { orderNo } })
  if (!order) {
    throw new Error('订单不存在')
  }

  if (order.status !== 'DELIVERING') {
    throw new Error('订单状态不允许完成')
  }

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { orderNo },
      data: {
        status: 'COMPLETED',
        completeTime: new Date()
      }
    })

    if (order.deliveryId) {
      await tx.deliveryStaff.update({
        where: { id: order.deliveryId },
        data: {
          completedOrders: { increment: 1 }
        }
      })
    }
  })

  return await getOrderByNo(orderNo)
}

export async function createEvaluation(orderId: number, userId: number, score: number, content: string = '', images: string[] = []) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) {
    throw new Error('订单不存在')
  }

  if (order.userId !== userId) {
    throw new Error('无权评价该订单')
  }

  if (order.status !== 'COMPLETED') {
    throw new Error('订单未完成，无法评价')
  }

  const existingEval = await prisma.evaluation.findUnique({ where: { orderId } })
  if (existingEval) {
    throw new Error('该订单已评价')
  }

  const evaluation = await prisma.evaluation.create({
    data: {
      orderId,
      userId,
      score,
      content,
      images: JSON.stringify(images)
    }
  })

  return evaluation
}

export async function getEvaluations(page: number = 1, pageSize: number = 20) {
  const skip = (page - 1) * pageSize

  const evaluations = await prisma.evaluation.findMany({
    include: {
      order: { include: { items: { select: { name: true, image: true } } } },
      user: { select: { nickname: true, avatar: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize
  })

  const total = await prisma.evaluation.count()

  return { evaluations, total, page, pageSize }
}