import prisma from '../utils/prisma'

export async function addCartItem(userId: number, productId: number, quantity: number = 1) {
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.status !== 'ON_SALE') {
    throw new Error('商品不存在或已下架')
  }

  if (product.stock < quantity) {
    throw new Error('库存不足')
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } }
  })

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity
    if (product.stock < newQuantity) {
      throw new Error('库存不足')
    }

    const updatedItem = await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: newQuantity }
    })

    return updatedItem
  }

  const newItem = await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity
    }
  })

  return newItem
}

export async function updateCartItem(userId: number, cartItemId: number, quantity: number) {
  if (quantity <= 0) {
    throw new Error('数量必须大于0')
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { product: true }
  })

  if (!cartItem) {
    throw new Error('购物车商品不存在')
  }

  if (cartItem.userId !== userId) {
    throw new Error('无权操作该购物车商品')
  }

  if (cartItem.product.stock < quantity) {
    throw new Error('库存不足')
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity }
  })

  return updatedItem
}

export async function deleteCartItem(userId: number, cartItemId: number) {
  const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } })

  if (!cartItem) {
    throw new Error('购物车商品不存在')
  }

  if (cartItem.userId !== userId) {
    throw new Error('无权操作该购物车商品')
  }

  const deletedItem = await prisma.cartItem.delete({ where: { id: cartItemId } })

  return deletedItem
}

export async function clearCart(userId: number) {
  await prisma.cartItem.deleteMany({ where: { userId } })
}

export async function getCart(userId: number) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return cartItems
}

export async function getCartCount(userId: number) {
  const count = await prisma.cartItem.aggregate({
    where: { userId },
    _sum: { quantity: true }
  })

  return count._sum.quantity || 0
}