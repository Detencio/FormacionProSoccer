# Guía de Desarrollo - Formación ProSoccer

## Configuración del Entorno

### Requisitos Previos
- **Node.js** 18+ 
- **Python** 3.8+
- **PostgreSQL** 13+
- **Git** para control de versiones

### Instalación Rápida
```bash
# Clonar repositorio
git clone [repository-url]
cd FormacionProSoccer

# Instalar dependencias frontend
npm install

# Instalar dependencias backend
cd backend
pip install -r requirements.txt

# Configurar base de datos
python create_admin.py
python create_supervisor.py
python add_real_players.py
```

### Scripts de Inicio
```batch
# Inicio completo (recomendado)
.\start-simple.bat

# Limpieza y reinicio
.\clean-dev.bat

# Solo frontend
npm run dev

# Solo backend
cd backend && uvicorn app.main:app --reload --port 9000
```

## Arquitectura del Proyecto

### Frontend (Next.js 14)

#### Estructura de Componentes
```
src/
├── app/                    # App Router (Next.js 14)
│   ├── dashboard/         # Panel principal
│   ├── teams/            # Gestión de equipos
│   ├── players/          # Gestión de jugadores
│   ├── payments/          # Sistema de pagos
│   ├── expenses/          # Gestión de gastos
│   ├── matches/           # Partidos
│   └── team-generator/    # Generador de equipos ⭐
├── components/            # Componentes reutilizables
│   ├── Layout/           # Layout principal
│   ├── ui/               # Componentes base
│   ├── teams/            # Componentes de equipos
│   └── team-generator/   # Componentes del generador ⭐
├── hooks/                # Hooks personalizados
├── services/             # Servicios API
├── store/                # Estado global (Zustand)
├── types/                # Tipos TypeScript
└── utils/                # Utilidades
```

#### Patrones de Diseño Implementados

##### 1. **Component-Based Architecture**
```typescript
// Componente reutilizable con props tipadas
interface PlayerCardProps {
  player: Player
  isSelected: boolean
  onSelect: (player: Player) => void
  onDeselect: (player: Player) => void
}

const PlayerCard: React.FC<PlayerCardProps> = React.memo(({
  player,
  isSelected,
  onSelect,
  onDeselect
}) => {
  // Implementación optimizada
})
```

##### 2. **Custom Hooks Pattern**
```typescript
// Hook personalizado para lógica compleja
export const useTeamGenerator = () => {
  const [distribution, setDistribution] = useState<TeamDistribution | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const generateTeams = useCallback((players: Player[]) => {
    // Lógica de generación
  }, [])
  
  const swapTwoPlayers = useCallback((substituteId: number, starterId: number) => {
    // Lógica de intercambio
  }, [distribution])
  
  return {
    distribution,
    isGenerating,
    generateTeams,
    swapTwoPlayers
  }
}
```

##### 3. **Service Layer Pattern**
```typescript
// Servicio para comunicación con API
export class TeamGeneratorService {
  static async getPlayers(teamId?: number): Promise<Player[]> {
    const response = await fetch(`/api/players${teamId ? `?team_id=${teamId}` : ''}`)
    return response.json()
  }
  
  static async generateTeams(players: Player[], config: TeamConfig): Promise<TeamDistribution> {
    const response = await fetch('/api/teams/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players, config })
    })
    return response.json()
  }
}
```

### Backend (FastAPI)

#### Estructura de la API
```
backend/
├── app/
│   ├── main.py           # Aplicación principal
│   ├── config.py         # Configuración
│   ├── database.py       # Conexión DB
│   ├── models.py         # Modelos SQLAlchemy
│   ├── schemas.py        # Esquemas Pydantic
│   ├── crud.py          # Operaciones CRUD
│   └── auth.py          # Autenticación
├── requirements.txt      # Dependencias Python
└── scripts/             # Scripts de inicialización
```

#### Patrones de Diseño Backend

##### 1. **Repository Pattern**
```python
# Operaciones CRUD centralizadas
class PlayerRepository:
    @staticmethod
    async def get_players_by_team(db: Session, team_id: int) -> List[Player]:
        return db.query(Player).filter(Player.team_id == team_id).all()
    
    @staticmethod
    async def create_player(db: Session, player_data: PlayerCreate) -> Player:
        player = Player(**player_data.dict())
        db.add(player)
        db.commit()
        return player
```

##### 2. **Dependency Injection**
```python
# Inyección de dependencias para testing
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/players/")
async def get_players(db: Session = Depends(get_db)):
    return PlayerRepository.get_all(db)
```

## Nuevas Funcionalidades Implementadas

### Team Generator - Arquitectura Avanzada

#### 1. **Sistema de Posiciones Personalizadas**
```typescript
// Estado para posiciones personalizadas
const [customPositions, setCustomPositions] = useState<{ 
  [playerId: number]: Position 
}>({})

// Preservación durante intercambios
const handleSwapConfirm = useCallback((substituteId: number, starterId: number) => {
  setCustomPositions(prev => {
    const newPositions = { ...prev }
    const substitutePosition = newPositions[substituteId]
    const starterPosition = newPositions[starterId]
    
    // Transferir posiciones
    if (substitutePosition) {
      newPositions[starterId] = substitutePosition
    }
    if (starterPosition) {
      newPositions[substituteId] = starterPosition
    }
    
    return newPositions
  })
}, [])
```

#### 2. **Algoritmos de Distribución Inteligente**
```typescript
// Distribución diferenciada por tipo de juego
const calculateTeamDistribution = (players: Player[], gameType: string) => {
  const isInternalMatch = ['5v5', '7v7'].includes(gameType)
  
  if (isInternalMatch) {
    // Distribución aleatoria para partidos amistosos
    return distributeRandomly(players)
  } else {
    // Distribución por posiciones para partidos oficiales
    return distributeByPositions(players)
  }
}
```

#### 3. **Sistema de Intercambios Atómico**
```typescript
// Intercambio atómico sin estados intermedios
const swapTwoPlayers = useCallback((substituteId: number, starterId: number) => {
  const newDistribution = {
    ...distribution,
    homeTeam: {
      ...distribution.homeTeam,
      starters: [...distribution.homeTeam.starters],
      substitutes: [...distribution.homeTeam.substitutes]
    },
    awayTeam: {
      ...distribution.awayTeam,
      starters: [...distribution.awayTeam.starters],
      substitutes: [...distribution.awayTeam.substitutes]
    }
  }
  
  // Intercambio directo
  const substituteArray = substituteTeam === 'home' ? 
    newDistribution.homeTeam.substitutes : newDistribution.awayTeam.substitutes
  const starterArray = starterTeam === 'home' ? 
    newDistribution.homeTeam.starters : newDistribution.awayTeam.starters
  
  // Realizar intercambio
  const substituteIndex = substituteArray.findIndex(p => p.id === substituteId)
  const starterIndex = starterArray.findIndex(p => p.id === starterId)
  
  const [substitute] = substituteArray.splice(substituteIndex, 1)
  const [starter] = starterArray.splice(starterIndex, 1)
  
  substituteArray.push(starter)
  starterArray.push(substitute)
  
  setDistribution(newDistribution)
}, [distribution])
```

### Optimizaciones de Rendimiento

#### 1. **React.memo para Componentes Pesados**
```typescript
// Optimización de re-renders
const PlayerCard = React.memo<PlayerCardProps>(({ 
  player, 
  isSelected, 
  onSelect, 
  onDeselect 
}) => {
  const handleClick = useCallback(() => {
    if (isSelected) {
      onDeselect(player)
    } else {
      onSelect(player)
    }
  }, [player, isSelected, onSelect, onDeselect])
  
  return (
    <div onClick={handleClick}>
      {/* Contenido optimizado */}
    </div>
  )
})
```

#### 2. **useMemo para Cálculos Costosos**
```typescript
// Memoización de asignación de posiciones
const assignPlayersToPositions = useMemo(() => {
  const formationPositions = getFormationPositions(gameType, formation?.name || '4-4-2', isTeamA)
  const players = [...team.starters]
  
  // Lógica de asignación optimizada
  if (Object.keys(customPositions).length > 0) {
    // Usar posiciones personalizadas
    return assignWithCustomPositions(players, customPositions, formationPositions)
  } else {
    // Usar posiciones de formación
    return assignWithFormationPositions(players, formationPositions)
  }
}, [team.starters, customPositions, gameType, formation, isTeamA])
```

#### 3. **Lazy Loading de Componentes**
```typescript
// Carga diferida de componentes pesados
const SwapPlayerModal = lazy(() => import('./SwapPlayerModal'))
const PlayerPreviewModal = lazy(() => import('./PlayerPreviewModal'))

// Suspense para manejo de carga
<Suspense fallback={<div>Cargando...</div>}>
  {showSwapModal && <SwapPlayerModal {...props} />}
</Suspense>
```

### Gestión de Estado Avanzada

#### 1. **Zustand Store Optimizado**
```typescript
interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const user = await authService.login(credentials)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false, error: null })
  },
  
  clearError: () => set({ error: null })
}))
```

#### 2. **Persistencia Inteligente**
```typescript
// Persistencia selectiva en localStorage
useEffect(() => {
  const config = {
    gameType,
    formation,
    manualPlayers: manualPlayers.map(p => p.id)
    // NO guardar selectedPlayers para evitar pre-selección
  }
  localStorage.setItem('teamGeneratorConfig', JSON.stringify(config))
}, [gameType, formation, manualPlayers.map(p => p.id).join(',')])

// Limpieza automática
useEffect(() => {
  const savedConfig = localStorage.getItem('teamGeneratorConfig')
  if (savedConfig) {
    const { selectedPlayers, ...cleanConfig } = JSON.parse(savedConfig)
    localStorage.setItem('teamGeneratorConfig', JSON.stringify(cleanConfig))
  }
}, [])
```

## Testing y Calidad de Código

### Estrategia de Testing

#### 1. **Unit Tests**
```typescript
// Test de utilidades
describe('teamDistribution', () => {
  test('should distribute players correctly for 5v5', () => {
    const players = createMockPlayers(10)
    const result = calculateTeamDistribution(players, '5v5')
    
    expect(result.homeTeam.starters).toHaveLength(5)
    expect(result.awayTeam.starters).toHaveLength(5)
    expect(result.homeTeam.substitutes.length + result.awayTeam.substitutes.length).toBe(0)
  })
})
```

#### 2. **Integration Tests**
```typescript
// Test de componentes
describe('TeamGenerator', () => {
  test('should generate teams when players are selected', async () => {
    render(<TeamGenerator />)
    
    // Seleccionar jugadores
    const playerCards = screen.getAllByTestId('player-card')
    fireEvent.click(playerCards[0])
    fireEvent.click(playerCards[1])
    
    // Generar equipos
    const generateButton = screen.getByText('Generar Equipos')
    fireEvent.click(generateButton)
    
    // Verificar que se generaron equipos
    await waitFor(() => {
      expect(screen.getByText('Equipo A')).toBeInTheDocument()
      expect(screen.getByText('Equipo B')).toBeInTheDocument()
    })
  })
})
```

### Code Quality

#### 1. **ESLint Configuration**
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

#### 2. **Prettier Configuration**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Deployment y DevOps

### Scripts de Automatización

#### 1. **start-simple.bat**
```batch
@echo off
echo ========================================
echo   FORMACION PROSOCCER - TEAM GENERATOR
echo ========================================

REM Limpiar puertos y procesos
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

REM Iniciar servicios
start "Backend" cmd /k "cd backend && uvicorn app.main:app --reload --port 9000"
start "Frontend" cmd /k "npm run dev"

echo Servicios iniciados correctamente
```

#### 2. **clean-dev.bat**
```batch
@echo off
echo ========================================
echo   LIMPIEZA Y REINICIO DEL DESARROLLO
echo ========================================

REM Terminar procesos
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

REM Limpiar puertos
netstat -ano | findstr :3000 >nul 2>&1 && (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
)

REM Reiniciar
call start-simple.bat
```

### Docker Support

#### 1. **Dockerfile**
```dockerfile
FROM node:18-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM python:3.9-slim AS backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .

EXPOSE 3000 9000
CMD ["npm", "start"]
```

#### 2. **docker-compose.yml**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:9000
    depends_on:
      - backend
      - postgres

  backend:
    build: ./backend
    ports:
      - "9000:9000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/prosoccer
    depends_on:
      - postgres

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=prosoccer
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Debugging y Troubleshooting

### Logs de Desarrollo
```typescript
// Logs detallados para debugging
console.log('FootballField - Custom positions:', customPositions)
console.log('FootballField - Posiciones personalizadas ANTES del intercambio:', customPositions)
console.log('useTeamGenerator - Distribución actualizada:', distribution)
```

### Errores Comunes y Soluciones

#### 1. **Error de Puerto Ocupado**
```bash
# Solución rápida
taskkill /f /im node.exe
taskkill /f /im python.exe
netstat -ano | findstr :3000
```

#### 2. **Error de Dependencias**
```bash
# Limpiar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 3. **Error de Base de Datos**
```bash
# Recrear base de datos
cd backend
python create_admin.py
python create_supervisor.py
python add_real_players.py
```

## Mejores Prácticas Implementadas

### 1. **Type Safety**
- TypeScript estricto en todo el proyecto
- Interfaces completas para todos los componentes
- Validación de tipos en tiempo de compilación

### 2. **Performance Optimization**
- React.memo para componentes pesados
- useCallback y useMemo para optimizaciones
- Lazy loading de componentes
- Virtualización para listas grandes

### 3. **Code Organization**
- Separación clara de responsabilidades
- Componentes reutilizables
- Hooks personalizados para lógica compleja
- Servicios para comunicación con API

### 4. **Error Handling**
- Error boundaries en React
- Try-catch en operaciones async
- Mensajes de error user-friendly
- Logging detallado para debugging

### 5. **Accessibility**
- Controles de teclado
- Textos alternativos
- Contraste adecuado
- Navegación por teclado

---

*Documentación de desarrollo actualizada: Diciembre 2024*
*Versión: 2.0 - Team Generator Avanzado* 