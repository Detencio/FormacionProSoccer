# 🧹 Guía de Limpieza de Código - ProSoccer

## **Objetivo**
Mantener el código limpio y libre de errores de ESLint para facilitar el desarrollo y los commits.

## **Problemas Comunes**

### **1. Variables No Utilizadas**
```typescript
// ❌ Malo
const [showDetails, setShowDetails] = useState<number | null>(null);

// ✅ Bueno
// const [showDetails, setShowDetails] = useState<number | null>(null);
```

### **2. Console Statements**
```typescript
// ❌ Malo
console.log('🔍 DEBUG - nationality:', updateData.nationality);

// ✅ Bueno
// console.log('🔍 DEBUG - nationality:', updateData.nationality);
```

### **3. Tipos Any**
```typescript
// ❌ Malo
const handleEditTeam = (team: any) => {

// ✅ Bueno
const handleEditTeam = (team: Team) => {
```

## **Scripts de Limpieza**

### **Limpieza Automática**
```bash
# Limpiar console.logs y variables no usadas
npm run clean

# Limpiar y aplicar fixes de ESLint
npm run clean:all

# Solo aplicar fixes de ESLint
npm run lint:fix
```

### **Verificación de Tipos**
```bash
# Verificar tipos TypeScript
npm run type-check

# Linting completo
npm run lint
```

## **Configuración ESLint**

### **Reglas Configuradas**
```json
{
  "@typescript-eslint/no-unused-vars": "warn",
  "@typescript-eslint/no-explicit-any": "warn",
  "no-console": "warn",
  "react-hooks/exhaustive-deps": "warn"
}
```

### **Archivos Ignorados**
- `docs/` - Documentación
- `backend/` - Código Python
- `scripts/` - Scripts de utilidad
- `*.config.js` - Archivos de configuración

## **Flujo de Trabajo**

### **Antes de Commit**
1. **Ejecutar limpieza:**
   ```bash
   npm run clean:all
   ```

2. **Verificar tipos:**
   ```bash
   npm run type-check
   ```

3. **Si hay errores críticos:**
   ```bash
   git commit --no-verify -m "mensaje"
   ```

### **Durante Desarrollo**
- Usar `// TODO:` para marcar código temporal
- Comentar console.logs en lugar de eliminarlos
- Usar tipos específicos en lugar de `any`

## **Mejores Prácticas**

### **1. Console Statements**
```typescript
// Para debugging temporal
// console.log('DEBUG:', data);

// Para errores permanentes
console.error('Error:', error);

// Para warnings importantes
console.warn('Warning:', warning);
```

### **2. Variables No Utilizadas**
```typescript
// Prefijo con underscore para ignorar
const _unusedVariable = 'value';

// O comentar completamente
// const unusedVariable = 'value';
```

### **3. Tipos TypeScript**
```typescript
// Definir interfaces específicas
interface PlayerFormData {
  name: string;
  email: string;
  nationality: string;
  // ... más campos
}

// Usar en lugar de any
const handleSubmit = (formData: PlayerFormData) => {
```

## **Comandos Útiles**

### **Limpieza Rápida**
```bash
# Solo console.logs
npm run clean

# Todo incluido ESLint
npm run clean:all
```

### **Verificación Completa**
```bash
# Verificar todo
npm run lint && npm run type-check

# Fix automático
npm run lint:fix
```

### **Commit con Limpieza**
```bash
# Limpiar antes de commit
npm run clean:all && git add . && git commit -m "feat: nueva funcionalidad"
```

## **Troubleshooting**

### **Error: "Cannot find module"**
```bash
# Reinstalar dependencias
npm install

# Limpiar cache
npm run clean
```

### **Error: "Too many errors"**
```bash
# Commit temporal
git commit --no-verify -m "wip: trabajo en progreso"

# Limpiar después
npm run clean:all
```

### **Error: "ESLint configuration"**
```bash
# Verificar configuración
npx eslint --print-config src/app/teams/page.tsx
```

## **Mantenimiento**

### **Revisión Semanal**
- Ejecutar `npm run clean:all`
- Revisar archivos con más warnings
- Actualizar tipos TypeScript

### **Revisión Mensual**
- Actualizar reglas ESLint
- Revisar patrones de código
- Optimizar configuración

---

**Guía creada por:** Equipo de Desarrollo ProSoccer  
**Última actualización:** Julio 2025  
**Versión:** 1.0  

¡**Esta guía garantiza código limpio y commits sin problemas!** ⚽🧹✨ 