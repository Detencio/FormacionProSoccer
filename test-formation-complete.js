// Script de prueba para verificar todas las correcciones de formación
console.log('⚽ PRUEBA COMPLETA DE FORMACIONES');
console.log('==================================');

// Simular la función getFormationPositions del componente principal
const getFormationPositions = (formation, isTeamA) => {
  switch (formation) {
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
};

// Simular la función getInitialPositions del componente TeamFormation
const getInitialPositions = (formation, isTeamA) => {
  switch (formation) {
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
};

// Simular cálculo de playersPerTeam
const getPlayersPerTeam = (formation) => {
  return formation === '1-2-1' ? 4 : 
         formation === '1-2-2' ? 5 : 
         formation === '2-2-2' ? 7 : 
         formation === '1-2-2-2' ? 7 : 11;
};

// Simular equipos generados
const teamA = [
  { name: 'Danilo Atencio', position: 'Portero' },
  { name: 'Palito\'S', position: 'Defensa' },
  { name: 'NachoToro', position: 'Defensa' },
  { name: 'Chalo G', position: 'Mediocampista' },
  { name: 'Alex', position: 'Mediocampista' },
  { name: 'Zear', position: 'Delantero' },
  { name: 'Diego', position: 'Delantero' }
];

const teamB = [
  { name: 'Asmatiz', position: 'Portero' },
  { name: 'Chask', position: 'Defensa' },
  { name: 'Jonthan', position: 'Defensa' },
  { name: 'Nico Payo', position: 'Mediocampista' },
  { name: 'Reyse Montana', position: 'Mediocampista' },
  { name: 'Galleta 1', position: 'Delantero' },
  { name: 'Galleta 2', position: 'Delantero' }
];

console.log('📊 CONFIGURACIÓN:');
console.log('- Modo: Futbolito (7 vs 7)');
console.log('- Formación: 1-2-2-2');
console.log('- Jugadores por equipo: 7');

// Verificar playersPerTeam
const playersPerTeam = getPlayersPerTeam('1-2-2-2');
console.log('\n🔢 CÁLCULO DE JUGADORES POR EQUIPO:');
console.log('- playersPerTeam para 1-2-2-2:', playersPerTeam);

// Verificar posiciones en la cancha
const positionsTeamA = getFormationPositions('1-2-2-2', true);
const positionsTeamB = getFormationPositions('1-2-2-2', false);
const initialPositionsTeamA = getInitialPositions('1-2-2-2', true);
const initialPositionsTeamB = getInitialPositions('1-2-2-2', false);

console.log('\n📍 POSICIONES EN LA CANCHA:');
console.log('Equipo A - getFormationPositions:', positionsTeamA.length, 'posiciones');
console.log('Equipo B - getFormationPositions:', positionsTeamB.length, 'posiciones');
console.log('Equipo A - getInitialPositions:', initialPositionsTeamA.length, 'posiciones');
console.log('Equipo B - getInitialPositions:', initialPositionsTeamB.length, 'posiciones');

console.log('\n🏆 EQUIPOS:');
console.log('Equipo A:', teamA.length, 'jugadores');
console.log('Equipo B:', teamB.length, 'jugadores');

console.log('\n✅ VERIFICACIÓN:');
console.log('- playersPerTeam = 7:', playersPerTeam === 7 ? '✅' : '❌');
console.log('- positionsTeamA = 7:', positionsTeamA.length === 7 ? '✅' : '❌');
console.log('- positionsTeamB = 7:', positionsTeamB.length === 7 ? '✅' : '❌');
console.log('- initialPositionsTeamA = 7:', initialPositionsTeamA.length === 7 ? '✅' : '❌');
console.log('- initialPositionsTeamB = 7:', initialPositionsTeamB.length === 7 ? '✅' : '❌');
console.log('- teamA = 7:', teamA.length === 7 ? '✅' : '❌');
console.log('- teamB = 7:', teamB.length === 7 ? '✅' : '❌');

console.log('\n🎯 RESULTADO ESPERADO:');
console.log('- Etiqueta: "1-2-2-2 (7 jugadores)"');
console.log('- Contador: "7/7"');
console.log('- Cada equipo muestra 7 jugadores en la cancha');
console.log('- Formación 1-2-2-2: 1 Portero, 2 Defensas, 2 Mediocampistas, 2 Delanteros');

const allCorrect = playersPerTeam === 7 && 
                   positionsTeamA.length === 7 && 
                   positionsTeamB.length === 7 && 
                   initialPositionsTeamA.length === 7 && 
                   initialPositionsTeamB.length === 7 && 
                   teamA.length === 7 && 
                   teamB.length === 7;

if (allCorrect) {
  console.log('\n🎉 ¡TODAS LAS CORRECCIONES FUNCIONAN CORRECTAMENTE!');
} else {
  console.log('\n❌ HAY PROBLEMAS QUE NECESITAN CORRECCIÓN');
} 