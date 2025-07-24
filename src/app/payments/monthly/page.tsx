'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/Layout/MainLayout'
import { paymentService } from '@/services/paymentService'

export default function MonthlyPaymentsPage() {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([new Date().toISOString().slice(0, 7)])
  const [amount, setAmount] = useState(50000)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedPayments, setGeneratedPayments] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeams, setSelectedTeams] = useState<number[]>([])
  const [showMonthSelection, setShowMonthSelection] = useState(false)

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      const savedTeams = localStorage.getItem('teams-data')
      if (savedTeams) {
        const teamsData = JSON.parse(savedTeams)
        setTeams(teamsData)
        // Seleccionar todos los equipos por defecto
        setSelectedTeams(teamsData.map((team: any) => team.id))
      }
    } catch (error) {
      console.error('Error cargando equipos:', error)
    }
  }

  const generateMonthlyPayments = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      // Filtrar equipos seleccionados
      const teamsToProcess = teams.filter(team => selectedTeams.includes(team.id))
      
      if (teamsToProcess.length === 0) {
        setMessage('Error: Debes seleccionar al menos un equipo')
        setLoading(false)
        return
      }

      if (selectedMonths.length === 0) {
        setMessage('Error: Debes seleccionar al menos un mes')
        setLoading(false)
        return
      }

      let allGeneratedPayments: any[] = []
      
      // Generar cuotas para cada mes seleccionado
      for (const month of selectedMonths) {
        const newPayments = await paymentService.generateMonthlyPaymentsForTeams(
          month, 
          amount, 
          teamsToProcess
        )
        allGeneratedPayments = [...allGeneratedPayments, ...newPayments]
      }

      setGeneratedPayments(allGeneratedPayments)
      setMessage(`Se generaron ${allGeneratedPayments.length} cuotas mensuales para ${teamsToProcess.length} equipo(s) en ${selectedMonths.length} mes(es)`)
    } catch (error) {
      console.error('Error generando cuotas:', error)
      setMessage('Error al generar las cuotas mensuales')
    } finally {
      setLoading(false)
    }
  }

  const getTotalPlayers = () => {
    const selectedTeamsData = teams.filter(team => selectedTeams.includes(team.id))
    return selectedTeamsData.reduce((total, team) => total + (team.players?.length || 0), 0)
  }

  const getTotalAmount = () => {
    return getTotalPlayers() * amount * selectedMonths.length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const handleTeamSelection = (teamId: number) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    )
  }

  const selectAllTeams = () => {
    setSelectedTeams(teams.map(team => team.id))
  }

  const deselectAllTeams = () => {
    setSelectedTeams([])
  }

  const getSelectedTeamsData = () => {
    return teams.filter(team => selectedTeams.includes(team.id))
  }

  // Funciones para manejo de meses
  const generateMonthOptions = () => {
    const options = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    
    // Generar opciones para el año actual y el siguiente
    for (let year = currentYear; year <= currentYear + 1; year++) {
      for (let month = 1; month <= 12; month++) {
        const date = new Date(year, month - 1, 1)
        const monthValue = date.toISOString().slice(0, 7)
        const monthLabel = date.toLocaleDateString('es-CL', { 
          year: 'numeric', 
          month: 'long' 
        })
        options.push({ value: monthValue, label: monthLabel })
      }
    }
    
    return options
  }

  const handleMonthSelection = (monthValue: string) => {
    setSelectedMonths(prev => 
      prev.includes(monthValue)
        ? prev.filter(m => m !== monthValue)
        : [...prev, monthValue]
    )
  }

  const selectAllMonths = () => {
    const allMonths = generateMonthOptions().map(option => option.value)
    setSelectedMonths(allMonths)
  }

  const deselectAllMonths = () => {
    setSelectedMonths([])
  }

  const formatMonthLabel = (monthValue: string) => {
    const date = new Date(monthValue + '-01')
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Cuotas Mensuales</h1>
            <p className="text-gray-600">
              Genera cuotas mensuales por equipo y jugadores específicos
            </p>
          </div>

          {/* Panel de configuración */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Cuotas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto por Cuota
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1000"
                  step="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Estimado
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(getTotalAmount())}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getTotalPlayers()} jugadores × {formatCurrency(amount)} × {selectedMonths.length} mes(es)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meses Seleccionados
                </label>
                <div className="px-4 py-3 bg-blue-50 border border-blue-300 rounded-lg">
                  <p className="text-lg font-semibold text-blue-900">
                    {selectedMonths.length} mes(es)
                  </p>
                  <p className="text-sm text-blue-600">
                    {selectedMonths.slice(0, 2).map(formatMonthLabel).join(', ')}
                    {selectedMonths.length > 2 && ` +${selectedMonths.length - 2} más`}
                  </p>
                </div>
              </div>
            </div>

            {/* Selección de meses */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Seleccionar Meses</h3>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllMonths}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  >
                    Seleccionar Año Completo
                  </button>
                  <button
                    onClick={deselectAllMonths}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Deseleccionar Todos
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {generateMonthOptions().map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedMonths.includes(option.value)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleMonthSelection(option.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{option.label}</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMonths.includes(option.value)}
                          onChange={() => handleMonthSelection(option.value)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selección de equipos */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Seleccionar Equipos</h3>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllTeams}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    Seleccionar Todos
                  </button>
                  <button
                    onClick={deselectAllTeams}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Deseleccionar Todos
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTeams.includes(team.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleTeamSelection(team.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{team.name}</h4>
                        <p className="text-sm text-gray-600">
                          {team.players?.length || 0} jugadores
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTeams.includes(team.id)}
                          onChange={() => handleTeamSelection(team.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {selectedTeams.includes(team.id) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Total: {formatCurrency((team.players?.length || 0) * amount * selectedMonths.length)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={generateMonthlyPayments}
                disabled={loading || selectedTeams.length === 0 || selectedMonths.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando cuotas...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generar Cuotas Mensuales
                  </div>
                )}
              </button>
            </div>

            {message && (
              <div className={`mt-4 p-4 rounded-lg ${
                message.includes('Error') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Resumen detallado por equipo */}
          {getSelectedTeamsData().length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen por Equipo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSelectedTeamsData().map((team) => (
                  <div key={team.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-blue-900">{team.name}</h3>
                      <span className="text-sm text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                        {team.players?.length || 0} jugadores
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Total cuotas:</span>
                        <span className="font-medium text-blue-900">
                          {formatCurrency((team.players?.length || 0) * amount * selectedMonths.length)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Por jugador:</span>
                        <span className="font-medium text-blue-900">{formatCurrency(amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Meses:</span>
                        <span className="font-medium text-blue-900">{selectedMonths.length}</span>
                      </div>
                    </div>

                    {/* Lista de jugadores */}
                    {team.players && team.players.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs text-blue-600 mb-2">Jugadores:</p>
                        <div className="space-y-1">
                          {team.players.slice(0, 3).map((player: any) => (
                            <p key={player.id} className="text-xs text-blue-700">
                              • {player.name}
                            </p>
                          ))}
                          {team.players.length > 3 && (
                            <p className="text-xs text-blue-600">
                              +{team.players.length - 3} más...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {teams.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500">No hay equipos registrados</p>
                <p className="text-sm text-gray-400 mt-1">
                  Primero debes crear equipos y agregar jugadores
                </p>
              </div>
            </div>
          )}

          {/* Cuotas generadas */}
          {generatedPayments.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Cuotas Generadas ({generatedPayments.length})
              </h2>
              
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
                        Mes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimiento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {generatedPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.playerName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.teamName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatMonthLabel(payment.month || '')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(payment.dueDate).toLocaleDateString('es-CL')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'pagado' 
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
} 