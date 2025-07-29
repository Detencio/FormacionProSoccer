'use client'

import React from 'react'
import { ExternalTeam } from '@/types'

interface ExternalTeamsManagerProps {
  teams: ExternalTeam[]
  onTeamUpdate: (team: ExternalTeam) => void
}

export default function ExternalTeamsManager({ teams, onTeamUpdate }: ExternalTeamsManagerProps) {
  // Asegurar que teams sea siempre un array
  const safeTeams = teams || []
  const getLevelColor = (level: ExternalTeam['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500'
      case 'intermediate':
        return 'bg-yellow-500'
      case 'advanced':
        return 'bg-orange-500'
      case 'professional':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getLevelText = (level: ExternalTeam['level']) => {
    switch (level) {
      case 'beginner':
        return 'Principiante'
      case 'intermediate':
        return 'Intermedio'
      case 'advanced':
        return 'Avanzado'
      case 'professional':
        return 'Profesional'
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Gestión de Equipos Externos</h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          + Agregar Equipo
        </button>
      </div>

      <div className="space-y-4">
        {safeTeams.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No hay equipos externos registrados</div>
            <div className="text-gray-500">Agrega tu primer equipo externo usando el botón "Agregar Equipo"</div>
          </div>
        ) : (
          safeTeams.map(team => (
            <div
              key={team.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getLevelColor(team.level)}`}>
                      {getLevelText(team.level)}
                    </span>
                  </div>
                  
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>📧 {team.contact?.email || 'No disponible'}</div>
                    <div>📞 {team.contact?.phone || 'No disponible'}</div>
                    <div>👤 {team.contact?.name || 'No disponible'}</div>
                    {team.description && (
                      <div>📝 {team.description}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onTeamUpdate(team)}
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