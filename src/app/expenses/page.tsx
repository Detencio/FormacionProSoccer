'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/Layout/MainLayout'

interface Expense {
  id: number
  category: string
  subcategory: string
  description: string
  amount: number
  date: string
  paymentMethod: string
  teamId?: number
  teamName?: string
  receiptUrl?: string
  notes?: string
  status: 'pagado' | 'pendiente' | 'cancelado'
  createdBy: string
  createdAt: string
}

const EXPENSE_CATEGORIES = {
  'equipamiento': {
    name: 'Equipamiento',
    subcategories: [
      'Balones de fútbol',
      'Camisetas y uniformes',
      'Guantes de portero',
      'Botines y zapatillas',
      'Implementos de entrenamiento',
      'Material de fisioterapia',
      'Equipos de protección'
    ]
  },
  'infraestructura': {
    name: 'Infraestructura',
    subcategories: [
      'Arriendo de cancha',
      'Mantenimiento de cancha',
      'Iluminación',
      'Vestuarios',
      'Equipos de sonido',
      'Señalética y publicidad'
    ]
  },
  'logistica': {
    name: 'Logística',
    subcategories: [
      'Transporte a partidos',
      'Combustible',
      'Peajes',
      'Alojamiento en viajes',
      'Alimentación en viajes'
    ]
  },
  'eventos': {
    name: 'Eventos',
    subcategories: [
      'Asados y comidas',
      'Torneos y competencias',
      'Premios y trofeos',
      'Fotografía y video',
      'Música y entretenimiento'
    ]
  },
  'administrativo': {
    name: 'Administrativo',
    subcategories: [
      'Inscripciones a ligas',
      'Seguros deportivos',
      'Certificados médicos',
      'Material de oficina',
      'Software y tecnología',
      'Marketing y publicidad'
    ]
  },
  'salud': {
    name: 'Salud y Bienestar',
    subcategories: [
      'Exámenes médicos',
      'Fisioterapia',
      'Suplementos nutricionales',
      'Primeros auxilios',
      'Seguros médicos'
    ]
  }
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    teamId: '',
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Cargar equipos
      const savedTeams = localStorage.getItem('teams-data')
      if (savedTeams) {
        setTeams(JSON.parse(savedTeams))
      }

      // Cargar gastos
      const savedExpenses = localStorage.getItem('expenses-data')
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses))
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
      setMessage('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const saveExpenses = (newExpenses: Expense[]) => {
    localStorage.setItem('expenses-data', JSON.stringify(newExpenses))
  }

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    }

    const updatedExpenses = [...expenses, newExpense]
    setExpenses(updatedExpenses)
    saveExpenses(updatedExpenses)
    setMessage('Gasto agregado exitosamente')
    setTimeout(() => setMessage(''), 3000)
  }

  const updateExpense = async (id: number, expenseData: Partial<Expense>) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === id ? { ...expense, ...expenseData } : expense
    )
    setExpenses(updatedExpenses)
    saveExpenses(updatedExpenses)
    setMessage('Gasto actualizado exitosamente')
    setTimeout(() => setMessage(''), 3000)
  }

  const deleteExpense = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      const updatedExpenses = expenses.filter(expense => expense.id !== id)
      setExpenses(updatedExpenses)
      saveExpenses(updatedExpenses)
      setMessage('Gasto eliminado exitosamente')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    if (filters.category && expense.category !== filters.category) return false
    if (filters.subcategory && expense.subcategory !== filters.subcategory) return false
    if (filters.teamId && expense.teamId !== parseInt(filters.teamId)) return false
    if (filters.status && expense.status !== filters.status) return false
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower) ||
        expense.subcategory.toLowerCase().includes(searchLower)
      )
    }
    if (filters.startDate && new Date(expense.date) < new Date(filters.startDate)) return false
    if (filters.endDate && new Date(expense.date) > new Date(filters.endDate)) return false
    return true
  })

  const getTotalExpenses = () => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getExpensesByCategory = () => {
    const categoryTotals: { [key: string]: number } = {}
    filteredExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })
    return categoryTotals
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'bg-green-100 text-green-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header con diseño FIFA 26 */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-3xl shadow-2xl border border-red-500/30 p-8 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Gastos</h1>
                  <p className="text-xl text-red-100 font-medium">Control financiero del club</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 border border-green-400/30 flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Nuevo Gasto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resumen financiero con diseño FIFA 26 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl shadow-2xl border border-red-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-100">Total Gastos</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(getTotalExpenses())}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl shadow-2xl border border-orange-500/30 p-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-100">Este Mes</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(expenses.filter(e => e.date.startsWith('2024-01')).reduce((sum, e) => sum + e.amount, 0))}</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-100">Categorías</p>
                  <p className="text-3xl font-bold text-white">{Object.keys(EXPENSE_CATEGORIES).length}</p>
                </div>
              </div>
            </div>
          </div>

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
                  <p className="text-sm font-medium text-green-100">Registros</p>
                  <p className="text-3xl font-bold text-white">{expenses.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros con diseño FIFA 26 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600/30 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-6">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-3">Categoría</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  {Object.entries(EXPENSE_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Subcategoría
                </label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => setFilters({...filters, subcategory: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todas las subcategorías</option>
                  {filters.category && EXPENSE_CATEGORIES[filters.category as keyof typeof EXPENSE_CATEGORIES]?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Equipo
                </label>
                <select
                  value={filters.teamId}
                  onChange={(e) => setFilters({...filters, teamId: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todos los equipos</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Buscar
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  placeholder="Descripción, categoría..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Rango de fechas
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setFilters({category: '', subcategory: '', teamId: '', status: '', search: '', startDate: '', endDate: ''})}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* Tabla de gastos */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
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
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Cargando gastos...
                        </div>
                      </td>
                    </tr>
                  ) : filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron gastos con los filtros aplicados
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {expense.teamName || 'Sin equipo'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {expense.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {expense.subcategory}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {EXPENSE_CATEGORIES[expense.category as keyof typeof EXPENSE_CATEGORIES]?.name || expense.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(expense.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(expense.date + 'T00:00:00').toLocaleDateString('es-CL')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingExpense(expense)
                                setShowAddModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-xs"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal para agregar/editar gastos */}
        {showAddModal && (
          <ExpenseModal
            expense={editingExpense}
            teams={teams}
            categories={EXPENSE_CATEGORIES}
            onClose={() => {
              setShowAddModal(false)
              setEditingExpense(null)
            }}
            onSave={(expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
              if (editingExpense) {
                updateExpense(editingExpense.id, expenseData)
              } else {
                addExpense(expenseData)
              }
              setShowAddModal(false)
              setEditingExpense(null)
            }}
          />
        )}
      </div>
    </MainLayout>
  )
}

// Componente Modal para gastos
function ExpenseModal({ expense, teams, categories, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    category: expense?.category || 'equipamiento',
    subcategory: expense?.subcategory || '',
    description: expense?.description || '',
    amount: expense?.amount || 0,
    date: expense?.date || new Date().toISOString().split('T')[0],
    paymentMethod: expense?.paymentMethod || 'efectivo',
    teamId: expense?.teamId || '',
    teamName: expense?.teamName || '',
    receiptUrl: expense?.receiptUrl || '',
    notes: expense?.notes || '',
    status: expense?.status || 'pagado',
    createdBy: expense?.createdBy || 'Administrador'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Arreglar el problema de zona horaria
    const fixedDate = new Date(formData.date + 'T12:00:00').toISOString().split('T')[0]
    
    onSave({
      ...formData,
      date: fixedDate
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {expense ? 'Editar Gasto' : 'Agregar Nuevo Gasto'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({...formData, category: e.target.value, subcategory: ''})
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {Object.entries(categories).map(([key, category]: [string, any]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategoría *
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una subcategoría</option>
                {categories[formData.category as keyof typeof categories]?.subcategories.map((sub: string) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada del gasto"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de Pago
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipo (opcional)
              </label>
              <select
                value={formData.teamId}
                onChange={(e) => {
                  const team = teams.find((t: any) => t.id === parseInt(e.target.value))
                  setFormData({
                    ...formData, 
                    teamId: e.target.value ? parseInt(e.target.value) : undefined,
                    teamName: team?.name || ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin equipo específico</option>
                {teams.map((team: any) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL del Comprobante (opcional)
            </label>
            <input
              type="url"
              value={formData.receiptUrl}
              onChange={(e) => setFormData({...formData, receiptUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/comprobante"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas Adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Información adicional sobre el gasto..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {expense ? 'Actualizar Gasto' : 'Agregar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 