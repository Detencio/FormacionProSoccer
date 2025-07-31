import api from '@/lib/api'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: 'admin' | 'supervisor' | 'jugador' | 'invitado'
    createdAt: Date
    updatedAt: Date
  }
  token: string
  refreshToken: string
}

export interface ApiError {
  message: string
  field?: string
}

class AuthService {
  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔍 DEBUG - Intentando login con:', data)
      // Login real con el backend
      const response = await api.post('/auth/login', data)
      console.log('🔍 DEBUG - Respuesta del backend:', response.data)
      
      // Convertir la respuesta del backend al formato esperado por el frontend
      const backendResponse = response.data
      const userData = {
        id: backendResponse.user?.id || '1',
        firstName: backendResponse.user?.full_name?.split(' ')[0] || 'Administrador',
        lastName: backendResponse.user?.full_name?.split(' ').slice(1).join(' ') || 'Sistema',
        email: backendResponse.user?.email || data.email,
        phone: backendResponse.user?.phone || '',
        role: backendResponse.user?.role || 'admin',
        createdAt: new Date(backendResponse.user?.created_at) || new Date(),
        updatedAt: new Date(backendResponse.user?.updated_at) || new Date()
      }
      console.log('🔍 DEBUG - Datos de usuario procesados:', userData)
      
      return {
        user: userData,
        token: backendResponse.access_token,
        refreshToken: backendResponse.refresh_token || null
      }
    } catch (error: any) {
      console.error('❌ ERROR - Error en login:', error)
      throw this.handleError(error)
    }
  }

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error: any) {
      console.error('Logout error:', error)
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    try {
      console.log('🔍 DEBUG - Intentando refresh token')
      
      // Validar que el refresh token no sea nulo o vacío
      if (!refreshToken) {
        throw new Error('Refresh token inválido')
      }
      
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
      console.log('🔍 DEBUG - Refresh token exitoso')
      
      // Validar que la respuesta tenga los campos necesarios
      if (!response.data?.access_token) {
        throw new Error('Respuesta de refresh token inválida')
      }
      
      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token || refreshToken
      }
    } catch (error: any) {
      console.error('❌ ERROR - Error en refresh token:', error)
      
      // Si es un error de red, no reintentar
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        throw new Error('Error de conexión. Verifique su conexión a internet.')
      }
      
      throw this.handleError(error)
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  // Reset password
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/reset-password', { token, password })
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  // Handle API errors
  private handleError(error: any): ApiError {
    if (error.response?.data) {
      return {
        message: error.response.data.message || 'Error del servidor',
        field: error.response.data.field
      }
    }
    return {
      message: error.message || 'Error de conexión'
    }
  }
}

export const authService = new AuthService() 