import request from './request'

export interface OrderCreateData {
  addressId: number
  items?: { productId: number; quantity: number }[]
  useCart?: boolean
  pointUsed?: number
}

export async function createOrder(data: OrderCreateData): Promise<any> {
  return request.post('/orders', data)
}

export async function getOrders(params?: { page?: number; pageSize?: number; status?: string }): Promise<any> {
  return request.get('/orders', { params })
}