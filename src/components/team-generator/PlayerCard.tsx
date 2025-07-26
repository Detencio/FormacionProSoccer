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
  photo_url?: string
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
  logo_url?: string
  jersey_number?: string | number
  email?: string
  age?: string | number
}

interface PlayerCardProps {
  player: Player
  onEdit?: () => void
  onDelete?: () => void
  onDragStart?: () => void
  isDragging?: boolean
  onEvaluate?: (playerId: number, stats: any) => void
  showEvaluation?: boolean
  enableEditing?: boolean
}

export default function PlayerCard({ player, onEdit, onDelete, onDragStart, isDragging, onEvaluate, showEvaluation = false, enableEditing = false }: PlayerCardProps) {
  console.log('PlayerCard renderizando COMPLETO:', {
    name: player.name,
    jersey_number: player.jersey_number,
    photo: player.photo,
    photo_url: player.photo_url,
    teamLogo: player.teamLogo,
    logo_url: player.logo_url,
    // Mostrar todos los campos del jugador
    allFields: Object.keys(player),
    playerObject: player
  });
  
  const [showActions, setShowActions] = useState(false)

  // Obtener la foto del jugador (compatibilidad con ambos campos)
  const getPlayerPhoto = () => {
    // Priorizar photo_url sobre photo, ya que es el campo usado en teams/page.tsx
    if (player.photo_url) {
      return player.photo_url;
    }
    if (player.photo) {
      return player.photo;
    }
    return undefined;
  };

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
  return (
    <div
      className={`relative group cursor-pointer w-full h-96 rounded-xl overflow-hidden shadow-2xl bg-yellow-200 border-2 border-yellow-400 flex flex-col items-center justify-start ${isDragging ? 'opacity-50' : ''}`}
      onDragStart={onDragStart}
      draggable={true}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Rating y posición */}
      <div className="absolute top-4 left-4 flex flex-col items-center">
        <span className="text-5xl font-black text-black">{calculateOverallRating()}</span>
        <span className="mt-1 px-2 py-1 text-xs font-bold bg-white/90 rounded-full border border-black/10 text-black">{getPositionAbbr(player.position)}</span>
      </div>
      {/* Estrella de skill grande y con borde oscuro */}
      <div className="absolute top-2 right-2 flex flex-col items-center w-16 h-24">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-16 h-16">
            <polygon points="32,6 39,25 60,25 43,38 49,58 32,46 15,58 21,38 4,25 25,25" fill="#ffe066" stroke="#222" strokeWidth="3" />
          </svg>
          {/* Número perfectamente centrado */}
          <span className="absolute text-xl font-black text-black" style={{left: '50%', top: '54%', transform: 'translate(-50%,-50%)'}}>{player.skill}</span>
        </div>
        {/* Iconos de acción en columna debajo de la estrella */}
        <div className={`flex flex-col gap-2 mt-1 z-10 ${(enableEditing && showActions) ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}>
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-500 bg-white rounded-full shadow border border-gray-200"
              title="Editar jugador"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 bg-white rounded-full shadow border border-gray-200"
              title="Eliminar jugador"
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
                if (onEvaluate) onEvaluate(player.id, player.stats);
              }}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-purple-500 bg-white rounded-full shadow border border-gray-200"
              title="Evaluar jugador"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M9 17H7a2 2 0 01-2-2v-2a2 2 0 012-2h2m0 0V7a4 4 0 014-4 4 4 0 014 4v2m-8 4h8" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {/* Foto del jugador */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-yellow-300 bg-gray-200">
          {getPlayerPhoto() ? (
            <img 
              src={getPlayerPhoto()} 
              alt={player.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('❌ Error cargando foto para', player.name);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('✅ Foto cargada para', player.name);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {player.name?.charAt(0) || '?'}
            </div>
          )}
        </div>
      </div>

      {/* Nombre del jugador */}
      <div className="absolute bottom-28 left-0 right-0 text-center">
        <h3 className="text-2xl font-black text-black whitespace-normal break-words">
          {player.name}
        </h3>
      </div>

      {/* Estadísticas del jugador */}
      <div className="absolute bottom-16 left-0 right-0 px-4">
        <div className="flex justify-between text-black">
          <div className="text-center">
            <div className="text-xs font-bold">RIT</div>
            <div className="text-xl font-bold">{player.stats?.velocidad || 70}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold">TIR</div>
            <div className="text-xl font-bold">{player.stats?.disparo || 70}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold">PAS</div>
            <div className="text-xl font-bold">{player.stats?.pase || 70}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold">REG</div>
            <div className="text-xl font-bold">{player.stats?.regate || 70}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold">DEF</div>
            <div className="text-xl font-bold">{player.stats?.defensa || 70}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold">FÍS</div>
            <div className="text-xl font-bold">{player.stats?.fisico || 70}</div>
          </div>
        </div>
      </div>

      {/* Bandera, camiseta y logo del equipo - ALINEADOS PERFECTAMENTE */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1">
        {/* Bandera chilena como imagen local */}
        <img src="/chile.png" alt="Bandera Chile" className="w-8 h-6 rounded shadow border border-gray-400" />
        
        {/* Camiseta simple con número sobreescrito - ALINEADA */}
        <div className="relative w-8 h-6 flex items-center justify-center">
          <span className="text-3xl">👕</span>
          {player.jersey_number && (
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black" style={{ top: '6px' }}>
              {player.jersey_number}
            </span>
          )}
        </div>
        
        {/* Logo del equipo - ALINEADO */}
        {player.teamLogo ? (
          <img 
            src={player.teamLogo} 
            alt="Logo equipo" 
            className="w-8 h-8 object-contain rounded-full"
            onError={(e) => {
              console.error('Error loading team logo:', player.teamLogo)
              e.currentTarget.style.display = 'none'
            }}
            onLoad={() => {
              console.log('Team logo loaded successfully:', player.teamLogo)
            }}
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
            ?
          </div>
        )}
      </div>
    </div>
  )
} 