'use client'

import React, { useState } from 'react'
import { Player } from '@/types'
import PlayerMoveModal from './PlayerMoveModal'

interface FootballFieldProps {
  team: {
    starters: Player[]
    substitutes: Player[]
  }
  teamName: string
  teamColor: string
  formation?: string
  onPlayerClick?: (player: Player) => void
  onPlayerMove?: (
    playerId: number,
    fromTeam: 'home' | 'away',
    fromRole: 'starter' | 'substitute',
    toTeam: 'home' | 'away',
    toRole: 'starter' | 'substitute'
  ) => void
}

const FootballField: React.FC<FootballFieldProps> = ({
  team,
  teamName,
  teamColor,
  formation = '4-4-2',
  onPlayerClick,
  onPlayerMove
}) => {
  const [moveModal, setMoveModal] = useState<{
    isOpen: boolean
    player: Player | null
    currentTeam: 'home' | 'away'
    currentRole: 'starter' | 'substitute'
  }>({
    isOpen: false,
    player: null,
    currentTeam: 'home',
    currentRole: 'starter'
  })

  // Configuración de posiciones según la formación
  const getFormationPositions = (formation: string) => {
    const positions = {
      '4-4-2': [
        { x: 50, y: 90, role: 'POR' }, // Portero
        { x: 15, y: 75, role: 'DEF' }, // Lateral Izquierdo
        { x: 35, y: 75, role: 'DEF' }, // Defensa Central Izquierdo
        { x: 65, y: 75, role: 'DEF' }, // Defensa Central Derecho
        { x: 85, y: 75, role: 'DEF' }, // Lateral Derecho
        { x: 15, y: 50, role: 'MED' }, // Mediocampista Izquierdo
        { x: 35, y: 50, role: 'MED' }, // Mediocampista Central Izquierdo
        { x: 65, y: 50, role: 'MED' }, // Mediocampista Central Derecho
        { x: 85, y: 50, role: 'MED' }, // Mediocampista Derecho
        { x: 35, y: 25, role: 'DEL' }, // Delantero Izquierdo
        { x: 65, y: 25, role: 'DEL' }  // Delantero Derecho
      ],
      '4-3-3': [
        { x: 50, y: 90, role: 'POR' },
        { x: 15, y: 75, role: 'DEF' },
        { x: 35, y: 75, role: 'DEF' },
        { x: 65, y: 75, role: 'DEF' },
        { x: 85, y: 75, role: 'DEF' },
        { x: 35, y: 50, role: 'MED' },
        { x: 50, y: 50, role: 'MED' },
        { x: 65, y: 50, role: 'MED' },
        { x: 25, y: 25, role: 'DEL' },
        { x: 50, y: 25, role: 'DEL' },
        { x: 75, y: 25, role: 'DEL' }
      ],
      '3-5-2': [
        { x: 50, y: 90, role: 'POR' },
        { x: 35, y: 75, role: 'DEF' },
        { x: 50, y: 75, role: 'DEF' },
        { x: 65, y: 75, role: 'DEF' },
        { x: 15, y: 50, role: 'MED' },
        { x: 35, y: 50, role: 'MED' },
        { x: 50, y: 50, role: 'MED' },
        { x: 65, y: 50, role: 'MED' },
        { x: 85, y: 50, role: 'MED' },
        { x: 40, y: 25, role: 'DEL' },
        { x: 60, y: 25, role: 'DEL' }
      ]
    }
    return positions[formation as keyof typeof positions] || positions['4-4-2']
  }

  const formationPositions = getFormationPositions(formation)

  const handlePlayerClick = (player: Player, team: 'home' | 'away', role: 'starter' | 'substitute') => {
    if (onPlayerMove) {
      setMoveModal({
        isOpen: true,
        player,
        currentTeam: team,
        currentRole: role
      })
    } else {
      onPlayerClick?.(player)
    }
  }

  const handleCloseModal = () => {
    setMoveModal({
      isOpen: false,
      player: null,
      currentTeam: 'home',
      currentRole: 'starter'
    })
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-4">
          <h3 className={`text-xl font-bold ${teamColor}`}>{teamName}</h3>
          <p className="text-sm text-gray-600">Formación: {formation}</p>
        </div>

        {/* Cancha de Fútbol usando imagen de fondo */}
        <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden"> {/* Contenedor principal */}
          {/* Imagen de la cancha como fondo */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/soccer-field.png')`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              width: '110%', // Reducimos un poco el ancho
              left: '-5%' // Ajustamos el centrado
            }}
          />
          
          {/* Jugadores Titulares */}
          {team.starters.map((player, index) => {
            const position = formationPositions[index]
            if (!position) return null

            return (
              <div
                key={`starter-${player.id}`}
                className={`absolute w-14 h-14 ${teamColor} rounded-full border-3 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
                onClick={() => handlePlayerClick(player, teamName === 'Equipo A' ? 'home' : 'away', 'starter')}
                title={`${player.name} - ${player.position_specific?.abbreviation || player.position_zone.abbreviation} (Click para mover)`}
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-white text-xs font-bold">
                  <div className="text-[10px] leading-none font-semibold">{player.name.split(' ')[0]}</div>
                  <div className="text-[8px] leading-none opacity-90">
                    {player.position_specific?.abbreviation || player.position_zone.abbreviation}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lista de Suplentes */}
        {team.substitutes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Suplentes ({team.substitutes.length})</h4>
            <div className="grid grid-cols-2 gap-2">
              {team.substitutes.map((player) => (
                <div
                  key={`substitute-${player.id}`}
                  className={`p-2 ${teamColor} rounded-lg text-white text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handlePlayerClick(player, teamName === 'Equipo A' ? 'home' : 'away', 'substitute')}
                  title={`${player.name} - ${player.position_specific?.abbreviation || player.position_zone.abbreviation} (Click para mover)`}
                >
                  <div className="font-semibold truncate">{player.name}</div>
                  <div className="text-[10px] opacity-90">
                    {player.position_specific?.abbreviation || player.position_zone.abbreviation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estadísticas del Equipo */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-gray-900">{team.starters.length}</div>
              <div className="text-gray-600">Titulares</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{team.substitutes.length}</div>
              <div className="text-gray-600">Suplentes</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {Math.round(
                  [...team.starters, ...team.substitutes].reduce((acc, p) => acc + p.skill_level, 0) / 
                  (team.starters.length + team.substitutes.length)
                )}
              </div>
              <div className="text-gray-600">Promedio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mover jugadores */}
      <PlayerMoveModal
        isOpen={moveModal.isOpen}
        onClose={handleCloseModal}
        player={moveModal.player}
        currentTeam={moveModal.currentTeam}
        currentRole={moveModal.currentRole}
        onMovePlayer={onPlayerMove || (() => {})}
      />
    </>
  )
}

export default FootballField 