'use client'

import React, { useMemo } from 'react'
import { Match } from '@/types'
import { format, isThisMonth, isThisWeek, isToday, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

interface MatchStatsProps {
  matches: Match[]
}

export default function MatchStats({ matches }: MatchStatsProps) {
  const stats = useMemo(() => {
    const now = new Date()
    
    // Estadísticas por período
    const todayMatches = matches.filter(match => isToday(new Date(match.date)))
    const thisWeekMatches = matches.filter(match => isThisWeek(new Date(match.date)))
    const thisMonthMatches = matches.filter(match => isThisMonth(new Date(match.date)))
    
    // Estadísticas por tipo
    const internalMatches = matches.filter(match => match.type === 'internal_friendly')
    const externalMatches = matches.filter(match => match.type === 'external_friendly')
    const championshipMatches = matches.filter(match => match.type === 'championship')
    
    // Estadísticas por estado
    const scheduledMatches = matches.filter(match => match.status === 'scheduled')
    const inProgressMatches = matches.filter(match => match.status === 'in_progress')
    const finishedMatches = matches.filter(match => match.status === 'finished')
    const cancelledMatches = matches.filter(match => match.status === 'cancelled')
    
    // Próximos partidos
    const upcomingMatches = matches
      .filter(match => new Date(match.date) > now && match.status === 'scheduled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
    
    // Estadísticas de asistencia
    const totalAttendance = matches.reduce((acc, match) => {
      return acc + (match.attendance?.length || 0)
    }, 0)
    
    const confirmedAttendance = matches.reduce((acc, match) => {
      return acc + (match.attendance?.filter(a => a.status === 'confirmed').length || 0)
    }, 0)
    
    const attendanceRate = totalAttendance > 0 ? (confirmedAttendance / totalAttendance) * 100 : 0
    
    return {
      total: matches.length,
      today: todayMatches.length,
      thisWeek: thisWeekMatches.length,
      thisMonth: thisMonthMatches.length,
      byType: {
        internal: internalMatches.length,
        external: externalMatches.length,
        championship: championshipMatches.length
      },
      byStatus: {
        scheduled: scheduledMatches.length,
        inProgress: inProgressMatches.length,
        finished: finishedMatches.length,
        cancelled: cancelledMatches.length
      },
      upcoming: upcomingMatches,
      attendance: {
        total: totalAttendance,
        confirmed: confirmedAttendance,
        rate: attendanceRate
      }
    }
  }, [matches])

  const StatCard = ({ title, value, subtitle, color = 'blue' }: {
    title: string
    value: string | number
    subtitle?: string
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  }) => {
    const colorClasses = {
      blue: 'bg-blue-600/20 border-blue-500/30',
      green: 'bg-green-600/20 border-green-500/30',
      yellow: 'bg-yellow-600/20 border-yellow-500/30',
      red: 'bg-red-600/20 border-red-500/30',
      purple: 'bg-purple-600/20 border-purple-500/30'
    }

    return (
      <div className={`p-4 rounded-xl border ${colorClasses[color]} backdrop-blur-sm`}>
        <div className="text-gray-300 text-sm font-medium">{title}</div>
        <div className="text-2xl font-bold text-white mt-1">{value}</div>
        {subtitle && (
          <div className="text-gray-400 text-xs mt-1">{subtitle}</div>
        )}
      </div>
    )
  }

  const ProgressBar = ({ value, max, color = 'blue' }: {
    value: number
    max: number
    color?: 'blue' | 'green' | 'yellow' | 'red'
  }) => {
    const percentage = (value / max) * 100
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500'
    }

    return (
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Partidos"
          value={stats.total}
          subtitle="Todos los tiempos"
          color="blue"
        />
        <StatCard
          title="Este Mes"
          value={stats.thisMonth}
          subtitle="Partidos programados"
          color="green"
        />
        <StatCard
          title="Esta Semana"
          value={stats.thisWeek}
          subtitle="Próximos 7 días"
          color="yellow"
        />
        <StatCard
          title="Hoy"
          value={stats.today}
          subtitle="Partidos de hoy"
          color="purple"
        />
      </div>

      {/* Estadísticas Detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Por Tipo */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Por Tipo de Partido</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Amistosos Internos</span>
              <span className="text-white font-semibold">{stats.byType.internal}</span>
            </div>
            <ProgressBar value={stats.byType.internal} max={stats.total} color="blue" />
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Amistosos Externos</span>
              <span className="text-white font-semibold">{stats.byType.external}</span>
            </div>
            <ProgressBar value={stats.byType.external} max={stats.total} color="green" />
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Campeonatos</span>
              <span className="text-white font-semibold">{stats.byType.championship}</span>
            </div>
            <ProgressBar value={stats.byType.championship} max={stats.total} color="yellow" />
          </div>
        </div>

        {/* Por Estado */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Por Estado</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Programados</span>
              <span className="text-white font-semibold">{stats.byStatus.scheduled}</span>
            </div>
            <ProgressBar value={stats.byStatus.scheduled} max={stats.total} color="blue" />
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">En Progreso</span>
              <span className="text-white font-semibold">{stats.byStatus.inProgress}</span>
            </div>
            <ProgressBar value={stats.byStatus.inProgress} max={stats.total} color="yellow" />
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Finalizados</span>
              <span className="text-white font-semibold">{stats.byStatus.finished}</span>
            </div>
            <ProgressBar value={stats.byStatus.finished} max={stats.total} color="green" />
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Cancelados</span>
              <span className="text-white font-semibold">{stats.byStatus.cancelled}</span>
            </div>
            <ProgressBar value={stats.byStatus.cancelled} max={stats.total} color="red" />
          </div>
        </div>
      </div>

      {/* Estadísticas de Asistencia */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Estadísticas de Asistencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Invitados"
            value={stats.attendance.total}
            subtitle="Todos los jugadores"
            color="blue"
          />
          <StatCard
            title="Confirmados"
            value={stats.attendance.confirmed}
            subtitle="Asistencia confirmada"
            color="green"
          />
          <StatCard
            title="Tasa de Asistencia"
            value={`${stats.attendance.rate.toFixed(1)}%`}
            subtitle="Porcentaje de confirmación"
            color="yellow"
          />
        </div>
      </div>

      {/* Próximos Partidos */}
      {stats.upcoming.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Próximos Partidos</h3>
          <div className="space-y-3">
            {stats.upcoming.map(match => {
              const daysUntil = differenceInDays(new Date(match.date), new Date())
              const isToday = daysUntil === 0
              const isTomorrow = daysUntil === 1
              
              return (
                <div key={match.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white font-medium">{match.title}</div>
                    <div className="text-gray-400 text-sm">
                      {format(new Date(match.date), 'EEEE d MMMM, HH:mm', { locale: es })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      isToday ? 'text-green-400' : isTomorrow ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {isToday ? 'Hoy' : isTomorrow ? 'Mañana' : `En ${daysUntil} días`}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      match.type === 'championship' 
                        ? 'bg-yellow-600/20 text-yellow-400' 
                        : match.type === 'external_friendly'
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {match.type === 'championship' ? 'Campeonato' : 
                       match.type === 'external_friendly' ? 'Amistoso Externo' : 'Amistoso Interno'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Resumen Mensual */}
      <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Resumen del Mes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{stats.thisMonth}</div>
            <div className="text-gray-300 text-sm">Partidos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{Math.round(stats.thisMonth / 4)}</div>
            <div className="text-gray-300 text-sm">Por Semana</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.byType.championship}</div>
            <div className="text-gray-300 text-sm">Campeonatos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.byType.external}</div>
            <div className="text-gray-300 text-sm">Amistosos</div>
          </div>
        </div>
      </div>
    </div>
  )
} 