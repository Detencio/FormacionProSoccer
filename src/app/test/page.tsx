'use client'

import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { FaCog, FaUser, FaKey, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative overflow-hidden">
      {/* Efectos de luz de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-600/20 to-yellow-600/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-3xl shadow-2xl border border-purple-500/30 p-8 mb-8 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <FaCog className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">Test de Autenticación</h1>
                <p className="text-xl text-purple-100 font-medium">Panel de pruebas del sistema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estado del sistema con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaUser className="mr-3 text-blue-400" />
              Estado del Sistema
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-200 font-medium">Autenticado</span>
                  {isAuthenticated ? (
                    <FaCheckCircle className="text-green-400 text-xl" />
                  ) : (
                    <FaTimesCircle className="text-red-400 text-xl" />
                  )}
                </div>
                <p className="text-3xl font-bold text-white">
                  {isAuthenticated ? 'SÍ' : 'NO'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-200 font-medium">Cargando</span>
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaCheckCircle className="text-green-400 text-xl" />
                  )}
                </div>
                <p className="text-3xl font-bold text-white">
                  {isLoading ? 'SÍ' : 'NO'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-200 font-medium">Usuario</span>
                  <FaUser className="text-green-400 text-xl" />
                </div>
                <p className="text-lg font-bold text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'No autenticado'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 rounded-2xl p-6 border border-orange-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-orange-200 font-medium">Token</span>
                  <FaKey className="text-orange-400 text-xl" />
                </div>
                <p className="text-lg font-bold text-white">
                  {token ? 'Presente' : 'No disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6">Acciones de Prueba</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button 
                onClick={handleLogin}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-green-400/30"
              >
                Test Login
              </button>
              <button 
                onClick={handleLogout}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-red-400/30"
              >
                Test Logout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href="/teams" 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-blue-400/30 text-center"
              >
                Ir a Equipos
              </a>
              <a 
                href="/dashboard" 
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-purple-400/30 text-center"
              >
                Ir al Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 