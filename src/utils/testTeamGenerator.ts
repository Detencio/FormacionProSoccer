import { mockPlayers } from './mockData'
import { calculateTeamDistribution, validateTeamDistribution, getDistributionStats } from './teamDistribution'

// Función de prueba para el generador de equipos
export const testTeamGenerator = () => {
  console.log('🧪 Iniciando pruebas del Generador de Equipos...')
  
  // Prueba 1: Generar equipos 5v5 con 14 jugadores
  console.log('\n📋 Prueba 1: 5v5 con 14 jugadores')
  const players5v5 = mockPlayers.slice(0, 14)
  console.log(`Jugadores seleccionados: ${players5v5.length}`)
  
  const distribution5v5 = calculateTeamDistribution(players5v5, '5v5')
  const stats5v5 = getDistributionStats(distribution5v5)
  const validation5v5 = validateTeamDistribution(distribution5v5)
  
  console.log('📊 Estadísticas 5v5:')
  console.log(`- Total jugadores: ${stats5v5.totalPlayers}`)
  console.log(`- Asignados: ${stats5v5.totalAssigned}`)
  console.log(`- Sin asignar: ${stats5v5.unassigned}`)
  console.log(`- Equipo A: ${stats5v5.homeTeam.starters} titulares, ${stats5v5.homeTeam.substitutes} suplentes`)
  console.log(`- Equipo B: ${stats5v5.awayTeam.starters} titulares, ${stats5v5.awayTeam.substitutes} suplentes`)
  console.log(`- Balance: ${stats5v5.balanceScore}/100`)
  console.log(`- Válido: ${validation5v5.isValid}`)
  if (validation5v5.errors.length > 0) {
    console.log(`- Errores: ${validation5v5.errors.join(', ')}`)
  }
  if (validation5v5.warnings.length > 0) {
    console.log(`- Advertencias: ${validation5v5.warnings.join(', ')}`)
  }
  
  // Prueba 2: Generar equipos 7v7 con 16 jugadores
  console.log('\n📋 Prueba 2: 7v7 con 16 jugadores')
  const players7v7 = mockPlayers.slice(0, 16)
  console.log(`Jugadores seleccionados: ${players7v7.length}`)
  
  const distribution7v7 = calculateTeamDistribution(players7v7, '7v7')
  const stats7v7 = getDistributionStats(distribution7v7)
  const validation7v7 = validateTeamDistribution(distribution7v7)
  
  console.log('📊 Estadísticas 7v7:')
  console.log(`- Total jugadores: ${stats7v7.totalPlayers}`)
  console.log(`- Asignados: ${stats7v7.totalAssigned}`)
  console.log(`- Sin asignar: ${stats7v7.unassigned}`)
  console.log(`- Equipo A: ${stats7v7.homeTeam.starters} titulares, ${stats7v7.homeTeam.substitutes} suplentes`)
  console.log(`- Equipo B: ${stats7v7.awayTeam.starters} titulares, ${stats7v7.awayTeam.substitutes} suplentes`)
  console.log(`- Balance: ${stats7v7.balanceScore}/100`)
  console.log(`- Válido: ${validation7v7.isValid}`)
  
  // Prueba 3: Generar equipos 11v11 con 22 jugadores
  console.log('\n📋 Prueba 3: 11v11 con 22 jugadores')
  const players11v11 = mockPlayers.slice(0, 22)
  console.log(`Jugadores seleccionados: ${players11v11.length}`)
  
  const distribution11v11 = calculateTeamDistribution(players11v11, '11v11')
  const stats11v11 = getDistributionStats(distribution11v11)
  const validation11v11 = validateTeamDistribution(distribution11v11)
  
  console.log('📊 Estadísticas 11v11:')
  console.log(`- Total jugadores: ${stats11v11.totalPlayers}`)
  console.log(`- Asignados: ${stats11v11.totalAssigned}`)
  console.log(`- Sin asignar: ${stats11v11.unassigned}`)
  console.log(`- Equipo A: ${stats11v11.homeTeam.starters} titulares, ${stats11v11.homeTeam.substitutes} suplentes`)
  console.log(`- Equipo B: ${stats11v11.awayTeam.starters} titulares, ${stats11v11.awayTeam.substitutes} suplentes`)
  console.log(`- Balance: ${stats11v11.balanceScore}/100`)
  console.log(`- Válido: ${validation11v11.isValid}`)
  
  // Prueba 4: Número impar de jugadores (13)
  console.log('\n📋 Prueba 4: 5v5 con 13 jugadores (impar)')
  const playersImpar = mockPlayers.slice(0, 13)
  console.log(`Jugadores seleccionados: ${playersImpar.length}`)
  
  const distributionImpar = calculateTeamDistribution(playersImpar, '5v5')
  const statsImpar = getDistributionStats(distributionImpar)
  const validationImpar = validateTeamDistribution(distributionImpar)
  
  console.log('📊 Estadísticas 5v5 (impar):')
  console.log(`- Total jugadores: ${statsImpar.totalPlayers}`)
  console.log(`- Asignados: ${statsImpar.totalAssigned}`)
  console.log(`- Sin asignar: ${statsImpar.unassigned}`)
  console.log(`- Equipo A: ${statsImpar.homeTeam.starters} titulares, ${statsImpar.homeTeam.substitutes} suplentes`)
  console.log(`- Equipo B: ${statsImpar.awayTeam.starters} titulares, ${statsImpar.awayTeam.substitutes} suplentes`)
  console.log(`- Balance: ${statsImpar.balanceScore}/100`)
  console.log(`- Válido: ${validationImpar.isValid}`)
  
  console.log('\n✅ Pruebas completadas!')
  
  return {
    test5v5: { distribution: distribution5v5, stats: stats5v5, validation: validation5v5 },
    test7v7: { distribution: distribution7v7, stats: stats7v7, validation: validation7v7 },
    test11v11: { distribution: distribution11v11, stats: stats11v11, validation: validation11v11 },
    testImpar: { distribution: distributionImpar, stats: statsImpar, validation: validationImpar }
  }
}

// Función para mostrar detalles de los equipos generados
export const showTeamDetails = (distribution: any, testName: string) => {
  console.log(`\n🏆 Detalles de ${testName}:`)
  
  console.log('\n🔵 Equipo A:')
  console.log('Titulares:')
  distribution.homeTeam.starters.forEach((player: any, index: number) => {
    console.log(`  ${index + 1}. ${player.name} (${player.position_specific?.abbreviation || player.position_zone.abbreviation}) - Nivel: ${player.skill_level}/5`)
  })
  console.log('Suplentes:')
  distribution.homeTeam.substitutes.forEach((player: any, index: number) => {
    console.log(`  ${index + 1}. ${player.name} (${player.position_specific?.abbreviation || player.position_zone.abbreviation}) - Nivel: ${player.skill_level}/5`)
  })
  
  console.log('\n🔴 Equipo B:')
  console.log('Titulares:')
  distribution.awayTeam.starters.forEach((player: any, index: number) => {
    console.log(`  ${index + 1}. ${player.name} (${player.position_specific?.abbreviation || player.position_zone.abbreviation}) - Nivel: ${player.skill_level}/5`)
  })
  console.log('Suplentes:')
  distribution.awayTeam.substitutes.forEach((player: any, index: number) => {
    console.log(`  ${index + 1}. ${player.name} (${player.position_specific?.abbreviation || player.position_zone.abbreviation}) - Nivel: ${player.skill_level}/5`)
  })
  
  if (distribution.unassigned.length > 0) {
    console.log('\n⚠️ Jugadores sin asignar:')
    distribution.unassigned.forEach((player: any, index: number) => {
      console.log(`  ${index + 1}. ${player.name} (${player.position_specific?.abbreviation || player.position_zone.abbreviation}) - Nivel: ${player.skill_level}/5`)
    })
  }
} 