'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService, LoginData, RegisterData, AuthResponse, ApiError } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const router = useRouter()
  const { user, setUser, clearUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login
  const login = async (data: LoginData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.login(data)
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      // Actualizar estado global
      setUser(response.user)
      
      // Redirigir al dashboard
      router.push('/dashboard')
      
      return response
    } catch (err: any) {
      const error = err as ApiError
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register
  const register = async (data: RegisterData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.register(data)
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      // Actualizar estado global
      setUser(response.user)
      
      // Redirigir al dashboard
      router.push('/dashboard')
      
      return response
    } catch (err: any) {
      const error = err as ApiError
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    setLoading(true)
    
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      
      // Limpiar estado global
      clearUser()
      
      // Redirigir al login
      router.push('/login')
      setLoading(false)
    }
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Get current user from API
  const getCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser()
      setUser(user)
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      clearUser()
      return null
    }
  }

  // Initialize auth on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) {
      getCurrentUser()
    }
  }, [user])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
  }
} 