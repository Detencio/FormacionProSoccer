'use client'

import React from 'react'
import { Player } from '@/services/teamService'

interface PlayerListViewProps {
  players: Player[]
  onEdit?: (player: Player) => void
  onDelete?: (playerId: number) => void
}

const PlayerListView: React.FC<PlayerListViewProps> = ({
  players,
  onEdit,
  onDelete
}) => {
  // Calcular edad desde fecha de nacimiento
  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Generar estrellas para nivel de habilidad
  const getSkillStars = (skill: number) => {
    const validSkill = Math.max(1, Math.min(5, skill || 1))
    return '★'.repeat(validSkill) + '☆'.repeat(5 - validSkill)
  }

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

  // Usar estadísticas del backend o generar por defecto
  const getPlayerStats = (player: Player) => {
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
    // Si no, generar basado en skill_level
    const validSkillLevel = Math.max(1, Math.min(5, player.skill_level || 1))
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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header de la tabla */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
        <h3 className="text-lg font-semibold">Lista de Jugadores</h3>
        <p className="text-gray-300 text-sm">{players.length} jugador{players.length !== 1 ? 'es' : ''} encontrado{players.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jugador
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nivel
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estadísticas
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Información
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.map((player) => {
              const stats = getPlayerStats(player)
              const age = calculateAge(player.date_of_birth)
              const position = player.position_specific?.abbreviation || player.position_zone?.abbreviation || 'N/A'
              const validSkillLevel = Math.max(1, Math.min(5, player.skill_level || 1))

              return (
                <tr key={player.id} className="hover:bg-gray-50 transition-colors duration-200">
                  {/* Columna Jugador */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">#{player.jersey_number || 'N/A'}</div>
                      </div>
                    </div>
                  </td>

                  {/* Columna Posición */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getPositionColor(position)}`}>
                      {position}
                    </span>
                  </td>

                  {/* Columna Equipo */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.team?.name || 'Sin equipo'}</div>
                  </td>

                  {/* Columna Nivel */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400 text-sm">{getSkillStars(validSkillLevel)}</span>
                      <span className="text-sm text-gray-500">Nivel {validSkillLevel}</span>
                    </div>
                  </td>

                  {/* Columna Estadísticas */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-500">RIT</div>
                        <div className={`font-bold ${getStatColor(stats.rit)}`}>{stats.rit}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">TIR</div>
                        <div className={`font-bold ${getStatColor(stats.tir)}`}>{stats.tir}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">PAS</div>
                        <div className={`font-bold ${getStatColor(stats.pas)}`}>{stats.pas}</div>
                      </div>
                    </div>
                  </td>

                  {/* Columna Información */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 space-y-1">
                      {age && <div>Edad: {age} años</div>}
                      {player.height && <div>Altura: {player.height}cm</div>}
                      {player.weight && <div>Peso: {player.weight}kg</div>}
                    </div>
                  </td>

                  {/* Columna Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit?.(player)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Editar jugador"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete?.(player.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Eliminar jugador"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {players.length === 0 && (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500 text-sm">No se encontraron jugadores</div>
        </div>
      )}
    </div>
  )
}

export default PlayerListView 