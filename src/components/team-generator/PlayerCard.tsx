'use client'

import { useState } from 'react'

interface Player {
  id: number
  name: string
  skill: number
  position: string
  teamId?: number
  teamName?: string
  photo?: string
  stats?: {
    velocidad: number
    disparo: number
    pase: number
    regate: number
    defensa: number
    fisico: number
  }
}

interface PlayerCardProps {
  player: Player
  onEdit?: () => void
  onDelete?: () => void
  onDragStart?: () => void
  isDragging?: boolean
  onEvaluate?: (playerId: number, stats: any) => void
  showEvaluation?: boolean
}

export default function PlayerCard({ 
  player, 
  onEdit, 
  onDelete, 
  onDragStart, 
  isDragging, 
  onEvaluate,
  showEvaluation = false
}: PlayerCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const [evaluationStats, setEvaluationStats] = useState({
    velocidad: player.stats?.velocidad || 70,
    disparo: player.stats?.disparo || 70,
    pase: player.stats?.pase || 70,
    regate: player.stats?.regate || 70,
    defensa: player.stats?.defensa || 70,
    fisico: player.stats?.fisico || 70
  })

  const getSkillColor = (skill: number) => {
    if (skill >= 4) return 'from-yellow-400 via-yellow-500 to-yellow-600'
    if (skill >= 3) return 'from-blue-400 via-blue-500 to-blue-600'
    if (skill >= 2) return 'from-green-400 via-green-500 to-green-600'
    return 'from-gray-400 via-gray-500 to-gray-600'
  }

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Portero':
        return 'bg-red-500'
      case 'Defensa':
        return 'bg-blue-500'
      case 'Mediocampista':
        return 'bg-green-500'
      case 'Delantero':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPositionAbbr = (position: string) => {
    switch (position) {
      case 'Portero':
        return 'POR'
      case 'Defensa':
        return 'DEF'
      case 'Mediocampista':
        return 'MED'
      case 'Delantero':
        return 'DEL'
      default:
        return position.slice(0, 3).toUpperCase()
    }
  }

  const calculateOverallRating = () => {
    if (player.stats) {
      const total = Object.values(player.stats).reduce((sum, stat) => sum + stat, 0)
      return Math.round(total / 6)
    }
    return player.skill * 20
  }

  const handleEvaluate = () => {
    if (onEvaluate) {
      onEvaluate(player.id, evaluationStats)
    }
    setShowEvaluationModal(false)
  }

  return (
    <>
      <div
        className={`relative group cursor-pointer fifa-card ${
          isDragging ? 'opacity-50' : ''
        }`}
        draggable
        onDragStart={onDragStart}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Tarjeta principal estilo FIFA FUT */}
        <div className="relative w-full h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700 fifa-particles">
          {/* Fondo con patrón dinámico */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Efectos de luz */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
          
          {/* Header de la tarjeta */}
          <div className="absolute top-0 left-0 right-0 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-bold text-white rounded ${getPositionColor(player.position)}`}>
                  {getPositionAbbr(player.position)}
                </span>
                <div className="flex space-x-1">
                  {Array.from({ length: player.skill }, (_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">⭐</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white fifa-text-glow">{calculateOverallRating()}</div>
                <div className="text-xs text-gray-300">RATING</div>
              </div>
            </div>
          </div>

          {/* Foto del jugador */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center border-2 border-yellow-400">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-18 h-18 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              {!player.photo && (
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {player.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Nombre del jugador */}
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <div className="text-white font-bold text-lg px-2 truncate">
              {player.name}
            </div>
          </div>

          {/* Stats del jugador */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-white font-bold">VEL</div>
                <div className="text-gray-300">{player.stats?.velocidad || 70}</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">DIS</div>
                <div className="text-gray-300">{player.stats?.disparo || 70}</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">PAS</div>
                <div className="text-gray-300">{player.stats?.pase || 70}</div>
              </div>
            </div>
          </div>

          {/* Borde brillante según habilidad */}
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${getSkillColor(player.skill)} opacity-30`}></div>
          
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20"></div>
        </div>

        {/* Acciones */}
        {(onEdit || onDelete || showEvaluation) && (
          <div className="absolute top-2 right-2 flex space-x-1 z-10">
            {showEvaluation && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowEvaluationModal(true)
                }}
                className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="Evaluar jugador"
              >
                📊
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-xs hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="Editar jugador"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="Eliminar jugador"
              >
                🗑️
              </button>
            )}
          </div>
        )}

        {/* Indicador de equipo */}
        {player.teamName && (
          <div className="absolute top-2 left-2">
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              {player.teamName}
            </div>
          </div>
        )}
      </div>

      {/* Modal de evaluación */}
      {showEvaluationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Evaluar Habilidades de {player.name}
            </h3>
            
            <div className="space-y-4">
              {Object.entries(evaluationStats).map(([stat, value]) => (
                <div key={stat}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {stat.charAt(0).toUpperCase() + stat.slice(1)}: {value}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={value}
                    onChange={(e) => setEvaluationStats({
                      ...evaluationStats,
                      [stat]: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleEvaluate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Guardar Evaluación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 