'use client'

import React from 'react'
import FootballField from './FootballField'
import { TeamDistribution, TeamFormation } from '@/types'

interface TeamManagerProps {
  distribution: TeamDistribution | null
  gameType: '5v5' | '7v7' | '11v11'
  formation?: TeamFormation | null
  onRegenerate: () => void
  onSwapPlayer?: (playerId: number) => void
  onSwapTwoPlayers?: (player1Id: number, player2Id: number) => void
  isGenerating?: boolean
}

const TeamManager: React.FC<TeamManagerProps> = ({
  distribution,
  gameType = '5v5',
  formation,
  onRegenerate,
  onSwapPlayer,
  onSwapTwoPlayers,
  isGenerating = false
}) => {
  if (!distribution) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay equipos generados</p>
      </div>
    )
  }

  const { homeTeam, awayTeam, unassigned } = distribution
  
  // Calcular estadísticas
  const totalPlayers = homeTeam.starters.length + awayTeam.starters.length
  const totalSubstitutes = homeTeam.substitutes.length + awayTeam.substitutes.length
  const totalUnassigned = unassigned.length
  
  // Calcular balance (promedio de habilidades)
  const allPlayers = [
    ...homeTeam.starters,
    ...homeTeam.substitutes,
    ...awayTeam.starters,
    ...awayTeam.substitutes
  ]
  
  const averageSkill = allPlayers.length > 0 
    ? Math.round(allPlayers.reduce((sum, p) => sum + (p.skill_level || 1), 0) / allPlayers.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <h2 className="text-xl font-bold">
                {gameType === '5v5' || gameType === '7v7' ? 'Equipos Amistosos' : 'Equipos Generados'}
              </h2>
            </div>
            <div className="flex space-x-6 text-sm">
              <span>{totalPlayers} Titulares</span>
              <span>{totalSubstitutes} Suplentes</span>
              <span>{totalUnassigned} Sin Asignar</span>
              <span>{averageSkill}/100 Balance</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <span className="text-lg">🔄</span>
              <span>Regenerar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campos de fútbol */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Equipo A */}
        <FootballField
          key={`home-${homeTeam.starters.length}-${homeTeam.substitutes.length}`}
          team={homeTeam}
          teamName="Equipo A"
          teamColor="bg-blue-600"
          gameType={gameType}
          formation={formation}
          onSwapPlayer={onSwapPlayer}
          onSwapTwoPlayers={onSwapTwoPlayers}
        />

        {/* Equipo B */}
        <FootballField
          key={`away-${awayTeam.starters.length}-${awayTeam.substitutes.length}`}
          team={awayTeam}
          teamName="Equipo B"
          teamColor="bg-red-600"
          gameType={gameType}
          formation={formation}
          onSwapPlayer={onSwapPlayer}
          onSwapTwoPlayers={onSwapTwoPlayers}
        />
      </div>

      {/* Jugadores sin asignar */}
      {unassigned.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Jugadores Sin Asignar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unassigned.map((player) => (
              <div key={player.id} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-900">{player.name}</div>
                <div className="text-sm text-gray-500">
                  {player.position_specific?.abbreviation || player.position_zone?.abbreviation || 'N/A'} • Nivel {player.skill_level || 1}
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