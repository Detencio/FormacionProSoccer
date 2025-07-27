# 🧩 Componentes - Formación Pro Soccer

## 📋 Descripción

Esta documentación describe todos los componentes reutilizables de la aplicación Formación Pro Soccer, organizados por módulos y funcionalidades.

## 🏗️ Estructura de Componentes

```
src/components/
├── 📁 team-generator/          # Componentes del generador de equipos
├── 📁 Layout/                  # Componentes de layout y navegación
├── 📁 teams/                   # Componentes de gestión de equipos
├── 📁 ui/                      # Componentes UI base
└── 📁 shared/                  # Componentes compartidos
```

## 🎯 Team Generator Components

### TeamFormation.tsx
**Ubicación**: `src/components/team-generator/TeamFormation.tsx`

**Propósito**: Visualización interactiva de la cancha de fútbol con jugadores posicionados.

**Props**:
```typescript
interface TeamFormationProps {
  players: Player[]
  formation: string
  onPlayerDragStart?: (player: Player) => void
  onPlayerDragOver?: (e: React.DragEvent) => void
  onPlayerDrop?: () => void
  onPositionChange?: (playerId: number, newPosition: string) => void
  onPlayerMove?: (playerId: number, fromPosition: string, toPosition: string) => void
  editable?: boolean
  customPlayersPerTeam?: number
  isTeamA?: boolean
}
```

**Características**:
- **Cancha virtual** con líneas profesionales
- **Tarjetas compactas** de jugadores (20x16)
- **Drag & drop** para ajustes manuales
- **Posiciones optimizadas** por formación
- **Responsive design** para móviles

**Uso**:
```tsx
<TeamFormation
  players={teamPlayers}
  formation="1-2-2-2"
  editable={true}
  onPositionChange={handlePositionChange}
  isTeamA={true}
/>
```

### PlayerList.tsx
**Ubicación**: `src/components/team-generator/PlayerList.tsx`

**Propósito**: Listado compacto de jugadores con acciones rápidas.

**Props**:
```typescript
interface PlayerListProps {
  players: Player[]
  onEdit?: (player: Player) => void
  onDelete?: (playerId: number) => void
  onEvaluate?: (playerId: number, stats: any) => void
  showEvaluation?: boolean
  enableEditing?: boolean
  onViewCard?: (player: Player) => void
}
```

**Características**:
- **Diseño compacto** con información esencial
- **Número de camiseta** prominente
- **Posición con color** (rojo=GK, azul=DEF, etc.)
- **Habilidad con estrellas** (★★★★☆)
- **Acciones rápidas** (ver, editar, evaluar, eliminar)

**Uso**:
```tsx
<PlayerList
  players={teamPlayers}
  onEdit={handleEditPlayer}
  onDelete={handleDeletePlayer}
  onViewCard={handleViewCard}
  enableEditing={true}
/>
```

### PlayerCardModal.tsx
**Ubicación**: `src/components/team-generator/PlayerCardModal.tsx`

**Propósito**: Modal con información completa del jugador.

**Props**:
```typescript
interface PlayerCardModalProps {
  player: Player | null
  onClose: () => void
}
```

**Características**:
- **Foto del jugador** con diseño circular
- **Información básica** (nombre, posición, habilidad)
- **Número de camiseta** destacado
- **Estadísticas detalladas** con colores por valor
- **Información de contacto** (email, teléfono)
- **Diseño profesional** con gradientes

**Uso**:
```tsx
<PlayerCardModal
  player={selectedPlayer}
  onClose={() => setShowModal(false)}
/>
```

## 🏠 Layout Components

### MainLayout.tsx
**Ubicación**: `src/components/Layout/MainLayout.tsx`

**Propósito**: Layout principal de la aplicación con navegación.

**Características**:
- **Header** con navegación principal
- **Sidebar** con menú lateral
- **Footer** con información de contacto
- **Responsive design** para móviles
- **Tema oscuro** por defecto

### Header.tsx
**Ubicación**: `src/components/Layout/Header.tsx`

**Propósito**: Header con navegación y acciones principales.

**Características**:
- **Logo** de la aplicación
- **Menú de navegación** principal
- **Acciones rápidas** (notificaciones, perfil)
- **Buscador** global
- **Indicador de estado** del sistema

### Sidebar.tsx
**Ubicación**: `src/components/Layout/Sidebar.tsx`

**Propósito**: Menú lateral con navegación secundaria.

**Características**:
- **Menú colapsable** para móviles
- **Iconos** descriptivos para cada sección
- **Indicador activo** de página actual
- **Submenús** para secciones complejas
- **Acceso rápido** a funciones principales

### Footer.tsx
**Ubicación**: `src/components/Layout/Footer.tsx`

**Propósito**: Footer con información de contacto y enlaces útiles.

**Características**:
- **Información de contacto** (email, teléfono)
- **Enlaces sociales** (Facebook, Instagram, WhatsApp)
- **Enlaces legales** (términos, privacidad)
- **Versión** de la aplicación
- **Copyright** y derechos reservados

## 🏆 Teams Components

### TeamCard.tsx
**Ubicación**: `src/components/teams/TeamCard.tsx`

**Propósito**: Tarjeta de equipo con información resumida.

**Props**:
```typescript
interface TeamCardProps {
  team: Team
  onEdit?: (team: Team) => void
  onDelete?: (teamId: number) => void
  onView?: (team: Team) => void
}
```

**Características**:
- **Logo del equipo** con diseño circular
- **Nombre y descripción** del equipo
- **Estadísticas** (jugadores, partidos, victorias)
- **Acciones rápidas** (ver, editar, eliminar)
- **Estado del equipo** (activo, inactivo)

### TeamModal.tsx
**Ubicación**: `src/components/teams/TeamModal.tsx`

**Propósito**: Modal para crear/editar equipos.

**Props**:
```typescript
interface TeamModalProps {
  team?: Team
  onClose: () => void
  onSave: (teamData: TeamFormData) => void
}
```

**Características**:
- **Formulario completo** para datos del equipo
- **Subida de logo** con preview
- **Selección de colores** del equipo
- **Validación** de campos requeridos
- **Diseño responsive** para móviles

### PlayerModal.tsx
**Ubicación**: `src/components/teams/PlayerModal.tsx`

**Propósito**: Modal para crear/editar jugadores.

**Props**:
```typescript
interface PlayerModalProps {
  player?: Player
  onClose: () => void
  onSave: (playerData: PlayerFormData) => void
}
```

**Características**:
- **Formulario completo** para datos del jugador
- **Subida de foto** con preview
- **Evaluación de habilidades** con sliders
- **Información de contacto** (email, teléfono)
- **Validación** de campos requeridos

## 🎨 UI Components

### Button.tsx
**Ubicación**: `src/components/ui/button.tsx`

**Propósito**: Componente de botón reutilizable con variantes.

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}
```

**Variantes**:
- **Primary**: Botón principal (azul)
- **Secondary**: Botón secundario (gris)
- **Danger**: Botón de peligro (rojo)
- **Success**: Botón de éxito (verde)

**Uso**:
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Generar Equipos
</Button>
```

### Input.tsx
**Ubicación**: `src/components/ui/input.tsx`

**Propósito**: Componente de input con validación y estados.

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
}
```

**Características**:
- **Validación** en tiempo real
- **Estados de error** con mensajes
- **Placeholder** dinámico
- **Accesibilidad** completa
- **Responsive design**

### Label.tsx
**Ubicación**: `src/components/ui/label.tsx`

**Propósito**: Componente de etiqueta para formularios.

**Props**:
```typescript
interface LabelProps {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
}
```

**Características**:
- **Indicador de campo requerido** (*)
- **Asociación** con inputs
- **Estilo consistente** en toda la app
- **Accesibilidad** para lectores de pantalla

## 🔐 Auth Components

### AuthGuard.tsx
**Ubicación**: `src/components/AuthGuard.tsx`

**Propósito**: Componente para proteger rutas que requieren autenticación.

**Props**:
```typescript
interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
}
```

**Características**:
- **Verificación** de autenticación
- **Control de roles** y permisos
- **Redirección** automática
- **Loading state** durante verificación
- **Fallback** para usuarios no autenticados

## 💰 Payment Components

### PaymentDashboard.tsx
**Ubicación**: `src/components/PaymentDashboard.tsx`

**Propósito**: Dashboard principal para gestión de pagos.

**Características**:
- **Resumen financiero** del mes
- **Gráficos** de ingresos y gastos
- **Lista de pagos** pendientes
- **Acciones rápidas** (nuevo pago, reporte)
- **Filtros** por fecha y estado

### PaymentNotifications.tsx
**Ubicación**: `src/components/PaymentNotifications.tsx`

**Propósito**: Sistema de notificaciones para pagos.

**Características**:
- **Notificaciones** de pagos vencidos
- **Recordatorios** automáticos
- **Estados** de notificación (leído, no leído)
- **Acciones** (marcar como leído, pagar)
- **Filtros** por tipo y fecha

### PlayerPaymentHistory.tsx
**Ubicación**: `src/components/PlayerPaymentHistory.tsx`

**Propósito**: Historial de pagos de un jugador específico.

**Características**:
- **Lista cronológica** de pagos
- **Estados** de pago (pagado, pendiente, vencido)
- **Detalles** de cada transacción
- **Filtros** por período
- **Exportación** a Excel

## 🧪 Testing Components

### TestComponent.tsx
**Ubicación**: `src/components/TestComponent.tsx`

**Propósito**: Componente para testing y desarrollo.

**Características**:
- **Funcionalidades de prueba** para desarrollo
- **Debugging** de estados
- **Validación** de props
- **Performance testing**
- **Accesibilidad testing**

## 🔧 Providers

### Providers.tsx
**Ubicación**: `src/components/Providers.tsx`

**Propósito**: Proveedores de contexto para la aplicación.

**Características**:
- **Theme provider** para temas
- **Auth provider** para autenticación
- **Toast provider** para notificaciones
- **Modal provider** para modales
- **Store provider** para estado global

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Componentes Responsive
- **Mobile-first** approach en todos los componentes
- **Touch-friendly** en dispositivos móviles
- **Desktop optimizado** para pantallas grandes
- **Tablet support** para dispositivos intermedios

## 🎨 Theming

### Variables CSS
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  
  --background-primary: #0f172a;
  --background-secondary: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
}
```

### Clases Utilitarias
```css
.fc-header { /* Header principal */ }
.fc-container { /* Contenedor principal */ }
.fc-button { /* Botón principal */ }
.fc-card { /* Tarjeta principal */ }
.fc-modal { /* Modal principal */ }
```

## 🚀 Performance

### Optimizaciones
- **Lazy loading** de componentes pesados
- **Memoización** con React.memo
- **Code splitting** por rutas
- **Image optimization** con Next.js
- **Bundle analysis** con webpack-bundle-analyzer

### Métricas
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **First Input Delay** < 100ms

## 📚 Uso de Componentes

### Patrón de Uso
```tsx
// 1. Importar componente
import { Button } from '@/components/ui/button'

// 2. Usar con props apropiadas
<Button variant="primary" size="md" onClick={handleClick}>
  Acción
</Button>

// 3. Componer componentes complejos
<TeamCard
  team={team}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Convenciones
- **Props opcionales** con valores por defecto
- **TypeScript** para tipado estricto
- **Prop drilling** mínimo
- **Composición** sobre herencia
- **Testing** para componentes críticos

---

**Componentes** - La base de la interfaz de usuario ⚽ 