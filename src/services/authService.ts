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
      // Para pruebas, simular login exitoso
      if (data.email === 'admin@prosoccer.com' && data.password === '123456') {
        return {
          user: {
            id: '1',
            firstName: 'Administrador',
            lastName: 'Sistema',
            email: data.email,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          token: 'fake-jwt-token-for-testing',
          refreshToken: 'fake-refresh-token'
        }
      }
      
      // Intentar login real
      const response = await api.post('/auth/login', data)
      return response.data
    } catch (error: any) {
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
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/refresh', { refreshToken })
      return response.data
    } catch (error: any) {
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