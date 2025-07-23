import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ApiResponse } from '@/types'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
        }
      } catch (error) {
        console.error('Error parsing auth token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API methods
export const apiClient = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/register', {
      name,
      email,
      password,
    })
    return response.data
  },

  // Teams
  getTeams: async () => {
    const response = await api.get<ApiResponse<any[]>>('/teams')
    return response.data
  },

  createTeam: async (data: { name: string; description?: string }) => {
    const response = await api.post<ApiResponse<any>>('/teams', data)
    return response.data
  },

  getTeam: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/teams/${id}`)
    return response.data
  },

  // Matches
  getMatches: async (filters?: any) => {
    const response = await api.get<ApiResponse<any[]>>('/matches', { params: filters })
    return response.data
  },

  createMatch: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/matches', data)
    return response.data
  },

  getMatch: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/matches/${id}`)
    return response.data
  },

  updateMatch: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/matches/${id}`, data)
    return response.data
  },

  // Payments
  getPayments: async (filters?: any) => {
    const response = await api.get<ApiResponse<any[]>>('/payments', { params: filters })
    return response.data
  },

  createPayment: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/payments', data)
    return response.data
  },

  // Posts
  getPosts: async (filters?: any) => {
    const response = await api.get<ApiResponse<any[]>>('/posts', { params: filters })
    return response.data
  },

  createPost: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/posts', data)
    return response.data
  },

  // Users
  getProfile: async () => {
    const response = await api.get<ApiResponse<any>>('/users/profile')
    return response.data
  },

  updateProfile: async (data: any) => {
    const response = await api.put<ApiResponse<any>>('/users/profile', data)
    return response.data
  },
}

export default api 