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
      case 'DEL': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  // Obtener color de estadística
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-500'
    if (value >= 60) return 'text-yellow-500'
    if (value >= 40) return 'text-orange-500'
    return 'text-red-500'
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div>
                <h2 className="text-white font-bold text-2xl">{player.name}</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-3 py-1 ${getPositionColor(position)} rounded text-sm font-medium text-white`}>
                    {position}
                  </span>
                  <span className="text-gray-300 text-sm">#{player.jersey_number || 'N/A'}</span>
                  {player.nationality && (
                    <span className="text-gray-300 text-sm">🇨🇱 {player.nationality}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Nivel de habilidad simple y elegante */}
            <div className="text-right">
              <div className="flex items-center justify-center">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                  <span className="text-gray-800 font-bold text-lg">{validSkillLevel}</span>
                </div>
              </div>
              <div className="text-gray-300 text-sm mt-2">
                Nivel {validSkillLevel}/5
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Estadísticas detalladas */}
          <div className="mb-6">
            <h3 className="text-gray-800 font-bold text-lg mb-4">Estadísticas</h3>
            <div className="space-y-4">
              {/* Ritmo */}
              <div className="flex justify-between items-center group hover:bg-blue-50 rounded-lg p-3 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Ritmo</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-40 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full"
                      style={{ width: `${stats.rit}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getStatColor(stats.rit)} min-w-[3rem] text-right`}>
                    {stats.rit}
                  </span>
                </div>
              </div>

              {/* Tiro */}
              <div className="flex justify-between items-center group hover:bg-green-50 rounded-lg p-3 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Tiro</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-40 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full"
                      style={{ width: `${stats.tir}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getStatColor(stats.tir)} min-w-[3rem] text-right`}>
                    {stats.tir}
                  </span>
                </div>
              </div>

              {/* Pase */}
              <div className="flex justify-between items-center group hover:bg-purple-50 rounded-lg p-3 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Pase</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-40 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-full"
                      style={{ width: `${stats.pas}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getStatColor(stats.pas)} min-w-[3rem] text-right`}>
                    {stats.pas}
                  </span>
                </div>
              </div>

              {/* Regate */}
              <div className="flex justify-between items-center group hover:bg-yellow-50 rounded-lg p-3 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Regate</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-40 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full"
                      style={{ width: `${stats.reg}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getStatColor(stats.reg)} min-w-[3rem] text-right`}>
                    {stats.reg}
                  </span>
                </div>
              </div>

              {/* Defensa */}
              <div className="flex justify-between items-center group hover:bg-red-50 rounded-lg p-3 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Defensa</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-40 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-full"
                      style={{ width: `${stats.defense}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getStatColor(stats.defense)} min-w-[3rem] text-right`}>
                    {stats.defense}
                  </span>
                </div>
              </div>

              {/* Físico */}
              <div className="flex justify-between items-center group hover:bg-orange-50 rounded-lg p-3 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Físico</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-40 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full"
                      style={{ width: `${stats.fis}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getStatColor(stats.fis)} min-w-[3rem] text-right`}>
                    {stats.fis}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-gray-800 font-bold text-lg mb-4">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {player.height && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Altura:</span>
                  <span className="font-medium">{player.height}cm</span>
                </div>
              )}
              {player.weight && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Peso:</span>
                  <span className="font-medium">{player.weight}kg</span>
                </div>
              )}
              {player.nationality && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Nacionalidad:</span>
                  <span className="font-medium">🇨🇱 {player.nationality}</span>
                </div>
              )}
              {player.date_of_birth && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Fecha de nacimiento:</span>
                  <span className="font-medium">{new Date(player.date_of_birth).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              {player.is_guest && (
                <div className="col-span-2 flex items-center space-x-2">
                  <span className="text-green-600 font-medium">Jugador Invitado</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerPreviewModal 