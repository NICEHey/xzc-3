import request from './request'

export interface CartItem {
  id: number
  userId: number
  productId: number
  quantity: number
  createdAt: string
  updatedAt: string
  product: {
    id: number
    name: string
    salePrice: number
    vipPrice: number
    image: string
    unit: string
    category: { name: string }
  }
}

export interface CartCountResult {
  count: number
}

export async function addCartItem(data: { productId: number; quantity?: number }): Promise<any> {
  return request.post('/cart', data)
}

export async function getCart(): Promise<CartItem[]> {
  return request.get('/cart')
}

export async function getCartCount(): Promise<CartCountResult> {
  return request.get('/cart/count')
}

export async function updateCartItem(id: number, data: { quantity: number }): Promise<any> {
  return request.put(`/cart/${id}`, data)
}

export async function deleteCartItem(id: number): Promise<any> {
  return request.delete(`/cart/${id}`)
}

export async function clearCart(): Promise<any> {
  return request.delete('/cart')
}