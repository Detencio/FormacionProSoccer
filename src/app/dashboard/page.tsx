'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { FaFutbol, FaUsers, FaCalendar, FaCreditCard, FaSignOutAlt, FaTrophy, FaChartLine, FaStar } from 'react-icons/fa'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import MainLayout from '@/components/Layout/MainLayout'

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-8">
          {/* Header con diseño FIFA 26 */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl shadow-2xl border border-blue-500/30 p-8 relative overflow-hidden">
            {/* Efecto de luz de fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    ¡Bienvenido de vuelta!
                  </h1>
                  <p className="text-xl text-blue-100 font-medium">
                    Gestiona tu equipo como un verdadero profesional
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                    <FaTrophy className="text-white text-3xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions con diseño FIFA 26 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/teams">
              <div className="group bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-2xl border border-blue-500/30 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <FaUsers className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Equipos</h3>
                      <p className="text-blue-100 text-sm">Gestiona tu equipo</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">12</span>
                    <span className="text-blue-100 text-sm">Jugadores</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/matches">
              <div className="group bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl shadow-2xl border border-green-500/30 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <FaCalendar className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Partidos</h3>
                      <p className="text-green-100 text-sm">Organiza partidos</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">8</span>
                    <span className="text-green-100 text-sm">Programados</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/payments">
              <div className="group bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl shadow-2xl border border-purple-500/30 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <FaCreditCard className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Pagos</h3>
                      <p className="text-purple-100 text-sm">Gestiona cuotas</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">95%</span>
                    <span className="text-purple-100 text-sm">Al día</span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="group bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-2xl shadow-2xl border border-orange-500/30 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <FaChartLine className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Estadísticas</h3>
                    <p className="text-orange-100 text-sm">Ver rendimiento</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">+15%</span>
                  <span className="text-orange-100 text-sm">Mejora</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas con diseño FIFA 26 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Victorias */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl border border-green-500/30 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Victorias</h3>
                  <FaStar className="text-yellow-400 text-2xl" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">12</div>
                <p className="text-green-100 text-sm">Últimos 3 meses</p>
              </div>
            </div>

            {/* Empates */}
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl shadow-2xl border border-yellow-500/30 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Empates</h3>
                  <FaFutbol className="text-white text-2xl" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">3</div>
                <p className="text-yellow-100 text-sm">Últimos 3 meses</p>
              </div>
            </div>

            {/* Derrotas */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-2xl border border-red-500/30 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Derrotas</h3>
                  <FaFutbol className="text-white text-2xl" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">2</div>
                <p className="text-red-100 text-sm">Últimos 3 meses</p>
              </div>
            </div>
          </div>

          {/* Actividad Reciente con diseño FIFA 26 */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaStar className="text-yellow-400 mr-3" />
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-xl border border-green-500/30">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-4 animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Último partido jugado
                    </p>
                    <p className="text-sm text-green-200">
                      Victoria 3-2 vs Los Tigres
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-xl border border-blue-500/30">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-4 animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Nuevo jugador registrado
                    </p>
                    <p className="text-sm text-blue-200">
                      Carlos González se unió al equipo
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-xl border border-purple-500/30">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-4 animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Pago recibido
                    </p>
                    <p className="text-sm text-purple-200">
                      Cuota mensual de Miguel Silva
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  )
} 