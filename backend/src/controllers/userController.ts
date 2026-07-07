import { Request, Response } from 'express'
import * as userService from '../services/userService'
import { success, error, notFound } from '../utils/response'
import { upload } from '../middleware/multer'

export async function register(req: Request, res: Response) {
  try {
    const result = await userService.register(req.body)
    success(res, result, '注册成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await userService.login(req.body)
    success(res, result, '登录成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return error(res, '用户ID不存在', 400)
    }

    const user = await userService.getUserById(userId)
    success(res, user)
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return error(res, '用户ID不存在', 400)
    }

    const user = await userService.updateUser(userId, req.body)
    success(res, user, '更新成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return error(res, '用户ID不存在', 400)
    }

    const file = req.file
    if (!file) {
      return error(res, '请上传图片')
    }

    const avatarUrl = `/uploads/${file.filename}`
    const user = await userService.updateUser(userId, { avatar: avatarUrl })
    success(res, user, '头像上传成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function addAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return error(res, '用户ID不存在', 400)
    }

    const address = await userService.addUserAddress(userId, req.body)
    success(res, address, '地址添加成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getAddresses(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return error(res, '用户ID不存在', 400)
    }

    const addresses = await userService.getUserAddresses(userId)
    success(res, addresses)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function updateAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const addressId = parseInt(req.params.id)

    if (!userId || isNaN(addressId)) {
      return error(res, '参数错误', 400)
    }

    const address = await userService.updateUserAddress(userId, addressId, req.body)
    success(res, address, '地址更新成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function deleteAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const addressId = parseInt(req.params.id)

    if (!userId || isNaN(addressId)) {
      return error(res, '参数错误', 400)
    }

    await userService.deleteUserAddress(userId, addressId)
    success(res, null, '地址删除成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function setDefaultAddress(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const addressId = parseInt(req.params.id)

    if (!userId || isNaN(addressId)) {
      return error(res, '参数错误', 400)
    }

    const address = await userService.setDefaultAddress(userId, addressId)
    success(res, address, '默认地址设置成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function getPointLogs(req: Request, res: Response) {
  try {
    const userId = req.user?.userId
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 20

    if (!userId) {
      return error(res, '用户ID不存在', 400)
    }

    const result = await userService.getUserPointLogs(userId, page, pageSize)
    success(res, result)
  } catch (err: any) {
    error(res, err.message)
  }
}