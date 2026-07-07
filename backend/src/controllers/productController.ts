import { Request, Response } from 'express'
import * as productService from '../services/productService'
import { success, error, notFound } from '../utils/response'

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, icon, sort } = req.body
    const category = await productService.createCategory(name, icon, sort)
    success(res, category, '分类创建成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await productService.getCategories()
    success(res, categories)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getCategory(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const category = await productService.getCategoryById(id)
    success(res, category)
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const category = await productService.updateCategory(id, req.body)
    success(res, category, '分类更新成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    await productService.deleteCategory(id)
    success(res, null, '分类删除成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const product = await productService.createProduct(req.body)
    success(res, product, '商品创建成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 20
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined
    const keyword = req.query.keyword as string | undefined

    const result = await productService.getProducts(page, pageSize, categoryId, keyword)
    success(res, result)
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const product = await productService.getProductById(id)
    success(res, product)
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const product = await productService.updateProduct(id, req.body)
    success(res, product, '商品更新成功')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function uploadProductImage(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const file = req.file
    if (!file) {
      return error(res, '请上传图片')
    }

    const imageUrl = `/uploads/${file.filename}`
    const product = await productService.updateProductImage(id, imageUrl)
    success(res, product, '图片上传成功')
  } catch (err: any) {
    error(res, err.message)
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return error(res, '参数错误', 400)
    }

    const product = await productService.deleteProduct(id)
    success(res, product, '商品已下架')
  } catch (err: any) {
    notFound(res, err.message)
  }
}

export async function getStockAlert(req: Request, res: Response) {
  try {
    const products = await productService.getStockAlertProducts()
    success(res, products)
  } catch (err: any) {
    error(res, err.message)
  }
}