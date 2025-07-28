'use client'

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
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
  gameType?: '5v5' | '7v7' | '11v11'
  onPlayerClick?: (player: Player) => void
  onPlayerMove?: (
    playerId: number,
    fromTeam: 'home' | 'away',
    fromRole: 'starter' | 'substitute',
    toTeam: 'home' | 'away',
    toRole: 'starter' | 'substitute'
  ) => void
}

interface Position {
  x: number
  y: number
  role: string
  zone: 'goalkeeper' | 'defense' | 'midfield' | 'attack'
}

const FootballField: React.FC<FootballFieldProps> = ({
  team,
  teamName,
  teamColor,
  formation = '4-4-2',
  gameType = '11v11',
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

  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [playerPositions, setPlayerPositions] = useState<Record<number, { x: number; y: number }>>({})
  const fieldRef = useRef<HTMLDivElement>(null)

  // Efecto para manejar eventos globales y cancelar drag and drop
  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging && draggedPlayer) {
        // Si el click fue fuera del área de la cancha, cancelar el drag
        if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) {
          setDraggedPlayer(null)
          setDragPosition(null)
          setIsDragging(false)
        }
      }
    }

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDragging) {
        setDraggedPlayer(null)
        setDragPosition(null)
        setIsDragging(false)
      }
    }

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp)
      document.addEventListener('keydown', handleGlobalKeyDown)
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isDragging, draggedPlayer])

  const isTeamA = teamName === 'Equipo A'

  // Configuración de posiciones según el tipo de juego y formación
  const getFormationPositions = (gameType: string, formation: string, isTeamA: boolean) => {
    if (gameType === '5v5') {
      // BabyFutbol: 1-2-2 (Arquero, 2 Defensas, 2 Delanteros)
      return [
        { x: 50, y: isTeamA ? 85 : 15, role: 'POR', zone: 'goalkeeper' as const }, // Arquero abajo
        { x: 30, y: isTeamA ? 60 : 40, role: 'DEF', zone: 'defense' as const },   // Defensa izquierda
        { x: 70, y: isTeamA ? 60 : 40, role: 'DEF', zone: 'defense' as const },   // Defensa derecha
        { x: 30, y: isTeamA ? 35 : 65, role: 'DEL', zone: 'attack' as const },    // Delantero izquierdo arriba
        { x: 70, y: isTeamA ? 35 : 65, role: 'DEL', zone: 'attack' as const }     // Delantero derecho arriba
      ]
    } else if (gameType === '7v7') {
      // Futbolito: 2-3-1 (2 Defensas, 3 Medios, 1 Delantero)
      return [
        { x: 50, y: isTeamA ? 85 : 15, role: 'POR', zone: 'goalkeeper' as const },
        { x: 30, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
        { x: 70, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
        { x: 25, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
        { x: 50, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
        { x: 75, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
        { x: 50, y: isTeamA ? 30 : 70, role: 'DEL', zone: 'attack' as const }
      ]
    } else {
      // Fútbol 11: Todas las posiciones (como antes)
      const basePositions = {
        '4-4-2': [
          { x: 50, y: isTeamA ? 85 : 15, role: 'POR', zone: 'goalkeeper' as const },
          { x: 20, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 40, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 60, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 80, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 20, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 40, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 60, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 80, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 35, y: isTeamA ? 30 : 70, role: 'DEL', zone: 'attack' as const },
          { x: 65, y: isTeamA ? 30 : 70, role: 'DEL', zone: 'attack' as const }
        ],
        '4-3-3': [
          { x: 50, y: isTeamA ? 85 : 15, role: 'POR', zone: 'goalkeeper' as const },
          { x: 20, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 40, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 60, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 80, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 35, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 50, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 65, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 25, y: isTeamA ? 30 : 70, role: 'DEL', zone: 'attack' as const },
          { x: 50, y: isTeamA ? 30 : 70, role: 'DEL', zone: 'attack' as const },
          { x: 75, y: isTeamA ? 30 : 70, role: 'DEL', zone: 'attack' as const }
        ],
        '3-5-2': [
          { x: 50, y: isTeamA ? 85 : 15, role: 'POR', zone: 'goalkeeper' as const },
          { x: 35, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 50, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 65, y: isTeamA ? 70 : 30, role: 'DEF', zone: 'defense' as const },
          { x: 15, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 35, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 50, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 65, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 85, y: isTeamA ? 50 : 50, role: 'MED', zone: 'midfield' as const },
          { x: 40, y: isTeamA ? 30 : 70, role: 'DEL', zone: 'attack' as const },
          { x: 60, y: isTeamA ? 30 : 70, role: 'DEL', zone: 'attack' as const }
        ]
      }
      return basePositions[formation as keyof typeof basePositions] || basePositions['4-4-2']
    }
  }

  // Función para asignar jugadores a posiciones según sus roles
  const assignPlayersToPositions = useMemo(() => {
    const formationPositions = getFormationPositions(gameType, formation, isTeamA)
    const players = [...team.starters]
    const assignedPositions: { player: Player; position: Position }[] = []
    const unassignedPlayers: Player[] = []

    // Primera pasada: asignar jugadores según su posición específica
    const positionsByRole: { [key: string]: Position[] } = {
      'POR': formationPositions.filter(p => p.role === 'POR'),
      'DEF': formationPositions.filter(p => p.role === 'DEF'),
      'MED': formationPositions.filter(p => p.role === 'MED'),
      'DEL': formationPositions.filter(p => p.role === 'DEL')
    }

    // Asignar porteros primero
    const goalkeepers = players.filter(p => 
      p.position_specific?.abbreviation === 'POR' || p.position_zone?.abbreviation === 'POR'
    )
    goalkeepers.forEach((player, index) => {
      if (positionsByRole['POR'][index]) {
        assignedPositions.push({ player, position: positionsByRole['POR'][index] })
      }
    })

    // Asignar defensas (incluye LD, LI, DFC, etc.)
    const defenders = players.filter(p => 
      p.position_specific?.abbreviation === 'DEF' || p.position_zone?.abbreviation === 'DEF' ||
      p.position_specific?.abbreviation === 'LD' || p.position_specific?.abbreviation === 'LI' ||
      p.position_specific?.abbreviation === 'DFC'
    )
    defenders.forEach((player, index) => {
      if (positionsByRole['DEF'][index]) {
        assignedPositions.push({ player, position: positionsByRole['DEF'][index] })
      }
    })

    // Asignar mediocampistas (incluye MC, MCD, MCO, MD, MI, etc.)
    const midfielders = players.filter(p => 
      p.position_specific?.abbreviation === 'MED' || p.position_zone?.abbreviation === 'MED' ||
      p.position_specific?.abbreviation === 'MC' || p.position_specific?.abbreviation === 'MCD' ||
      p.position_specific?.abbreviation === 'MCO' || p.position_specific?.abbreviation === 'MD' ||
      p.position_specific?.abbreviation === 'MI'
    )
    midfielders.forEach((player, index) => {
      if (positionsByRole['MED'][index]) {
        assignedPositions.push({ player, position: positionsByRole['MED'][index] })
      }
    })

    // Asignar delanteros (incluye DC, SD, ED, EI, etc.)
    const forwards = players.filter(p => 
      p.position_specific?.abbreviation === 'DEL' || p.position_zone?.abbreviation === 'DEL' ||
      p.position_specific?.abbreviation === 'DC' || p.position_specific?.abbreviation === 'SD' ||
      p.position_specific?.abbreviation === 'ED' || p.position_specific?.abbreviation === 'EI'
    )
    forwards.forEach((player, index) => {
      if (positionsByRole['DEL'][index]) {
        assignedPositions.push({ player, position: positionsByRole['DEL'][index] })
      }
    })

    // Segunda pasada: asignar jugadores sin posición específica
    const remainingPlayers = players.filter(p => 
      !assignedPositions.some(ap => ap.player.id === p.id)
    )

    // Obtener posiciones no asignadas
    const usedPositions = assignedPositions.map(ap => ap.position)
    const availablePositions = formationPositions.filter(p => 
      !usedPositions.some(up => up.x === p.x && up.y === p.y)
    )

    // Asignar jugadores restantes a posiciones disponibles
    remainingPlayers.forEach((player, index) => {
      if (availablePositions[index]) {
        assignedPositions.push({ player, position: availablePositions[index] })
      } else {
        unassignedPlayers.push(player)
      }
    })

    // Tercera pasada: si aún hay jugadores sin asignar, asignarlos a cualquier posición disponible
    if (unassignedPlayers.length > 0 && availablePositions.length > assignedPositions.length) {
      const remainingPositions = formationPositions.filter(p => 
        !assignedPositions.some(ap => ap.position.x === p.x && ap.position.y === p.y)
      )
      
      unassignedPlayers.forEach((player, index) => {
        if (remainingPositions[index]) {
          assignedPositions.push({ player, position: remainingPositions[index] })
        }
      })
    }

    // Debug: Log para verificar asignaciones
    console.log(`[FootballField] ${teamName}:`, {
      totalPlayers: players.length,
      assignedPositions: assignedPositions.length,
      unassignedPlayers: unassignedPlayers.length,
      formationPositions: formationPositions.length,
      gameType,
      formation
    })

    return { assignedPositions, unassignedPlayers }
  }, [team.starters, gameType, formation, isTeamA, teamName])

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

  // Funciones para drag and drop mejoradas
  const handleMouseDown = useCallback((e: React.MouseEvent, player: Player) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!fieldRef.current) return
    
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setDraggedPlayer(player)
    setDragPosition({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedPlayer || !fieldRef.current) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setDragPosition({ x: e.clientX, y: e.clientY })
  }, [isDragging, draggedPlayer])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedPlayer || !fieldRef.current) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Guardar la nueva posición del jugador
    setPlayerPositions(prev => ({
      ...prev,
      [draggedPlayer.id]: { x, y }
    }))
    
    setDraggedPlayer(null)
    setDragPosition(null)
    setIsDragging(false)
  }, [isDragging, draggedPlayer])

  // Obtener color de zona
  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'goalkeeper': return 'bg-yellow-200'
      case 'defense': return 'bg-blue-200'
      case 'midfield': return 'bg-green-200'
      case 'attack': return 'bg-red-200'
      default: return 'bg-gray-200'
    }
  }

  // Obtener formación y nombre local según el tipo de juego
  const getFormationNameAndLabel = () => {
    if (gameType === '5v5') return { formation: '1-2-2', label: 'BabyFutbol' }
    if (gameType === '7v7') return { formation: '2-3-1', label: 'Futbolito' }
    return { formation, label: 'Fútbol 11' }
  }
  const { formation: formationLabel, label: gameTypeLabel } = getFormationNameAndLabel()

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* Overlay invisible para capturar eventos fuera de la cancha */}
      {isDragging && (
        <div 
          className="fixed inset-0 z-50 pointer-events-auto"
          onClick={() => {
            setDraggedPlayer(null)
            setDragPosition(null)
            setIsDragging(false)
          }}
        />
      )}

      {/* Header de la cancha */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{teamName}</h3>
            <p className="text-sm text-gray-600">
              Formación: {formationLabel} ({gameTypeLabel})
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {assignPlayersToPositions.assignedPositions.length} jugadores
          </span>
        </div>
      </div>

      {/* Cancha de Fútbol mejorada */}
      <div 
        ref={fieldRef}
        className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden border-2 border-green-600 pointer-events-auto"
        onMouseMove={(e) => {
          // Solo manejar eventos si estamos arrastrando y dentro del área de la cancha
          if (draggedPlayer && fieldRef.current && fieldRef.current.contains(e.target as Node)) {
            handleMouseMove(e)
          }
        }}
        onMouseUp={(e) => {
          // Solo manejar eventos si estamos arrastrando y dentro del área de la cancha
          if (draggedPlayer && fieldRef.current && fieldRef.current.contains(e.target as Node)) {
            handleMouseUp(e)
          }
        }}
        onMouseLeave={(e) => {
          // Solo manejar eventos si estamos arrastrando y dentro del área de la cancha
          if (draggedPlayer && fieldRef.current && fieldRef.current.contains(e.target as Node)) {
            handleMouseUp(e)
          }
        }}
      >
        {/* Imagen de la cancha como fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url('/soccer-field.png')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            width: '110%',
            left: '-5%'
          }}
        />

        {/* Zonas de la cancha */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Zona del portero */}
          <div className={`absolute top-0 left-1/4 w-1/2 h-1/4 ${getZoneColor('goalkeeper')} opacity-20`}></div>
          <div className={`absolute bottom-0 left-1/4 w-1/2 h-1/4 ${getZoneColor('goalkeeper')} opacity-20`}></div>
          
          {/* Zona de defensa */}
          <div className={`absolute top-1/4 left-0 w-full h-1/4 ${getZoneColor('defense')} opacity-20`}></div>
          <div className={`absolute bottom-1/4 left-0 w-full h-1/4 ${getZoneColor('defense')} opacity-20`}></div>
          
          {/* Zona de mediocampo */}
          <div className={`absolute top-1/2 left-0 w-full h-1/4 ${getZoneColor('midfield')} opacity-20`}></div>
          
          {/* Zona de ataque */}
          <div className={`absolute top-3/4 left-0 w-full h-1/4 ${getZoneColor('attack')} opacity-20`}></div>
          <div className={`absolute bottom-3/4 left-0 w-full h-1/4 ${getZoneColor('attack')} opacity-20`}></div>
        </div>
        
        {/* Jugadores Asignados */}
        {assignPlayersToPositions.assignedPositions.map(({ player, position }) => {
          // Usar posición personalizada si existe, sino usar la posición asignada
          const customPosition = playerPositions[player.id]
          const finalPosition = customPosition || position

          return (
            <div
              key={`starter-${player.id}`}
              className={`absolute w-16 h-16 ${teamColor} rounded-full border-3 border-white shadow-lg cursor-move transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10 pointer-events-auto ${
                draggedPlayer?.id === player.id ? 'opacity-50' : ''
              }`}
              style={{
                left: `${finalPosition.x}%`,
                top: `${finalPosition.y}%`
              }}
              onMouseDown={(e) => {
                // Solo manejar eventos dentro del área de la cancha
                if (fieldRef.current && fieldRef.current.contains(e.target as Node)) {
                  e.preventDefault()
                  e.stopPropagation()
                  handleMouseDown(e, player)
                }
              }}
              onClick={(e) => {
                // Solo manejar clicks dentro del área de la cancha
                if (fieldRef.current && fieldRef.current.contains(e.target as Node)) {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePlayerClick(player, teamName === 'Equipo A' ? 'home' : 'away', 'starter')
                }
              }}
              title={`${player.name} - ${player.position_specific?.abbreviation || player.position_zone.abbreviation} (Arrastra para mover)`}
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

        {/* Jugador siendo arrastrado */}
        {draggedPlayer && dragPosition && (
          <div
            className={`absolute w-16 h-16 ${teamColor} rounded-full border-3 border-white shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-20 opacity-80 pointer-events-none`}
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center text-white text-xs font-bold">
              <div className="text-[10px] leading-none font-semibold">{draggedPlayer.name.split(' ')[0]}</div>
              <div className="text-[8px] leading-none opacity-90">
                {draggedPlayer.position_specific?.abbreviation || draggedPlayer.position_zone.abbreviation}
              </div>
            </div>
          </div>
        )}
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

      {/* Modal para mover jugadores */}
      <PlayerMoveModal
        isOpen={moveModal.isOpen}
        onClose={handleCloseModal}
        player={moveModal.player}
        currentTeam={moveModal.currentTeam}
        currentRole={moveModal.currentRole}
        onMovePlayer={onPlayerMove || (() => {})}
      />
    </div>
  )
}

export default FootballField 