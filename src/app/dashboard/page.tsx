'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { FaFutbol, FaUsers, FaCalendar, FaCreditCard, FaSignOutAlt } from 'react-icons/fa'
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
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido a tu Dashboard
            </h2>
            <p className="text-gray-600">
              Gestiona tu equipo, organiza partidos y mantén el control de los pagos.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/teams">
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <FaUsers size={24} className="text-brand-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Equipos</h3>
                    <p className="text-gray-600 text-sm">Gestiona tu equipo</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/matches">
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <FaCalendar size={24} className="text-brand-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Partidos</h3>
                    <p className="text-gray-600 text-sm">Organiza partidos</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/payments">
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <FaCreditCard size={24} className="text-brand-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pagos</h3>
                    <p className="text-gray-600 text-sm">Gestiona cuotas</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <FaFutbol size={24} className="text-brand-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
                  <p className="text-gray-600 text-sm">Ver rendimiento</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Último partido jugado
                  </p>
                  <p className="text-sm text-gray-600">
                    Victoria 3-2 vs Los Tigres
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Pago recibido
                  </p>
                  <p className="text-sm text-gray-600">
                    Cuota mensual - Juan Pérez
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-4"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Próximo partido
                  </p>
                  <p className="text-sm text-gray-600">
                    Domingo 15:00 vs Los Leones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  )
} 