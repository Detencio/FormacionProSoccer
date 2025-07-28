import { useState, useCallback, useEffect } from 'react'
import { Player, TeamDistribution, TeamFormation } from '@/types'
import { 
  calculateTeamDistribution, 
  movePlayerInDistribution, 
  calculateAverageSkill, 
  calculateBalanceScore,
  validateTeamDistribution,
  getDistributionStats,
  GAME_CONFIGURATIONS 
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
    console.log('generateTeams called')
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
    console.log('regenerateTeams called')
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
    console.log('movePlayer called:', { playerId, fromTeam, fromRole, toTeam, toRole })
    if (!distribution) return

    try {
      const newDistribution = movePlayerInDistribution(distribution, playerId, fromTeam, fromRole, toTeam, toRole)
      setDistribution(newDistribution)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al mover jugador')
    }
  }, [distribution])

  // Intercambiar dos jugadores específicos
  const swapTwoPlayers = useCallback((
    substituteId: number,
    starterId: number
  ) => {
    console.log('swapTwoPlayers called:', { substituteId, starterId })
    if (!distribution) return

    try {
      // Buscar el suplente
      let substituteTeam: 'home' | 'away' | null = null
      let substituteRole: 'substitute' = 'substitute'
      
      if (distribution.homeTeam.substitutes.some(p => p.id === substituteId)) {
        substituteTeam = 'home'
      } else if (distribution.awayTeam.substitutes.some(p => p.id === substituteId)) {
        substituteTeam = 'away'
      }

      // Buscar el titular
      let starterTeam: 'home' | 'away' | null = null
      let starterRole: 'starter' = 'starter'
      
      if (distribution.homeTeam.starters.some(p => p.id === starterId)) {
        starterTeam = 'home'
      } else if (distribution.awayTeam.starters.some(p => p.id === starterId)) {
        starterTeam = 'away'
      }

      if (!substituteTeam || !starterTeam) {
        console.error('Uno o ambos jugadores no encontrados')
        setError('Uno o ambos jugadores no encontrados')
        return
      }

      console.log('Jugadores encontrados:', {
        substitute: { team: substituteTeam, role: substituteRole },
        starter: { team: starterTeam, role: starterRole }
      })

      // Crear nueva distribución con nuevas referencias de arrays
      const newDistribution = {
        ...distribution,
        homeTeam: {
          ...distribution.homeTeam,
          starters: [...distribution.homeTeam.starters],
          substitutes: [...distribution.homeTeam.substitutes]
        },
        awayTeam: {
          ...distribution.awayTeam,
          starters: [...distribution.awayTeam.starters],
          substitutes: [...distribution.awayTeam.substitutes]
        }
      }
      
      // Encontrar y remover jugadores
      const substituteArray = substituteTeam === 'home' ? newDistribution.homeTeam.substitutes : newDistribution.awayTeam.substitutes
      const starterArray = starterTeam === 'home' ? newDistribution.homeTeam.starters : newDistribution.awayTeam.starters
      
      const substituteIndex = substituteArray.findIndex(p => p.id === substituteId)
      const starterIndex = starterArray.findIndex(p => p.id === starterId)
      
      if (substituteIndex === -1 || starterIndex === -1) {
        console.error('Jugadores no encontrados en sus arrays')
        setError('Error al encontrar jugadores')
        return
      }

      const substitute = substituteArray[substituteIndex]
      const starter = starterArray[starterIndex]

      // Remover jugadores de sus posiciones actuales
      substituteArray.splice(substituteIndex, 1)
      starterArray.splice(starterIndex, 1)

      // Intercambiar posiciones
      substituteArray.push(starter)  // Titular va a suplentes
      starterArray.push(substitute)  // Suplente va a titulares

      // Recalcular promedios
      newDistribution.homeTeam.averageSkill = calculateAverageSkill(newDistribution.homeTeam.starters)
      newDistribution.awayTeam.averageSkill = calculateAverageSkill(newDistribution.awayTeam.starters)
      newDistribution.balanceScore = calculateBalanceScore(newDistribution.homeTeam, newDistribution.awayTeam)

      setDistribution(newDistribution)
      setError(null)
      console.log('Intercambio exitoso entre suplente y titular')
    } catch (error) {
      console.error('Error en intercambio:', error)
      setError(error instanceof Error ? error.message : 'Error al intercambiar jugadores')
    }
  }, [distribution])

  // Intercambiar jugador titular por suplente
  const swapPlayer = useCallback((
    playerId: number
  ) => {
    console.log('swapPlayer called:', { playerId })
    if (!distribution) return

    // Buscar el jugador en ambos equipos
    let foundTeam: 'home' | 'away' | null = null
    let foundRole: 'starter' | 'substitute' | null = null

    // Buscar en equipo A
    if (distribution.homeTeam.starters.some(p => p.id === playerId)) {
      foundTeam = 'home'
      foundRole = 'starter'
    } else if (distribution.homeTeam.substitutes.some(p => p.id === playerId)) {
      foundTeam = 'home'
      foundRole = 'substitute'
    }
    // Buscar en equipo B
    else if (distribution.awayTeam.starters.some(p => p.id === playerId)) {
      foundTeam = 'away'
      foundRole = 'starter'
    } else if (distribution.awayTeam.substitutes.some(p => p.id === playerId)) {
      foundTeam = 'away'
      foundRole = 'substitute'
    }

    if (!foundTeam || !foundRole) {
      console.error('Jugador no encontrado:', playerId)
      setError('Jugador no encontrado')
      return
    }

    console.log('Jugador encontrado:', { foundTeam, foundRole, playerId })

    // Determinar el nuevo rol (intercambiar)
    const newRole = foundRole === 'starter' ? 'substitute' : 'starter'
    
    // Verificar que el movimiento sea válido
    const targetTeam = foundTeam === 'home' ? distribution.homeTeam : distribution.awayTeam
    const targetArray = newRole === 'starter' ? targetTeam.starters : targetTeam.substitutes
    
    // Verificar límites
    const config = GAME_CONFIGURATIONS[distribution.gameType]
    if (newRole === 'starter' && targetArray.length >= config.startersPerTeam) {
      console.error('No se puede agregar más titulares')
      setError(`No se puede agregar más titulares. Máximo: ${config.startersPerTeam}`)
      return
    }

    if (newRole === 'substitute' && targetArray.length >= config.maxSubstitutesPerTeam) {
      console.error('No se puede agregar más suplentes')
      setError(`No se puede agregar más suplentes. Máximo: ${config.maxSubstitutesPerTeam}`)
      return
    }
    
    console.log('Movimiento válido, ejecutando intercambio...')
    
    try {
      // Mover el jugador
      const newDistribution = movePlayerInDistribution(distribution, playerId, foundTeam, foundRole, foundTeam, newRole)
      setDistribution(newDistribution)
      setError(null)
      console.log('Intercambio exitoso')
    } catch (error) {
      console.error('Error en intercambio:', error)
      setError(error instanceof Error ? error.message : 'Error al intercambiar jugador')
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
    console.log('clearSelection called')
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

  // Notificar cambios en la distribución
  useEffect(() => {
    if (distribution) {
      console.log('useTeamGenerator: Distribución actualizada:', {
        homeStarters: distribution.homeTeam.starters.length,
        homeSubstitutes: distribution.homeTeam.substitutes.length,
        awayStarters: distribution.awayTeam.starters.length,
        awaySubstitutes: distribution.awayTeam.substitutes.length
      })
    }
  }, [distribution])

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
    swapTwoPlayers, // Added swapTwoPlayers to the return object
    swapPlayer,
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