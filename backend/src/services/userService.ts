import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'
import { generateToken } from '../utils/jwt'
import { UserRegisterInput, UserLoginInput, UserAddressInput } from '../types'

export async function register(input: UserRegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { phone: input.phone } })
  if (existingUser) {
    throw new Error('手机号已注册')
  }

  const hashedPassword = await bcrypt.hash(input.password, 10)

  const user = await prisma.user.create({
    data: {
      phone: input.phone,
      password: hashedPassword,
      nickname: input.nickname || `用户${input.phone.slice(-4)}`
    }
  })

  const token = generateToken({ userId: user.id, phone: user.phone, level: user.level })

  return {
    user: {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      level: user.level,
      points: user.points,
      createdAt: user.createdAt
    },
    token
  }
}

export async function login(input: UserLoginInput) {
  const user = await prisma.user.findUnique({ where: { phone: input.phone } })
  if (!user) {
    throw new Error('用户不存在')
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password)
  if (!isPasswordValid) {
    throw new Error('密码错误')
  }

  const token = generateToken({ userId: user.id, phone: user.phone, level: user.level })

  return {
    user: {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      level: user.level,
      points: user.points,
      createdAt: user.createdAt
    },
    token
  }
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      nickname: true,
      avatar: true,
      level: true,
      points: true,
      createdAt: true
    }
  })

  if (!user) {
    throw new Error('用户不存在')
  }

  return user
}

import { UserLevel } from '@prisma/client'

export async function updateUser(userId: number, data: Partial<{ nickname: string; avatar: string; level: UserLevel }>) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      phone: true,
      nickname: true,
      avatar: true,
      level: true,
      points: true,
      createdAt: true
    }
  })

  return user
}

export async function addUserAddress(userId: number, input: UserAddressInput) {
  const transaction = await prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      })
    }

    const address = await tx.userAddress.create({
      data: {
        userId,
        ...input
      }
    })

    return address
  })

  return transaction
}

export async function getUserAddresses(userId: number) {
  const addresses = await prisma.userAddress.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }
  })

  return addresses
}

export async function updateUserAddress(userId: number, addressId: number, input: Partial<UserAddressInput>) {
  const transaction = await prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      })
    }

    const address = await tx.userAddress.update({
      where: { id: addressId, userId },
      data: input
    })

    return address
  })

  return transaction
}

export async function deleteUserAddress(userId: number, addressId: number) {
  const address = await prisma.userAddress.delete({
    where: { id: addressId, userId }
  })

  return address
}

export async function getUserPointLogs(userId: number, page: number = 1, pageSize: number = 20) {
  const skip = (page - 1) * pageSize

  const logs = await prisma.pointLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize
  })

  const total = await prisma.pointLog.count({ where: { userId } })

  return { logs, total, page, pageSize }
}

export async function addPoints(userId: number, amount: number, description: string, orderId?: number) {
  const transaction = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('用户不存在')
    }

    const newBalance = user.points + amount

    await tx.user.update({
      where: { id: userId },
      data: { points: newBalance }
    })

    const log = await tx.pointLog.create({
      data: {
        userId,
        type: amount > 0 ? 'EARN' : 'SPEND',
        amount: Math.abs(amount),
        balance: newBalance,
        description,
        orderId
      }
    })

    return log
  })

  return transaction
}