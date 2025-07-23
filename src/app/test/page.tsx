'use client'

import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'

export default function TestPage() {
  const { user, token, isAuthenticated, isLoading } = useAuthStore()
  const { login, logout } = useAuth()

  const handleLogin = async () => {
    console.log('Test: Iniciando login...')
    await login({
      email: 'admin@prosoccer.com',
      password: '123456'
    })
    console.log('Test: Login completado')
  }

  const handleLogout = async () => {
    console.log('Test: Iniciando logout...')
    await logout()
    console.log('Test: Logout completado')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Autenticación</h1>
      
      <div className="mb-4">
        <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
        <p><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</p>
        <p><strong>User:</strong> {user ? `${user.firstName} ${user.lastName}` : 'null'}</p>
        <p><strong>Token:</strong> {token ? 'Presente' : 'null'}</p>
      </div>

      <div className="space-x-4">
        <button 
          onClick={handleLogin}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Login
        </button>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Test Logout
        </button>
      </div>

      <div className="mt-4 space-x-4">
        <a href="/teams" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Ir a Equipos
        </a>
        <a href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Ir al Dashboard
        </a>
      </div>
    </div>
  )
} 