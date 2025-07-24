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
  country?: string
  teamLogo?: string
  jersey_number?: string
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

  // Agrega esta función arriba del componente para obtener el emoji de la bandera
  function getFlagEmoji(countryCode: string) {
    if (!countryCode) return '🏳️';
    // Convierte el código de país a emoji de bandera
    return countryCode
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  }

  return (
    <>
      <div
        className={`relative group cursor-pointer fifa-card ${
          isDragging ? 'opacity-50' : ''
        }`}
        onDragStart={onDragStart}
      >
        {/* Tarjeta principal estilo FIFA FUT */}
        <div className="relative w-full h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700 fifa-particles" draggable={true}>
          {/* Fondo con patrón dinámico */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
          {/* Efectos de luz */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>

          {/* Header de la tarjeta */}
          <div className="absolute top-0 left-0 p-3 flex flex-col items-start">
            <div className="text-3xl font-bold text-white fifa-text-glow leading-none">{calculateOverallRating()}</div>
            <div className="text-xs text-gray-300 mt-1 px-1 py-0.5 rounded bg-black/30 font-bold">
              {getPositionAbbr(player.position)}
            </div>
          </div>

          {/* Estrella de skill en la esquina superior derecha y acciones */}
          <div className="absolute top-2 right-3 flex flex-col items-center justify-start gap-1 pointer-events-none z-30">
            <div className="relative w-9 h-9 flex items-center justify-center mb-1">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <polygon points="20,3 25,15 38,15 27,23 31,36 20,28 9,36 13,23 2,15 15,15" fill="#fffbe6" stroke="#ffe066" strokeWidth="2" filter="drop-shadow(0 1px 4px #ffe06688)" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-yellow-600" style={{pointerEvents: 'none'}}>{player.skill}</span>
            </div>
            {/* Iconos de acción: editar, eliminar y evaluación */}
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="w-6 h-6 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all duration-200 scale-75 group-hover:scale-100 mb-1 pointer-events-auto"
                title="Editar jugador"
                style={{background: 'none', boxShadow: 'none'}}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-6 h-6 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-red-500 transition-all duration-200 scale-75 group-hover:scale-100 mb-1 pointer-events-auto"
                title="Eliminar jugador"
                style={{background: 'none', boxShadow: 'none'}}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            {showEvaluation && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEvaluationModal(true);
                }}
                className="w-6 h-6 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-purple-500 transition-all duration-200 scale-75 group-hover:scale-100 pointer-events-auto"
                title="Evaluar jugador"
                style={{background: 'none', boxShadow: 'none'}}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M9 17H7a2 2 0 01-2-2v-2a2 2 0 012-2h2m0 0V7a4 4 0 014-4 4 4 0 014 4v2m-8 4h8" />
                </svg>
              </button>
            )}
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

          {/* Nombre del jugador centrado debajo de la foto */}
          <div className="absolute bottom-20 left-0 right-0 text-center flex flex-col items-center">
            <div className="text-white font-bold text-lg px-2 truncate">
              {player.name}
            </div>
          </div>

          {/* Stats del jugador */}
          <div className="absolute bottom-10 left-0 right-0 p-3">
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



          {/* País, camiseta y logo del equipo */}
          <div className="flex items-center justify-center gap-3 mt-2 mb-1">
            {/* Bandera del país (emoji) */}
            <span className="text-2xl" title={player.country || ''}>{getFlagEmoji(player.country || '')}</span>
            {/* Camiseta SVG igual al ejemplo, con mangas y cuello en V */}
            <span className="inline-block align-middle">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="shirtStroke" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6"/>
                    <stop offset="1" stopColor="#a21caf"/>
                  </linearGradient>
                  <linearGradient id="shirtFill" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff"/>
                    <stop offset="1" stopColor="#f3e8ff"/>
                  </linearGradient>
                </defs>
                {/* Camiseta con mangas y cuello en V */}
                <path d="M2 8 Q4 2 12 2 L16 6 L20 2 Q28 2 30 8 L26 12 L24 10 L16 16 L8 10 L6 12 Z" fill="url(#shirtFill)" stroke="url(#shirtStroke)" strokeWidth="2"/>
                {/* Cuerpo */}
                <rect x="8" y="10" width="16" height="16" rx="3" fill="url(#shirtFill)" stroke="url(#shirtStroke)" strokeWidth="2"/>
                {/* Cuello en V */}
                <path d="M13 10 L16 13 L19 10" stroke="#3b82f6" strokeWidth="1.2" fill="none"/>
                {/* Número */}
                <text x="16" y="22" textAnchor="middle" fontSize="12" fill="#a21caf" fontWeight="bold" dominantBaseline="middle">{player.jersey_number || ''}</text>
              </svg>
            </span>
            {/* Logo del equipo */}
            {player.teamLogo && (
              <img src={player.teamLogo} alt="Logo equipo" className="w-7 h-7 object-contain rounded bg-white/80 border border-gray-300" />
            )}
          </div>

          {/* Borde brillante según habilidad */}
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${getSkillColor(player.skill)} opacity-30 z-0 pointer-events-none`}></div>
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 z-0 pointer-events-none"></div>
        </div>
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