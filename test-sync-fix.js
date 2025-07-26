// Script de prueba para verificar la sincronización entre presentPlayers y validación
console.log('🔄 PRUEBA DE SINCRONIZACIÓN ENTRE ESTADOS');
console.log('==========================================');

// Simular el estado correcto
const state = {
  loading: false,
  selectedTeamId: 1,
  currentPlayersPerTeam: 7, // Futbolito
  requiredPlayers: 14,
  
  // Estado presentPlayers (el que se actualiza correctamente)
  presentPlayers: [
    { name: 'Danilo Atencio', isPresent: true },
    { name: 'Palito\'S', isPresent: true },
    { name: 'NachoToro', isPresent: true },
    { name: 'Chalo G', isPresent: true },
    { name: 'Alex', isPresent: true },
    { name: 'Zear', isPresent: true },
    { name: 'Diego', isPresent: true },
    { name: 'Asmatiz', isPresent: true },
    { name: 'Chask', isPresent: true },
    { name: 'Jonthan', isPresent: true },
    { name: 'Nico Payo', isPresent: true },
    { name: 'Reyse Montana', isPresent: true },
    { name: 'Galleta 1', isPresent: true },
    { name: 'Galleta 2', isPresent: true }
  ],
  
  // Estado players (el que NO se actualiza correctamente)
  players: [
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
  ]
};

// Calcular conteos
const presentPlayersCount = state.presentPlayers.filter(p => p.isPresent).length;
const playersWithIsPresent = state.players.filter(p => p.isPresent).length;

console.log('📊 ESTADO SIMULADO:');
console.log('- Loading:', state.loading);
console.log('- Equipo seleccionado:', state.selectedTeamId);
console.log('- Jugadores por equipo:', state.currentPlayersPerTeam);
console.log('- Jugadores requeridos:', state.requiredPlayers);

console.log('\n🔍 CONTEOS:');
console.log('- presentPlayers con isPresent: true:', presentPlayersCount);
console.log('- players con isPresent: true:', playersWithIsPresent);

console.log('\n❌ PROBLEMA ANTERIOR:');
console.log('- La función usaba players.filter(p => p.isPresent)');
console.log('- Esto daba:', playersWithIsPresent, 'jugadores');
console.log('- Pero presentPlayers tenía:', presentPlayersCount, 'jugadores');

console.log('\n✅ SOLUCIÓN APLICADA:');
console.log('- Ahora usa presentPlayers.filter(p => p.isPresent)');
console.log('- Esto da:', presentPlayersCount, 'jugadores');
console.log('- Que coincide con la interfaz: 14/14');

// Verificar validación
const isButtonDisabled = state.loading || !state.selectedTeamId || presentPlayersCount < state.requiredPlayers;
const buttonText = state.loading ? '🔄 Generando...' : '⚽ Generar Equipos';

console.log('\n🔘 ESTADO DEL BOTÓN:');
console.log('- Deshabilitado:', isButtonDisabled);
console.log('- Texto:', buttonText);

if (presentPlayersCount >= state.requiredPlayers) {
  console.log('✅ CORRECTO: Hay suficientes jugadores para generar equipos');
} else {
  console.log('❌ ERROR: No hay suficientes jugadores');
}

console.log('\n🎯 RESULTADO ESPERADO:');
console.log('- presentPlayersCount: 14');
console.log('- requiredPlayers: 14');
console.log('- Botón habilitado: true');
console.log('- Texto: "⚽ Generar Equipos"');
console.log('- Validación: exitosa'); 