'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/Layout/MainLayout'
import PaymentDashboard from '@/components/PaymentDashboard'

interface Payment {
  id: number
  playerName: string
  playerId: number
  teamId: number
  teamName: string
  amount: number
  date: string
  dueDate: string
  status: 'pagado' | 'pendiente' | 'vencido' | 'cancelado'
  method: 'transferencia' | 'efectivo' | 'tarjeta' | 'otro'
  description: string
  notes?: string
  receiptUrl?: string
}

export default function PaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [filterTeam, setFilterTeam] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDashboard, setShowDashboard] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [monthlyStats, setMonthlyStats] = useState<any[]>([])

  // Cargar datos desde localStorage
  useEffect(() => {
    const savedPayments = localStorage.getItem('payments-data')
    const savedTeams = localStorage.getItem('teams-data')
    
    if (savedPayments) {
      try {
        setPayments(JSON.parse(savedPayments))
      } catch (error) {
        console.error('Error cargando pagos:', error)
      }
    } else {
      // Datos de ejemplo
      const samplePayments: Payment[] = [
        {
          id: 1,
          playerName: 'Juan Pérez',
          playerId: 1,
          teamId: 1,
          teamName: 'Matiz FC',
          amount: 50000,
          date: '2024-01-15',
          dueDate: '2024-01-10',
          status: 'pagado',
          method: 'transferencia',
          description: 'Cuota mensual enero',
          notes: 'Pago recibido correctamente',
          month: '2024-01'
        },
        {
          id: 2,
          playerName: 'Carlos Rodríguez',
          playerId: 2,
          teamId: 1,
          teamName: 'Matiz FC',
          amount: 50000,
          date: '',
          dueDate: '2024-01-10',
          status: 'pendiente',
          method: 'efectivo',
          description: 'Cuota mensual enero',
          month: '2024-01'
        },
        {
          id: 3,
          playerName: 'Miguel González',
          playerId: 3,
          teamId: 1,
          teamName: 'Matiz FC',
          amount: 50000,
          date: '2024-01-14',
          dueDate: '2024-01-10',
          status: 'pagado',
          method: 'transferencia',
          description: 'Cuota mensual enero',
          month: '2024-01'
        },
        {
          id: 4,
          playerName: 'Luis Martínez',
          playerId: 4,
          teamId: 1,
          teamName: 'Matiz FC',
          amount: 50000,
          date: '',
          dueDate: '2024-01-10',
          status: 'vencido',
          method: 'efectivo',
          description: 'Cuota mensual enero',
          month: '2024-01'
        }
      ]
      setPayments(samplePayments)
      localStorage.setItem('payments-data', JSON.stringify(samplePayments))
    }

    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams))
      } catch (error) {
        console.error('Error cargando equipos:', error)
      }
    }

    // Cargar estadísticas
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const statsData = await paymentService.getPaymentStats()
      setStats(statsData)
      setMonthlyStats(statsData.monthlyStats || [])
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }

  // Filtrar pagos
  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'todos' || payment.status === filterStatus
    const matchesTeam = filterTeam === 'todos' || payment.teamId.toString() === filterTeam
    const matchesSearch = payment.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesTeam && matchesSearch
  })

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-CL')
  }

  const handleCreatePayment = () => {
    setEditingPayment(null)
    setShowModal(true)
  }

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment)
    setShowModal(true)
  }

  const handleDeletePayment = (paymentId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      const updatedPayments = payments.filter(p => p.id !== paymentId)
      setPayments(updatedPayments)
      localStorage.setItem('payments-data', JSON.stringify(updatedPayments))
    }
  }

  const handlePaymentSubmit = (paymentData: any) => {
    if (editingPayment) {
      // Editar pago existente
      const updatedPayments = payments.map(p => 
        p.id === editingPayment.id ? { ...p, ...paymentData } : p
      )
      setPayments(updatedPayments)
      localStorage.setItem('payments-data', JSON.stringify(updatedPayments))
    } else {
      // Crear nuevo pago
      const newPayment: Payment = {
        id: Math.max(...payments.map(p => p.id)) + 1,
        ...paymentData
      }
      const updatedPayments = [...payments, newPayment]
      setPayments(updatedPayments)
      localStorage.setItem('payments-data', JSON.stringify(updatedPayments))
    }
    setShowModal(false)
    setEditingPayment(null)
  }

  const totalPaid = payments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = payments.filter(p => p.status === 'vencido').reduce((sum, p) => sum + p.amount, 0)
  const totalCanceled = payments.filter(p => p.status === 'cancelado').reduce((sum, p) => sum + p.amount, 0)

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDashboard(!showDashboard)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {showDashboard ? 'Ocultar Dashboard' : 'Mostrar Dashboard'}
            </button>
            <button 
              onClick={() => router.push('/payments/reports')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Reportes
            </button>
            <button 
              onClick={() => router.push('/payments/monthly')}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Cuotas Mensuales
            </button>
            <button 
              onClick={handleCreatePayment}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Pago
            </button>
          </div>
        </div>

        {/* Dashboard */}
        {showDashboard && stats && (
          <div className="mb-8">
            <PaymentDashboard stats={stats} monthlyStats={monthlyStats} />
          </div>
        )}

        {/* Resumen de pagos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pagado</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendiente</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vencido</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOverdue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelado</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCanceled)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Buscar por jugador o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipo</label>
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los equipos</option>
                {teams.map((team, index) => (
                  <option key={`filter-team-${team.id}-${index}`} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de pagos */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Historial de Pagos ({filteredPayments.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jugador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.playerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.teamName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(payment.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(payment.dueDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{payment.method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal para crear/editar pagos */}
        {showModal && (
          <PaymentModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handlePaymentSubmit}
            payment={editingPayment}
            teams={teams}
          />
        )}
      </div>
    </MainLayout>
  )
}

// Componente Modal para crear/editar pagos
function PaymentModal({ isOpen, onClose, onSubmit, payment, teams }: any) {
  const [formData, setFormData] = useState({
    playerName: '',
    playerId: '',
    teamId: '',
    teamName: '',
    amount: '',
    date: '',
    dueDate: '',
    status: 'pendiente',
    method: 'efectivo',
    description: '',
    notes: ''
  })

  useEffect(() => {
    if (payment) {
      setFormData({
        playerName: payment.playerName,
        playerId: payment.playerId.toString(),
        teamId: payment.teamId.toString(),
        teamName: payment.teamName,
        amount: payment.amount.toString(),
        date: payment.date,
        dueDate: payment.dueDate,
        status: payment.status,
        method: payment.method,
        description: payment.description,
        notes: payment.notes || ''
      })
    } else {
      setFormData({
        playerName: '',
        playerId: '',
        teamId: '',
        teamName: '',
        amount: '',
        date: '',
        dueDate: '',
        status: 'pendiente',
        method: 'efectivo',
        description: '',
        notes: ''
      })
    }
  }, [payment])

  const handleTeamChange = (teamId: string) => {
    const selectedTeam = teams.find(team => team.id.toString() === teamId)
    setFormData({
      ...formData,
      teamId,
      teamName: selectedTeam ? selectedTeam.name : ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      playerId: parseInt(formData.playerId),
      teamId: parseInt(formData.teamId),
      amount: parseInt(formData.amount)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {payment ? 'Editar Pago' : 'Nuevo Pago'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipo *</label>
              <select
                value={formData.teamId}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un equipo</option>
                {teams.map((team, index) => (
                  <option key={`modal-team-${team.id}-${index}`} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jugador *</label>
              <input
                type="text"
                value={formData.playerName}
                onChange={(e) => setFormData({...formData, playerName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del jugador"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Pago</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({...formData, method: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cuota mensual, equipamiento, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {payment ? 'Actualizar' : 'Crear'} Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 