'use client'

import React from 'react'
import { Championship } from '@/types'

interface ChampionshipManagerProps {
  championships: Championship[]
  onChampionshipUpdate: (championship: Championship) => void
}

export default function ChampionshipManager({ championships, onChampionshipUpdate }: ChampionshipManagerProps) {
  // Asegurar que championships sea siempre un array
  const safeChampionships = championships || []
  const getStatusColor = (status: Championship['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500'
      case 'active':
        return 'bg-green-500'
      case 'finished':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: Championship['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Próximo'
      case 'active':
        return 'Activo'
      case 'finished':
        return 'Finalizado'
      default:
        return 'Desconocido'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Gestión de Campeonatos</h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          + Crear Campeonato
        </button>
      </div>

      <div className="space-y-4">
        {safeChampionships.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No hay campeonatos registrados</div>
            <div className="text-gray-500">Crea tu primer campeonato usando el botón "Crear Campeonato"</div>
          </div>
        ) : (
          safeChampionships.map(championship => (
            <div
              key={championship.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{championship.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(championship.status)}`}>
                      {getStatusText(championship.status)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-purple-500">
                      {championship.season}
                    </span>
                  </div>
                  
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>📅 {formatDate(championship.startDate)} - {formatDate(championship.endDate)}</div>
                    <div>🏆 {championship.teams.length} equipos</div>
                    <div>⚽ {championship.fixtures.length} partidos</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onChampionshipUpdate(championship)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
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