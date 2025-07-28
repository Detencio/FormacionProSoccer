import { Player, TeamDistribution, TeamSection, GameConfiguration, TeamFormation, PositionAbbreviation } from '@/types'

// Configuraciones por tipo de juego
export const GAME_CONFIGURATIONS: Record<'5v5' | '7v7' | '11v11', GameConfiguration> = {
  '5v5': {
    gameType: '5v5',
    startersPerTeam: 5,
    maxSubstitutesPerTeam: 3,
    requiredPositions: ['POR', 'DEF', 'DEF', 'MED', 'DEL'] as PositionAbbreviation[],
    maxPlayers: 16
  },
  '7v7': {
    gameType: '7v7',
    startersPerTeam: 7,
    maxSubstitutesPerTeam: 4,
    requiredPositions: ['POR', 'DEF', 'DEF', 'MED', 'MED', 'DEL', 'DEL'] as PositionAbbreviation[],
    maxPlayers: 22
  },
  '11v11': {
    gameType: '11v11',
    startersPerTeam: 11,
    maxSubstitutesPerTeam: 7,
    requiredPositions: ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL', 'DEL'] as PositionAbbreviation[],
    maxPlayers: 36
  }
}

// Función para mezclar array (Fisher-Yates shuffle)
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Calcular promedio de habilidad de un equipo
export const calculateAverageSkill = (players: Player[]): number => {
  if (players.length === 0) return 0
  const totalSkill = players.reduce((sum, player) => sum + player.skill_level, 0)
  return Math.round((totalSkill / players.length) * 10) / 10
}

// Calcular puntuación de balance entre equipos
export const calculateBalanceScore = (
  homeTeam: TeamSection,
  awayTeam: TeamSection,
  preferences: {
    skillLevelWeight: number;
    positionBalanceWeight: number;
    teamSizeWeight: number;
  } = { skillLevelWeight: 0.4, positionBalanceWeight: 0.3, teamSizeWeight: 0.3 }
): number => {
  // Balance de habilidad
  const skillDifference = Math.abs(homeTeam.averageSkill - awayTeam.averageSkill)
  const skillBalance = Math.max(0, 100 - skillDifference * 10)

  // Balance de posiciones
  const homePositions = new Set(homeTeam.starters.map(p => p.position_zone.abbreviation))
  const awayPositions = new Set(awayTeam.starters.map(p => p.position_zone.abbreviation))
  const positionBalance = Math.max(0, 100 - Math.abs(homePositions.size - awayPositions.size) * 20)

  // Balance de tamaño de equipo
  const homeTotal = homeTeam.starters.length + homeTeam.substitutes.length
  const awayTotal = awayTeam.starters.length + awayTeam.substitutes.length
  const sizeBalance = Math.max(0, 100 - Math.abs(homeTotal - awayTotal) * 10)

  return Math.round(
    skillBalance * preferences.skillLevelWeight +
    positionBalance * preferences.positionBalanceWeight +
    sizeBalance * preferences.teamSizeWeight
  )
}

// Distribuir jugadores de forma inteligente
export const calculateTeamDistribution = (
  players: Player[],
  gameType: '5v5' | '7v7' | '11v11',
  formation?: TeamFormation | null
): TeamDistribution => {
  const config = GAME_CONFIGURATIONS[gameType]
  const totalPlayers = players.length
  const playersPerTeam = Math.floor(totalPlayers / 2)
  const startersPerTeam = config.startersPerTeam
  const substitutesPerTeam = Math.min(playersPerTeam - startersPerTeam, config.maxSubstitutesPerTeam)

  // Para partidos internos del club (5v5, 7v7), las posiciones son referenciales
  // No es obligatorio tener un portero específico - son partidos amistosos entre amigos
  const isInternalMatch = gameType === '5v5' || gameType === '7v7'
  
  if (isInternalMatch) {
    // Distribución flexible para partidos amistosos entre amigos
    // No es necesario seguir reglas estrictas de posiciones
    const shuffledPlayers = shuffleArray([...players])
    
    console.log(`[TeamDistribution] 🏆 Partido amistoso: ${players.length} jugadores para ${gameType}`)
    console.log(`[TeamDistribution] Titulares por equipo: ${startersPerTeam}`)
    
    // Distribuir jugadores titulares equitativamente
    const homeStarters = shuffledPlayers.slice(0, startersPerTeam)
    const awayStarters = shuffledPlayers.slice(startersPerTeam, startersPerTeam * 2)
    
    console.log(`[TeamDistribution] Equipo A titulares: ${homeStarters.length}`)
    console.log(`[TeamDistribution] Equipo B titulares: ${awayStarters.length}`)
    
    // Los jugadores restantes se convierten en suplentes distribuidos aleatoriamente
    // En partidos amistosos, no importa si hay más suplentes en un equipo que en otro
    const remainingPlayers = shuffledPlayers.slice(startersPerTeam * 2)
    
    console.log(`[TeamDistribution] Jugadores restantes para suplentes: ${remainingPlayers.length}`)
    
    // Distribuir suplentes de forma completamente aleatoria
    // En partidos amistosos, la distribución desigual es normal
    const shuffledRemaining = shuffleArray([...remainingPlayers])
    const totalSubstitutes = remainingPlayers.length
    
    // Distribuir suplentes de forma aleatoria (puede ser desigual)
    let homeSubstitutes: Player[] = []
    let awaySubstitutes: Player[] = []
    
    if (totalSubstitutes > 0) {
      // Para partidos amistosos, distribuir de forma más aleatoria
      // Puede que un equipo tenga más suplentes que otro
      const homeSubstitutesCount = Math.floor(totalSubstitutes / 2)
      const awaySubstitutesCount = totalSubstitutes - homeSubstitutesCount
      
      homeSubstitutes = shuffledRemaining.slice(0, homeSubstitutesCount)
      awaySubstitutes = shuffledRemaining.slice(homeSubstitutesCount)
      
      console.log(`[TeamDistribution] Equipo A suplentes: ${homeSubstitutes.length}`)
      console.log(`[TeamDistribution] Equipo B suplentes: ${awaySubstitutes.length}`)
      console.log(`[TeamDistribution] 💡 Distribución flexible para partido amistoso`)
    }
    
    // Crear equipos
    const homeTeam: TeamSection = {
      starters: homeStarters,
      substitutes: homeSubstitutes,
      averageSkill: calculateAverageSkill(homeStarters)
    }

    const awayTeam: TeamSection = {
      starters: awayStarters,
      substitutes: awaySubstitutes,
      averageSkill: calculateAverageSkill(awayStarters)
    }

    // Jugadores sin asignar (si quedan)
    const assignedPlayers = [...homeStarters, ...awayStarters, ...homeSubstitutes, ...awaySubstitutes]
    const unassigned = players.filter(p => !assignedPlayers.some(ap => ap.id === p.id))

    console.log(`[TeamDistribution] Total asignados: ${assignedPlayers.length}`)
    console.log(`[TeamDistribution] Sin asignar: ${unassigned.length}`)
    console.log(`[TeamDistribution] ✅ Listo para partido amistoso!`)

    return {
      homeTeam,
      awayTeam,
      unassigned,
      gameType,
      formation: formation || undefined,
      balanceScore: calculateBalanceScore(homeTeam, awayTeam),
      generatedAt: new Date().toISOString()
    }
  } else {
    // Para fútbol 11 (campeonatos o partidos oficiales), mantener la lógica estricta
    console.log(`[TeamDistribution] 🏆 Partido oficial: ${players.length} jugadores para ${gameType}`)
    console.log(`[TeamDistribution] Aplicando reglas estrictas de posiciones`)
    
    // Separar jugadores por posición usando includes para evitar errores de tipos
    const goalkeepers = players.filter(p => {
      const specificPos = p.position_specific?.abbreviation
      const zonePos = p.position_zone?.abbreviation
      return String(specificPos).includes('POR') || String(zonePos).includes('POR')
    })
    
    const defenders = players.filter(p => {
      const specificPos = p.position_specific?.abbreviation
      const zonePos = p.position_zone?.abbreviation
      return String(specificPos).includes('DEF') || String(zonePos).includes('DEF')
    })
    
    const midfielders = players.filter(p => {
      const specificPos = p.position_specific?.abbreviation
      const zonePos = p.position_zone?.abbreviation
      return String(specificPos).includes('MED') || String(zonePos).includes('MED')
    })
    
    const forwards = players.filter(p => {
      const specificPos = p.position_specific?.abbreviation
      const zonePos = p.position_zone?.abbreviation
      return String(specificPos).includes('DEL') || String(zonePos).includes('DEL')
    })
    
    const others = players.filter(p => {
      const specificPos = p.position_specific?.abbreviation
      const zonePos = p.position_zone?.abbreviation
      const specificStr = String(specificPos)
      const zoneStr = String(zonePos)
      return !(specificStr.includes('POR') || specificStr.includes('DEF') || specificStr.includes('MED') || specificStr.includes('DEL') ||
               zoneStr.includes('POR') || zoneStr.includes('DEF') || zoneStr.includes('MED') || zoneStr.includes('DEL'))
    })

    // Mezclar cada grupo
    const shuffledGoalkeepers = shuffleArray(goalkeepers)
    const shuffledDefenders = shuffleArray(defenders)
    const shuffledMidfielders = shuffleArray(midfielders)
    const shuffledForwards = shuffleArray(forwards)
    const shuffledOthers = shuffleArray(others)

    // Distribuir jugadores de forma balanceada
    const homeStarters: Player[] = []
    const awayStarters: Player[] = []

    // Asignar porteros primero (1 por equipo)
    if (shuffledGoalkeepers.length >= 2) {
      homeStarters.push(shuffledGoalkeepers[0])
      awayStarters.push(shuffledGoalkeepers[1])
    } else if (shuffledGoalkeepers.length === 1) {
      homeStarters.push(shuffledGoalkeepers[0])
      // Si solo hay 1 portero, asignar un jugador de otra posición al equipo B
      const availableForAway = [...shuffledDefenders, ...shuffledMidfielders, ...shuffledForwards, ...shuffledOthers]
      if (availableForAway.length > 0) {
        awayStarters.push(availableForAway[0])
      }
    }

    // Asignar defensas
    const defendersNeeded = 4 // Para 11v11
    for (let i = 0; i < defendersNeeded && i < shuffledDefenders.length; i++) {
      if (homeStarters.length < startersPerTeam) {
        homeStarters.push(shuffledDefenders[i])
      } else if (awayStarters.length < startersPerTeam) {
        awayStarters.push(shuffledDefenders[i])
      }
    }

    // Asignar mediocampistas
    const midfieldersNeeded = 4 // Para 11v11
    for (let i = 0; i < midfieldersNeeded && i < shuffledMidfielders.length; i++) {
      if (homeStarters.length < startersPerTeam) {
        homeStarters.push(shuffledMidfielders[i])
      } else if (awayStarters.length < startersPerTeam) {
        awayStarters.push(shuffledMidfielders[i])
      }
    }

    // Asignar delanteros
    const forwardsNeeded = 2 // Para 11v11
    for (let i = 0; i < forwardsNeeded && i < shuffledForwards.length; i++) {
      if (homeStarters.length < startersPerTeam) {
        homeStarters.push(shuffledForwards[i])
      } else if (awayStarters.length < startersPerTeam) {
        awayStarters.push(shuffledForwards[i])
      }
    }

    // Completar con otros jugadores si es necesario
    const allRemaining = [
      ...shuffledGoalkeepers.slice(2),
      ...shuffledDefenders.slice(defendersNeeded),
      ...shuffledMidfielders.slice(midfieldersNeeded),
      ...shuffledForwards.slice(forwardsNeeded),
      ...shuffledOthers
    ]

    for (const player of allRemaining) {
      if (homeStarters.length < startersPerTeam) {
        homeStarters.push(player)
      } else if (awayStarters.length < startersPerTeam) {
        awayStarters.push(player)
      }
    }

    // Crear equipos
    const homeTeam: TeamSection = {
      starters: homeStarters,
      substitutes: [],
      averageSkill: calculateAverageSkill(homeStarters)
    }

    const awayTeam: TeamSection = {
      starters: awayStarters,
      substitutes: [],
      averageSkill: calculateAverageSkill(awayStarters)
    }

    // Jugadores sin asignar
    const assignedPlayers = [...homeStarters, ...awayStarters]
    const unassigned = players.filter(p => !assignedPlayers.some(ap => ap.id === p.id))

    return {
      homeTeam,
      awayTeam,
      unassigned,
      gameType,
      formation: formation || undefined,
      balanceScore: calculateBalanceScore(homeTeam, awayTeam),
      generatedAt: new Date().toISOString()
    }
  }
}

// Validar distribución de equipos
export const validateTeamDistribution = (
  distribution: TeamDistribution
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = []
  const warnings: string[] = []
  const config = GAME_CONFIGURATIONS[distribution.gameType]

  // Validar número de titulares
  if (distribution.homeTeam.starters.length !== config.startersPerTeam) {
    errors.push(`Equipo A debe tener exactamente ${config.startersPerTeam} titulares`)
  }
  if (distribution.awayTeam.starters.length !== config.startersPerTeam) {
    errors.push(`Equipo B debe tener exactamente ${config.startersPerTeam} titulares`)
  }

  // Validar posiciones requeridas
  const requiredPositions = config.requiredPositions
  const homePositions = distribution.homeTeam.starters.map(p => 
    p.position_specific?.abbreviation || p.position_zone.abbreviation
  )
  const awayPositions = distribution.awayTeam.starters.map(p => 
    p.position_specific?.abbreviation || p.position_zone.abbreviation
  )

  const missingHome = requiredPositions.filter(pos => !homePositions.includes(pos))
  const missingAway = requiredPositions.filter(pos => !awayPositions.includes(pos))

  if (missingHome.length > 0) {
    warnings.push(`Equipo A faltan posiciones: ${missingHome.join(', ')}`)
  }
  if (missingAway.length > 0) {
    warnings.push(`Equipo B faltan posiciones: ${missingAway.join(', ')}`)
  }

  // Validar balance de habilidad
  const skillDifference = Math.abs(distribution.homeTeam.averageSkill - distribution.awayTeam.averageSkill)
  if (skillDifference > 2) {
    warnings.push(`Diferencia de habilidad alta: ${skillDifference.toFixed(1)} puntos`)
  }

  // Validar jugadores sin asignar
  if (distribution.unassigned.length > 0) {
    warnings.push(`${distribution.unassigned.length} jugadores sin asignar`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Mover jugador entre equipos y roles
export const movePlayerInDistribution = (
  distribution: TeamDistribution,
  playerId: number,
  fromTeam: 'home' | 'away',
  fromRole: 'starter' | 'substitute',
  toTeam: 'home' | 'away',
  toRole: 'starter' | 'substitute'
): TeamDistribution => {
  console.log('movePlayerInDistribution - Iniciando movimiento:', {
    playerId,
    fromTeam,
    fromRole,
    toTeam,
    toRole
  })

  const newDistribution = { ...distribution }
  
  // Encontrar y remover jugador de la posición original
  const sourceTeam = fromTeam === 'home' ? newDistribution.homeTeam : newDistribution.awayTeam
  const sourceArray = fromRole === 'starter' ? sourceTeam.starters : sourceTeam.substitutes
  const playerIndex = sourceArray.findIndex(p => p.id === playerId)
  
  console.log('Buscando jugador en:', {
    team: fromTeam,
    role: fromRole,
    playerIndex,
    sourceArrayLength: sourceArray.length
  })
  
  if (playerIndex === -1) {
    console.error('Jugador no encontrado:', playerId)
    throw new Error(`Jugador con ID ${playerId} no encontrado en la posición especificada`)
  }

  const player = sourceArray[playerIndex]
  console.log('Jugador encontrado:', player.name)
  
  // Remover jugador de la posición original
  sourceArray.splice(playerIndex, 1)

  // Validar límites antes de mover
  const targetTeam = toTeam === 'home' ? newDistribution.homeTeam : newDistribution.awayTeam
  const targetArray = toRole === 'starter' ? targetTeam.starters : targetTeam.substitutes
  const config = GAME_CONFIGURATIONS[distribution.gameType]

  console.log('Validando límites:', {
    toRole,
    targetArrayLength: targetArray.length,
    maxAllowed: toRole === 'starter' ? config.startersPerTeam : config.maxSubstitutesPerTeam
  })

  if (toRole === 'starter' && targetArray.length >= config.startersPerTeam) {
    // Si no se puede agregar como titular, devolver el jugador a su posición original
    sourceArray.push(player)
    throw new Error(`No se puede agregar más titulares. Máximo: ${config.startersPerTeam}`)
  }

  if (toRole === 'substitute' && targetArray.length >= config.maxSubstitutesPerTeam) {
    // Si no se puede agregar como suplente, devolver el jugador a su posición original
    sourceArray.push(player)
    throw new Error(`No se puede agregar más suplentes. Máximo: ${config.maxSubstitutesPerTeam}`)
  }

  // Agregar jugador a la nueva posición
  targetArray.push(player)
  console.log('Jugador movido exitosamente a:', { toTeam, toRole })

  // Recalcular promedios de habilidad
  newDistribution.homeTeam.averageSkill = calculateAverageSkill(newDistribution.homeTeam.starters)
  newDistribution.awayTeam.averageSkill = calculateAverageSkill(newDistribution.awayTeam.starters)

  // Recalcular puntuación de balance
  newDistribution.balanceScore = calculateBalanceScore(newDistribution.homeTeam, newDistribution.awayTeam)

  console.log('Distribución actualizada:', {
    homeStarters: newDistribution.homeTeam.starters.length,
    homeSubstitutes: newDistribution.homeTeam.substitutes.length,
    awayStarters: newDistribution.awayTeam.starters.length,
    awaySubstitutes: newDistribution.awayTeam.substitutes.length,
    balanceScore: newDistribution.balanceScore
  })

  return newDistribution
}

// Verificar si se puede mover un jugador
export const canMovePlayer = (
  distribution: TeamDistribution,
  toTeam: 'home' | 'away',
  toRole: 'starter' | 'substitute'
): boolean => {
  const config = GAME_CONFIGURATIONS[distribution.gameType]
  const targetTeam = toTeam === 'home' ? distribution.homeTeam : distribution.awayTeam
  const targetArray = toRole === 'starter' ? targetTeam.starters : targetTeam.substitutes

  if (toRole === 'starter') {
    return targetArray.length < config.startersPerTeam
  } else {
    return targetArray.length < config.maxSubstitutesPerTeam
  }
}

// Obtener estadísticas de distribución
export const getDistributionStats = (distribution: TeamDistribution) => {
  const homeTotal = distribution.homeTeam.starters.length + distribution.homeTeam.substitutes.length
  const awayTotal = distribution.awayTeam.starters.length + distribution.awayTeam.substitutes.length
  const totalAssigned = homeTotal + awayTotal
  const totalPlayers = totalAssigned + distribution.unassigned.length

  return {
    totalPlayers,
    totalAssigned,
    unassigned: distribution.unassigned.length,
    homeTeam: {
      starters: distribution.homeTeam.starters.length,
      substitutes: distribution.homeTeam.substitutes.length,
      total: homeTotal,
      averageSkill: distribution.homeTeam.averageSkill
    },
    awayTeam: {
      starters: distribution.awayTeam.starters.length,
      substitutes: distribution.awayTeam.substitutes.length,
      total: awayTotal,
      averageSkill: distribution.awayTeam.averageSkill
    },
    balanceScore: distribution.balanceScore
  }
} 