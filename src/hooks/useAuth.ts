'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'

export const useAuth = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser, clearUser, user, token, isAuthenticated } = useAuthStore()

  // Login
  const login = async (data: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.login(data)
      setUser(response.user, response.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Register
  const register = async (data: { email: string; password: string; confirmPassword: string; firstName: string; lastName: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.register(data)
      setUser(response.user, response.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al registrarse')
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    setLoading(true)
    
    try {
      await authService.logout()
      clearUser()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Aún así, limpiar el estado local
      clearUser()
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    register,
    logout,
    loading,
    error,
    user,
    token,
    isAuthenticated,
  }
} 