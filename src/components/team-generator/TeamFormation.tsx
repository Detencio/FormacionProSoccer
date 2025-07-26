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
                                                  formation === '2-2-2' ? 7 : 
                                                  formation === '1-2-2-2' ? 7 : 11)

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
      case '1-2-2-2': // 7 jugadores (Futbolito)
        return [
          { id: 'portero', position: 'Portero', x: isTeamA ? 12 : 88, y: 50 },
          { id: 'defensa1', position: 'Defensa', x: isTeamA ? 25 : 75, y: 35 },
          { id: 'defensa2', position: 'Defensa', x: isTeamA ? 25 : 75, y: 65 },
          { id: 'medio1', position: 'Mediocampista', x: isTeamA ? 45 : 55, y: 35 },
          { id: 'medio2', position: 'Mediocampista', x: isTeamA ? 45 : 55, y: 65 },
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

  const getPositionAbbr = (position: string) => {
    switch (position) {
      case 'Portero': return 'GK'
      case 'Defensa': return 'DEF'
      case 'Mediocampista': return 'MID'
      case 'Delantero': return 'ST'
      default: return position.slice(0, 3).toUpperCase()
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

  // Sistema de drag and drop mejorado
  const handleMouseDown = (e: React.MouseEvent, player: Player) => {
    if (!editable) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setDraggedPlayer(player)
    setIsDragging(true)
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggedPlayer || !fieldRef.current) return
    
    e.preventDefault()
    
    const rect = fieldRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    
    setMousePosition({ x: e.clientX, y: e.clientY })
    
    setPlayerPositions(prev => ({
      ...prev,
      [draggedPlayer.id]: { x, y }
    }))
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !draggedPlayer) return
    
    if (onPlayerMove) {
      onPlayerMove(draggedPlayer.id, 'current', 'new')
    }
    
    setIsDragging(false)
    setDraggedPlayer(null)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        
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
      {/* Cancha de fútbol estilo profesional */}
      <div 
        ref={fieldRef}
        className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl"
        style={{ 
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: isDragging ? 'none' : 'auto'
        }}
      >
        {/* Fondo de la cancha verde oscuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-800 via-green-900 to-green-950"></div>
        
        {/* Patrón de césped sutil */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
            backgroundSize: '4px 4px'
          }}></div>
        </div>

        {/* Líneas del campo con estilo profesional */}
        <div className="absolute inset-0">
          {/* Línea central */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/90 shadow-lg"></div>
          
          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/90 rounded-full shadow-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
          
          {/* Áreas de arco */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-20 h-32 border-r-2 border-white/90 border-t-2 border-b-2"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-32 border-l-2 border-white/90 border-t-2 border-b-2"></div>
          
          {/* Líneas de área */}
          <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/90"></div>
          <div className="absolute bottom-0 left-0 right-0 h-12 border-t border-white/90"></div>
          
          {/* Puntos de penalti */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Jugadores posicionados - Estilo profesional */}
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
              {/* Tarjeta hexagonal del jugador */}
              <div
                className={`w-20 h-24 bg-gray-800 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-110 shadow-lg border-2 border-gray-600 relative ${
                  editable ? 'hover:border-green-400 hover:shadow-green-400/50' : ''
                } ${isPlayerDragging ? 'shadow-2xl scale-110 shadow-green-400/50' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, player)}
                onClick={() => handlePlayerClick(player)}
                style={{ 
                  cursor: editable ? (isPlayerDragging ? 'grabbing' : 'grab') : 'pointer',
                  userSelect: 'none',
                  pointerEvents: 'auto'
                }}
              >
                {/* Nombre del jugador */}
                <div className="text-white font-bold text-xs px-2 text-center leading-tight mb-1">
                  {player.name.length > 8 ? player.name.substring(0, 8) + '...' : player.name}
                </div>
                
                {/* Rol del jugador */}
                <div className="text-gray-300 text-xs text-center mb-1">
                  {player.position}
                </div>
                
                {/* Instrucción/Mentalidad */}
                <div className="text-gray-400 text-xs text-center mb-1">
                  {player.position === 'Portero' ? 'Defend' : 
                   player.position === 'Defensa' ? 'Defend' : 
                   player.position === 'Delantero' ? 'Attack' : 'Balanced'}
                </div>
                
                {/* Posición abreviada */}
                <div className={`w-6 h-6 ${getPositionColor(player.position)} rounded-full flex items-center justify-center shadow-lg border border-white`}>
                  <span className="text-xs text-white font-bold">
                    {getPositionAbbr(player.position)}
                  </span>
                </div>
                
                {/* Indicadores de habilidad */}
                <div className="absolute -top-1 -right-1 flex space-x-1">
                  {player.skill >= 4 && <span className="text-green-400 text-xs">+</span>}
                  {player.skill >= 5 && <span className="text-green-400 text-xs">+</span>}
                </div>
                
                {/* Indicador de edición */}
                {editable && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border border-white">
                    <span className="text-xs text-white">✏️</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Información de formación */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            {formation} ({playersPerTeam} jugadores)
          </div>
        </div>

        {/* Contador de jugadores */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            {players.length}/{playersPerTeam}
          </div>
        </div>

        {/* Instrucciones de drag and drop */}
        {editable && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              Click y arrastra para mover jugadores
            </div>
          </div>
        )}

        {/* Estado de arrastre */}
        {editable && (
          <div className="absolute bottom-4 right-4">
            <div className={`bg-black/50 text-white text-xs px-3 py-1 rounded-full ${isDragging ? 'animate-pulse' : ''}`}>
              {isDragging ? 'Arrastrando...' : 'Listo'}
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
          <span className="text-white font-medium">Arquero</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
          <span className="text-white font-medium">Defensa</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
          <span className="text-white font-medium">Medio</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
          <span className="text-white font-medium">Delantero</span>
        </div>
      </div>

      {/* Modal para cambiar posición */}
      {showPositionModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Cambiar Posición de {selectedPlayer.name}
            </h3>
            
            <div className="space-y-3">
              {['Portero', 'Defensa', 'Mediocampista', 'Delantero'].map((pos, index) => (
                <button
                  key={`modal-position-${pos}-${index}`}
                  onClick={() => handlePositionChange(pos)}
                  className="w-full p-4 text-left rounded-xl transition-all duration-300 hover:scale-105 bg-gray-700 hover:bg-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded-full ${getPositionColor(pos)} shadow-lg`}></div>
                    <span className="font-semibold text-white">{pos}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => {
                  setShowPositionModal(false)
                  setSelectedPlayer(null)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
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