'use client'

import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'
import { FaBug, FaDatabase, FaUser, FaKey, FaCog, FaEye } from 'react-icons/fa'

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
      createdAt: new Date(),
      updatedAt: new Date()
    }, 'real-token-from-backend')
    alert('Usuario establecido manualmente')
  }

  const handleClearUser = () => {
    const { clearUser } = useAuthStore.getState()
    clearUser()
    alert('Usuario limpiado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative overflow-hidden">
      {/* Efectos de luz de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-600/20 to-yellow-600/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-3xl shadow-2xl border border-red-500/30 p-8 mb-8 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <FaBug className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">Debug - Estado de Autenticación</h1>
                <p className="text-xl text-red-100 font-medium">Panel de desarrollo y pruebas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estado del sistema con diseño FIFA 26 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaUser className="mr-3 text-blue-400" />
                Estado del AuthStore
              </h2>
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/50">
                <pre className="text-green-300 text-sm overflow-auto max-h-96">
                  {JSON.stringify({
                    user,
                    token,
                    isAuthenticated,
                    isLoading
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaDatabase className="mr-3 text-purple-400" />
                localStorage
              </h2>
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/50">
                <pre className="text-yellow-300 text-sm overflow-auto max-h-96">
                  {localStorageData}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones de debug con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaCog className="mr-3 text-green-400" />
              Acciones de Debug
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleTestLogin}
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-blue-400/30"
              >
                Probar Login Backend
              </button>
              
              <button
                onClick={handleManualSetUser}
                className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-green-400/30"
              >
                Establecer Usuario Manualmente
              </button>
              
              <button
                onClick={handleClearUser}
                className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-red-400/30"
              >
                Limpiar Usuario
              </button>
            </div>
          </div>
        </div>

        {/* Enlaces de prueba con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaEye className="mr-3 text-orange-400" />
              Enlaces de Prueba
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href="/teams" 
                className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-purple-400/30 text-center"
              >
                Ir a Teams (debería redirigir si no autenticado)
              </a>
              <a 
                href="/dashboard" 
                className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-indigo-400/30 text-center"
              >
                Ir a Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 