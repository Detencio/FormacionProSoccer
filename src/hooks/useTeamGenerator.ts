import { useState, useCallback } from 'react'
import { Player, TeamDistribution, TeamFormation, PlayerMove } from '@/types'
import { 
  calculateTeamDistribution, 
  movePlayerInDistribution, 
  canMovePlayer,
  validateTeamDistribution,
  getDistributionStats
} from '@/utils/teamDistribution'

export const useTeamGenerator = () => {
  const [distribution, setDistribution] = useState<TeamDistribution | null>(null)
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [gameType, setGameType] = useState<'5v5' | '7v7' | '11v11'>('5v5')
  const [formation, setFormation] = useState<TeamFormation | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener formación por defecto según tipo de juego
  const getDefaultFormation = useCallback((gameType: '5v5' | '7v7' | '11v11') => {
    switch (gameType) {
      case '5v5':
        return { 
          id: '2-2-1', 
          name: '2-2-1', 
          description: 'Formación para fútbol 5',
          gameType: '5v5',
          positions: [],
          is_active: true,
          created_at: new Date().toISOString()
        } as any
      case '7v7':
        return { 
          id: '3-2-1', 
          name: '3-2-1', 
          description: 'Formación para fútbol 7',
          gameType: '7v7',
          positions: [],
          is_active: true,
          created_at: new Date().toISOString()
        } as any
      case '11v11':
        return { 
          id: '4-4-2', 
          name: '4-4-2', 
          description: 'Formación clásica equilibrada',
          gameType: '11v11',
          positions: [],
          is_active: true,
          created_at: new Date().toISOString()
        } as any
      default:
        return { 
          id: '2-2-1', 
          name: '2-2-1', 
          description: 'Formación para fútbol 5',
          gameType: '5v5',
          positions: [],
          is_active: true,
          created_at: new Date().toISOString()
        } as any
    }
  }, [])

  // Generar equipos
  const generateTeams = useCallback(() => {
    if (selectedPlayers.length < 2) {
      setError('Se necesitan al menos 2 jugadores para generar equipos')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Usar formación por defecto si no hay una seleccionada
      const currentFormation = formation || getDefaultFormation(gameType)
      const newDistribution = calculateTeamDistribution(selectedPlayers, gameType, currentFormation)
      setDistribution(newDistribution)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar equipos')
    } finally {
      setIsGenerating(false)
    }
  }, [selectedPlayers, gameType, formation, getDefaultFormation])

  // Regenerar equipos
  const regenerateTeams = useCallback(() => {
    generateTeams()
  }, [generateTeams])

  // Mover jugador entre equipos y roles
  const movePlayer = useCallback((
    playerId: number,
    fromTeam: 'home' | 'away',
    fromRole: 'starter' | 'substitute',
    toTeam: 'home' | 'away',
    toRole: 'starter' | 'substitute'
  ) => {
    if (!distribution) return

    try {
      // Validar si se puede mover
      if (!canMovePlayer(distribution, toTeam, toRole)) {
        setError('No se puede mover más jugadores a esa posición')
        return
      }

      const newDistribution = movePlayerInDistribution(
        distribution,
        playerId,
        fromTeam,
        fromRole,
        toTeam,
        toRole
      )
      
      setDistribution(newDistribution)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al mover jugador')
    }
  }, [distribution])

  // Validar distribución actual
  const validateCurrentDistribution = useCallback(() => {
    if (!distribution) return null
    return validateTeamDistribution(distribution)
  }, [distribution])

  // Obtener estadísticas de la distribución
  const getCurrentStats = useCallback(() => {
    if (!distribution) return null
    return getDistributionStats(distribution)
  }, [distribution])

  // Agregar jugador a la selección
  const addPlayer = useCallback((player: Player) => {
    if (selectedPlayers.some(p => p.id === player.id)) {
      setError('El jugador ya está seleccionado')
      return
    }
    setSelectedPlayers(prev => [...prev, player])
    setError(null)
  }, [selectedPlayers])

  // Remover jugador de la selección
  const removePlayer = useCallback((playerId: number) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId))
    setError(null)
  }, [])

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedPlayers([])
    setDistribution(null)
    setError(null)
  }, [])

  // Cambiar tipo de juego
  const changeGameType = useCallback((newGameType: '5v5' | '7v7' | '11v11') => {
    setGameType(newGameType)
    // Establecer formación por defecto para el nuevo tipo de juego
    const defaultFormation = getDefaultFormation(newGameType)
    setFormation(defaultFormation)
    // Regenerar equipos si ya hay una distribución
    if (distribution) {
      setTimeout(() => generateTeams(), 100)
    }
  }, [distribution, generateTeams, getDefaultFormation])

  // Cambiar formación
  const changeFormation = useCallback((newFormation: TeamFormation | null) => {
    setFormation(newFormation)
    // Regenerar equipos si ya hay una distribución
    if (distribution) {
      setTimeout(() => generateTeams(), 100)
    }
  }, [distribution, generateTeams])

  // Guardar configuración
  const saveConfiguration = useCallback(() => {
    if (!distribution) {
      setError('No hay equipos generados para guardar')
      return
    }

    try {
      const config = {
        distribution,
        timestamp: new Date().toISOString(),
        gameType,
        formation: formation?.id,
        playerCount: selectedPlayers.length
      }
      
      // Guardar en localStorage (temporal)
      localStorage.setItem('teamGenerator_lastConfig', JSON.stringify(config))
      setError(null)
      return config
    } catch (err) {
      setError('Error al guardar la configuración')
      return null
    }
  }, [distribution, gameType, formation, selectedPlayers])

  // Cargar configuración guardada
  const loadSavedConfiguration = useCallback(() => {
    try {
      const saved = localStorage.getItem('teamGenerator_lastConfig')
      if (saved) {
        const config = JSON.parse(saved)
        setDistribution(config.distribution)
        setGameType(config.gameType)
        // Nota: formation y selectedPlayers se manejarían por separado
        setError(null)
        return config
      }
    } catch (err) {
      setError('Error al cargar la configuración guardada')
    }
    return null
  }, [])

  return {
    // Estado
    distribution,
    selectedPlayers,
    gameType,
    formation,
    isGenerating,
    error,
    
    // Acciones
    setSelectedPlayers,
    setGameType,
    setFormation,
    generateTeams,
    regenerateTeams,
    movePlayer,
    addPlayer,
    removePlayer,
    clearSelection,
    changeGameType,
    changeFormation,
    saveConfiguration,
    loadSavedConfiguration,
    
    // Utilidades
    validateCurrentDistribution,
    getCurrentStats,
    
    // Validaciones
    canGenerate: selectedPlayers.length >= 2,
    canRegenerate: distribution !== null,
    hasError: error !== null
  }
} 