import prisma from '../utils/prisma'

export async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const monthAgo = new Date(today)
  monthAgo.setDate(monthAgo.getDate() - 30)

  const [todayOrders, weekOrders, monthOrders, todaySales, weekSales, monthSales,
    newUsersToday, newUsersWeek, newUsersMonth, activeUsersToday, activeUsersWeek,
    stockAlertCount, totalProducts, totalUsers, totalOrders, completedOrders,
    deliveryStaffCount, activeDeliveryStaff] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.order.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: today, lt: tomorrow }, status: 'COMPLETED' },
      _sum: { payAmount: true }
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: weekAgo }, status: 'COMPLETED' },
      _sum: { payAmount: true }
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: monthAgo }, status: 'COMPLETED' },
      _sum: { payAmount: true }
    }),
    prisma.user.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.user.count({
      where: {
        orders: { some: { createdAt: { gte: today, lt: tomorrow } } }
      }
    }),
    prisma.user.count({
      where: {
        orders: { some: { createdAt: { gte: weekAgo } } }
      }
    }),
    prisma.product.count({
      where: { status: 'ON_SALE', stock: { lte: prisma.product.fields.minStock } }
    }),
    prisma.product.count({ where: { status: 'ON_SALE' } }),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.deliveryStaff.count(),
    prisma.deliveryStaff.count({ where: { status: 'ACTIVE' } })
  ])

  return {
    orders: {
      today: todayOrders,
      week: weekOrders,
      month: monthOrders
    },
    sales: {
      today: Number(todaySales._sum.payAmount || 0),
      week: Number(weekSales._sum.payAmount || 0),
      month: Number(monthSales._sum.payAmount || 0)
    },
    users: {
      newToday: newUsersToday,
      newWeek: newUsersWeek,
      newMonth: newUsersMonth,
      activeToday: activeUsersToday,
      activeWeek: activeUsersWeek,
      total: totalUsers
    },
    products: {
      total: totalProducts,
      stockAlert: stockAlertCount
    },
    delivery: {
      totalStaff: deliveryStaffCount,
      activeStaff: activeDeliveryStaff
    },
    overview: {
      totalOrders,
      completedOrders,
      completionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : '0'
    }
  }
}

export async function getOrderStats(type: 'day' | 'week' | 'month') {
  const now = new Date()
  let startDate: Date

  switch (type) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true, payAmount: true, status: true }
  })

  const result: { date: string; count: number; sales: number; completed: number }[] = []
  const dateMap = new Map<string, { count: number; sales: number; completed: number }>()

  orders.forEach(order => {
    const dateStr = order.createdAt.toISOString().split('T')[0]
    const existing = dateMap.get(dateStr) || { count: 0, sales: 0, completed: 0 }
    existing.count++
    existing.sales += Number(order.payAmount)
    if (order.status === 'COMPLETED') existing.completed++
    dateMap.set(dateStr, existing)
  })

  dateMap.forEach((value, key) => {
    result.push({ date: key, ...value })
  })

  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return result
}

export async function getUserStats(type: 'day' | 'week' | 'month') {
  const now = new Date()
  let startDate: Date

  switch (type) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true }
  })

  const result: { date: string; count: number }[] = []
  const dateMap = new Map<string, number>()

  users.forEach(user => {
    const dateStr = user.createdAt.toISOString().split('T')[0]
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
  })

  dateMap.forEach((count, date) => {
    result.push({ date, count })
  })

  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return result
}

export async function getProductSalesTop(limit: number = 10) {
  const orderItems = await prisma.orderItem.groupBy({
    by: ['productId', 'name'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: limit
  })

  const result = await Promise.all(orderItems.map(async item => {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { category: { select: { name: true } }, image: true }
    })
    return {
      productId: item.productId,
      name: item.name,
      sales: item._sum.quantity || 0,
      categoryName: product?.category.name || '',
      image: product?.image || ''
    }
  }))

  return result
}

export async function getDeliveryStats() {
  const staff = await prisma.deliveryStaff.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      phone: true,
      totalOrders: true,
      completedOrders: true
    }
  })

  const result = staff.map(s => ({
    id: s.id,
    name: s.name,
    phone: s.phone,
    totalOrders: s.totalOrders,
    completedOrders: s.completedOrders,
    completionRate: s.totalOrders > 0 ? ((s.completedOrders / s.totalOrders) * 100).toFixed(1) : '0'
  }))

  return result
}