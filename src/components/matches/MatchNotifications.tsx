'use client'

import React, { useState, useEffect } from 'react'
import { Match, Notification } from '@/types'
import { format, isToday, isTomorrow, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'

interface MatchNotificationsProps {
  matches: Match[]
  onMatchSelect?: (match: Match) => void
}

export default function MatchNotifications({ matches, onMatchSelect }: MatchNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // Generar notificaciones basadas en los partidos
    const generateNotifications = () => {
      const now = new Date()
      const newNotifications: Notification[] = []

      matches.forEach(match => {
        const matchDate = new Date(match.date)
        const hoursUntil = differenceInHours(matchDate, now)

        // Notificación para partidos de hoy
        if (isToday(matchDate)) {
          newNotifications.push({
            id: `today-${match.id}`,
            type: 'match_update',
            title: 'Partido Hoy',
            message: `${match.title} comienza en ${hoursUntil} horas`,
            recipientId: 'all',
            matchId: match.id,
            read: false,
            createdAt: now,
            expiresAt: new Date(matchDate.getTime() + 24 * 60 * 60 * 1000)
          })
        }

        // Notificación para partidos de mañana
        if (isTomorrow(matchDate)) {
          newNotifications.push({
            id: `tomorrow-${match.id}`,
            type: 'match_invitation',
            title: 'Partido Mañana',
            message: `${match.title} está programado para mañana`,
            recipientId: 'all',
            matchId: match.id,
            read: false,
            createdAt: now,
            expiresAt: new Date(matchDate.getTime() + 24 * 60 * 60 * 1000)
          })
        }

        // Notificación para recordatorio de asistencia
        if (match.attendance && match.attendance.length > 0) {
          const pendingAttendance = match.attendance.filter(a => a.status === 'pending')
          if (pendingAttendance.length > 0) {
            newNotifications.push({
              id: `attendance-${match.id}`,
              type: 'attendance_reminder',
              title: 'Recordatorio de Asistencia',
              message: `${pendingAttendance.length} jugadores aún no han confirmado asistencia para ${match.title}`,
              recipientId: 'all',
              matchId: match.id,
              read: false,
              createdAt: now,
              expiresAt: new Date(matchDate.getTime() - 2 * 60 * 60 * 1000) // 2 horas antes
            })
          }
        }
      })

      setNotifications(newNotifications)
    }

    generateNotifications()
  }, [matches])

  const unreadNotifications = notifications.filter(n => !n.read)
  const displayNotifications = showAll ? notifications : unreadNotifications

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match_invitation':
        return '⚽'
      case 'attendance_reminder':
        return '👥'
      case 'match_update':
        return '📅'
      case 'championship_announcement':
        return '🏆'
      default:
        return '📢'
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'match_invitation':
        return 'bg-blue-600/20 border-blue-500/30'
      case 'attendance_reminder':
        return 'bg-yellow-600/20 border-yellow-500/30'
      case 'match_update':
        return 'bg-green-600/20 border-green-500/30'
      case 'championship_announcement':
        return 'bg-purple-600/20 border-purple-500/30'
      default:
        return 'bg-gray-600/20 border-gray-500/30'
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notificaciones</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">No hay notificaciones</div>
          <div className="text-gray-500 text-sm">Las notificaciones aparecerán aquí cuando haya actualizaciones</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
        <div className="flex items-center space-x-3">
          {unreadNotifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Marcar todas como leídas
            </button>
          )}
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showAll ? 'Mostrar solo no leídas' : 'Mostrar todas'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {displayNotifications.map(notification => {
          const match = matches.find(m => m.id === notification.matchId)
          
          return (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:border-white/40 ${
                notification.read ? 'opacity-60' : ''
              } ${getNotificationColor(notification.type)}`}
              onClick={() => {
                markAsRead(notification.id)
                if (match) {
                  onMatchSelect?.(match)
                }
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white">{notification.title}</h4>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-400">
                        {format(new Date(notification.createdAt), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                  
                  {match && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {format(new Date(match.date), 'EEEE d MMMM, HH:mm', { locale: es })}
                      </span>
                      <span className={`px-2 py-1 rounded ${
                        match.type === 'championship' 
                          ? 'bg-yellow-600/20 text-yellow-400' 
                          : match.type === 'external_friendly'
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-blue-600/20 text-blue-400'
                      }`}>
                        {match.type === 'championship' ? 'Campeonato' : 
                         match.type === 'external_friendly' ? 'Amistoso Externo' : 'Amistoso Interno'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {notifications.length > 5 && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showAll ? 'Mostrar menos' : `Mostrar ${notifications.length - 5} más`}
          </button>
        </div>
      )}
    </div>
  )
} 