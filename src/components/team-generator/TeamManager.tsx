'use client'

import React from 'react'
import { TeamDistribution } from '@/types'
import FootballField from './FootballField'

interface TeamManagerProps {
  distribution: TeamDistribution
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
  onPlayerMove,
  onRegenerate,
  onSave,
  isGenerating
}) => {
  const getBalanceScore = () => {
    const homeAvg = distribution.homeTeam.starters.reduce((acc, p) => acc + p.skill_level, 0) / distribution.homeTeam.starters.length
    const awayAvg = distribution.awayTeam.starters.reduce((acc, p) => acc + p.skill_level, 0) / distribution.awayTeam.starters.length
    const diff = Math.abs(homeAvg - awayAvg)
    return Math.max(0, 100 - diff * 20) // Penalizar por diferencia de nivel
  }

  const balanceScore = getBalanceScore()

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">🏆 Equipos Generados</h2>
          <div className="flex space-x-2">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isGenerating ? '🔄 Generando...' : '🔄 Regenerar'}
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
            >
              💾 Guardar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{distribution.homeTeam.starters.length + distribution.awayTeam.starters.length}</div>
            <div className="text-sm opacity-90">Titulares</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{distribution.homeTeam.substitutes.length + distribution.awayTeam.substitutes.length}</div>
            <div className="text-sm opacity-90">Suplentes</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{distribution.unassigned.length}</div>
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
          formation="4-4-2"
          onPlayerMove={onPlayerMove}
        />

        {/* Equipo B */}
        <FootballField
          team={distribution.awayTeam}
          teamName="Equipo B"
          teamColor="bg-red-600"
          formation="4-4-2"
          onPlayerMove={onPlayerMove}
        />
      </div>

      {/* Jugadores sin asignar */}
      {distribution.unassigned.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            ⚠️ Jugadores Sin Asignar ({distribution.unassigned.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {distribution.unassigned.map((player) => (
              <div
                key={`unassigned-${player.id}`}
                className="bg-white border border-yellow-300 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPlayerMove(player.id, 'home', 'substitute', 'home', 'starter')}
              >
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {player.name}
                </div>
                <div className="text-xs text-gray-600">
                  {player.position_specific?.abbreviation || player.position_zone.abbreviation}
                </div>
                <div className="text-xs text-gray-500">
                  Nivel: {player.skill_level}/5
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Análisis de Equipos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">🔵 Equipo A</h4>
            <div className="space-y-1 text-sm">
              <div>• Titulares: {distribution.homeTeam.starters.length}</div>
              <div>• Suplentes: {distribution.homeTeam.substitutes.length}</div>
              <div>• Promedio: {
                Math.round(
                  [...distribution.homeTeam.starters, ...distribution.homeTeam.substitutes]
                    .reduce((acc, p) => acc + p.skill_level, 0) / 
                  (distribution.homeTeam.starters.length + distribution.homeTeam.substitutes.length)
                )
              }/5</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-red-600 mb-2">🔴 Equipo B</h4>
            <div className="space-y-1 text-sm">
              <div>• Titulares: {distribution.awayTeam.starters.length}</div>
              <div>• Suplentes: {distribution.awayTeam.substitutes.length}</div>
              <div>• Promedio: {
                Math.round(
                  [...distribution.awayTeam.starters, ...distribution.awayTeam.substitutes]
                    .reduce((acc, p) => acc + p.skill_level, 0) / 
                  (distribution.awayTeam.starters.length + distribution.awayTeam.substitutes.length)
                )
              }/5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamManager 