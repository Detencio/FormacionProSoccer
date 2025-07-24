'use client'

import { useState, useRef, useEffect } from 'react'

interface Player {
  id: number
  name: string
  skill: number
  position: string
  teamId?: number
  teamName?: string
  photo?: string
}

interface TeamFormationProps {
  players: Player[]
  formation: string
  onPlayerDragStart?: (player: Player) => void
  onPlayerDragOver?: (e: React.DragEvent) => void
  onPlayerDrop?: () => void
  onPositionChange?: (playerId: number, newPosition: string) => void
  onPlayerMove?: (playerId: number, fromPosition: string, toPosition: string) => void
  editable?: boolean
  customPlayersPerTeam?: number
  isTeamA?: boolean
}

export default function TeamFormation({ 
  players, 
  formation, 
  onPlayerDragStart, 
  onPlayerDragOver, 
  onPlayerDrop,
  onPositionChange,
  onPlayerMove,
  editable = false,
  customPlayersPerTeam,
  isTeamA = true
}: TeamFormationProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [playerPositions, setPlayerPositions] = useState<{[key: number]: {x: number, y: number}}>({})
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const fieldRef = useRef<HTMLDivElement>(null)

  const playersPerTeam = customPlayersPerTeam || (formation === '1-2-1' ? 4 : 
                                                  formation === '1-2-2' ? 5 : 
                                                  formation === '2-2-2' ? 7 : 11)

  // Posiciones iniciales realistas en el campo
  const getInitialPositions = (formation: string, isTeamA: boolean) => {
    switch (formation) {
      case '1-2-1': // 4 jugadores
        return [
          { id: 'portero', position: 'Portero', x: isTeamA ? 12 : 88, y: 50 },
          { id: 'defensa1', position: 'Defensa', x: isTeamA ? 35 : 65, y: 35 },
          { id: 'defensa2', position: 'Defensa', x: isTeamA ? 35 : 65, y: 65 },
          { id: 'delantero', position: 'Delantero', x: isTeamA ? 65 : 35, y: 50 }
        ]
      case '1-2-2': // 5 jugadores
        return [
          { id: 'portero', position: 'Portero', x: isTeamA ? 12 : 88, y: 50 },
          { id: 'defensa1', position: 'Defensa', x: isTeamA ? 35 : 65, y: 35 },
          { id: 'defensa2', position: 'Defensa', x: isTeamA ? 35 : 65, y: 65 },
          { id: 'delantero1', position: 'Delantero', x: isTeamA ? 65 : 35, y: 35 },
          { id: 'delantero2', position: 'Delantero', x: isTeamA ? 65 : 35, y: 65 }
        ]
      case '2-2-2': // 7 jugadores
        return [
          { id: 'portero', position: 'Portero', x: isTeamA ? 12 : 88, y: 50 },
          { id: 'defensa1', position: 'Defensa', x: isTeamA ? 30 : 70, y: 30 },
          { id: 'defensa2', position: 'Defensa', x: isTeamA ? 30 : 70, y: 70 },
          { id: 'medio1', position: 'Mediocampista', x: isTeamA ? 50 : 50, y: 35 },
          { id: 'medio2', position: 'Mediocampista', x: isTeamA ? 50 : 50, y: 65 },
          { id: 'delantero1', position: 'Delantero', x: isTeamA ? 70 : 30, y: 35 },
          { id: 'delantero2', position: 'Delantero', x: isTeamA ? 70 : 30, y: 65 }
        ]
      default:
        return []
    }
  }

  const initialPositions = getInitialPositions(formation, isTeamA)

  const getPlayerInitials = (playerName: string) => {
    const names = playerName.split(' ')
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
    }
    return playerName.charAt(0).toUpperCase()
  }

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Portero': return 'bg-red-500'
      case 'Defensa': return 'bg-blue-500'
      case 'Mediocampista': return 'bg-green-500'
      case 'Delantero': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const handlePlayerClick = (player: Player) => {
    if (editable && !isDragging) {
      setSelectedPlayer(player)
      setShowPositionModal(true)
    }
  }

  const handlePositionChange = (newPosition: string) => {
    if (selectedPlayer && onPositionChange) {
      onPositionChange(selectedPlayer.id, newPosition)
      setShowPositionModal(false)
      setSelectedPlayer(null)
    }
  }

  // NUEVO SISTEMA DE DRAG AND DROP - PRUEBAS EXHAUSTIVAS
  const handleMouseDown = (e: React.MouseEvent, player: Player) => {
    if (!editable) return
    
    console.log('🔵 FORMATION - Mouse down on player:', player.name)
    
    e.preventDefault()
    e.stopPropagation()
    
    setDraggedPlayer(player)
    setIsDragging(true)
    setMousePosition({ x: e.clientX, y: e.clientY })
    
    console.log('🔵 FORMATION - DRAG STARTED - Player:', player.name)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggedPlayer || !fieldRef.current) {
      console.log('🔴 FORMATION - Mouse move but not dragging or no field ref')
      return
    }
    
    e.preventDefault()
    
    console.log('🟡 FORMATION - Mouse move:', e.clientX, e.clientY)
    
    const rect = fieldRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    
    console.log('🟡 FORMATION - New position:', x, y)
    
    setMousePosition({ x: e.clientX, y: e.clientY })
    
    setPlayerPositions(prev => ({
      ...prev,
      [draggedPlayer.id]: { x, y }
    }))
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !draggedPlayer) {
      console.log('🔴 FORMATION - Mouse up but not dragging')
      return
    }
    
    console.log('🟢 FORMATION - Mouse up for player:', draggedPlayer.name)
    
    if (onPlayerMove) {
      onPlayerMove(draggedPlayer.id, 'current', 'new')
    }
    
    // Limpiar estado
    setIsDragging(false)
    setDraggedPlayer(null)
    
    console.log('🟢 FORMATION - DRAG ENDED - Player:', draggedPlayer.name)
  }

  // Usar useEffect para manejar los event listeners (TÉCNICA DEL SIMPLEDRAGTEST)
  useEffect(() => {
    if (isDragging) {
      console.log('🔵 FORMATION - Adding event listeners')
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      // Cambiar cursor
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      
      return () => {
        console.log('🟢 FORMATION - Removing event listeners')
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        
        // Restaurar cursor
        document.body.style.cursor = 'default'
        document.body.style.userSelect = 'auto'
      }
    }
  }, [isDragging])

  // Distribuir jugadores a posiciones iniciales
  const distributePlayers = () => {
    const distributed = [...players]
    const usedPlayers = new Set()
    
    initialPositions.forEach((pos, index) => {
      let player = distributed.find(p => 
        p.position === pos.position && !usedPlayers.has(p.id)
      )
      
      if (!player) {
        player = distributed.find(p => !usedPlayers.has(p.id))
      }
      
      if (player) {
        usedPlayers.add(player.id)
        if (!playerPositions[player.id]) {
          setPlayerPositions(prev => ({
            ...prev,
            [player.id]: { x: pos.x, y: pos.y }
          }))
        }
      }
    })
    
    return distributed
  }

  const distributedPlayers = distributePlayers()

  return (
    <div className="relative">
      {/* Cancha de fútbol realista */}
      <div 
        ref={fieldRef}
        className="relative w-full h-96 bg-gradient-to-b from-green-600 to-green-800 rounded-lg overflow-hidden border-2 border-white shadow-lg"
        style={{ 
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: isDragging ? 'none' : 'auto'
        }}
      >
        {/* Líneas del campo */}
        <div className="absolute inset-0">
          {/* Línea central */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white"></div>
          
          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
          
          {/* Áreas de arco rectangulares COMPLETAS */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-16 h-24 border-r-2 border-white border-t-2 border-b-2"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-16 h-24 border-l-2 border-white border-t-2 border-b-2"></div>
          
          {/* Líneas de área */}
          <div className="absolute top-0 left-0 right-0 h-8 border-b border-white"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-white"></div>
        </div>

        {/* Jugadores posicionados */}
        {distributedPlayers.map((player, index) => {
          const position = playerPositions[player.id] || { x: 50, y: 50 }
          const isPlayerDragging = draggedPlayer?.id === player.id
          
          return (
            <div
              key={`player-${player.id}-${index}`}
              className={`absolute ${isPlayerDragging ? 'z-50' : ''}`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg border-2 border-white relative ${
                  editable ? 'hover:border-yellow-400' : ''
                } ${isPlayerDragging ? 'shadow-2xl scale-110' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, player)}
                onClick={() => handlePlayerClick(player)}
                style={{ 
                  cursor: editable ? (isPlayerDragging ? 'grabbing' : 'grab') : 'pointer',
                  userSelect: 'none',
                  pointerEvents: 'auto'
                }}
              >
                <div className="text-white text-xs font-bold text-center leading-tight">
                  {getPlayerInitials(player.name)}
                </div>
                {/* Estrella sobrepuesta */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs text-white font-bold">{player.skill}</span>
                </div>
                {editable && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✏️</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Información de formación */}
        <div className="absolute top-2 left-2">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded font-bold">
            {formation} ({playersPerTeam} jugadores)
          </div>
        </div>

        {/* Contador de jugadores */}
        <div className="absolute top-2 right-2">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded font-bold">
            {players.length}/{playersPerTeam}
          </div>
        </div>

        {/* Instrucciones de drag and drop */}
        {editable && (
          <div className="absolute bottom-2 left-2">
            <div className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
              Click y arrastra para mover jugadores
            </div>
          </div>
        )}

        {/* Debug info */}
        {editable && (
          <div className="absolute bottom-2 right-2">
            <div className="bg-red-600/80 text-white text-xs px-2 py-1 rounded">
              {isDragging ? 'Arrastrando...' : 'Listo'}
            </div>
          </div>
        )}

        {/* Mouse position debug */}
        {editable && isDragging && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-yellow-600/80 text-white text-xs px-2 py-1 rounded">
              Mouse: {mousePosition.x}, {mousePosition.y}
            </div>
          </div>
        )}

        {/* Formation debug */}
        {editable && (
          <div className="absolute top-2 left-2">
            <div className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
              Dragging: {isDragging ? 'SÍ' : 'NO'}
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600 font-medium">Arquero</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600 font-medium">Defensa</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 font-medium">Medio</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600 font-medium">Delantero</span>
        </div>
      </div>

      {/* Modal para cambiar posición */}
      {showPositionModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cambiar Posición de {selectedPlayer.name}
            </h3>
            
            <div className="space-y-3">
              {['Portero', 'Defensa', 'Mediocampista', 'Delantero'].map((pos, index) => (
                <button
                  key={`modal-position-${pos}-${index}`}
                  onClick={() => handlePositionChange(pos)}
                  className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getPositionColor(pos)}`}></div>
                    <span className="font-medium">{pos}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowPositionModal(false)
                  setSelectedPlayer(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}