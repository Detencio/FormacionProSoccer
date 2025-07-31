import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { 
  ApiResponse, 
  User, 
  Team, 
  Player, 
  Match, 
  Payment, 
  TeamGenerationRequest, 
  TeamGenerationResponse, 
  TeamFormation, 
  PositionZone, 
  PositionSpecific 
} from '@/types'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000',
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
  async (error) => {
    console.error('API: Error en respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    })
    
    if (error.response?.status === 401) {
      // Intentar refresh token automáticamente
      try {
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          const authData = JSON.parse(authStorage)
          const refreshToken = authData.state?.refreshToken
          
          if (refreshToken) {
            console.log('API: Intentando refresh token automático')
            
            // Importar authService dinámicamente para evitar dependencias circulares
            const { authService } = await import('@/services/authService')
            
            try {
              const newTokens = await authService.refreshToken(refreshToken)
              
              // Actualizar el token en localStorage
              const updatedAuthData = {
                ...authData,
                state: {
                  ...authData.state,
                  token: newTokens.access_token,
                  refreshToken: newTokens.refresh_token
                }
              }
              localStorage.setItem('auth-storage', JSON.stringify(updatedAuthData))
              
              // Actualizar el store de Zustand
              const { useAuthStore } = await import('@/store/authStore')
              useAuthStore.getState().updateTokens(newTokens.access_token, newTokens.refresh_token)
              
              // Reintentar la petición original con el nuevo token
              const newConfig = {
                ...error.config,
                headers: {
                  ...error.config.headers,
                  Authorization: `Bearer ${newTokens.access_token}`
                }
              }
              
              console.log('API: Reintentando petición con nuevo token')
              return api.request(newConfig)
              
            } catch (refreshError) {
              console.error('API: Error en refresh token automático:', refreshError)
              // Si el refresh falla, limpiar el localStorage y redirigir a login
              localStorage.removeItem('auth-storage')
              const { useAuthStore } = await import('@/store/authStore')
              useAuthStore.getState().clearUser()
              if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login'
              }
              return Promise.reject(error)
            }
          } else {
            console.log('API: No hay refresh token válido, redirigiendo a login')
            localStorage.removeItem('auth-storage')
            const { useAuthStore } = await import('@/store/authStore')
            useAuthStore.getState().clearUser()
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
            return Promise.reject(error)
          }
        } else {
          console.log('API: No hay auth storage, redirigiendo a login')
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }
      } catch (parseError) {
        console.error('API: Error parsing auth storage:', parseError)
        localStorage.removeItem('auth-storage')
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
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

  // Positions
  getPositionZones: async () => {
    const response = await api.get<PositionZone[]>('/positions/zones')
    return response.data
  },

  getPositionZoneByAbbreviation: async (abbreviation: string) => {
    const response = await api.get<PositionZone>(`/positions/zones/${abbreviation}`)
    return response.data
  },

  getPositionSpecifics: async () => {
    const response = await api.get<PositionSpecific[]>('/positions/specifics')
    return response.data
  },

  getPositionSpecificsByZone: async (zoneId: number) => {
    const response = await api.get<PositionSpecific[]>(`/positions/specifics/zone/${zoneId}`)
    return response.data
  },

  getPositionSpecificByAbbreviation: async (abbreviation: string) => {
    const response = await api.get<PositionSpecific>(`/positions/specifics/${abbreviation}`)
    return response.data
  },

  // Players
  getPlayers: async () => {
    const response = await api.get<Player[]>('/players')
    return response.data
  },

  getPlayer: async (id: number) => {
    const response = await api.get<Player>(`/players/${id}`)
    return response.data
  },

  createPlayer: async (data: {
    full_name: string
    email: string
    phone?: string
    position_zone: string
    position_specific?: string
    date_of_birth?: string
    nationality?: string
    jersey_number?: number
    height?: number
    weight?: number
    skill_level: number
    team_id: number
  }) => {
    const response = await api.post<Player>('/players/register', data)
    return response.data
  },

  updatePlayer: async (id: number, data: Partial<Player>) => {
    const response = await api.put<Player>(`/players/${id}`, data)
    return response.data
  },

  deletePlayer: async (id: number) => {
    const response = await api.delete(`/players/${id}`)
    return response.data
  },

  assignPlayerToTeam: async (playerId: number, teamId: number) => {
    const response = await api.post(`/players/${playerId}/assign/${teamId}`)
    return response.data
  },

  removePlayerFromTeam: async (playerId: number) => {
    const response = await api.post(`/players/${playerId}/remove`)
    return response.data
  },

  // Team Generator API
  generateTeams: async (request: TeamGenerationRequest): Promise<TeamGenerationResponse> => {
    const response = await api.post<TeamGenerationResponse>('/team-generator/generate', request)
    return response.data
  },

  getFormations: async (): Promise<TeamFormation[]> => {
    const response = await api.get<TeamFormation[]>('/team-generator/formations')
    return response.data
  },

  getFormation: async (id: string): Promise<TeamFormation> => {
    const response = await api.get<TeamFormation>(`/team-generator/formations/${id}`)
    return response.data
  },

  saveTeamGeneration: async (request: any): Promise<any> => {
    const response = await api.post<any>('/team-generator/save', request)
    return response.data
  },

  getTeamGenerationHistory: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/team-generator/history')
    return response.data
  }
}

export default api 