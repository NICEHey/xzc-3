import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'
import { DeliveryStaffRegisterInput, DeliveryTraceInput } from '../types'

let lastDeliveryIndex = 0

export async function registerDeliveryStaff(input: DeliveryStaffRegisterInput) {
  const existingStaff = await prisma.deliveryStaff.findUnique({ where: { phone: input.phone } })
  if (existingStaff) {
    throw new Error('手机号已注册')
  }

  const hashedPassword = await bcrypt.hash(input.password, 10)

  const staff = await prisma.deliveryStaff.create({
    data: {
      phone: input.phone,
      password: hashedPassword,
      name: input.name,
      idCard: input.idCard || ''
    }
  })

  return staff
}

export async function getDeliveryStaffList(page: number = 1, pageSize: number = 20, status?: string) {
  const skip = (page - 1) * pageSize

  const where: any = {}
  if (status) where.status = status

  const staff = await prisma.deliveryStaff.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize
  })

  const total = await prisma.deliveryStaff.count({ where })

  return { staff, total, page, pageSize }
}

export async function getDeliveryStaffById(id: number) {
  const staff = await prisma.deliveryStaff.findUnique({ where: { id } })
  if (!staff) {
    throw new Error('配送员不存在')
  }
  return staff
}

import { StaffStatus } from '@prisma/client'

export async function updateDeliveryStaff(id: number, data: Partial<{ name: string; avatar: string; status: StaffStatus }>) {
  const staff = await prisma.deliveryStaff.update({
    where: { id },
    data
  })
  return staff
}

export async function deleteDeliveryStaff(id: number) {
  const staff = await prisma.deliveryStaff.update({
    where: { id },
    data: { status: 'INACTIVE' }
  })
  return staff
}

export async function autoAssignDelivery(orderId: number) {
  const activeStaff = await prisma.deliveryStaff.findMany({
    where: { status: 'ACTIVE' }
  })

  if (activeStaff.length === 0) {
    return
  }

  lastDeliveryIndex = (lastDeliveryIndex + 1) % activeStaff.length
  const selectedStaff = activeStaff[lastDeliveryIndex]

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        deliveryId: selectedStaff.id,
        status: 'PENDING_DELIVERY'
      }
    })

    await tx.deliveryStaff.update({
      where: { id: selectedStaff.id },
      data: { totalOrders: { increment: 1 } }
    })
  })

  return selectedStaff
}

export async function addDeliveryTrace(orderId: number, deliveryId: number, latitude: number, longitude: number, status: string, description: string = '') {
  const trace = await prisma.deliveryTrace.create({
    data: {
      orderId,
      deliveryId,
      latitude,
      longitude,
      status,
      description
    }
  })

  return trace
}

export async function getDeliveryTraces(orderId: number) {
  const traces = await prisma.deliveryTrace.findMany({
    where: { orderId },
    orderBy: { createdAt: 'asc' }
  })

  return traces
}

export async function updateDeliveryPosition(orderId: number, latitude: number, longitude: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order || !order.deliveryId) {
    throw new Error('订单或配送员信息不存在')
  }

  if (order.status !== 'DELIVERING') {
    throw new Error('订单状态不允许更新位置')
  }

  const trace = await prisma.deliveryTrace.create({
    data: {
      orderId,
      deliveryId: order.deliveryId,
      latitude,
      longitude,
      status: 'DELIVERING',
      description: `配送员位置更新: ${latitude}, ${longitude}`
    }
  })

  return trace
}