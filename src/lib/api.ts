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
    // Obtener el token desde localStorage (Zustand persist)
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
          console.log('API: Token agregado a la petición:', authData.state.token.substring(0, 20) + '...')
        } else {
          console.log('API: No se encontró token en auth-storage')
        }
      } catch (error) {
        console.error('API: Error parsing auth token:', error)
      }
    } else {
      console.log('API: No se encontró auth-storage en localStorage')
    }
    return config
  },
  (error) => {
    console.error('API: Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API: Respuesta exitosa:', response.config.url)
    return response
  },
  (error) => {
    console.error('API: Error en respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    })
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('API: 401 Unauthorized, limpiando localStorage')
      localStorage.removeItem('auth-storage')
      // Solo redirigir si no estamos ya en login
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (error.response?.status === 403) {
      console.log('API: 403 Forbidden - Token inválido o expirado')
      // Para desarrollo, no limpiar el localStorage en 403
      // Solo log para debug
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