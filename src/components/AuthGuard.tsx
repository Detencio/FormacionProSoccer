'use client'

import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, token, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    console.log('AuthGuard: Checking authentication...', {
      user,
      token,
      isAuthenticated,
      isLoading
    })

    // Si está cargando, esperar
    if (isLoading) {
      console.log('AuthGuard: Still loading...')
      return
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated || !user || !token) {
      console.log('AuthGuard: Not authenticated, redirecting to login')
      router.push('/login')
      return
    }

    console.log('AuthGuard: Authenticated, allowing access')
    setIsChecking(false)
  }, [user, token, isAuthenticated, isLoading, router])

  // Mostrar loading mientras verifica
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Estado: {isAuthenticated ? 'Autenticado' : 'No autenticado'}</p>
            <p>Usuario: {user ? 'Presente' : 'No presente'}</p>
            <p>Token: {token ? 'Presente' : 'No presente'}</p>
          </div>
        </div>
      </div>
    )
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>
} 