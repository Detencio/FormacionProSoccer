'use client'

import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const { user, token, isAuthenticated, isLoading } = useAuthStore()
  const [localStorageData, setLocalStorageData] = useState<string>('')

  useEffect(() => {
    const data = localStorage.getItem('auth-storage')
    setLocalStorageData(data || 'No data found')
  }, [])

  const handleTestLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@prosoccer.com',
          password: '123456'
        })
      })
      
      const data = await response.json()
      console.log('Login response:', data)
      alert(`Login response: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      console.error('Login error:', error)
      alert(`Login error: ${error}`)
    }
  }

  const handleManualSetUser = () => {
    const { setUser } = useAuthStore.getState()
    setUser({
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@prosoccer.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    }, 'fake-token-123')
    alert('Usuario establecido manualmente')
  }

  const handleClearUser = () => {
    const { clearUser } = useAuthStore.getState()
    clearUser()
    alert('Usuario limpiado')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Debug - Estado de Autenticación</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Estado del AuthStore</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({
              user,
              token,
              isAuthenticated,
              isLoading
            }, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">localStorage</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {localStorageData}
          </pre>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Acciones de Debug</h2>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleTestLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Probar Login Backend
          </button>
          
          <button
            onClick={handleManualSetUser}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Establecer Usuario Manualmente
          </button>
          
          <button
            onClick={handleClearUser}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Limpiar Usuario
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Enlaces de Prueba</h2>
        <div className="space-y-2">
          <a href="/teams" className="block text-blue-500 hover:underline">
            Ir a Teams (debería redirigir si no autenticado)
          </a>
          <a href="/dashboard" className="block text-blue-500 hover:underline">
            Ir a Dashboard
          </a>
        </div>
      </div>
    </div>
  )
} 