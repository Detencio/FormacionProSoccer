import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: User, token?: string) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: User) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user: User, token?: string) => {
        console.log('AuthStore: setUser called with:', { user, token })
        const newState = {
          user,
          token: token || null,
          isAuthenticated: true,
          isLoading: false,
        }
        set(newState)
        console.log('AuthStore: State after setUser:', newState)
        
        // Verificar que se guardó correctamente
        setTimeout(() => {
          const stored = localStorage.getItem('auth-storage')
          console.log('AuthStore: Stored in localStorage:', stored)
        }, 100)
      },

      clearUser: () => {
        console.log('AuthStore: clearUser called')
        const newState = {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }
        set(newState)
        console.log('AuthStore: State after clearUser:', newState)
      },

      setLoading: (loading: boolean) => {
        console.log('AuthStore: setLoading called with:', loading)
        set({
          isLoading: loading,
        })
      },

      updateUser: (user: User) => {
        console.log('AuthStore: updateUser called with:', user)
        set((state) => ({
          user: { ...state.user, ...user },
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => {
        console.log('AuthStore: Partializing state:', state)
        return {
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }
      },
      onRehydrateStorage: () => (state) => {
        console.log('AuthStore: Rehydrated state:', state)
        if (state) {
          // Verificar si el estado rehidratado es válido
          // Un estado es válido si tiene user Y token, o si ambos son null (estado limpio)
          const hasUserAndToken = state.user && state.token
          const isCleanState = !state.user && !state.token
          const isValid = hasUserAndToken || isCleanState
          
          console.log('AuthStore: Rehydrated state validation:', {
            hasUserAndToken,
            isCleanState,
            isValid
          })
          
          if (!isValid) {
            console.log('AuthStore: Invalid rehydrated state, clearing...')
            state.clearUser()
          } else if (hasUserAndToken) {
            // Si tenemos user y token, asegurar que isAuthenticated sea true
            console.log('AuthStore: Valid rehydrated state with user and token, setting isAuthenticated to true')
            // No necesitamos hacer nada aquí, el estado ya debería estar correcto
          }
        }
      },
    }
  )
) 