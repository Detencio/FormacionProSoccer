'use client'

import React from 'react'
import { Match } from '@/types'

interface MatchStatsProps {
  matches: Match[]
}

export default function MatchStats({ matches }: MatchStatsProps) {
  // Asegurar que matches sea siempre un array
  const safeMatches = matches || []
  const stats = {
    total: safeMatches.length,
    scheduled: safeMatches.filter(m => m.status === 'scheduled').length,
    inProgress: safeMatches.filter(m => m.status === 'in_progress').length,
    finished: safeMatches.filter(m => m.status === 'finished').length,
    cancelled: safeMatches.filter(m => m.status === 'cancelled').length
  }

  const statCards = [
    {
      label: 'Total Partidos',
      value: stats.total,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Programados',
      value: stats.scheduled,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'En Progreso',
      value: stats.inProgress,
      color: 'from-orange-500 to-red-500'
    },
    {
      label: 'Finalizados',
      value: stats.finished,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Cancelados',
      value: stats.cancelled,
      color: 'from-red-500 to-red-600'
    }
  ]

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Estadísticas de Partidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${stat.color} rounded-xl p-4 text-center`}
          >
            <div className="text-3xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="text-white/90 text-sm font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 