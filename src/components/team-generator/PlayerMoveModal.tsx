'use client'

import React from 'react'
import { Player } from '@/types'

interface PlayerMoveModalProps {
  isOpen: boolean
  onClose: () => void
  player: Player | null
  currentTeam: 'home' | 'away'
  currentRole: 'starter' | 'substitute'
  onMovePlayer: (
    playerId: number,
    fromTeam: 'home' | 'away',
    fromRole: 'starter' | 'substitute',
    toTeam: 'home' | 'away',
    toRole: 'starter' | 'substitute'
  ) => void
}

const PlayerMoveModal: React.FC<PlayerMoveModalProps> = ({
  isOpen,
  onClose,
  player,
  currentTeam,
  currentRole,
  onMovePlayer
}) => {
  if (!isOpen || !player) return null

  const handleMove = (toTeam: 'home' | 'away', toRole: 'starter' | 'substitute') => {
    onMovePlayer(player.id, currentTeam, currentRole, toTeam, toRole)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Mover Jugador
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-semibold text-gray-900">{player.name}</div>
            <div className="text-sm text-gray-600">
              {player.position_specific?.abbreviation || player.position_zone.abbreviation} - Nivel: {player.skill_level}/5
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Actualmente: {currentTeam === 'home' ? 'Equipo A' : 'Equipo B'} - {currentRole === 'starter' ? 'Titular' : 'Suplente'}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Mover a:</h4>
          
          {/* Equipo A */}
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-blue-600 mb-2">🔵 Equipo A</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleMove('home', 'starter')}
                disabled={currentTeam === 'home' && currentRole === 'starter'}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  currentTeam === 'home' && currentRole === 'starter'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Titular
              </button>
              <button
                onClick={() => handleMove('home', 'substitute')}
                disabled={currentTeam === 'home' && currentRole === 'substitute'}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  currentTeam === 'home' && currentRole === 'substitute'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Suplente
              </button>
            </div>
          </div>

          {/* Equipo B */}
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-red-600 mb-2">🔴 Equipo B</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleMove('away', 'starter')}
                disabled={currentTeam === 'away' && currentRole === 'starter'}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  currentTeam === 'away' && currentRole === 'starter'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Titular
              </button>
              <button
                onClick={() => handleMove('away', 'substitute')}
                disabled={currentTeam === 'away' && currentRole === 'substitute'}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  currentTeam === 'away' && currentRole === 'substitute'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Suplente
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerMoveModal 