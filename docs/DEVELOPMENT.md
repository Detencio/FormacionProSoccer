# 🛠️ Guía de Desarrollo - Formación Pro Soccer

## 🎯 **Descripción General**

Esta guía proporciona información completa para desarrolladores que trabajen en
el proyecto **ProSoccer**. Incluye configuración del entorno, arquitectura del
sistema, patrones de desarrollo y mejores prácticas implementadas.

---

## 🚀 **Configuración del Entorno**

### **Requisitos Previos**

- **Node.js** 18.0.0 o superior
- **Python** 3.8 o superior
- **PostgreSQL** 12 o superior
- **Git** para control de versiones

### **Instalación Rápida**

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/formacion-pro-soccer.git
cd formacion-pro-soccer

# 2. Instalar dependencias frontend
npm install

# 3. Configurar entorno virtual Python
python -m venv backend/venv
backend\venv\Scripts\activate  # Windows
source backend/venv/bin/activate  # Linux/Mac

# 4. Instalar dependencias backend
pip install -r backend/requirements.txt

# 5. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 6. Iniciar desarrollo
.\start-simple.bat
```

### **Scripts de Desarrollo**

```bash
# Iniciar servidores
.\start-simple.bat

# Validar dependencias
.\validate-dependencies.bat

# Limpiar puertos
.\kill-ports.bat

# Limpiar caché
npm run clean
```

---

## 🏗️ **Arquitectura del Sistema**

### **Estructura de Directorios**

```
FormacionProSoccer/
├── src/                          # Frontend (Next.js 14)
│   ├── app/                     # App Router
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── team-generator/      # Generador de equipos ⭐
│   │   ├── teams/              # Gestión de equipos
│   │   ├── payments/           # Sistema de pagos
│   │   ├── expenses/           # Gestión de gastos
│   │   └── matches/            # Gestión de partidos
│   ├── components/             # Componentes reutilizables
│   │   ├── team-generator/     # Componentes del generador
│   │   ├── Layout/             # Layout y navegación
│   │   └── ui/                 # Componentes UI base
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # Servicios de API
│   ├── store/                  # Estado global (Zustand)
│   ├── types/                  # Definiciones TypeScript
│   └── utils/                  # Utilidades
├── backend/                     # Backend (FastAPI)
│   ├── app/
│   │   ├── models.py           # Modelos de base de datos
│   │   ├── schemas.py          # Esquemas Pydantic
│   │   ├── crud.py            # Operaciones CRUD
│   │   ├── auth.py            # Autenticación JWT
│   │   └── main.py            # Aplicación principal
│   ├── requirements.txt        # Dependencias Python
│   └── database.py            # Configuración DB
├── docs/                       # Documentación
├── public/                     # Assets estáticos
└── scripts/                    # Scripts de automatización
```

### **Patrones de Diseño Implementados**

#### **1. Component-Based Architecture**

```typescript
// Componente modular y reutilizable
const PlayerCard = memo(({ player, isSelected, onSelect, onDeselect }) => {
  const handleClick = useCallback(() => {
    isSelected ? onDeselect(player.id) : onSelect(player.id)
  }, [player.id, isSelected, onSelect, onDeselect])

  return (
    <div className={`player-card ${isSelected ? 'selected' : ''}`}>
      {/* Contenido del componente */}
    </div>
  )
})
```

#### **2. Custom Hooks Pattern**

```typescript
// useTeamGenerator.ts
const useTeamGenerator = () => {
  const [state, setState] = useState<TeamGeneratorState>({
    selectedPlayers: [],
    distribution: null,
    isGenerating: false,
    gameType: '5v5',
    formation: null,
  });

  const generateTeams = useCallback(async (players: Player[]) => {
    // Lógica de generación
  }, []);

  const swapTwoPlayers = useCallback(
    (substituteId: number, starterId: number) => {
      // Lógica de intercambio
    },
    []
  );

  return {
    ...state,
    generateTeams,
    swapTwoPlayers,
  };
};
```

#### **3. Service Layer Pattern**

```typescript
// services/teamGeneratorService.ts
export const teamGeneratorService = {
  async generateTeams(
    players: Player[],
    gameType: string
  ): Promise<TeamDistribution> {
    const response = await api.post('/teams/generate', { players, gameType });
    return response.data;
  },

  async saveTeams(teams: TeamDistribution): Promise<void> {
    await api.post('/teams/save', teams);
  },
};
```

---

## 🎮 **Team Generator - Funcionalidades Avanzadas**

### **1. Sistema de Posiciones Personalizadas**

#### **Implementación de Drag & Drop**

```typescript
// FootballField.tsx
const handleMouseDown = (e: React.MouseEvent, player: Player) => {
  e.preventDefault();
  e.stopPropagation();

  setDraggedPlayer(player);
  setDragStart({ x: e.clientX, y: e.clientY });

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const handleMouseMove = useCallback(
  (e: MouseEvent) => {
    if (!draggedPlayer || !fieldRef.current) return;

    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCustomPositions(prev => ({
      ...prev,
      [draggedPlayer.id]: {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
        role: 'starter',
        zone: getZoneFromPosition(x, y),
      },
    }));
  },
  [draggedPlayer]
);
```

#### **Preservación Durante Swaps**

```typescript
const handleSwapConfirm = (substituteId: number, starterId: number) => {
  // Transferir posiciones personalizadas
  setCustomPositions(prev => {
    const newPositions = { ...prev };
    const substitutePosition = newPositions[substituteId];
    const starterPosition = newPositions[starterId];

    delete newPositions[substituteId];
    delete newPositions[starterId];

    if (substitutePosition) {
      newPositions[starterId] = substitutePosition;
    }
    if (starterPosition) {
      newPositions[substituteId] = starterPosition;
    }

    return newPositions;
  });

  // Ejecutar intercambio
  onSwapTwoPlayers(substituteId, starterId);
};
```

### **2. Algoritmos de Distribución Inteligente**

#### **Para Partidos Amistosos (5v5/7v7)**

```typescript
// utils/teamDistribution.ts
const calculateTeamDistribution = (players: Player[], gameType: string) => {
  const isInternalMatch = ['5v5', '7v7'].includes(gameType);

  if (isInternalMatch) {
    // Distribución flexible para partidos amistosos
    const shuffledPlayers = shuffleArray([...players]);
    const midPoint = Math.ceil(shuffledPlayers.length / 2);

    const teamA = shuffledPlayers.slice(0, midPoint);
    const teamB = shuffledPlayers.slice(midPoint);

    // Distribuir suplentes aleatoriamente
    const remainingPlayers = players.filter(
      p => !teamA.includes(p) && !teamB.includes(p)
    );

    remainingPlayers.forEach(player => {
      if (Math.random() > 0.5) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });

    return { teamA, teamB };
  }
};
```

#### **Para Partidos Oficiales (11v11)**

```typescript
const strictPositionDistribution = (players: Player[]) => {
  // Separar por posiciones
  const goalkeepers = players.filter(p => p.position === 'POR');
  const defenders = players.filter(p => p.position === 'DEF');
  const midfielders = players.filter(p => p.position === 'MED');
  const forwards = players.filter(p => p.position === 'DEL');

  // Asignar 1 portero por equipo
  const teamA = [goalkeepers[0]];
  const teamB = [goalkeepers[1]];

  // Distribuir resto por habilidades
  const remainingPlayers = [...defenders, ...midfielders, ...forwards];
  const sortedBySkill = remainingPlayers.sort(
    (a, b) => calculateAverageSkill(b) - calculateAverageSkill(a)
  );

  // Distribución alternada para balance
  sortedBySkill.forEach((player, index) => {
    if (index % 2 === 0) {
      teamA.push(player);
    } else {
      teamB.push(player);
    }
  });

  return { teamA, teamB };
};
```

### **3. Generación de Imágenes para Compartir**

#### **Canvas API Implementation**

```typescript
const generateTeamsImage = async (
  teams: TeamDistribution,
  formation: Formation
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 600;

  // Fondo
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Formación Pro Soccer', canvas.width / 2, 40);

  // Equipos
  drawTeam(ctx, teams.teamA, 'Equipo A', 50, 100);
  drawTeam(ctx, teams.teamB, 'Equipo B', 50, 350);

  // Formación
  ctx.fillStyle = '#888888';
  ctx.font = '16px Arial';
  ctx.fillText(`Formación: ${formation.name}`, canvas.width / 2, 580);

  return new Promise<Blob>(resolve => {
    canvas.toBlob(blob => {
      resolve(blob!);
    }, 'image/png');
  });
};
```

---

## ⚡ **Optimizaciones de Rendimiento**

### **1. React Optimizations**

#### **React.memo para Componentes Pesados**

```typescript
const PlayerCard = memo(({ player, isSelected, onSelect, onDeselect }) => {
  const handleClick = useCallback(() => {
    isSelected ? onDeselect(player.id) : onSelect(player.id)
  }, [player.id, isSelected, onSelect, onDeselect])
  
  return (
    <div className={`player-card ${isSelected ? 'selected' : ''}`}>
      {/* Contenido optimizado */}
    </div>
  )
}, (prevProps, nextProps) => {
  // Comparación personalizada para evitar re-renders innecesarios
  return prevProps.player.id === nextProps.player.id &&
         prevProps.isSelected === nextProps.isSelected
})
```

#### **useCallback para Funciones Estables**

```typescript
const handlePlayerSelect = useCallback((playerId: number) => {
  setSelectedPlayers(prev => [...prev, playerId]);
}, []);

const handlePlayerDeselect = useCallback((playerId: number) => {
  setSelectedPlayers(prev => prev.filter(id => id !== playerId));
}, []);
```

#### **useMemo para Cálculos Costosos**

```typescript
const filteredPlayers = useMemo(() => {
  return allPlayers.filter(player => {
    if (teamFilter && player.team !== teamFilter) return false;
    if (positionFilter && player.position !== positionFilter) return false;
    return true;
  });
}, [allPlayers, teamFilter, positionFilter]);

const teamStats = useMemo(() => {
  return calculateTeamStats(distribution);
}, [distribution]);
```

### **2. Bundle Optimization**

#### **Code Splitting**

```typescript
// Lazy loading de componentes pesados
const PlayerPreviewModal = lazy(() => import('./PlayerPreviewModal'))
const AddManualPlayerModal = lazy(() => import('./AddManualPlayerModal'))

// Suspense para componentes lazy
<Suspense fallback={<div>Cargando...</div>}>
  <PlayerPreviewModal />
</Suspense>
```

#### **Tree Shaking**

```typescript
// Importaciones específicas para reducir bundle size
import { FaFutbol, FaUsers } from 'react-icons/fa';
import { PieChart, BarChart } from 'recharts';
```

### **3. API Optimizations**

#### **Caching con React Query**

```typescript
const { data: players, isLoading } = useQuery({
  queryKey: ['players', teamFilter],
  queryFn: () => teamService.getPlayers(teamFilter),
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
});
```

#### **Pagination para Listas Grandes**

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['players'],
  queryFn: ({ pageParam = 1 }) =>
    teamService.getPlayers({ page: pageParam, limit: 20 }),
  getNextPageParam: lastPage => lastPage.nextPage,
});
```

---

## 🔐 **Sistema de Autenticación y Seguridad**

### **1. JWT Authentication**

```typescript
// services/authService.ts
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { access_token, user } = response.data;

    // Guardar token
    localStorage.setItem('token', access_token);

    return { access_token, user };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    // Limpiar estado global
  },

  async refreshToken(): Promise<string> {
    const response = await api.post('/auth/refresh');
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    return access_token;
  },
};
```

### **2. Role-Based Access Control**

```typescript
// hooks/useAuth.ts
interface User {
  id: number;
  email: string;
  role: 'admin' | 'supervisor' | 'player' | 'guest';
  team_id?: number;
}

const useAuth = () => {
  const { user, isAuthenticated } = useAuthStore();

  const canAccessTeamGenerator = useMemo(() => {
    return ['admin', 'supervisor'].includes(user?.role || '');
  }, [user?.role]);

  const canViewAllTeams = useMemo(() => {
    return user?.role === 'admin';
  }, [user?.role]);

  return {
    user,
    isAuthenticated,
    canAccessTeamGenerator,
    canViewAllTeams,
  };
};
```

### **3. API Security**

```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expirado, intentar refresh
      try {
        const newToken = await authService.refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      } catch {
        // Refresh falló, redirigir a login
        authService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 🧪 **Testing y Calidad de Código**

### **1. Unit Testing**

```typescript
// __tests__/utils/teamDistribution.test.ts
import {
  calculateTeamDistribution,
  calculateAverageSkill,
} from '@/utils/teamDistribution';

describe('Team Distribution', () => {
  test('should distribute players correctly for 5v5', () => {
    const players = createMockPlayers(10);
    const result = calculateTeamDistribution(players, '5v5');

    expect(result.teamA).toHaveLength(5);
    expect(result.teamB).toHaveLength(5);
  });

  test('should preserve goalkeeper requirement for 11v11', () => {
    const players = createMockPlayers(22);
    const result = calculateTeamDistribution(players, '11v11');

    const teamAGoalkeepers = result.teamA.filter(p => p.position === 'POR');
    const teamBGoalkeepers = result.teamB.filter(p => p.position === 'POR');

    expect(teamAGoalkeepers).toHaveLength(1);
    expect(teamBGoalkeepers).toHaveLength(1);
  });
});
```

### **2. Component Testing**

```typescript
// __tests__/components/PlayerCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import PlayerCard from '@/components/team-generator/PlayerCard'

describe('PlayerCard', () => {
  const mockPlayer = {
    id: 1,
    name: 'Test Player',
    position: 'DEF',
    skill_level: 8
  }

  test('should display player information correctly', () => {
    render(<PlayerCard player={mockPlayer} isSelected={false} />)

    expect(screen.getByText('Test Player')).toBeInTheDocument()
    expect(screen.getByText('DEF')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  test('should call onSelect when clicked', () => {
    const onSelect = jest.fn()
    render(<PlayerCard player={mockPlayer} isSelected={false} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(mockPlayer.id)
  })
})
```

### **3. E2E Testing**

```typescript
// tests/e2e/team-generator.spec.ts
import { test, expect } from '@playwright/test';

test('should generate teams successfully', async ({ page }) => {
  await page.goto('/team-generator');

  // Seleccionar jugadores
  await page.click('[data-testid="player-card-1"]');
  await page.click('[data-testid="player-card-2"]');

  // Generar equipos
  await page.click('[data-testid="generate-teams"]');

  // Verificar que se generaron los equipos
  await expect(page.locator('[data-testid="team-a"]')).toBeVisible();
  await expect(page.locator('[data-testid="team-b"]')).toBeVisible();
});
```

### **4. Code Quality Tools**

#### **ESLint Configuration**

```javascript
// .eslintrc.js
module.exports = {
  extends: ['next/core-web-vitals', '@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react-hooks/exhaustive-deps': 'error',
  },
};
```

#### **Prettier Configuration**

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

---

## 🚀 **Deployment y DevOps**

### **1. Scripts de Automatización**

```bash
# start-simple.bat
@echo off
echo ========================================
echo   FORMACION PROSOCCER - TEAM GENERATOR
echo ========================================

# Limpiar puertos
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

# Iniciar backend
start "Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 9000"

# Iniciar frontend
start "Frontend" cmd /k "npm run dev"

echo Servidores iniciados correctamente
```

### **2. Docker Configuration**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
```

### **3. Environment Variables**

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:9000
NEXT_PUBLIC_APP_NAME=Formación Pro Soccer

# .env (backend)
DATABASE_URL=postgresql://user:password@localhost:5432/formacion_prosoccer
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 📊 **Métricas y Monitoreo**

### **1. Performance Monitoring**

```typescript
// utils/analytics.ts
export const trackEvent = (
  eventName: string,
  properties: Record<string, any>
) => {
  // Implementar tracking de eventos
  console.log('Event:', eventName, properties);
};

export const trackTeamGeneration = (gameType: string, playerCount: number) => {
  trackEvent('team_generated', {
    gameType,
    playerCount,
    timestamp: new Date().toISOString(),
  });
};
```

### **2. Error Tracking**

```typescript
// utils/errorTracking.ts
export const logError = (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error);

  // Enviar a servicio de tracking de errores
  // Sentry.captureException(error, { tags: { context } })
};
```

---

## 🔧 **Debugging y Troubleshooting**

### **1. Debug Information**

```typescript
// components/DebugInfo.tsx
const DebugInfo = ({ distribution, customPositions }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs">
      <h4 className="font-bold mb-2">Debug Info</h4>
      <div>Team A: {distribution?.teamA?.length || 0} players</div>
      <div>Team B: {distribution?.teamB?.length || 0} players</div>
      <div>Custom Positions: {Object.keys(customPositions).length}</div>
    </div>
  )
}
```

### **2. Common Issues**

#### **Problema: Dependencias faltantes**

```bash
# Solución
npm install @tanstack/react-query recharts react-icons tailwindcss-animate
```

#### **Problema: Puertos ocupados**

```bash
# Solución
.\kill-ports.bat
# O manualmente
taskkill /f /im node.exe
taskkill /f /im python.exe
```

#### **Problema: Caché corrupto**

```bash
# Solución
npm run clean
Remove-Item -Recurse -Force .next
npm cache clean --force
```

---

## 📚 **Recursos y Referencias**

### **Documentación Oficial**

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React 18 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

### **Herramientas de Desarrollo**

- **VS Code Extensions**: ESLint, Prettier, TypeScript
- **Browser DevTools**: React DevTools, Network Tab
- **Postman**: Testing de APIs
- **pgAdmin**: Gestión de base de datos

---

## 🎯 **Conclusión**

Esta guía proporciona una base sólida para el desarrollo en **ProSoccer
Soccer**. El proyecto utiliza las mejores prácticas de desarrollo moderno, con
un enfoque en performance, mantenibilidad y escalabilidad.

**Estado del Proyecto**: ✅ **Completamente Funcional** **Última
Actualización**: Julio 2025 **Versión**: 1.0.0
