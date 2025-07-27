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

  // Mezclar jugadores para distribución aleatoria
  const shuffledPlayers = shuffleArray([...players])

  // Distribuir jugadores equitativamente
  const homeTeam: TeamSection = {
    starters: shuffledPlayers.slice(0, startersPerTeam),
    substitutes: shuffledPlayers.slice(startersPerTeam, startersPerTeam + substitutesPerTeam),
    averageSkill: 0
  }

  const awayTeam: TeamSection = {
    starters: shuffledPlayers.slice(startersPerTeam + substitutesPerTeam, startersPerTeam * 2 + substitutesPerTeam),
    substitutes: shuffledPlayers.slice(startersPerTeam * 2 + substitutesPerTeam),
    averageSkill: 0
  }

  // Calcular promedios de habilidad
  homeTeam.averageSkill = calculateAverageSkill(homeTeam.starters)
  awayTeam.averageSkill = calculateAverageSkill(awayTeam.starters)

  // Jugadores sin asignar (si los hay)
  const assignedCount = startersPerTeam * 2 + substitutesPerTeam * 2
  const unassigned = shuffledPlayers.slice(assignedCount)

  const distribution: TeamDistribution = {
    homeTeam,
    awayTeam,
    unassigned,
    gameType,
    formation: formation || undefined,
    balanceScore: calculateBalanceScore(homeTeam, awayTeam),
    generatedAt: new Date().toISOString()
  }

  return distribution
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
  const newDistribution = { ...distribution }
  
  // Encontrar y remover jugador de la posición original
  const sourceTeam = fromTeam === 'home' ? newDistribution.homeTeam : newDistribution.awayTeam
  const sourceArray = fromRole === 'starter' ? sourceTeam.starters : sourceTeam.substitutes
  const playerIndex = sourceArray.findIndex(p => p.id === playerId)
  
  if (playerIndex === -1) {
    throw new Error('Jugador no encontrado en la posición especificada')
  }

  const player = sourceArray[playerIndex]
  sourceArray.splice(playerIndex, 1)

  // Validar límites antes de mover
  const targetTeam = toTeam === 'home' ? newDistribution.homeTeam : newDistribution.awayTeam
  const targetArray = toRole === 'starter' ? targetTeam.starters : targetTeam.substitutes
  const config = GAME_CONFIGURATIONS[distribution.gameType]

  if (toRole === 'starter' && targetArray.length >= config.startersPerTeam) {
    throw new Error('No se puede agregar más titulares')
  }

  if (toRole === 'substitute' && targetArray.length >= config.maxSubstitutesPerTeam) {
    throw new Error('No se puede agregar más suplentes')
  }

  // Agregar jugador a la nueva posición
  targetArray.push(player)

  // Recalcular promedios de habilidad
  newDistribution.homeTeam.averageSkill = calculateAverageSkill(newDistribution.homeTeam.starters)
  newDistribution.awayTeam.averageSkill = calculateAverageSkill(newDistribution.awayTeam.starters)

  // Recalcular puntuación de balance
  newDistribution.balanceScore = calculateBalanceScore(newDistribution.homeTeam, newDistribution.awayTeam)

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