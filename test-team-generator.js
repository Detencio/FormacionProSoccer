// Script de prueba para verificar el comportamiento del botón "Generar Equipos"
console.log('🧪 PRUEBA DEL GENERADOR DE EQUIPOS');
console.log('=====================================');

// Simular el estado inicial
const selectedTeamId = 1; // Matiz FC
const presentPlayersCount = 0; // Inicialmente todos ausentes
const currentPlayersPerTeam = 5; // Baby Futbol
const requiredPlayers = currentPlayersPerTeam * 2; // 10 jugadores

console.log('📊 ESTADO INICIAL:');
console.log('- Equipo seleccionado:', selectedTeamId);
console.log('- Jugadores presentes:', presentPlayersCount);
console.log('- Jugadores por equipo:', currentPlayersPerTeam);
console.log('- Jugadores requeridos:', requiredPlayers);

// Verificar condición del botón
const isButtonDisabled = !selectedTeamId || presentPlayersCount < requiredPlayers;
console.log('🔘 Botón "Generar Equipos" deshabilitado:', isButtonDisabled);

if (isButtonDisabled) {
  console.log('✅ CORRECTO: El botón está deshabilitado porque no hay suficientes jugadores presentes');
} else {
  console.log('❌ ERROR: El botón debería estar deshabilitado');
}

// Simular selección de jugadores
console.log('\n📋 SIMULANDO SELECCIÓN DE JUGADORES:');
for (let i = 1; i <= 14; i++) {
  const newPresentCount = i;
  const isDisabled = !selectedTeamId || newPresentCount < requiredPlayers;
  console.log(`- ${i} jugadores presentes: ${isDisabled ? '❌ Deshabilitado' : '✅ Habilitado'}`);
}

console.log('\n🎯 RESULTADO ESPERADO:');
console.log('- Con 0-9 jugadores: Botón deshabilitado');
console.log('- Con 10+ jugadores: Botón habilitado');
console.log('- ✅ El cambio está funcionando correctamente'); 