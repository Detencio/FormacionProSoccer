# ⚽ Formación Pro Soccer - Generador de Equipos Profesional

## 📋 Descripción del Proyecto

**Formación Pro Soccer** es una aplicación web moderna para la gestión y generación automática de equipos de fútbol. Diseñada para clubes deportivos, entrenadores y organizadores de partidos, ofrece una interfaz intuitiva y profesional para crear formaciones equilibradas basadas en las habilidades de los jugadores.

## 🎯 Características Principales

### 🏆 Generador de Equipos Inteligente
- **Algoritmo de balanceo automático** basado en habilidades de jugadores
- **Múltiples modos de juego**: Baby Fútbol (5v5), Futbolito (7v7), Fútbol (11v11)
- **Formaciones personalizables** con posiciones optimizadas
- **Visualización en tiempo real** de formaciones en cancha virtual

### 👥 Gestión de Jugadores
- **Perfiles completos** con estadísticas detalladas
- **Sistema de asistencia** para partidos
- **Evaluación de habilidades** con métricas específicas
- **Historial de rendimiento** y estadísticas

### 🎨 Interfaz Profesional
- **Diseño EA SPORTS FC** con gradientes y efectos visuales
- **Tarjetas compactas** de jugadores en cancha
- **Listado optimizado** de jugadores por equipo
- **Modales informativos** con detalles completos

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
FormacionProSoccer/
├── 📁 src/                          # Código fuente principal
│   ├── 📁 app/                      # Páginas Next.js 14 (App Router)
│   │   ├── 📁 team-generator/       # Módulo principal de generación
│   │   ├── 📁 dashboard/            # Panel de control
│   │   ├── 📁 teams/                # Gestión de equipos
│   │   ├── 📁 players/              # Gestión de jugadores
│   │   └── 📁 auth/                 # Autenticación
│   ├── 📁 components/               # Componentes reutilizables
│   │   ├── 📁 team-generator/       # Componentes específicos
│   │   ├── 📁 Layout/               # Componentes de layout
│   │   ├── 📁 teams/                # Componentes de equipos
│   │   └── 📁 ui/                   # Componentes UI base
│   ├── 📁 services/                 # Servicios y APIs
│   ├── 📁 hooks/                    # Custom React hooks
│   ├── 📁 lib/                      # Utilidades y configuraciones
│   ├── 📁 store/                    # Estado global (Zustand)
│   └── 📁 types/                    # Definiciones TypeScript
├── 📁 backend/                      # API REST (Python/FastAPI)
├── 📁 public/                       # Assets estáticos
└── 📁 docs/                         # Documentación técnica
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **Zustand** - Gestión de estado
- **React Hook Form** - Manejo de formularios

### Backend
- **Python 3.11+** - Lenguaje principal
- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para base de datos
- **PostgreSQL** - Base de datos principal
- **Pydantic** - Validación de datos

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Jest** - Testing framework
- **Git** - Control de versiones

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- Python 3.11+
- PostgreSQL 14+

### Instalación Frontend
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/formacion-pro-soccer.git
cd formacion-pro-soccer

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar en desarrollo
npm run dev
```

### Instalación Backend
```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
python create_admin.py

# Ejecutar servidor
uvicorn app.main:app --reload
```

## 🎮 Uso de la Aplicación

### 1. Configuración Inicial
1. **Seleccionar Equipo**: Elegir el equipo base con jugadores
2. **Modo de Juego**: Seleccionar formato (5v5, 7v7, 11v11)
3. **Configurar Asistencia**: Marcar jugadores presentes

### 2. Generación de Equipos
1. **Revisar Asistencia**: Verificar jugadores disponibles
2. **Generar Equipos**: Clic en "Generar Equipos"
3. **Visualizar Formación**: Revisar posiciones en cancha
4. **Ajustar Manualmente**: Mover jugadores si es necesario

### 3. Gestión Avanzada
- **Evaluar Jugadores**: Asignar estadísticas detalladas
- **Gestionar Reservas**: Manejar jugadores suplentes
- **Exportar Datos**: Generar reportes en Excel
- **Compartir Equipos**: Enviar formaciones por WhatsApp

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Formación Pro Soccer

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/formacion_pro
SECRET_KEY=tu-clave-secreta-aqui
```

### Configuración de Base de Datos
```sql
-- Crear base de datos
CREATE DATABASE formacion_pro;

-- Ejecutar migraciones
python -m alembic upgrade head
```

## 📚 Documentación de Módulos

### 🎯 Módulo Team Generator
**Ubicación**: `src/app/team-generator/`

**Funcionalidades**:
- Generación automática de equipos balanceados
- Visualización de formaciones en cancha virtual
- Gestión de asistencia de jugadores
- Configuración de modos de juego

**Componentes Principales**:
- `page.tsx` - Página principal del generador
- `TeamFormation.tsx` - Visualización de cancha
- `PlayerList.tsx` - Listado de jugadores
- `PlayerCardModal.tsx` - Modal de detalles

### 👥 Módulo de Jugadores
**Ubicación**: `src/app/register-player/`

**Funcionalidades**:
- Registro de nuevos jugadores
- Edición de perfiles existentes
- Evaluación de habilidades
- Gestión de fotos y datos personales

### 🏆 Módulo de Equipos
**Ubicación**: `src/app/teams/`

**Funcionalidades**:
- Creación y gestión de equipos
- Asignación de jugadores
- Visualización de plantillas
- Estadísticas de equipo

### 💰 Módulo de Pagos
**Ubicación**: `src/app/payments/`

**Funcionalidades**:
- Gestión de cuotas mensuales
- Historial de pagos
- Notificaciones de vencimiento
- Reportes financieros

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Coverage
npm run test:coverage
```

### Estructura de Tests
```
tests/
├── unit/                    # Tests unitarios
├── integration/             # Tests de integración
├── e2e/                    # Tests end-to-end
└── fixtures/               # Datos de prueba
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build de producción
npm run build

# Deploy automático
git push origin main
```

### Backend (Railway/Heroku)
```bash
# Configurar variables de entorno
# Deploy automático desde GitHub
```

## 📊 Monitoreo y Analytics

### Métricas de Rendimiento
- **Core Web Vitals** - Optimización de UX
- **Error Tracking** - Sentry para errores
- **Performance Monitoring** - Vercel Analytics

### Logs y Debugging
- **Structured Logging** - Winston para backend
- **Error Boundaries** - React error handling
- **Development Tools** - React DevTools

## 🤝 Contribución

### Guías de Contribución
1. **Fork del repositorio**
2. **Crear rama feature**: `git checkout -b feature/nueva-funcionalidad`
3. **Commit cambios**: `git commit -m 'feat: agregar nueva funcionalidad'`
4. **Push a rama**: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

### Estándares de Código
- **ESLint** - Reglas de linting
- **Prettier** - Formateo automático
- **TypeScript** - Tipado estricto
- **Conventional Commits** - Mensajes de commit

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño UI/UX**: [Diseñador]
- **Testing**: [QA Engineer]

## 📞 Soporte

- **Email**: soporte@formacionprosoccer.com
- **Documentación**: [Link a docs]
- **Issues**: [GitHub Issues]

---

**Formación Pro Soccer** - Generando equipos profesionales desde 2024 ⚽ 