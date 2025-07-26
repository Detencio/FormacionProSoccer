// Script para limpiar caché y localStorage
console.log('🧹 LIMPIANDO CACHÉ Y LOCALSTORAGE');
console.log('===================================');

// Simular limpieza de localStorage
const keysToRemove = [
  'generatedTeams',
  'generator-players',
  'temp-data',
  'cache-data'
];

console.log('🗑️ Eliminando claves de localStorage:');
keysToRemove.forEach(key => {
  console.log(`- ${key}`);
});

console.log('\n📋 INSTRUCCIONES PARA LIMPIAR CACHÉ:');
console.log('1. Abrir las herramientas de desarrollador (F12)');
console.log('2. Ir a la pestaña "Application" o "Aplicación"');
console.log('3. En "Storage" o "Almacenamiento", hacer clic en "Clear storage"');
console.log('4. O usar Ctrl+Shift+R para recargar sin caché');
console.log('5. O usar Ctrl+F5 para forzar recarga completa');

console.log('\n🔧 PASOS ADICIONALES:');
console.log('1. Cerrar completamente el navegador');
console.log('2. Abrir el navegador nuevamente');
console.log('3. Ir a http://localhost:3000/team-generator');
console.log('4. Verificar que el botón muestre "⚽ Generar Equipos"');
console.log('5. Verificar que la asistencia muestre "0/14"');

console.log('\n✅ RESULTADO ESPERADO:');
console.log('- Botón: "⚽ Generar Equipos" (deshabilitado)');
console.log('- Asistencia: "0/14"');
console.log('- Loading: false');
console.log('- Todos los jugadores: Ausentes'); 