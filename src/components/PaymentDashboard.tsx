'use client'

import { useState, useEffect } from 'react'
import { paymentService, PaymentStats, MonthlyStats } from '@/services/paymentService'

interface PaymentDashboardProps {
  stats: PaymentStats
  monthlyStats: MonthlyStats[]
}

export default function PaymentDashboard({ stats, monthlyStats }: PaymentDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('3m') // 3m, 6m, 1y, all

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pagado':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'pendiente':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'vencido':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'bg-green-100 text-green-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'vencido':
        return 'bg-red-100 text-red-800'
      case 'cancelado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'Pagado'
      case 'pendiente':
        return 'Pendiente'
      case 'vencido':
        return 'Vencido'
      case 'cancelado':
        return 'Cancelado'
      default:
        return 'Desconocido'
    }
  }

  const filteredMonthlyStats = monthlyStats.slice(0, 
    selectedPeriod === '3m' ? 3 : 
    selectedPeriod === '6m' ? 6 : 
    selectedPeriod === '1y' ? 12 : monthlyStats.length
  )

  const totalPercentage = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard de Pagos</h2>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último año</option>
            <option value="all">Todo el período</option>
          </select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Recaudado */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Recaudado</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.paidAmount)}</p>
              <p className="text-xs text-green-600 mt-1">
                {stats.total > 0 ? `${Math.round((stats.paid / stats.total) * 100)}%` : '0%'} de pagos completados
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pagos Pendientes */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-900">{formatCurrency(stats.pendingAmount)}</p>
              <p className="text-xs text-yellow-600 mt-1">
                {stats.pending} cuotas pendientes
              </p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pagos Vencidos */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-900">{formatCurrency(stats.overdueAmount)}</p>
              <p className="text-xs text-red-600 mt-1">
                {stats.overdue} cuotas vencidas
              </p>
            </div>
            <div className="p-3 bg-red-200 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total de Cuotas */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Cuotas</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-xs text-blue-600 mt-1">
                {formatCurrency(stats.totalAmount)} en total
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso general */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progreso General</h3>
          <span className="text-sm font-medium text-gray-600">{totalPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(totalPercentage)}`}
            style={{ width: `${totalPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Gráfico de tendencia mensual */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h3>
        <div className="space-y-4">
          {filteredMonthlyStats.map((monthStat, index) => {
            const monthPercentage = monthStat.total > 0 ? Math.round((monthStat.paid / monthStat.total) * 100) : 0
            return (
              <div key={monthStat.month} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-600">
                  {new Date(monthStat.month + '-01').toLocaleDateString('es-CL', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      {monthStat.paid}/{monthStat.total} pagos
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(monthStat.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(monthPercentage)}`}
                      style={{ width: `${monthPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className={`text-sm font-medium ${monthPercentage >= 80 ? 'text-green-600' : monthPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {monthPercentage}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Distribución por estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          <div className="space-y-4">
            {[
              { status: 'pagado', count: stats.paid, amount: stats.paidAmount, color: 'green' },
              { status: 'pendiente', count: stats.pending, amount: stats.pendingAmount, color: 'yellow' },
              { status: 'vencido', count: stats.overdue, amount: stats.overdueAmount, color: 'red' },
              { status: 'cancelado', count: stats.canceled, amount: stats.canceledAmount, color: 'gray' }
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium text-gray-900">{getStatusText(item.status)}</p>
                    <p className="text-sm text-gray-600">{item.count} cuotas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-gray-500">
                    {stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Rápido</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Tasa de Cobranza</span>
              <span className="text-lg font-bold text-green-700">{totalPercentage}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">Promedio por Cuota</span>
              <span className="text-lg font-bold text-blue-700">
                {stats.total > 0 ? formatCurrency(Math.round(stats.totalAmount / stats.total)) : formatCurrency(0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-700">Cuotas en Riesgo</span>
              <span className="text-lg font-bold text-yellow-700">{stats.overdue + stats.pending}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-700">Eficiencia Mensual</span>
              <span className="text-lg font-bold text-purple-700">
                {monthlyStats.length > 0 ? 
                  Math.round(monthlyStats.slice(0, 3).reduce((sum, m) => sum + (m.total > 0 ? (m.paid / m.total) * 100 : 0), 0) / Math.min(3, monthlyStats.length)
                : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 