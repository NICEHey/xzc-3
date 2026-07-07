import prisma from '../utils/prisma'
import { ProductCreateInput } from '../types'
import { ProductStatus } from '@prisma/client'

export async function createCategory(name: string, icon: string = '', sort: number = 0) {
  const category = await prisma.category.create({
    data: { name, icon, sort }
  })

  return category
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { status: true },
    orderBy: { sort: 'asc' }
  })

  return categories
}

export async function getCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: { id }
  })

  if (!category) {
    throw new Error('分类不存在')
  }

  return category
}

export async function updateCategory(id: number, data: Partial<{ name: string; icon: string; sort: number; status: boolean }>) {
  const category = await prisma.category.update({
    where: { id },
    data
  })

  return category
}

export async function deleteCategory(id: number) {
  const category = await prisma.category.delete({
    where: { id }
  })

  return category
}

export async function createProduct(input: ProductCreateInput) {
  const product = await prisma.product.create({
    data: input
  })

  return product
}

export async function getProducts(page: number = 1, pageSize: number = 20, categoryId?: number, keyword?: string) {
  const skip = (page - 1) * pageSize

  const where: any = { status: 'ON_SALE' }
  
  if (categoryId !== undefined && categoryId !== null) {
    where.categoryId = categoryId
  }
  
  if (keyword) {
    where.name = { contains: keyword }
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize
  })

  const total = await prisma.product.count({ where })

  return { products, total, page, pageSize }
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } }
    }
  })

  if (!product) {
    throw new Error('商品不存在')
  }

  return product
}

export async function updateProduct(id: number, input: Partial<{
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  vipPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  status: ProductStatus;
}>) {
  const product = await prisma.product.update({
    where: { id },
    data: input
  })

  return product
}

export async function updateProductImage(id: number, image: string) {
  const product = await prisma.product.update({
    where: { id },
    data: { image }
  })

  return product
}

export async function deleteProduct(id: number) {
  const product = await prisma.product.update({
    where: { id },
    data: { status: 'OFF_SALE' }
  })

  return product
}

export async function updateStock(id: number, stock: number) {
  const product = await prisma.product.update({
    where: { id },
    data: { stock }
  })

  return product
}

export async function decreaseStock(id: number, quantity: number) {
  const product = await prisma.product.update({
    where: { id },
    data: { stock: { decrement: quantity } }
  })

  return product
}

export async function getStockAlertProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: 'ON_SALE',
      stock: { lte: prisma.product.fields.minStock }
    },
    include: {
      category: { select: { name: true } }
    }
  })

  return products
}