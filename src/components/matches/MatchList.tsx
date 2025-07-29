'use client'

import React from 'react'
import { Match } from '@/types'

interface MatchListProps {
  matches: Match[]
  onMatchUpdate: (match: Match) => void
  onMatchSelect?: (match: Match) => void
}

export default function MatchList({ matches, onMatchUpdate, onMatchSelect }: MatchListProps) {
  // Asegurar que matches sea siempre un array
  const safeMatches = matches || []
  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-500'
      case 'in_progress':
        return 'bg-orange-500'
      case 'finished':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Programado'
      case 'in_progress':
        return 'En Progreso'
      case 'finished':
        return 'Finalizado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Desconocido'
    }
  }

  const getTypeText = (type: Match['type']) => {
    switch (type) {
      case 'internal_friendly':
        return 'Amistoso Interno'
      case 'external_friendly':
        return 'Amistoso Externo'
      case 'championship':
        return 'Campeonato'
      default:
        return 'Desconocido'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Lista de Partidos</h2>
        <div className="flex space-x-2">
          <select className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2">
            <option value="">Todos los estados</option>
            <option value="scheduled">Programados</option>
            <option value="in_progress">En Progreso</option>
            <option value="finished">Finalizados</option>
            <option value="cancelled">Cancelados</option>
          </select>
          <select className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2">
            <option value="">Todos los tipos</option>
            <option value="internal_friendly">Amistosos Internos</option>
            <option value="external_friendly">Amistosos Externos</option>
            <option value="championship">Campeonatos</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {safeMatches.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No hay partidos registrados</div>
            <div className="text-gray-500">Crea tu primer partido usando el botón "Crear Partido"</div>
          </div>
        ) : (
          safeMatches.map(match => (
            <div
              key={match.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{match.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-blue-500">
                      {getTypeText(match.type)}
                    </span>
                  </div>
                  
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>📅 {formatDate(match.date)}</div>
                    <div>🏟️ {match.venue.name}</div>
                    <div>👥 {match.attendance?.length || 0} asistencias</div>
                    <div>⚽ {match.events?.length || 0} eventos</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onMatchUpdate(match)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onMatchSelect?.(match)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 