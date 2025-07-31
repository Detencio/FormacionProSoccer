'use client'

import React from 'react'
import { TeamDistribution } from '@/types'

interface TeamStatsProps {
  distribution: TeamDistribution
}

const TeamStats: React.FC<TeamStatsProps> = ({ distribution }) => {
  const calculateTeamStats = (team: { starters: any[], substitutes: any[] }) => {
    const allPlayers = [...team.starters, ...team.substitutes]
    
    // Validar que haya jugadores antes de calcular promedios
    if (allPlayers.length === 0) {
      return { 
        avgSkill: 0, 
        avgHeight: 0, 
        avgWeight: 0, 
        positions: {} 
      }
    }
    
    const avgSkill = allPlayers.reduce((acc, p) => acc + (p.skill_level || 1), 0) / allPlayers.length
    const avgHeight = allPlayers.reduce((acc, p) => acc + (p.height || 175), 0) / allPlayers.length
    const avgWeight = allPlayers.reduce((acc, p) => acc + (p.weight || 70), 0) / allPlayers.length
    
    // Distribución por posición
    const positions = allPlayers.reduce((acc, p) => {
      const pos = p.position_specific?.abbreviation || p.position_zone?.abbreviation || 'N/A'
      acc[pos] = (acc[pos] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return { avgSkill, avgHeight, avgWeight, positions }
  }

  const homeStats = calculateTeamStats(distribution.homeTeam)
  const awayStats = calculateTeamStats(distribution.awayTeam)
  const balanceScore = Math.max(0, Math.min(100, 100 - Math.abs(homeStats.avgSkill - awayStats.avgSkill) * 20))

  const getBalanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBalanceBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getBalanceText = (score: number): string => {
    if (score >= 80) return 'Excelente balance'
    if (score >= 60) return 'Buen balance'
    if (score >= 40) return 'Balance regular'
    return 'Balance pobre'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Análisis Detallado</h3>
      
      {/* Score de Balance */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Balance de Equipos</span>
          <span className={`text-lg font-bold ${getBalanceColor(balanceScore)}`}>
            {balanceScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getBalanceBgColor(balanceScore)}`}
            style={{ width: `${balanceScore}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {getBalanceText(balanceScore)}
        </div>
      </div>

      {/* Comparación de Equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipo A */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">🔵 Equipo A</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Titulares:</span>
              <span className="font-semibold">{distribution.homeTeam.starters.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Suplentes:</span>
              <span className="font-semibold">{distribution.homeTeam.substitutes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Promedio nivel:</span>
              <span className="font-semibold">{homeStats.avgSkill.toFixed(1)}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Altura promedio:</span>
              <span className="font-semibold">{homeStats.avgHeight.toFixed(0)}cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Peso promedio:</span>
              <span className="font-semibold">{homeStats.avgWeight.toFixed(0)}kg</span>
            </div>
          </div>
          
          {/* Distribución por posición */}
          <div className="mt-4">
            <div className="text-xs font-medium text-gray-600 mb-2">Posiciones:</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(homeStats.positions).map(([pos, count]) => (
                <div key={pos} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                  {pos}: {String(count)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipo B */}
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-3">🔴 Equipo B</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Titulares:</span>
              <span className="font-semibold">{distribution.awayTeam.starters.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Suplentes:</span>
              <span className="font-semibold">{distribution.awayTeam.substitutes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Promedio nivel:</span>
              <span className="font-semibold">{awayStats.avgSkill.toFixed(1)}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Altura promedio:</span>
              <span className="font-semibold">{awayStats.avgHeight.toFixed(0)}cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Peso promedio:</span>
              <span className="font-semibold">{awayStats.avgWeight.toFixed(0)}kg</span>
            </div>
          </div>
          
          {/* Distribución por posición */}
          <div className="mt-4">
            <div className="text-xs font-medium text-gray-600 mb-2">Posiciones:</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(awayStats.positions).map(([pos, count]) => (
                <div key={pos} className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">
                  {pos}: {String(count)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jugadores sin asignar */}
      {distribution.unassigned.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">
            ⚠️ Jugadores Sin Asignar ({distribution.unassigned.length})
          </h4>
          <div className="text-sm text-yellow-700">
            Estos jugadores no fueron asignados a ningún equipo. Puedes moverlos manualmente.
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Recomendaciones</h4>
        <div className="text-sm text-gray-700 space-y-1">
          {balanceScore < 60 && (
            <div>• Considera regenerar los equipos para mejorar el balance</div>
          )}
          {distribution.unassigned.length > 0 && (
            <div>• Asigna manualmente los jugadores sin asignar</div>
          )}
          {Math.abs(homeStats.avgSkill - awayStats.avgSkill) > 1 && (
            <div>• Los equipos tienen niveles muy diferentes</div>
          )}
          {balanceScore >= 80 && (
            <div>• ¡Excelente balance! Los equipos están bien equilibrados</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamStats 