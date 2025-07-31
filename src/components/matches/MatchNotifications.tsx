'use client'

import React, { useState, useEffect } from 'react'
import { Match } from '@/types'
import { isToday, isTomorrow, differenceInHours, format } from 'date-fns'
import { es } from 'date-fns/locale'

interface MatchNotificationsProps {
  matches: Match[]
  onMatchSelect: (match: Match) => void
}

export default function MatchNotifications({ matches, onMatchSelect }: MatchNotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'urgent'>('all')

  useEffect(() => {
    generateNotifications()
  }, [matches])

  const generateNotifications = () => {
    const now = new Date()
    const newNotifications: any[] = []

    matches.forEach(match => {
      const matchDate = new Date(match.date)
      const hoursUntil = differenceInHours(matchDate, now)

      // Partidos de hoy
      if (isToday(matchDate)) {
        newNotifications.push({
          id: `today-${match.id}`,
          type: 'today',
          title: `Partido de hoy: ${match.title}`,
          message: `El partido comienza en ${hoursUntil} horas`,
          match,
          priority: 'high',
          icon: '⚽',
          color: 'text-green-400'
        })
      }

      // Partidos de mañana
      if (isTomorrow(matchDate)) {
        newNotifications.push({
          id: `tomorrow-${match.id}`,
          type: 'upcoming',
          title: `Partido mañana: ${match.title}`,
          message: `Recordatorio: Partido programado para mañana`,
          match,
          priority: 'medium',
          icon: '📅',
          color: 'text-blue-400'
        })
      }

      // Recordatorios de asistencia pendiente
      const pendingAttendance = match.attendance?.filter(a => a.status === 'pending') || []
      if (pendingAttendance.length > 0 && hoursUntil <= 24) {
        newNotifications.push({
          id: `attendance-${match.id}`,
          type: 'urgent',
          title: `Asistencia pendiente: ${match.title}`,
          message: `${pendingAttendance.length} jugadores aún no han confirmado asistencia`,
          match,
          priority: 'high',
          icon: '👥',
          color: 'text-yellow-400'
        })
      }

      // Partidos próximos (en las próximas 48 horas)
      if (hoursUntil > 0 && hoursUntil <= 48 && !isToday(matchDate) && !isTomorrow(matchDate)) {
        newNotifications.push({
          id: `upcoming-${match.id}`,
          type: 'upcoming',
          title: `Partido próximo: ${match.title}`,
          message: `En ${Math.floor(hoursUntil / 24)} días`,
          match,
          priority: 'low',
          icon: '📋',
          color: 'text-purple-400'
        })
      }
    })

    setNotifications(newNotifications)
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true
    return notification.type === activeFilter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-600/10'
      case 'medium': return 'border-yellow-500/30 bg-yellow-600/10'
      case 'low': return 'border-blue-500/30 bg-blue-600/10'
      default: return 'border-gray-500/30 bg-gray-600/10'
    }
  }

  const handleNotificationClick = (notification: any) => {
    onMatchSelect(notification.match)
  }

  const handleDismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const getFilterStats = () => {
    return {
      all: notifications.length,
      today: notifications.filter(n => n.type === 'today').length,
      upcoming: notifications.filter(n => n.type === 'upcoming').length,
      urgent: notifications.filter(n => n.type === 'urgent').length
    }
  }

  const stats = getFilterStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Notificaciones</h2>
        <div className="text-gray-400 text-sm">
          {notifications.length} notificaciones
        </div>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'all' 
              ? 'bg-white/20 text-white' 
              : 'bg-white/5 text-gray-300 hover:text-white'
          }`}
        >
          Todas ({stats.all})
        </button>
        <button
          onClick={() => setActiveFilter('today')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'today' 
              ? 'bg-green-600/20 text-green-400' 
              : 'bg-white/5 text-gray-300 hover:text-white'
          }`}
        >
          Hoy ({stats.today})
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'upcoming' 
              ? 'bg-blue-600/20 text-blue-400' 
              : 'bg-white/5 text-gray-300 hover:text-white'
          }`}
        >
          Próximos ({stats.upcoming})
        </button>
        <button
          onClick={() => setActiveFilter('urgent')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'urgent' 
              ? 'bg-yellow-600/20 text-yellow-400' 
              : 'bg-white/5 text-gray-300 hover:text-white'
          }`}
        >
          Urgentes ({stats.urgent})
        </button>
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-lg mb-2">No hay notificaciones</div>
            <div className="text-sm">Las notificaciones aparecerán aquí automáticamente</div>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getPriorityColor(notification.priority)} hover:bg-white/5 transition-colors cursor-pointer`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className={`text-xl ${notification.color}`}>
                    {notification.icon}
                  </span>
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">
                      {notification.title}
                    </div>
                    <div className="text-gray-300 text-sm mb-2">
                      {notification.message}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {format(new Date(notification.match.date), 'EEEE d MMMM, HH:mm', { locale: es })}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDismissNotification(notification.id)
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Estadísticas */}
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">Resumen de Notificaciones</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-green-400 text-2xl font-bold">{stats.today}</div>
            <div className="text-gray-400 text-xs">Partidos Hoy</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 text-2xl font-bold">{stats.upcoming}</div>
            <div className="text-gray-400 text-xs">Próximos</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 text-2xl font-bold">{stats.urgent}</div>
            <div className="text-gray-400 text-xs">Urgentes</div>
          </div>
          <div className="text-center">
            <div className="text-white text-2xl font-bold">{stats.all}</div>
            <div className="text-gray-400 text-xs">Total</div>
          </div>
        </div>
      </div>
    </div>
  )
} 