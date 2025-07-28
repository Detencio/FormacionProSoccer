'use client'

import React from 'react'
import { TeamDistribution } from '@/types'
import FootballField from './FootballField'

interface TeamManagerProps {
  distribution: TeamDistribution
  gameType?: '5v5' | '7v7' | '11v11'
  formation?: string
  onPlayerMove: (
    playerId: number,
    fromTeam: 'home' | 'away',
    fromRole: 'starter' | 'substitute',
    toTeam: 'home' | 'away',
    toRole: 'starter' | 'substitute'
  ) => void
  onRegenerate: () => void
  onSave: () => void
  isGenerating: boolean
}

const TeamManager: React.FC<TeamManagerProps> = ({
  distribution,
  gameType = '11v11',
  formation = '4-4-2',
  onPlayerMove,
  onRegenerate,
  onSave,
  isGenerating
}) => {
  // Calcular estadísticas
  const totalPlayers = distribution.homeTeam.starters.length + distribution.awayTeam.starters.length
  const totalSubstitutes = distribution.homeTeam.substitutes.length + distribution.awayTeam.substitutes.length
  const totalUnassigned = distribution.unassigned.length
  
  // Calcular balance (promedio de habilidades)
  const allPlayers = [
    ...distribution.homeTeam.starters,
    ...distribution.homeTeam.substitutes,
    ...distribution.awayTeam.starters,
    ...distribution.awayTeam.substitutes
  ]
  
  const averageSkill = allPlayers.length > 0 
    ? allPlayers.reduce((acc, player) => acc + player.skill_level, 0) / allPlayers.length
    : 0
  
  const balanceScore = Math.round(averageSkill * 10)

  return (
    <div className="space-y-6">
      {/* Resumen de Equipos */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>🏆</span>
            Equipos Generados
          </h3>
          <div className="flex gap-3">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerar
            </button>
            <button
              onClick={onSave}
              disabled={isGenerating}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{totalPlayers}</div>
            <div className="text-sm opacity-90">Titulares</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalSubstitutes}</div>
            <div className="text-sm opacity-90">Suplentes</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalUnassigned}</div>
            <div className="text-sm opacity-90">Sin Asignar</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{balanceScore}/100</div>
            <div className="text-sm opacity-90">Balance</div>
          </div>
        </div>
      </div>

      {/* Canchas de Fútbol */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Equipo A */}
        <FootballField
          team={distribution.homeTeam}
          teamName="Equipo A"
          teamColor="bg-blue-600"
          formation={formation}
          gameType={gameType}
          onPlayerMove={onPlayerMove}
        />

        {/* Equipo B */}
        <FootballField
          team={distribution.awayTeam}
          teamName="Equipo B"
          teamColor="bg-red-600"
          formation={formation}
          gameType={gameType}
          onPlayerMove={onPlayerMove}
        />
      </div>

      {/* Jugadores sin asignar */}
      {distribution.unassigned.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Jugadores Sin Asignar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {distribution.unassigned.map((player) => (
              <div key={player.id} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-900">{player.name}</div>
                <div className="text-sm text-gray-600">
                  {player.position_specific?.abbreviation || player.position_zone?.abbreviation} • Nivel {player.skill_level}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamManager 