// Script de prueba para verificar la formación 1-2-2-2 para Futbolito
console.log('⚽ PRUEBA DE FORMACIÓN 1-2-2-2 PARA FUTBOLITO');
console.log('==============================================');

// Simular la función getFormationPositions
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

console.log('\n🏆 EQUIPO A (7 jugadores):');
teamA.forEach((player, index) => {
  console.log(`${index + 1}. ${player.name} - ${player.position}`);
});

console.log('\n🏆 EQUIPO B (7 jugadores):');
teamB.forEach((player, index) => {
  console.log(`${index + 1}. ${player.name} - ${player.position}`);
});

// Verificar posiciones en la cancha
const positionsTeamA = getFormationPositions('1-2-2-2', true);
const positionsTeamB = getFormationPositions('1-2-2-2', false);

console.log('\n📍 POSICIONES EN LA CANCHA:');
console.log('Equipo A:');
positionsTeamA.forEach((pos, index) => {
  console.log(`${index + 1}. ${pos.position} - (${pos.x}%, ${pos.y}%)`);
});

console.log('\nEquipo B:');
positionsTeamB.forEach((pos, index) => {
  console.log(`${index + 1}. ${pos.position} - (${pos.x}%, ${pos.y}%)`);
});

console.log('\n✅ VERIFICACIÓN:');
console.log('- Total posiciones Equipo A:', positionsTeamA.length);
console.log('- Total posiciones Equipo B:', positionsTeamB.length);
console.log('- Jugadores Equipo A:', teamA.length);
console.log('- Jugadores Equipo B:', teamB.length);

if (positionsTeamA.length === 7 && positionsTeamB.length === 7) {
  console.log('✅ CORRECTO: Ambos equipos tienen 7 posiciones en la cancha');
} else {
  console.log('❌ ERROR: Los equipos no tienen 7 posiciones');
}

if (teamA.length === 7 && teamB.length === 7) {
  console.log('✅ CORRECTO: Ambos equipos tienen 7 jugadores');
} else {
  console.log('❌ ERROR: Los equipos no tienen 7 jugadores');
}

console.log('\n🎯 RESULTADO ESPERADO:');
console.log('- Cada equipo muestra 7 jugadores en la cancha');
console.log('- Formación 1-2-2-2: 1 Portero, 2 Defensas, 2 Mediocampistas, 2 Delanteros');
console.log('- Posiciones distribuidas correctamente en el campo'); 