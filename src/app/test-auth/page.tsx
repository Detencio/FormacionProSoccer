'use client'

import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function TestAuthPage() {
  const { user, token, isAuthenticated, isLoading } = useAuthStore()
  const { login, logout } = useAuth()
  const [localStorageData, setLocalStorageData] = useState<string>('')

  useEffect(() => {
    // Verificar localStorage cada segundo
    const interval = setInterval(() => {
      const stored = localStorage.getItem('auth-storage')
      setLocalStorageData(stored || 'null')
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleTestLogin = async () => {
    console.log('TestAuth: Iniciando login...')
    await login({
      email: 'admin@prosoccer.com',
      password: '123456'
    })
    console.log('TestAuth: Login completado')
  }

  const handleTestLogout = async () => {
    console.log('TestAuth: Iniciando logout...')
    await logout()
    console.log('TestAuth: Logout completado')
  }

  const handleClearStorage = () => {
    localStorage.removeItem('auth-storage')
    console.log('TestAuth: localStorage limpiado')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prueba de Autenticación</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado del Store</h2>
          <div className="space-y-2">
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
            <p><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</p>
            <p><strong>User:</strong> {user ? `${user.firstName} ${user.lastName}` : 'null'}</p>
            <p><strong>Token:</strong> {token ? 'Presente' : 'null'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">localStorage</h2>
          <div className="space-y-2">
            <p><strong>auth-storage:</strong></p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
              {localStorageData}
            </pre>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Acciones</h2>
          <div className="space-x-4">
            <Button onClick={handleTestLogin} className="bg-green-600 hover:bg-green-700">
              Test Login
            </Button>
            <Button onClick={handleTestLogout} className="bg-red-600 hover:bg-red-700">
              Test Logout
            </Button>
            <Button onClick={handleClearStorage} className="bg-yellow-600 hover:bg-yellow-700">
              Limpiar Storage
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Navegación</h2>
          <div className="space-x-4">
            <a href="/dashboard" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Ir al Dashboard
            </a>
            <a href="/teams" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Ir a Equipos
            </a>
            <a href="/login" className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Ir al Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 