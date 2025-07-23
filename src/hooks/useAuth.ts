'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login
  const login = async (data: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular llamada a API
      console.log('Login attempt:', data)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Por ahora, solo redirigir al dashboard
      router.push('/dashboard')
      
    } catch (err: any) {
      setError('Error al iniciar sesión')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Register
  const register = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular llamada a API
      console.log('Register attempt:', data)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Por ahora, solo redirigir al dashboard
      router.push('/dashboard')
      
    } catch (err: any) {
      setError('Error al registrarse')
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    setLoading(true)
    
    try {
      // Simular logout
      console.log('Logout')
      
      // Redirigir al login
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
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
  }
} 