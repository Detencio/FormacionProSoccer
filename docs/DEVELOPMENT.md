# 🛠️ Guía de Desarrollo - Formación Pro Soccer

## 📋 Descripción

Esta guía establece los estándares de desarrollo, mejores prácticas y flujo de trabajo para el proyecto Formación Pro Soccer.

## 🏗️ Arquitectura del Proyecto

### Frontend (Next.js 14)
```
src/
├── 📁 app/                      # App Router (Next.js 14)
│   ├── 📁 team-generator/       # Módulo principal
│   ├── 📁 dashboard/            # Panel de control
│   ├── 📁 teams/                # Gestión de equipos
│   ├── 📁 players/              # Gestión de jugadores
│   ├── 📁 payments/             # Gestión de pagos
│   └── 📁 auth/                 # Autenticación
├── 📁 components/               # Componentes reutilizables
├── 📁 services/                 # Servicios y APIs
├── 📁 hooks/                    # Custom React hooks
├── 📁 lib/                      # Utilidades y configuraciones
├── 📁 store/                    # Estado global (Zustand)
└── 📁 types/                    # Definiciones TypeScript
```

### Backend (FastAPI)
```
backend/
├── 📁 app/                      # Aplicación principal
│   ├── main.py                  # Punto de entrada
│   ├── config.py                # Configuración
│   ├── database.py              # Base de datos
│   ├── auth.py                  # Autenticación
│   ├── models.py                # Modelos SQLAlchemy
│   ├── schemas.py               # Esquemas Pydantic
│   ├── crud.py                  # Operaciones CRUD
│   └── api/                     # Rutas de la API
├── 📁 tests/                    # Tests
├── 📁 alembic/                  # Migraciones
└── requirements.txt              # Dependencias
```

## 🎯 Estándares de Código

### TypeScript
```typescript
// ✅ Correcto
interface Player {
  id: number
  name: string
  skill: number
  position: string
  isPresent?: boolean
}

// ❌ Incorrecto
interface Player {
  id: any
  name: string
  skill: any
  position: string
  isPresent: any
}
```

### React Components
```typescript
// ✅ Componente funcional con hooks
import React, { useState, useEffect } from 'react'

interface TeamFormationProps {
  players: Player[]
  formation: string
  onPlayerMove?: (playerId: number, newPosition: string) => void
}

export default function TeamFormation({ 
  players, 
  formation, 
  onPlayerMove 
}: TeamFormationProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  
  useEffect(() => {
    // Lógica de efecto
  }, [players])
  
  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player)
  }
  
  return (
    <div className="team-formation">
      {/* JSX */}
    </div>
  )
}
```

### CSS/Tailwind
```css
/* ✅ Clases utilitarias de Tailwind */
.team-card {
  @apply bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg;
}

/* ✅ Variables CSS personalizadas */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}

/* ❌ Evitar CSS inline */
<div style={{ backgroundColor: 'blue', padding: '10px' }}>
```

## 📝 Convenciones de Nomenclatura

### Archivos y Carpetas
```
✅ Componentes: PascalCase
- TeamFormation.tsx
- PlayerCard.tsx
- PaymentDashboard.tsx

✅ Páginas: kebab-case
- team-generator/
- register-player/
- change-password/

✅ Utilidades: camelCase
- api.ts
- utils.ts
- constants.ts
```

### Variables y Funciones
```typescript
// ✅ Variables: camelCase
const playerName = 'Juan'
const isPlayerPresent = true
const teamPlayers = []

// ✅ Funciones: camelCase
const handlePlayerClick = () => {}
const generateBalancedTeams = () => {}
const updatePlayerPosition = () => {}

// ✅ Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000'
const MAX_PLAYERS_PER_TEAM = 11
const DEFAULT_SKILL_LEVEL = 3
```

### Interfaces y Tipos
```typescript
// ✅ Interfaces: PascalCase
interface Player {
  id: number
  name: string
  skill: number
}

interface TeamFormationProps {
  players: Player[]
  formation: string
}

// ✅ Tipos: PascalCase
type GameMode = 'babyfutbol' | 'futbolito' | 'futbol'
type PlayerPosition = 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero'
```

## 🧪 Testing

### Estructura de Tests
```
tests/
├── 📁 unit/                     # Tests unitarios
│   ├── components/              # Tests de componentes
│   ├── services/                # Tests de servicios
│   └── utils/                   # Tests de utilidades
├── 📁 integration/              # Tests de integración
├── 📁 e2e/                      # Tests end-to-end
└── 📁 fixtures/                 # Datos de prueba
```

### Ejemplo de Test
```typescript
// tests/unit/components/TeamFormation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import TeamFormation from '@/components/team-generator/TeamFormation'

describe('TeamFormation', () => {
  const mockPlayers = [
    { id: 1, name: 'Juan', skill: 4, position: 'Delantero' },
    { id: 2, name: 'Pedro', skill: 3, position: 'Defensa' }
  ]

  it('renders players correctly', () => {
    render(<TeamFormation players={mockPlayers} formation="1-2-2" />)
    
    expect(screen.getByText('Juan')).toBeInTheDocument()
    expect(screen.getByText('Pedro')).toBeInTheDocument()
  })

  it('handles player click', () => {
    const onPlayerClick = jest.fn()
    render(
      <TeamFormation 
        players={mockPlayers} 
        formation="1-2-2"
        onPlayerClick={onPlayerClick}
      />
    )
    
    fireEvent.click(screen.getByText('Juan'))
    expect(onPlayerClick).toHaveBeenCalledWith(mockPlayers[0])
  })
})
```

## 🔧 Configuración de Herramientas

### ESLint
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🚀 Flujo de Desarrollo

### 1. Configuración Inicial
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/formacion-pro-soccer.git
cd formacion-pro-soccer

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### 2. Desarrollo Diario
```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm run test

# Linting
npm run lint

# Formateo
npm run format
```

### 3. Git Workflow
```bash
# Crear rama para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push y crear Pull Request
git push origin feature/nueva-funcionalidad
```

### 4. Conventional Commits
```bash
# Tipos de commit
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de formato
refactor: refactorización
test: agregar tests
chore: tareas de mantenimiento

# Ejemplos
git commit -m "feat: agregar generador de equipos"
git commit -m "fix: corregir validación de asistencia"
git commit -m "docs: actualizar README"
```

## 📊 Métricas de Calidad

### Cobertura de Tests
```bash
# Ejecutar tests con cobertura
npm run test:coverage

# Meta: >80% de cobertura
```

### Performance
```bash
# Analizar bundle
npm run build
npm run analyze

# Core Web Vitals
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms
```

### Linting y Formateo
```bash
# Verificar código
npm run lint
npm run format:check

# Auto-fix
npm run lint:fix
npm run format
```

## 🔍 Debugging

### Frontend
```typescript
// Console logs estructurados
console.log('=== DEBUG ESTADO ===')
console.log('players:', players)
console.log('formation:', formation)
console.log('===================')

// React DevTools
// - Componentes
// - Estado
// - Props
// - Hooks
```

### Backend
```python
# Logging estructurado
import logging

logger = logging.getLogger(__name__)

def generate_teams(players, formation):
    logger.info(f"Generando equipos con {len(players)} jugadores")
    logger.debug(f"Formación: {formation}")
    
    try:
        # Lógica de generación
        result = generate_balanced_teams(players, formation)
        logger.info("Equipos generados exitosamente")
        return result
    except Exception as e:
        logger.error(f"Error generando equipos: {e}")
        raise
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build de producción
npm run build

# Verificar build
npm run start

# Deploy automático
git push origin main
```

### Backend (Railway/Heroku)
```bash
# Configurar variables de entorno
DATABASE_URL=postgresql://...
SECRET_KEY=tu-clave-secreta

# Deploy
git push heroku main
```

## 📚 Recursos Adicionales

### Documentación
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

### Herramientas
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- [Postman](https://www.postman.com) - Testing de APIs
- [Insomnia](https://insomnia.rest) - Cliente REST

### Comunidad
- [Stack Overflow](https://stackoverflow.com)
- [GitHub Discussions](https://github.com/tu-usuario/formacion-pro-soccer/discussions)
- [Discord](https://discord.gg/tu-servidor)

---

**Guía de Desarrollo** - Construyendo el futuro del fútbol ⚽ 