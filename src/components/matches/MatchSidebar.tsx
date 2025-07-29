'use client'

import React from 'react'
import { Match } from '@/types'

interface MatchSidebarProps {
  selectedMatch: Match | null
  onClose: () => void
  onUpdateMatch: (match: Match) => void
}

export default function MatchSidebar({ selectedMatch, onClose, onUpdateMatch }: MatchSidebarProps) {
  if (!selectedMatch) return null

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

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500'
      case 'in_progress':
        return 'bg-yellow-500'
      case 'finished':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
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

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white/10 backdrop-blur-xl border-l border-white/20 z-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Detalles del Partido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">{selectedMatch.title}</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedMatch.status)}`}>
              {getStatusText(selectedMatch.status)}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-blue-500">
              {getTypeText(selectedMatch.type)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Información General</h4>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">📅</span>
              <span>{formatDate(selectedMatch.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🏟️</span>
              <span>{selectedMatch.venue.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">📍</span>
              <span>{selectedMatch.venue.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">👥</span>
              <span>{selectedMatch.attendance?.length || 0} asistencias</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚽</span>
              <span>{selectedMatch.events?.length || 0} eventos</span>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Acciones</h4>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              📝 Editar Partido
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              👥 Gestionar Asistencias
            </button>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              ⚽ Gestionar Eventos
            </button>
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
              📊 Ver Estadísticas
            </button>
          </div>
        </div>

        {/* Estado del partido */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Estado</h4>
          <div className="space-y-2">
            {selectedMatch.status === 'scheduled' && (
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                ▶️ Iniciar Partido
              </button>
            )}
            {selectedMatch.status === 'in_progress' && (
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                ✅ Finalizar Partido
              </button>
            )}
            {selectedMatch.status !== 'finished' && selectedMatch.status !== 'cancelled' && (
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                ❌ Cancelar Partido
              </button>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Información Adicional</h4>
          <div className="space-y-3 text-gray-300 text-sm">
            <div>
              <span className="font-medium">Creado por:</span> {selectedMatch.createdBy}
            </div>
            <div>
              <span className="font-medium">Creado el:</span> {formatDate(selectedMatch.createdAt)}
            </div>
            <div>
              <span className="font-medium">Última actualización:</span> {formatDate(selectedMatch.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 