export interface UserRegisterInput {
  phone: string
  password: string
  nickname?: string
}

export interface UserLoginInput {
  phone: string
  password: string
}

export interface UserAddressInput {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: boolean
}

export interface ProductCreateInput {
  categoryId: number
  name: string
  description?: string
  originalPrice: number
  salePrice: number
  vipPrice: number
  stock: number
  minStock?: number
  unit?: string
}

export interface ProductUpdateInput {
  categoryId?: number
  name?: string
  description?: string
  originalPrice?: number
  salePrice?: number
  vipPrice?: number
  stock?: number
  minStock?: number
  unit?: string
  status?: string
}

export interface OrderCreateInput {
  addressId: number
  items: {
    productId: number
    quantity: number
  }[]
  pointUsed?: number
}

export interface OrderPayInput {
  orderNo: string
}

export interface OrderRefundInput {
  orderNo: string
}

export interface EvaluationCreateInput {
  orderId: number
  score: number
  content?: string
  images?: string[]
}

export interface DeliveryStaffRegisterInput {
  phone: string
  password: string
  name: string
  idCard?: string
}

export interface DeliveryTraceInput {
  orderId: number
  deliveryId: number
  latitude: number
  longitude: number
  status: string
  description?: string
}