// Script de depuración para verificar el estado actual
console.log('🔍 DEPURACIÓN DEL ESTADO ACTUAL');
console.log('================================');

// Simular el estado que debería estar en el componente
const debugState = {
  loading: false, // Debería ser false después de cargar
  selectedTeamId: 1, // Matiz FC
  presentPlayers: [
    { name: 'Danilo Atencio', isPresent: false },
    { name: 'Palito\'S', isPresent: false },
    { name: 'NachoToro', isPresent: false },
    { name: 'Chalo G', isPresent: false },
    { name: 'Alex', isPresent: false },
    { name: 'Zear', isPresent: false },
    { name: 'Diego', isPresent: false },
    { name: 'Asmatiz', isPresent: false },
    { name: 'Chask', isPresent: false },
    { name: 'Jonthan', isPresent: false },
    { name: 'Nico Payo', isPresent: false },
    { name: 'Reyse Montana', isPresent: false },
    { name: 'Galleta 1', isPresent: false },
    { name: 'Galleta 2', isPresent: false }
  ],
  currentPlayersPerTeam: 7, // Futbolito
  requiredPlayers: 14
};

const presentPlayersCount = debugState.presentPlayers.filter(p => p.isPresent).length;
const totalPlayersCount = debugState.presentPlayers.length;

console.log('📊 ESTADO SIMULADO:');
console.log('- Loading:', debugState.loading);
console.log('- Equipo seleccionado:', debugState.selectedTeamId);
console.log('- Jugadores presentes:', presentPlayersCount);
console.log('- Total jugadores:', totalPlayersCount);
console.log('- Jugadores por equipo:', debugState.currentPlayersPerTeam);
console.log('- Jugadores requeridos:', debugState.requiredPlayers);

// Verificar condición del botón
const isButtonDisabled = debugState.loading || !debugState.selectedTeamId || presentPlayersCount < debugState.requiredPlayers;
const buttonText = debugState.loading ? '🔄 Generando...' : '⚽ Generar Equipos';

console.log('\n🔘 ESTADO DEL BOTÓN:');
console.log('- Deshabilitado:', isButtonDisabled);
console.log('- Texto:', buttonText);

console.log('\n📋 JUGADORES:');
debugState.presentPlayers.forEach((player, index) => {
  console.log(`${index + 1}. ${player.name}: ${player.isPresent ? '✅ Presente' : '❌ Ausente'}`);
});

console.log('\n🎯 RESULTADO ESPERADO:');
console.log('- Loading: false');
console.log('- Presentes: 0/14');
console.log('- Botón: "⚽ Generar Equipos" (deshabilitado)');
console.log('- Todos los jugadores: Ausentes');

if (debugState.loading) {
  console.log('❌ PROBLEMA: Loading debería ser false');
} else {
  console.log('✅ Loading está correcto');
}

if (presentPlayersCount === 0) {
  console.log('✅ Presentes está correcto (0)');
} else {
  console.log('❌ PROBLEMA: Presentes debería ser 0, pero es', presentPlayersCount);
}

if (buttonText === '⚽ Generar Equipos') {
  console.log('✅ Texto del botón está correcto');
} else {
  console.log('❌ PROBLEMA: Texto del botón debería ser "⚽ Generar Equipos"');
}

console.log('\n🔧 SOLUCIÓN:');
console.log('1. Verificar que setLoading(false) se ejecute correctamente');
console.log('2. Verificar que presentPlayers se inicialice con isPresent: false');
console.log('3. Verificar que no haya caché del navegador');
console.log('4. Recargar la página completamente (Ctrl+F5)'); 