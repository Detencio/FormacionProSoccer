#!/usr/bin/env node

/**
 * Script para limpiar automáticamente el código
 * Elimina console.logs de debugging y variables no utilizadas
 */

const fs = require('fs');
const path = require('path');

// Archivos a limpiar
const filesToClean = [
  'src/app/teams/page.tsx',
  'src/components/teams/PlayerModal.tsx',
  'src/components/teams/ProfessionalPlayerCard.tsx',
  'src/components/team-generator/FootballField.tsx',
  'src/services/teamService.ts'
];

// Patrones a buscar y reemplazar
const patterns = [
  // Console statements de debugging
  {
    pattern: /console\.log\(['"`].*DEBUG.*['"`].*\);?\s*/g,
    replacement: ''
  },
  {
    pattern: /console\.log\(['"`].*🔍.*['"`].*\);?\s*/g,
    replacement: ''
  },
  // Variables no utilizadas (comentar)
  {
    pattern: /const \[([^,]+),\s*set([^\]]+)\]\s*=\s*useState.*\/\/\s*no-unused-vars/g,
    replacement: '// const [$1, set$2] = useState... // no-unused-vars'
  }
];

function cleanFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;

    // Aplicar patrones de limpieza
    patterns.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });

    // Guardar solo si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Limpiado: ${filePath}`);
    } else {
      console.log(`ℹ️  Sin cambios: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error limpiando ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🧹 Iniciando limpieza de código...\n');
  
  filesToClean.forEach(cleanFile);
  
  console.log('\n✨ Limpieza completada!');
  console.log('💡 Recuerda ejecutar: npm run lint -- --fix');
}

if (require.main === module) {
  main();
}

module.exports = { cleanFile, patterns }; 