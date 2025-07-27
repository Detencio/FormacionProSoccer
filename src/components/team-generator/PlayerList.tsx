import React, { useState } from 'react'

interface Player {
  id: number
  name: string
  skill: number
  position: string
  teamId?: number
  teamName?: string
  photo?: string
  jersey_number?: string
  stats?: {
    velocidad: number
    disparo: number
    pase: number
    regate: number
    defensa: number
    fisico: number
  }
}

interface PlayerListProps {
  players: Player[]
  onEdit?: (player: Player) => void
  onDelete?: (playerId: number) => void
  onEvaluate?: (playerId: number, stats: any) => void
  showEvaluation?: boolean
  enableEditing?: boolean
  onViewCard?: (player: Player) => void
}

export default function PlayerList({ 
  players, 
  onEdit, 
  onDelete, 
  onEvaluate, 
  showEvaluation, 
  enableEditing,
  onViewCard 
}: PlayerListProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Portero': return 'bg-red-500'
      case 'Defensa': return 'bg-blue-500'
      case 'Mediocampista': return 'bg-green-500'
      case 'Delantero': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getPositionAbbr = (position: string) => {
    switch (position) {
      case 'Portero': return 'GK'
      case 'Defensa': return 'DEF'
      case 'Mediocampista': return 'MID'
      case 'Delantero': return 'ST'
      default: return position.slice(0, 3).toUpperCase()
    }
  }

  const getSkillStars = (skill: number) => {
    return '★'.repeat(skill) + '☆'.repeat(5 - skill)
  }

  const handleViewCard = (player: Player) => {
    if (onViewCard) {
      onViewCard(player)
    }
  }

  return (
    <div className="space-y-2">
      {players.map((player) => (
        <div 
          key={player.id} 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-200 hover:shadow-lg"
        >
          {/* Información del jugador */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Número de camiseta */}
            <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center border-2 border-gray-500">
              <span className="text-white font-bold text-sm">
                {player.jersey_number || '#'}
              </span>
            </div>

            {/* Posición */}
            <div className={`w-8 h-8 ${getPositionColor(player.position)} rounded-full flex items-center justify-center shadow-lg border border-white/80`}>
              <span className="text-xs text-white font-bold">
                {getPositionAbbr(player.position)}
              </span>
            </div>

            {/* Nombre y posición */}
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">
                {player.name}
              </div>
              <div className="text-gray-400 text-xs">
                {player.position}
              </div>
            </div>

            {/* Habilidad */}
            <div className="text-right">
              <div className="text-yellow-400 text-xs font-mono">
                {getSkillStars(player.skill)}
              </div>
              <div className="text-gray-400 text-xs">
                {player.skill}/5
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-2 ml-4">
            {/* Botón ver tarjeta completa */}
            <button
              onClick={() => handleViewCard(player)}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg border border-blue-400/50"
              title="Ver tarjeta completa"
            >
              <span className="text-white text-xs">👁️</span>
            </button>

            {/* Botón evaluar */}
            {showEvaluation && onEvaluate && (
              <button
                onClick={() => onEvaluate(player.id, player.stats || {})}
                className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg border border-green-400/50"
                title="Evaluar jugador"
              >
                <span className="text-white text-xs">📊</span>
              </button>
            )}

            {/* Botón editar */}
            {enableEditing && onEdit && (
              <button
                onClick={() => onEdit(player)}
                className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg border border-yellow-400/50"
                title="Editar jugador"
              >
                <span className="text-white text-xs">✏️</span>
              </button>
            )}

            {/* Botón eliminar */}
            {enableEditing && onDelete && (
              <button
                onClick={() => onDelete(player.id)}
                className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg border border-red-400/50"
                title="Eliminar jugador"
              >
                <span className="text-white text-xs">🗑️</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 