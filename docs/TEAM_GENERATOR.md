# Módulo Team Generator

## Descripción General

El módulo **Team Generator** es una herramienta avanzada para la generación y gestión de equipos de fútbol. Permite crear formaciones dinámicas, gestionar jugadores, y simular partidos con funcionalidades de intercambio de jugadores y posicionamiento personalizado.

## Características Principales

### 🎯 **Gestión de Jugadores**
- **Filtrado por Equipos**: Vista diferenciada para administradores (todos los equipos) y supervisores (solo su equipo)
- **Jugadores Manuales**: Agregar jugadores invitados temporales para simulaciones
- **Selección Masiva**: Opciones de "Seleccionar Todo", "Deseleccionar Todo", "Seleccionar por Posición", "Seleccionar Aleatorio"
- **Previsualización**: Modal detallado con estadísticas completas del jugador

### ⚽ **Tipos de Juego**
- **BabyFutbol (5v5)**: Formación 1-2-2 (Arquero, 2 Defensas, 2 Delanteros)
- **Futbolito (7v7)**: Formación 2-3-1 (2 Defensas, 3 Medios, 1 Delantero)
- **Fútbol 11 (11v11)**: Formaciones completas (4-4-2, 4-3-3, 3-5-2)

### 🏟️ **Cancha Interactiva**
- **Posicionamiento Dinámico**: Arrastrar y soltar jugadores en la cancha
- **Zonas Visuales**: Áreas de arquero, defensa, mediocampo y ataque con colores diferenciados
- **Posiciones Personalizadas**: Guardar posiciones personalizadas de cada jugador
- **Preservación de Posiciones**: Mantener posiciones durante intercambios

### 🔄 **Sistema de Intercambios**
- **Intercambio Suplente ↔ Titular**: Modal de confirmación para intercambiar jugadores
- **Transferencia de Posiciones**: Las posiciones personalizadas se transfieren entre jugadores intercambiados
- **Preservación de Formación**: Solo se afectan los jugadores intercambiados, manteniendo las demás posiciones

### 💾 **Gestión de Configuraciones**
- **Guardar Equipos**: Persistencia en localStorage de configuraciones de equipos
- **Cargar Equipos**: Recuperar configuraciones guardadas previamente
- **Compartir Equipos**: Generación de imágenes dinámicas para compartir por WhatsApp, email, etc.

## Arquitectura Técnica

### Componentes Principales

#### `src/app/team-generator/page.tsx`
**Componente principal** que orquesta todo el módulo:
- Gestión de estado global (jugadores, equipos, configuraciones)
- Integración con hooks personalizados
- Manejo de notificaciones y feedback de usuario
- Persistencia en localStorage

#### `src/components/team-generator/PlayerCard.tsx`
**Tarjeta de jugador** con diseño profesional:
- Estadísticas en una sola fila (6 habilidades)
- Nivel de habilidad en círculo con número
- Icono de previsualización en hover
- Diseño sobrio y elegante

#### `src/components/team-generator/FootballField.tsx`
**Cancha interactiva** con funcionalidades avanzadas:
- Drag & Drop para posicionamiento
- Preservación de posiciones personalizadas
- Zonas visuales diferenciadas
- Integración con modal de intercambios

#### `src/components/team-generator/TeamManager.tsx`
**Gestor de equipos** con visualización lado a lado:
- Dos canchas simultáneas (Equipo A y B)
- Headers dinámicos según tipo de juego
- Integración con sistema de intercambios

#### `src/components/team-generator/SwapPlayerModal.tsx`
**Modal de intercambio** con confirmación:
- Lista de titulares disponibles
- Confirmación visual del intercambio
- Transferencia automática de posiciones

### Hooks Personalizados

#### `src/hooks/useTeamGenerator.ts`
**Lógica central** del generador de equipos:
```typescript
interface UseTeamGeneratorReturn {
  // Estado
  distribution: TeamDistribution
  isGenerating: boolean
  teamError: string | null
  
  // Funciones
  generateTeams: (players: Player[]) => void
  swapPlayer: (playerId: number) => void
  swapTwoPlayers: (substituteId: number, starterId: number) => void
  movePlayerInDistribution: (playerId: number, toTeam: 'home' | 'away', toRole: 'starter' | 'substitute') => void
}
```

### Utilidades

#### `src/utils/teamDistribution.ts`
**Algoritmos de distribución** de equipos:
- Distribución por habilidades y posiciones
- Lógica diferenciada para partidos amistosos vs oficiales
- Distribución aleatoria de suplentes para 5v5/7v7

## Flujo de Trabajo

### 1. **Configuración Inicial**
```typescript
// Seleccionar tipo de juego
gameType: '5v5' | '7v7' | '11v11'

// Seleccionar formación
formation: TeamFormation | null

// Filtrar jugadores (solo admin)
selectedTeam: number | null
```

### 2. **Selección de Jugadores**
```typescript
// Selección individual
onPlayerSelect: (player: Player) => void
onPlayerDeselect: (player: Player) => void

// Selección masiva
selectAllPlayers: () => void
deselectAllPlayers: () => void
selectByPosition: (position: string) => void
selectRandom: (count: number) => void
```

### 3. **Generación de Equipos**
```typescript
// Generar equipos automáticamente
generateTeams: (players: Player[]) => void

// Distribución inteligente
- 11v11: Posiciones estrictas (1 POR por equipo)
- 5v5/7v7: Posiciones referenciales (flexibles)
```

### 4. **Gestión de Posiciones**
```typescript
// Posiciones personalizadas
customPositions: { [playerId: number]: Position }

// Preservación durante intercambios
transferPositions: (substituteId: number, starterId: number) => void
```

### 5. **Intercambio de Jugadores**
```typescript
// Abrir modal de intercambio
handleSwapPlayer: (playerId: number) => void

// Confirmar intercambio
handleSwapConfirm: (substituteId: number, starterId: number) => void

// Transferir posiciones
setCustomPositions: (positions: { [playerId: number]: Position }) => void
```

## Configuraciones de Juego

### BabyFutbol (5v5)
```typescript
const formation5v5 = {
  name: '1-2-2',
  label: 'BabyFutbol',
  positions: [
    { x: 50, y: 85, role: 'POR', zone: 'goalkeeper' },
    { x: 30, y: 60, role: 'DEF', zone: 'defense' },
    { x: 70, y: 60, role: 'DEF', zone: 'defense' },
    { x: 30, y: 35, role: 'DEL', zone: 'attack' },
    { x: 70, y: 35, role: 'DEL', zone: 'attack' }
  ]
}
```

### Futbolito (7v7)
```typescript
const formation7v7 = {
  name: '2-3-1',
  label: 'Futbolito',
  positions: [
    { x: 50, y: 85, role: 'POR', zone: 'goalkeeper' },
    { x: 30, y: 70, role: 'DEF', zone: 'defense' },
    { x: 70, y: 70, role: 'DEF', zone: 'defense' },
    { x: 25, y: 50, role: 'MED', zone: 'midfield' },
    { x: 50, y: 50, role: 'MED', zone: 'midfield' },
    { x: 75, y: 50, role: 'MED', zone: 'midfield' },
    { x: 50, y: 30, role: 'DEL', zone: 'attack' }
  ]
}
```

## Persistencia de Datos

### localStorage Keys
```typescript
const STORAGE_KEYS = {
  TEAM_GENERATOR_CONFIG: 'teamGeneratorConfig',
  SAVED_TEAMS: 'savedTeams',
  SELECTED_PLAYERS: 'selectedPlayers' // No se usa para evitar pre-selección
}
```

### Estructura de Configuración
```typescript
interface TeamGeneratorConfig {
  gameType: '5v5' | '7v7' | '11v11'
  formation: TeamFormation | null
  manualPlayers: number[] // IDs de jugadores manuales
  // selectedPlayers: number[] // Comentado para evitar pre-selección
}
```

## Notificaciones y Feedback

### Sistema de Notificaciones
```typescript
interface Notification {
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

const showNotification = (notification: Notification) => void
```

### Mensajes Comunes
- ✅ "Equipos generados exitosamente"
- ✅ "Jugador intercambiado correctamente"
- ✅ "Equipos guardados exitosamente"
- ❌ "Error al generar equipos"
- ❌ "No hay suficientes jugadores seleccionados"

## Compartir Equipos

### Generación de Imágenes
```typescript
const generateTeamsImage = (teams: TeamDistribution) => Promise<Blob>
```

### Características de la Imagen
- Formato PNG con fondo transparente
- Información completa de equipos
- Estadísticas de balance
- Fecha y hora de generación
- Formación y tipo de juego

## Roles y Permisos

### Administrador
- ✅ Ver todos los equipos y jugadores
- ✅ Filtrar por equipo específico
- ✅ Acceso completo a todas las funcionalidades

### Supervisor
- ✅ Ver solo jugadores de su equipo
- ✅ No necesita filtro de equipo
- ✅ Acceso completo a funcionalidades

### Jugador
- ❌ No puede acceder al Team Generator

### Invitado
- ❌ No puede acceder al Team Generator

## Optimizaciones de Rendimiento

### React.memo y useCallback
```typescript
const PlayerCard = React.memo(({ player, onSelect, onDeselect }) => {
  const handleClick = useCallback(() => {
    // Lógica de selección
  }, [player.id, isSelected])
})
```

### useMemo para Cálculos Costosos
```typescript
const assignPlayersToPositions = useMemo(() => {
  // Lógica de asignación de posiciones
}, [team.starters, customPositions, gameType, formation])
```

## Debugging y Logs

### Logs de Desarrollo
```typescript
console.log('FootballField - Custom positions:', customPositions)
console.log('FootballField - Posiciones personalizadas ANTES del intercambio:', customPositions)
console.log('useTeamGenerator - Distribución actualizada:', distribution)
```

### Información de Debug
- Posiciones personalizadas
- Estado de intercambios
- Distribución de equipos
- Errores y validaciones

## Consideraciones de UX

### Diseño Responsivo
- Layout adaptativo para diferentes tamaños de pantalla
- Canchas lado a lado en pantallas grandes
- Scroll horizontal en pantallas pequeñas

### Accesibilidad
- Controles de teclado para navegación
- Textos alternativos para imágenes
- Contraste adecuado en colores

### Feedback Visual
- Estados de carga durante generación
- Indicadores de selección
- Animaciones suaves en transiciones

## Mantenimiento y Escalabilidad

### Estructura Modular
- Componentes reutilizables
- Hooks personalizados
- Utilidades separadas

### Tipado TypeScript
- Interfaces completas
- Tipos estrictos
- Validación en tiempo de compilación

### Testing
- Componentes testables
- Funciones puras
- Estados predecibles

---

*Documentación actualizada: Diciembre 2024*
*Versión: 2.0 - Team Generator Avanzado* 