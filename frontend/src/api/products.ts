import request from './request'

export interface Product {
  id: number
  categoryId: number
  name: string
  description: string
  originalPrice: number
  salePrice: number
  vipPrice: number
  stock: number
  minStock: number
  image: string
  unit: string
  status: string
  category: { name: string }
}

export interface ProductListResult {
  products: Product[]
  total: number
  page: number
  pageSize: number
}

export interface Category {
  id: number
  name: string
  icon: string
  sort: number
  status: boolean
}

export async function getProducts(params?: {
  page?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
}): Promise<ProductListResult> {
  return request.get('/products', { params })
}

export async function getProduct(id: number): Promise<Product> {
  return request.get(`/products/${id}`)
}

export async function getCategories(): Promise<Category[]> {
  return request.get('/products/categories')
}