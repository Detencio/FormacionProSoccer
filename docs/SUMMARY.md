# Formación ProSoccer - Documentación General

## Descripción del Proyecto

**Formación ProSoccer** es una aplicación web completa para la gestión de equipos de fútbol, diseñada para administradores, supervisores y jugadores. El sistema incluye módulos para gestión de equipos, jugadores, pagos, gastos, partidos y un avanzado generador de equipos.

## Módulos Principales

### 🏠 **Dashboard**
- Panel de control principal
- Estadísticas generales
- Acceso rápido a módulos
- Notificaciones del sistema

### 👥 **Equipos**
- Gestión completa de equipos
- Registro de jugadores
- Asignación de roles y posiciones
- Historial de cambios

### 👤 **Jugadores**
- Perfiles detallados de jugadores
- Estadísticas de rendimiento
- Historial de pagos
- Gestión de posiciones específicas

### 💰 **Pagos**
- Sistema de pagos mensuales
- Reportes financieros
- Historial de transacciones
- Gestión de cuotas

### 📊 **Gastos**
- Registro de gastos del club
- Categorización de gastos
- Reportes de presupuesto
- Control de finanzas

### ⚽ **Partidos**
- Programación de partidos
- Resultados y estadísticas
- Gestión de calendario
- Historial de encuentros

### 🎯 **Team Generator** ⭐ *NUEVO*
- **Generación inteligente de equipos**
- **Tipos de juego**: BabyFutbol (5v5), Futbolito (7v7), Fútbol 11 (11v11)
- **Cancha interactiva** con drag & drop
- **Sistema de intercambios** suplente ↔ titular
- **Posiciones personalizadas** preservadas
- **Compartir equipos** con imágenes dinámicas
- **Selección masiva** de jugadores
- **Jugadores invitados** temporales

## Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño
- **Zustand** - Gestión de estado
- **React Hooks** - Lógica de componentes

### Backend
- **FastAPI** - API REST
- **SQLAlchemy** - ORM
- **PostgreSQL** - Base de datos
- **Pydantic** - Validación de datos
- **Uvicorn** - Servidor ASGI

### Herramientas de Desarrollo
- **Docker** - Containerización
- **PowerShell/Batch** - Scripts de inicio
- **Git** - Control de versiones

## Arquitectura del Sistema

### Estructura de Archivos
```
FormacionProSoccer/
├── src/
│   ├── app/                    # Páginas Next.js
│   ├── components/             # Componentes React
│   ├── hooks/                  # Hooks personalizados
│   ├── services/               # Servicios API
│   ├── store/                  # Estado global
│   ├── types/                  # Tipos TypeScript
│   └── utils/                  # Utilidades
├── backend/
│   ├── app/                    # API FastAPI
│   ├── models/                 # Modelos SQLAlchemy
│   └── schemas/                # Esquemas Pydantic
├── docs/                       # Documentación
└── scripts/                    # Scripts de inicio
```

### Patrones de Diseño
- **Component-Based Architecture** - Componentes reutilizables
- **Custom Hooks** - Lógica reutilizable
- **Service Layer** - Separación de responsabilidades
- **Type Safety** - Validación en tiempo de compilación

## Funcionalidades Avanzadas

### Team Generator - Características Destacadas

#### 🎮 **Tipos de Juego Flexibles**
```typescript
// BabyFutbol (5v5) - Partidos amistosos
formation: '1-2-2' // Arquero, 2 Defensas, 2 Delanteros

// Futbolito (7v7) - Partidos amistosos  
formation: '2-3-1' // 2 Defensas, 3 Medios, 1 Delantero

// Fútbol 11 (11v11) - Partidos oficiales
formation: '4-4-2' | '4-3-3' | '3-5-2'
```

#### 🏟️ **Cancha Interactiva**
- **Drag & Drop** para posicionamiento
- **Zonas visuales** diferenciadas
- **Posiciones personalizadas** preservadas
- **Intercambios inteligentes** suplente ↔ titular

#### 📊 **Algoritmos de Distribución**
```typescript
// 5v5/7v7 - Posiciones referenciales
- Distribución aleatoria de suplentes
- Flexibilidad en formaciones
- Sin restricciones estrictas de posiciones

// 11v11 - Posiciones estrictas
- 1 portero por equipo obligatorio
- Distribución por habilidades
- Balance de equipos optimizado
```

#### 💾 **Persistencia Inteligente**
- **localStorage** para configuraciones
- **Preservación de posiciones** durante intercambios
- **Transferencia de posiciones** entre jugadores
- **Limpieza automática** solo en regeneraciones completas

### Sistema de Autenticación

#### Roles y Permisos
```typescript
enum UserRole {
  ADMIN = 'admin',           // Acceso completo
  SUPERVISOR = 'supervisor', // Equipo específico
  PLAYER = 'player',         // Solo su equipo
  GUEST = 'guest'           // Sin acceso
}
```

#### Filtrado Inteligente
- **Administradores**: Ven todos los equipos
- **Supervisores**: Solo su equipo asignado
- **Jugadores**: Solo su equipo
- **Invitados**: Sin acceso al Team Generator

### Gestión de Estado

#### Zustand Store
```typescript
interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
```

#### Custom Hooks
```typescript
// useTeamGenerator
const {
  distribution,
  generateTeams,
  swapTwoPlayers,
  isGenerating
} = useTeamGenerator()

// useAuth
const {
  user,
  isAuthenticated,
  login,
  logout
} = useAuth()
```

## Optimizaciones de Rendimiento

### React Optimizations
- **React.memo** para componentes pesados
- **useCallback** para funciones estables
- **useMemo** para cálculos costosos
- **Lazy loading** de componentes

### API Optimizations
- **Caching** de datos frecuentes
- **Pagination** para listas grandes
- **Selective loading** de datos
- **Error boundaries** para manejo de errores

## Seguridad

### Autenticación
- **JWT tokens** para sesiones
- **Refresh tokens** para renovación automática
- **Role-based access control** (RBAC)
- **Session management** seguro

### Validación de Datos
- **Pydantic** en backend
- **TypeScript** en frontend
- **Input sanitization**
- **SQL injection protection**

## Deployment y DevOps

### Scripts de Inicio
```batch
# start-simple.bat
- Limpieza de puertos
- Inicio de backend (puerto 9000)
- Inicio de frontend (puerto 3000)
- Verificación de servicios
```

### Docker Support
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Testing y Calidad

### Estrategia de Testing
- **Unit tests** para utilidades
- **Integration tests** para APIs
- **E2E tests** para flujos críticos
- **Performance testing** para optimizaciones

### Code Quality
- **ESLint** para linting
- **Prettier** para formateo
- **TypeScript** para type checking
- **Git hooks** para pre-commit

## Roadmap y Futuras Mejoras

### Próximas Funcionalidades
- [ ] **Sistema de notificaciones push**
- [ ] **App móvil nativa**
- [ ] **Analytics avanzados**
- [ ] **Integración con redes sociales**
- [ ] **Sistema de torneos**

### Mejoras Técnicas
- [ ] **Microservicios** para escalabilidad
- [ ] **GraphQL** para APIs más eficientes
- [ ] **WebSockets** para tiempo real
- [ ] **PWA** para funcionalidad offline

## Contribución y Desarrollo

### Guías de Contribución
1. **Fork** del repositorio
2. **Feature branch** para cambios
3. **Tests** obligatorios
4. **Code review** antes de merge
5. **Documentación** actualizada

### Estándares de Código
- **Conventional Commits** para mensajes
- **Semantic Versioning** para releases
- **Changelog** mantenido
- **README** actualizado

---

## Información de Contacto

- **Proyecto**: Formación ProSoccer
- **Versión**: 2.0
- **Última actualización**: Diciembre 2024
- **Estado**: En desarrollo activo

---

*Documentación mantenida por el equipo de desarrollo de Formación ProSoccer* 