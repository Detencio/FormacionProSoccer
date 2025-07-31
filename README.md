# ⚽ ProSoccer - Sistema de Gestión de Equipos de Fútbol

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

> **Sistema completo de gestión para equipos de fútbol con generador de equipos
> inteligente**

## 🚀 Características Principales

### 📊 **Dashboard Inteligente**

- Panel de control con estadísticas en tiempo real
- Gestión de equipos, jugadores y pagos
- Sistema de notificaciones integrado

### 🎯 **Team Generator Avanzado** ⭐ _NUEVO_

- **Generación inteligente de equipos** con algoritmos optimizados
- **Tipos de juego flexibles**: BabyFutbol (5v5), Futbolito (7v7), Fútbol 11
  (11v11)
- **Cancha interactiva** con drag & drop para posicionamiento
- **Sistema de intercambios** suplente ↔ titular con modal de confirmación
- **Posiciones personalizadas** que se preservan durante intercambios
- **Compartir equipos** con generación de imágenes dinámicas
- **Selección masiva** de jugadores (Seleccionar Todo, Por Posición, Aleatorio)
- **Jugadores invitados** temporales para simulaciones

### 👥 **Gestión de Equipos**

- Registro completo de equipos y jugadores
- Asignación de roles y posiciones específicas
- Historial de cambios y estadísticas

### 💰 **Sistema de Pagos**

- Gestión de cuotas mensuales
- Reportes financieros detallados
- Historial de transacciones

### 📈 **Gestión de Gastos**

- Registro y categorización de gastos
- Reportes de presupuesto
- Control financiero del club

### ⚽ **Gestión de Partidos** ⭐ _MEJORADO_

- **Calendario avanzado** con vista mensual y semanal
- **Sistema de email** con recordatorios automáticos
- **Gráficos interactivos** con estadísticas detalladas
- **Gestión de asistencia** con confirmaciones visuales
- **Notificaciones inteligentes** para partidos próximos
- **Sidebar de detalles** con múltiples pestañas
- **Creación avanzada** de partidos con validación
- **Lista de partidos** con filtros y búsqueda

### 🔐 **Sistema de Autenticación** ⭐ _NUEVO_

- **Refresh tokens automáticos** - Renovación transparente de sesiones
- **Interceptores inteligentes** - Manejo automático de tokens expirados
- **Seguridad mejorada** - Tokens duales (access + refresh)
- **Experiencia sin interrupciones** - No más errores de "Signature has expired"

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático completo
- **Tailwind CSS** - Framework de estilos
- **Zustand** - Gestión de estado global
- **React Hooks** - Lógica de componentes optimizada

### Backend

- **FastAPI** - API REST moderna y rápida
- **SQLAlchemy** - ORM para PostgreSQL
- **Pydantic** - Validación de datos
- **JWT** - Autenticación segura

### Herramientas de Desarrollo

- **Docker** - Containerización
- **PowerShell/Batch** - Scripts de automatización
- **Git** - Control de versiones

## 📚 Documentación

### 📋 Módulos Principales
- **[⚽ Módulo de Partidos](./docs/MATCHES_MODULE.md)** - Gestión completa de eventos deportivos
- **[🗺️ Roadmap de Partidos](./docs/MATCHES_ROADMAP.md)** - Plan de desarrollo y funcionalidades futuras
- **[📧 Email Best Practices](./docs/EMAIL_BEST_PRACTICES.md)** - Mejores prácticas para comunicaciones
- **[🎨 Componentes UI](./docs/COMPONENTS.md)** - Biblioteca de componentes reutilizables
- **[🔧 API Documentation](./docs/API.md)** - Documentación técnica de APIs
- **[🔐 Sistema de Autenticación](./docs/AUTH_REFRESH_TOKEN_IMPLEMENTATION.md)** - Refresh tokens y seguridad mejorada

### 🚀 Funcionalidades Futuras
- **📱 App Móvil**: Notificaciones push en tiempo real
- **🤖 IA Integrada**: Sugerencias inteligentes de horarios
- **📱 QR Codes**: Check-in rápido para jugadores

---

## 🚀 Instalación Rápida

### Requisitos Previos

- Node.js 18+
- Python 3.8+
- PostgreSQL 13+

### 1. Clonar Repositorio

```bash
git clone https://github.com/tu-usuario/formacion-pro-soccer.git
cd formacion-pro-soccer
```

### 2. Instalar Dependencias

```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Configurar Base de Datos

```bash
cd backend
python create_admin.py
python create_supervisor.py
python add_real_players.py
cd ..
```

### 4. Iniciar Servicios

```bash
# Inicio completo (recomendado)
.\start-simple.bat

# O manualmente
npm run dev          # Frontend (puerto 3000)
cd backend && uvicorn app.main:app --reload --port 9000  # Backend (puerto 9000)
```

## 🎮 Team Generator - Funcionalidades Avanzadas

### Tipos de Juego

```typescript
// BabyFutbol (5v5) - Partidos amistosos
formation: '1-2-2'; // Arquero, 2 Defensas, 2 Delanteros

// Futbolito (7v7) - Partidos amistosos
formation: '2-3-1'; // 2 Defensas, 3 Medios, 1 Delantero

// Fútbol 11 (11v11) - Partidos oficiales
formation: '4-4-2' | '4-3-3' | '3-5-2';
```

### Cancha Interactiva

- **Drag & Drop** para posicionamiento de jugadores
- **Zonas visuales** diferenciadas (arquero, defensa, mediocampo, ataque)
- **Posiciones personalizadas** que se preservan durante intercambios
- **Intercambios inteligentes** con modal de confirmación

### Algoritmos de Distribución

```typescript
// 5v5/7v7 - Posiciones referenciales (partidos amistosos)
- Distribución aleatoria de suplentes
- Flexibilidad en formaciones
- Sin restricciones estrictas de posiciones

// 11v11 - Posiciones estrictas (partidos oficiales)
- 1 portero por equipo obligatorio
- Distribución por habilidades
- Balance de equipos optimizado
```

### Gestión de Estado Avanzada

```typescript
// Preservación de posiciones personalizadas
const [customPositions, setCustomPositions] = useState<{
  [playerId: number]: Position;
}>({});

// Intercambio atómico sin estados intermedios
const swapTwoPlayers = useCallback(
  (substituteId: number, starterId: number) => {
    // Lógica de intercambio optimizada
  },
  [distribution]
);
```

## 📱 Interfaz de Usuario

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

## 🔐 Roles y Permisos

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

## 📊 Características Técnicas

### Optimizaciones de Rendimiento

- **React.memo** para componentes pesados
- **useCallback** y **useMemo** para optimizaciones
- **Lazy loading** de componentes
- **Virtualización** para listas grandes

### Type Safety

- TypeScript estricto en todo el proyecto
- Interfaces completas para todos los componentes
- Validación de tipos en tiempo de compilación

### Persistencia Inteligente

- **localStorage** para configuraciones
- **Preservación de posiciones** durante intercambios
- **Transferencia de posiciones** entre jugadores
- **Limpieza automática** solo en regeneraciones completas

## 🧪 Testing y Calidad

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

## 🚀 Deployment

### Scripts de Automatización

```batch
# Inicio completo
.\start-simple.bat

# Limpieza y reinicio
.\clean-dev.bat
```

### Docker Support

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - '3000:3000'

  backend:
    build: ./backend
    ports:
      - '9000:9000'

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=prosoccer
```

## 📚 Documentación

- [📖 Guía de Desarrollo](docs/DEVELOPMENT.md)
- [🎯 Team Generator](docs/TEAM_GENERATOR.md)
- [🔌 API Documentation](docs/API.md)
- [📊 Resumen General](docs/SUMMARY.md)

## 🤝 Contribución

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

## 🐛 Troubleshooting

### Errores Comunes

#### Puerto Ocupado

```bash
# Solución rápida
taskkill /f /im node.exe
taskkill /f /im python.exe
netstat -ano | findstr :3000
```

#### Dependencias

```bash
# Limpiar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Base de Datos

```bash
# Recrear base de datos
cd backend
python create_admin.py
python create_supervisor.py
python add_real_players.py
```

## 📈 Roadmap

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

## 📞 Contacto

- **Proyecto**: ProSoccer
- **Versión**: 1.0.0
- **Última actualización**: Julio 2025
- **Estado**: Completamente funcional

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para
más detalles.

---

**ProSoccer** - Construyendo el futuro del fútbol ⚽

_Desarrollado con ❤️ para la comunidad futbolística_
