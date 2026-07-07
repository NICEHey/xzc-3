import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

const baseURL = 'http://localhost:3000/api'

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as { code: number; message: string; data?: any }
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request