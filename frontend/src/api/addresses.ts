import request from './request'

export interface Address {
  id: number
  userId: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export async function getAddresses(): Promise<Address[]> {
  return request.get('/users/addresses')
}

export async function addAddress(data: {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: boolean
}): Promise<any> {
  return request.post('/users/addresses', data)
}

export async function updateAddress(id: number, data: {
  name?: string
  phone?: string
  province?: string
  city?: string
  district?: string
  detail?: string
  isDefault?: boolean
}): Promise<any> {
  return request.put(`/users/addresses/${id}`, data)
}

export async function deleteAddress(id: number): Promise<any> {
  return request.delete(`/users/addresses/${id}`)
}

export async function setDefaultAddress(id: number): Promise<any> {
  return request.put(`/users/addresses/${id}/default`)
}