'use client'

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Player, TeamSection, TeamFormation } from '@/types'
import SwapPlayerModal from './SwapPlayerModal'

interface FootballFieldProps {
  team: TeamSection
  teamName: string
  teamColor: string
  gameType: '5v5' | '7v7' | '11v11'
  formation?: TeamFormation | null
  onPlayerMove?: (
    playerId: number,
    fromTeam: 'home' | 'away',
    fromRole: 'starter' | 'substitute',
    toTeam: 'home' | 'away',
    toRole: 'starter' | 'substitute'
  ) => void
  onSwapPlayer?: (playerId: number) => void
  onSwapTwoPlayers?: (player1Id: number, player2Id: number) => void
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
  gameType = '5v5',
  formation,
  onPlayerMove,
  onSwapPlayer,
  onSwapTwoPlayers
}) => {
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  const [dropZone, setDropZone] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [customPositions, setCustomPositions] = useState<{ [playerId: number]: Position }>({})
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [selectedSubstitute, setSelectedSubstitute] = useState<Player | null>(null)
  const [lastTeamIds, setLastTeamIds] = useState<string>('')
  const fieldRef = useRef<HTMLDivElement>(null)

  // Limpiar posiciones personalizadas solo cuando se regeneren completamente los equipos
  useEffect(() => {
    const currentTeamIds = team.starters.map(p => p.id).sort().join(',')
    
    // Solo limpiar si es una regeneración completa (cambio drástico en la composición)
    if (lastTeamIds && lastTeamIds !== currentTeamIds) {
      // Verificar si es un cambio drástico (más de 2 jugadores diferentes)
      const lastIds = lastTeamIds.split(',').map(Number)
      const currentIds = currentTeamIds.split(',').map(Number)
      const differentPlayers = lastIds.filter(id => !currentIds.includes(id)).length
      
      if (differentPlayers > 2) {
        // console.log('FootballField - Regeneración completa detectada, limpiando posiciones personalizadas')
        setCustomPositions({})
      }
    }
    
    setLastTeamIds(currentTeamIds)
  }, [team.starters.map(p => p.id).sort().join(','), lastTeamIds])

  const isTeamA = teamName === 'Equipo A'

  // Limpiar modal después de un swap exitoso
  useEffect(() => {
    if (!showSwapModal && selectedSubstitute) {
      // Si el modal se cerró pero aún hay un suplente seleccionado, limpiarlo
      setSelectedSubstitute(null)
    }
  }, [showSwapModal, selectedSubstitute])

  // Forzar re-render cuando cambie el equipo
  useEffect(() => {
    // console.log('FootballField: Equipo actualizado:', {
    //   teamName,
    //   starters: team.starters.length,
    //   substitutes: team.substitutes.length
    // })
    
    // Solo limpiar modal si está abierto Y el equipo realmente cambió
    // (no cuando se abre el modal por primera vez)
    if (showSwapModal && selectedSubstitute) {
      // Verificar si el suplente seleccionado ya no existe en el equipo
      const substituteStillExists = team.substitutes.some(p => p.id === selectedSubstitute.id)
      if (!substituteStillExists) {
        setShowSwapModal(false)
        setSelectedSubstitute(null)
      }
    }
  }, [team, teamName, showSwapModal, selectedSubstitute])

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
      // Fútbol 11: Todas las posiciones
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
    const formationPositions = getFormationPositions(gameType, formation?.name || '4-4-2', isTeamA)
    const players = [...team.starters]
    const assignedPositions: { player: Player; position: Position }[] = []
    const unassignedPlayers: Player[] = []

    // Verificar si hay posiciones personalizadas
    const hasCustomPositions = Object.keys(customPositions).length > 0
    // console.log('FootballField - Custom positions:', customPositions)
    // console.log('FootballField - Has custom positions:', hasCustomPositions)

    if (hasCustomPositions) {
      // Si hay posiciones personalizadas, usarlas primero
      players.forEach(player => {
        if (customPositions[player.id]) {
          // console.log(`FootballField - Using custom position for ${player.name}:`, customPositions[player.id])
          assignedPositions.push({ player, position: customPositions[player.id] })
        }
      })

      // Para jugadores sin posición personalizada, usar posiciones de formación
      const playersWithoutCustom = players.filter(p => !customPositions[p.id])
      const usedPositions = assignedPositions.map(ap => ap.position)
      const availablePositions = formationPositions.filter(p => 
        !usedPositions.some(up => up.x === p.x && up.y === p.y)
      )

      playersWithoutCustom.forEach((player, index) => {
        if (availablePositions[index]) {
          // console.log(`FootballField - Using formation position for ${player.name}:`, availablePositions[index])
          assignedPositions.push({ player, position: availablePositions[index] })
        } else {
          unassignedPlayers.push(player)
        }
      })
    } else {
      // console.log('FootballField - Using formation positions for all players')
      // Lógica original para asignar según roles
      const positionsByRole: { [key: string]: Position[] } = {
        'POR': formationPositions.filter(p => p.role === 'POR'),
        'DEF': formationPositions.filter(p => p.role === 'DEF'),
        'MED': formationPositions.filter(p => p.role === 'MED'),
        'DEL': formationPositions.filter(p => p.role === 'DEL')
      }

      // Asignar porteros primero
      const goalkeepers = players.filter(p => {
        const specificPos = p.position_specific?.abbreviation
        const zonePos = p.position_zone?.abbreviation
        return String(specificPos).includes('POR') || String(zonePos).includes('POR')
      })
      goalkeepers.forEach((player, index) => {
        if (positionsByRole['POR'][index]) {
          assignedPositions.push({ player, position: positionsByRole['POR'][index] })
        }
      })

      // Asignar defensas
      const defenders = players.filter(p => {
        const specificPos = p.position_specific?.abbreviation
        const zonePos = p.position_zone?.abbreviation
        return String(specificPos).includes('DEF') || String(zonePos).includes('DEF')
      })
      defenders.forEach((player, index) => {
        if (positionsByRole['DEF'][index]) {
          assignedPositions.push({ player, position: positionsByRole['DEF'][index] })
        }
      })

      // Asignar mediocampistas
      const midfielders = players.filter(p => {
        const specificPos = p.position_specific?.abbreviation
        const zonePos = p.position_zone?.abbreviation
        return String(specificPos).includes('MED') || String(zonePos).includes('MED')
      })
      midfielders.forEach((player, index) => {
        if (positionsByRole['MED'][index]) {
          assignedPositions.push({ player, position: positionsByRole['MED'][index] })
        }
      })

      // Asignar delanteros
      const forwards = players.filter(p => {
        const specificPos = p.position_specific?.abbreviation
        const zonePos = p.position_zone?.abbreviation
        return String(specificPos).includes('DEL') || String(zonePos).includes('DEL')
      })
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
    }

    // console.log('FootballField - Final assigned positions:', assignedPositions.map(ap => ({ player: ap.player.name, position: ap.position })))
    return { assignedPositions, unassignedPlayers }
  }, [team.starters, team.starters.length, gameType, formation, isTeamA, teamName, customPositions])

  // Funciones para drag and drop
  const handleMouseDown = useCallback((e: React.MouseEvent, player: Player) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!fieldRef.current) return
    
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setDraggedPlayer(player)
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedPlayer || !fieldRef.current) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Guardar la nueva posición personalizada del jugador
    setCustomPositions(prev => ({
      ...prev,
      [draggedPlayer.id]: { 
        x, 
        y, 
        role: draggedPlayer.position_specific?.abbreviation || draggedPlayer.position_zone?.abbreviation || 'MED',
        zone: 'midfield' // Por defecto, pero se puede mejorar
      }
    }))
    
    setIsDragging(false)
  }, [isDragging, draggedPlayer])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedPlayer || !fieldRef.current) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Guardar la nueva posición personalizada del jugador
    setCustomPositions(prev => ({
      ...prev,
      [draggedPlayer.id]: { 
        x, 
        y, 
        role: draggedPlayer.position_specific?.abbreviation || draggedPlayer.position_zone?.abbreviation || 'MED',
        zone: 'midfield' // Por defecto, pero se puede mejorar
      }
    }))
    
    setDraggedPlayer(null)
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
    if (gameType === '5v5') return { formation: '1-2-2', label: 'BabyFutbol (Amistoso)' }
    if (gameType === '7v7') return { formation: '2-3-1', label: 'Futbolito (Amistoso)' }
    return { formation: formation?.name || '4-4-2', label: 'Fútbol 11 (Oficial)' }
  }
  const { formation: formationLabel, label: gameTypeLabel } = getFormationNameAndLabel()

  const handleSwapPlayer = useCallback((playerId: number) => {
    // console.log('handleSwapPlayer called for playerId:', playerId)
    
    // Buscar si es un suplente
    const substitute = team.substitutes.find(p => p.id === playerId)
    if (substitute) {
      // console.log('Suplente encontrado, abriendo modal:', substitute.name)
      setSelectedSubstitute(substitute)
      setShowSwapModal(true)
      return
    }
    
    // Si es titular, NO hacer intercambio automático
    // Solo permitir movimiento de posición en la cancha
    // console.log('Titular clickeado, permitiendo solo movimiento de posición')
  }, [team.substitutes])

  const handleSwapConfirm = useCallback((substituteId: number, starterId: number) => {
    // console.log('Confirmando intercambio:', { substituteId, starterId })
    // console.log('FootballField - Posiciones personalizadas ANTES del intercambio:', customPositions)
    
    // Transferir posiciones personalizadas en lugar de limpiarlas
    setCustomPositions(prev => {
      const newPositions = { ...prev }
      
      // Obtener las posiciones personalizadas de ambos jugadores
      const substitutePosition = newPositions[substituteId]
      const starterPosition = newPositions[starterId]
      
      // console.log('FootballField - Posiciones encontradas:', {
      //   substitutePosition,
      //   starterPosition
      // })
      
      // Limpiar las posiciones actuales
      delete newPositions[substituteId]
      delete newPositions[starterId]
      
      // Transferir las posiciones personalizadas
      if (substitutePosition) {
        newPositions[starterId] = substitutePosition // El suplente va a la posición del titular
        // console.log(`FootballField - Transferida posición de suplente ${substituteId} a titular ${starterId}:`, substitutePosition)
      }
      if (starterPosition) {
        newPositions[substituteId] = starterPosition // El titular va a la posición del suplente
        // console.log(`FootballField - Transferida posición de titular ${starterId} a suplente ${substituteId}:`, starterPosition)
      }
      
      // console.log('FootballField - Posiciones personalizadas DESPUÉS del intercambio:', newPositions)
      return newPositions
    })
    
    if (onSwapTwoPlayers) {
      // Intercambiar directamente las posiciones
      onSwapTwoPlayers(substituteId, starterId)
    }
    
    setShowSwapModal(false)
    setSelectedSubstitute(null)
  }, [onSwapTwoPlayers, customPositions])

  const handleSwapCancel = useCallback(() => {
    setShowSwapModal(false)
    setSelectedSubstitute(null)
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
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

      {/* Cancha de Fútbol */}
      <div 
        ref={fieldRef}
        className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden border-2 border-green-600 pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
          const customPosition = customPositions[player.id]
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
              onMouseDown={(e) => handleMouseDown(e, player)}
              onClick={() => handleSwapPlayer(player.id)}
              title={`${player.name} - ${player.position_specific?.abbreviation || player.position_zone?.abbreviation} (Arrastra para mover, clic para intercambiar)`}
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-white text-xs font-bold">
                  <div className="text-[10px] leading-none font-semibold">{player.name.split(' ')[0]}</div>
                  <div className="text-[8px] leading-none opacity-90">
                  {player.position_specific?.abbreviation || player.position_zone?.abbreviation}
                </div>
                </div>
              </div>
            )
          })}

        {/* Jugador siendo arrastrado */}
        {draggedPlayer && (
          <div
            className={`absolute w-16 h-16 ${teamColor} rounded-full border-3 border-white shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-20 opacity-80 pointer-events-none`}
            style={{
              left: `${draggedPlayer.custom_position?.x}px`,
              top: `${draggedPlayer.custom_position?.y}px`
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center text-white text-xs font-bold">
              <div className="text-[10px] leading-none font-semibold">{draggedPlayer.name.split(' ')[0]}</div>
              <div className="text-[8px] leading-none opacity-90">
                {draggedPlayer.position_specific?.abbreviation || draggedPlayer.position_zone?.abbreviation}
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
                onClick={() => handleSwapPlayer(player.id)}
                title={`${player.name} - ${player.position_specific?.abbreviation || player.position_zone?.abbreviation} (Click para intercambiar)`}
                >
                  <div className="font-semibold truncate">{player.name}</div>
                  <div className="text-[10px] opacity-90">
                  {player.position_specific?.abbreviation || player.position_zone?.abbreviation}
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

      {/* Modal de Intercambio */}
      {showSwapModal && selectedSubstitute && (
        <SwapPlayerModal
          isOpen={showSwapModal}
          substitute={selectedSubstitute}
          availableStarters={team.starters}
          onConfirm={handleSwapConfirm}
          onCancel={handleSwapCancel}
        />
      )}
    </div>
  )
}

export default FootballField 