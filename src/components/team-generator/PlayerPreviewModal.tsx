'use client'

import React from 'react'
import { Player } from '@/types'

interface PlayerPreviewModalProps {
  player: Player | null
  isOpen: boolean
  onClose: () => void
}

const PlayerPreviewModal: React.FC<PlayerPreviewModalProps> = ({
  player,
  isOpen,
  onClose
}) => {
  if (!isOpen || !player) return null

  // Obtener color de posición
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'POR': return 'bg-red-500'
      case 'DEF': return 'bg-blue-500'
      case 'MED': return 'bg-green-500'
      case 'DEL': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  // Obtener color de estadística
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-700'
    if (value >= 60) return 'text-yellow-700'
    if (value >= 40) return 'text-orange-700'
    return 'text-red-700'
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header compacto */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-semibold text-lg truncate mb-2">{player.name}</h2>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 ${getPositionColor(position)} rounded text-sm font-bold text-white`}>
                  {position}
                </span>
                <span className="text-gray-300 text-sm">#{player.jersey_number && !isNaN(player.jersey_number) ? player.jersey_number.toString() : 'N/A'}</span>
              </div>
            </div>

            {/* Estrella grande con número */}
            <div className="flex items-center justify-center ml-3">
              <div className="relative">
                <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-800 font-bold text-sm">{validSkillLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body compacto con estadísticas */}
        <div className="p-4">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">Estadísticas</h3>
          
          {/* 6 habilidades en una fila compacta */}
          <div className="grid grid-cols-6 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">RIT</div>
              <div className={`text-sm font-bold ${getStatColor(stats.rit)}`}>{stats.rit}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">TIR</div>
              <div className={`text-sm font-bold ${getStatColor(stats.tir)}`}>{stats.tir}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">PAS</div>
              <div className={`text-sm font-bold ${getStatColor(stats.pas)}`}>{stats.pas}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">REG</div>
              <div className={`text-sm font-bold ${getStatColor(stats.reg)}`}>{stats.reg}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">DEF</div>
              <div className={`text-sm font-bold ${getStatColor(stats.defense)}`}>{stats.defense}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">FIS</div>
              <div className={`text-sm font-bold ${getStatColor(stats.fis)}`}>{stats.fis}</div>
            </div>
          </div>
        </div>

        {/* Footer con botón de cerrar */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerPreviewModal 