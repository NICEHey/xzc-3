import { Request, Response } from 'express'
import * as deliveryService from '../services/deliveryService'
import { success, error, notFound } from '../utils/response'

export async function registerDeliveryStaff(req: Request, res: Response) {
  try {
    const staff = await deliveryService.registerDeliveryStaff(req.body)
    success(res, staff, '配送员注册成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getDeliveryStaffList(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 20
    const status = req.query.status as string | undefined

    const result = await deliveryService.getDeliveryStaffList(page, pageSize, status)
    success(res, result)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getDeliveryStaff(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const staff = await deliveryService.getDeliveryStaffById(id)
    success(res, staff)
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function updateDeliveryStaff(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const staff = await deliveryService.updateDeliveryStaff(id, req.body)
    success(res, staff, '更新成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function deleteDeliveryStaff(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const staff = await deliveryService.deleteDeliveryStaff(id)
    success(res, staff, '已停用')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function assignDelivery(req: Request, res: Response) {
  try {
    const orderId = parseInt(req.params.orderId)
    if (isNaN(orderId)) {
      return error(res, '参数错误', 400)
    }

    const staff = await deliveryService.autoAssignDelivery(orderId)
    success(res, staff, '分配成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getDeliveryTraces(req: Request, res: Response) {
  try {
    const orderId = parseInt(req.params.orderId)
    if (isNaN(orderId)) {
      return error(res, '参数错误', 400)
    }

    const traces = await deliveryService.getDeliveryTraces(orderId)
    success(res, traces)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function updateDeliveryPosition(req: Request, res: Response) {
  try {
    const orderId = parseInt(req.params.orderId)
    const { latitude, longitude } = req.body

    if (isNaN(orderId) || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return error(res, '参数错误', 400)
    }

    const trace = await deliveryService.updateDeliveryPosition(orderId, latitude, longitude)
    success(res, trace, '位置更新成功')
  } catch (err: any) {
    error(res, err.message)
  }
}