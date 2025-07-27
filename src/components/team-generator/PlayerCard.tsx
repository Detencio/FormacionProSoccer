'use client'

import React, { useCallback } from 'react'
import { Player } from '@/types'

interface PlayerCardProps {
  player: Player
  isSelected: boolean
  onSelect: (player: Player) => void
  onDeselect: (playerId: number) => void
  onRemoveManualPlayer?: (playerId: number) => void
  showManualPlayerControls?: boolean
  onPreview?: (player: Player) => void
}

const PlayerCard: React.FC<PlayerCardProps> = React.memo(({
  player,
  isSelected,
  onSelect,
  onDeselect,
  onRemoveManualPlayer,
  showManualPlayerControls = false,
  onPreview
}) => {
  // Obtener color de posición
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'POR': return 'bg-red-500'
      case 'DEF': return 'bg-blue-500'
      case 'MED': return 'bg-green-500'
      case 'DEL': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  // Obtener color de estadística
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    if (value >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  // Generar estadísticas aleatorias basadas en skill_level
  const generateStats = (skillLevel: number) => {
    const validSkillLevel = Math.max(1, Math.min(5, skillLevel || 1))
    const baseValue = validSkillLevel * 15 + Math.floor(Math.random() * 10)
    return {
      rit: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      tir: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      pas: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      reg: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      defense: Math.min(100, baseValue + Math.floor(Math.random() * 10)),
      fis: Math.min(100, baseValue + Math.floor(Math.random() * 10))
    }
  }

  // Usar estadísticas del backend o generar por defecto
  const getPlayerStats = () => {
    if (player.rit !== undefined && player.tir !== undefined && player.pas !== undefined && 
        player.reg !== undefined && player.defense !== undefined && player.fis !== undefined) {
      return {
        rit: player.rit,
        tir: player.tir,
        pas: player.pas,
        reg: player.reg,
        defense: player.defense,
        fis: player.fis
      }
    }
    return generateStats(player.skill_level)
  }

  const stats = getPlayerStats()
  const position = player.position_specific?.abbreviation || player.position_zone?.abbreviation || 'N/A'
  const validSkillLevel = Math.max(1, Math.min(5, player.skill_level || 1))
  const shouldShowDeleteButton = showManualPlayerControls && player.is_guest

  const handleClick = useCallback(() => {
    if (isSelected) {
      onDeselect(player.id)
    } else {
      onSelect(player)
    }
  }, [isSelected, onSelect, onDeselect, player])

  const handleRemoveClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onRemoveManualPlayer?.(player.id)
  }, [onRemoveManualPlayer, player.id])

  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onPreview?.(player)
  }, [onPreview, player])

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 group select-none relative overflow-hidden ${
        isSelected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl scale-105'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
      }`}
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()}
      style={{ userSelect: 'none' }}
    >
      {/* Header con diseño profesional */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5">
        {/* Efecto de luz sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-white font-bold text-lg truncate">{player.name}</h3>
              
              {/* Icono de detalles que aparece en hover */}
              <button
                onClick={handlePreviewClick}
                onMouseDown={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                title="Ver detalles del jugador"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 ${getPositionColor(position)} rounded-full text-xs font-bold text-white shadow-lg`}>
                {position}
              </span>
              <span className="text-gray-300 text-sm font-medium">#{player.jersey_number || 'N/A'}</span>
            </div>
          </div>

          {/* Nivel de habilidad elegante */}
          <div className="flex items-center justify-center ml-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                <span className="text-slate-900 font-bold text-sm">{validSkillLevel}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-slate-800">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body con todas las estadísticas */}
      <div className="p-5">
        {/* Todas las 6 habilidades en una fila */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1 font-medium">RIT</div>
            <div className={`text-sm font-bold ${getStatColor(stats.rit)}`}>{stats.rit}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1 font-medium">TIR</div>
            <div className={`text-sm font-bold ${getStatColor(stats.tir)}`}>{stats.tir}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1 font-medium">PAS</div>
            <div className={`text-sm font-bold ${getStatColor(stats.pas)}`}>{stats.pas}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1 font-medium">REG</div>
            <div className={`text-sm font-bold ${getStatColor(stats.reg)}`}>{stats.reg}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1 font-medium">DEF</div>
            <div className={`text-sm font-bold ${getStatColor(stats.defense)}`}>{stats.defense}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1 font-medium">FIS</div>
            <div className={`text-sm font-bold ${getStatColor(stats.fis)}`}>{stats.fis}</div>
          </div>
        </div>

        {/* Botón de eliminar para jugadores invitados */}
        {shouldShowDeleteButton && (
          <div className="flex justify-center pt-3 border-t border-gray-100">
            <button
              onClick={handleRemoveClick}
              onMouseDown={(e) => e.stopPropagation()}
              className="px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
              title="Eliminar jugador invitado"
            >
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Eliminar</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Badge de invitado */}
      {player.is_guest && (
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
            Invitado
          </span>
        </div>
      )}
    </div>
  )
})

PlayerCard.displayName = 'PlayerCard'

export default PlayerCard 