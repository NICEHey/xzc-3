import request from './request'

export interface RegisterData {
  phone: string
  password: string
  nickname?: string
}

export interface LoginData {
  phone: string
  password: string
}

export interface UserInfo {
  id: number
  phone: string
  nickname: string
  level: string
  points: number
  createdAt: string
}

export interface LoginResult {
  user: UserInfo
  token: string
}

export async function register(data: RegisterData): Promise<any> {
  return request.post('/auth/register', data)
}

export async function login(data: LoginData): Promise<LoginResult> {
  return request.post('/auth/login', data)
}

export async function getProfile(): Promise<UserInfo> {
  return request.get('/users/profile')
}