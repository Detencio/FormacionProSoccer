'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { FaFutbol, FaUsers, FaCalendar, FaCreditCard, FaSignOutAlt, FaTrophy, FaChartLine, FaStar, FaUserCheck, FaUserTimes, FaMoneyBillWave, FaMedal } from 'react-icons/fa'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import MainLayout from '@/components/Layout/MainLayout'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  // Cargar equipos desde localStorage (listo para migrar a API)
  useEffect(() => {
    async function fetchTeams() {
      // Aquí puedes cambiar a una llamada a API en el futuro
      const data = localStorage.getItem('teams-data')
      const teamsList = data ? JSON.parse(data) : []
      setTeams(teamsList)
    }
    fetchTeams()
  }, [])

  // Determinar equipo a mostrar según rol
  useEffect(() => {
    if (!user) return
    if (user.role === 'admin') {
      // Si es admin, mostrar el primer equipo por defecto si no hay uno seleccionado
      if (!selectedTeamId && teams.length > 0) {
        setSelectedTeamId(teams[0].id.toString())
      }
    } else {
      // Si es supervisor, jugador o invitado, mostrar solo su equipo
      if (user.teamId) {
        setSelectedTeamId(user.teamId)
      }
    }
  }, [user, teams])

  // Actualizar el equipo seleccionado
  useEffect(() => {
    if (!selectedTeamId) {
      setSelectedTeam(null)
      return
    }
    const team = teams.find((t: any) => t.id.toString() === selectedTeamId)
    setSelectedTeam(team)
  }, [selectedTeamId, teams])

  const handleLogout = async () => {
    await logout()
  }

  // Si no hay equipo seleccionado, mostrar mensaje
  if (!selectedTeam) {
    return (
      <AuthGuard>
        <MainLayout>
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No hay equipo seleccionado</h2>
            <p className="text-gray-300">Por favor, selecciona un equipo para ver el dashboard.</p>
          </div>
        </MainLayout>
      </AuthGuard>
    )
  }

  // --- DASHBOARD PARA JUGADOR ---
  if (user?.role === 'jugador') {
    // Datos simulados personales
    const nextMatch = selectedTeam?.nextMatch || 'Sábado 18:00 vs Los Tigres'
    const paymentStatus = selectedTeam?.myPaymentStatus || 'Al día'
    const paymentPie = selectedTeam?.myPaymentsPie || [
      { name: 'Pagado', value: 90 },
      { name: 'Pendiente', value: 10 },
      { name: 'Vencido', value: 0 },
    ]
    const recentActivity = selectedTeam?.myRecentActivity || [
      { type: 'partido', text: 'Jugaste el partido vs Los Tigres (3-2)', color: 'green' },
      { type: 'pago', text: 'Pagaste cuota de abril', color: 'yellow' },
    ]

    return (
      <AuthGuard>
        <MainLayout>
          <div className="max-w-3xl mx-auto py-8 space-y-8">
            {/* Encabezado limpio */}
            <div className="bg-gradient-to-r from-green-700 via-blue-800 to-black rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 border-4 border-green-500/30">
                <FaFutbol className="text-green-400 text-4xl" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{selectedTeam?.name || 'Mi Equipo'}</h1>
              <p className="text-lg text-green-100 font-medium">¡Hola, {user.firstName}!</p>
            </div>

            {/* KPIs esenciales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Próximo partido */}
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-500/30">
                <FaCalendar className="text-white text-2xl mb-2" />
                <div className="text-lg font-bold text-white mb-1">Próximo partido</div>
                <div className="text-blue-100 text-base">{nextMatch}</div>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Ver detalles</button>
              </div>
              {/* Estado de pagos */}
              <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl shadow-xl p-6 flex flex-col items-center border border-green-500/30">
                <FaMoneyBillWave className="text-white text-2xl mb-2" />
                <div className="text-lg font-bold text-white mb-1">Estado de pagos</div>
                <div className="text-green-100 text-base">{paymentStatus === 'Al día' ? 'Al día ✅' : paymentStatus}</div>
                <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Ver historial</button>
              </div>
            </div>

            {/* Gráfico circular de pagos personales */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-600/30 flex flex-col items-center">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center"><FaCreditCard className="mr-2 text-yellow-400" /> Mis Pagos</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={paymentPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    <Cell key="pagado" fill="#34d399" />
                    <Cell key="pendiente" fill="#fbbf24" />
                    <Cell key="vencido" fill="#ef4444" />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Actividad reciente personal */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-600/30">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaStar className="text-yellow-400 mr-3" />
                Mi Actividad Reciente
              </h3>
              <div className="space-y-4">
                {recentActivity.map((item: any, idx: number) => (
                  <div key={idx} className={`flex items-center p-4 bg-gradient-to-r from-${item.color}-600/20 to-${item.color}-700/20 rounded-xl border border-${item.color}-500/30`}>
                    <div className={`w-3 h-3 bg-${item.color}-400 rounded-full mr-4 animate-pulse`}></div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.type === 'partido' ? 'Partido' : 'Pago'}</p>
                      <p className={`text-sm text-${item.color}-200`}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    )
  }

  // --- DASHBOARD PARA ADMIN/SUPERVISOR ---
  if (user?.role === 'admin' || user?.role === 'supervisor') {
    // Datos simulados de equipo
    const kpis = [
      { label: 'Jugadores activos', value: selectedTeam?.players?.length || 0, icon: <FaUsers className="text-green-400 text-2xl" />, color: 'from-green-700 to-green-900', border: 'border-green-500/30' },
      { label: 'Pagos al día', value: selectedTeam?.paymentsOnTime || 12, icon: <FaMoneyBillWave className="text-yellow-400 text-2xl" />, color: 'from-yellow-600 to-yellow-800', border: 'border-yellow-500/30' },
      { label: 'Gastos', value: `$${selectedTeam?.expenses || 0}`, icon: <FaCreditCard className="text-purple-400 text-2xl" />, color: 'from-purple-700 to-purple-900', border: 'border-purple-500/30' },
      { label: 'Próximo partido', value: selectedTeam?.nextMatch || 'Sábado 18:00', icon: <FaCalendar className="text-blue-400 text-2xl" />, color: 'from-blue-700 to-blue-900', border: 'border-blue-500/30' },
      { label: 'Asistencia promedio', value: selectedTeam?.avgAttendance || '85%', icon: <FaUserCheck className="text-green-300 text-2xl" />, color: 'from-green-600 to-green-800', border: 'border-green-500/30' },
    ]
    const teamStats = [
      { label: 'Partidos jugados', value: selectedTeam?.matchesPlayed || 8, color: 'bg-blue-700', icon: <FaFutbol className="text-white text-xl" /> },
      { label: 'Victorias', value: selectedTeam?.wins || 5, color: 'bg-green-700', icon: <FaMedal className="text-yellow-400 text-xl" /> },
      { label: 'Empates', value: selectedTeam?.draws || 2, color: 'bg-yellow-700', icon: <FaFutbol className="text-white text-xl" /> },
      { label: 'Derrotas', value: selectedTeam?.losses || 1, color: 'bg-red-700', icon: <FaFutbol className="text-white text-xl" /> },
    ]
    const paymentPie = selectedTeam?.paymentsPie || [
      { name: 'Pagado', value: 70 },
      { name: 'Pendiente', value: 20 },
      { name: 'Vencido', value: 10 },
    ]
    const recentActivity = selectedTeam?.recentActivity || [
      { type: 'partido', text: 'Victoria 3-2 vs Los Tigres', color: 'green' },
      { type: 'jugador', text: 'Carlos González se unió al equipo', color: 'blue' },
      { type: 'pago', text: 'Cuota mensual de Miguel Silva', color: 'yellow' },
      { type: 'gasto', text: 'Compra de balones y petos', color: 'purple' },
    ]
    const notifications = [
      { text: '¡Nuevo evento de entrenamiento este viernes!', color: 'blue' },
      { text: 'Trivia futbolera: ¿Quién fue el goleador del último mundial?', color: 'green' },
    ]

    return (
      <AuthGuard>
        <MainLayout>
          <div className="max-w-6xl mx-auto py-8 space-y-10">
            {/* Encabezado limpio */}
            <div className="bg-gradient-to-r from-green-700 via-blue-800 to-black rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left relative overflow-hidden gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-4 border-green-500/30">
                  <FaFutbol className="text-green-400 text-4xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{selectedTeam?.name || 'Mi Equipo'}</h1>
                  <p className="text-lg text-green-100 font-medium">¡Hola, {user.firstName}!</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center md:items-end">
                {notifications.map((n, idx) => (
                  <div key={idx} className={`px-4 py-2 rounded-lg text-white bg-gradient-to-r from-${n.color}-600 to-${n.color}-800 shadow-md text-sm font-medium`}>{n.text}</div>
                ))}
              </div>
            </div>

            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {kpis.map((kpi, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${kpi.color} rounded-2xl shadow-xl p-6 flex flex-col items-center border ${kpi.border}`}>
                  {kpi.icon}
                  <div className="text-2xl font-bold text-white mt-2">{kpi.value}</div>
                  <div className="text-white text-sm mt-1">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Gráfico circular de pagos */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-600/30 flex flex-col items-center">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center"><FaCreditCard className="mr-2 text-yellow-400" /> Estado de Pagos</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={paymentPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    <Cell key="pagado" fill="#34d399" />
                    <Cell key="pendiente" fill="#fbbf24" />
                    <Cell key="vencido" fill="#ef4444" />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Datos de equipo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              {teamStats.map((stat, idx) => (
                <div key={idx} className={`rounded-2xl shadow-xl p-6 flex flex-col items-center ${stat.color}`}>
                  {stat.icon}
                  <div className="text-2xl font-bold text-white mt-2">{stat.value}</div>
                  <div className="text-white text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Actividad reciente */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-600/30 mt-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaStar className="text-yellow-400 mr-3" />
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                {recentActivity.map((item: any, idx: number) => (
                  <div key={idx} className={`flex items-center p-4 bg-gradient-to-r from-${item.color}-600/20 to-${item.color}-700/20 rounded-xl border border-${item.color}-500/30`}>
                    <div className={`w-3 h-3 bg-${item.color}-400 rounded-full mr-4 animate-pulse`}></div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.type === 'partido' ? 'Último partido jugado' : item.type === 'jugador' ? 'Nuevo jugador agregado' : item.type === 'pago' ? 'Pago recibido' : 'Gasto realizado'}
                      </p>
                      <p className={`text-sm text-${item.color}-200`}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MainLayout>
      </AuthGuard>
    )
  }
} 