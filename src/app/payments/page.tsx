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
  month?: string
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
      // Simular estadísticas para evitar el error
      const statsData = {
        totalPayments: payments.length,
        totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
        paidAmount: payments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + p.amount, 0),
        pendingAmount: payments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + p.amount, 0),
        overdueAmount: payments.filter(p => p.status === 'vencido').reduce((sum, p) => sum + p.amount, 0),
        monthlyStats: []
      }
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
      <div className="space-y-8">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-3xl shadow-2xl border border-purple-500/30 p-8 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Gestión de Pagos</h1>
                  <p className="text-xl text-purple-100 font-medium">Control financiero profesional</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-purple-400/30 flex items-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>{showDashboard ? 'Ocultar Dashboard' : 'Mostrar Dashboard'}</span>
                </button>
                <button 
                  onClick={() => router.push('/payments/reports')}
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-green-400/30 flex items-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Reportes</span>
                </button>
                <button 
                  onClick={() => router.push('/payments/monthly')}
                  className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-orange-400/30 flex items-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Cuotas Mensuales</span>
                </button>
                <button 
                  onClick={handleCreatePayment}
                  className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-blue-400/30 flex items-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Nuevo Pago</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        {showDashboard && stats && (
          <div className="mb-8">
            <PaymentDashboard stats={stats} monthlyStats={monthlyStats} />
          </div>
        )}

        {/* Resumen de pagos con diseño FIFA 26 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl shadow-2xl border border-green-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-100">Total Pagado</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(totalPaid)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-3xl shadow-2xl border border-yellow-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-100">Pendiente</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(totalPending)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl shadow-2xl border border-red-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-100">Vencido</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(totalOverdue)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl shadow-2xl border border-gray-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-100">Cancelado</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(totalCanceled)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-3">Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar por jugador o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">Estado</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="vencido">Vencido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-white mb-3">Equipo</label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los equipos</option>
                  {teams.map((team: any) => (
                    <option key={`filter-team-${team.id}`} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de pagos con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-bold">Jugador</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Equipo</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Monto</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Fecha</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Estado</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Método</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300">
                    <td className="px-6 py-4 text-white font-medium">{payment.playerName}</td>
                    <td className="px-6 py-4 text-gray-300">{payment.teamName}</td>
                    <td className="px-6 py-4 text-white font-bold">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4 text-gray-300">{payment.date ? formatDate(payment.date) : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 capitalize">{payment.method}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de pago */}
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
    const selectedTeam = teams.find((team: any) => team.id.toString() === teamId)
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
                {teams.map((team: any, index: number) => (
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