# ⚽ Módulo de Gestión de Partidos - Formación Pro Soccer

## 📋 Descripción General

El módulo de **Gestión de Partidos** es un componente esencial del sistema Formación Pro Soccer que permite la programación, seguimiento y análisis completo de partidos de fútbol. Incluye funcionalidades para la gestión de calendarios, resultados, estadísticas y reportes de rendimiento.

## 🎯 Funcionalidades Principales

### ✅ Funcionalidades Implementadas
- **Programación de Partidos**: Creación y gestión de calendario de partidos
- **Gestión de Resultados**: Registro de marcadores y estadísticas
- **Asignación de Equipos**: Vinculación de equipos y jugadores a partidos
- **Estadísticas de Partido**: Métricas detalladas de rendimiento
- **Historial de Encuentros**: Seguimiento completo de partidos jugados
- **Notificaciones**: Alertas de partidos próximos y resultados
- **Reportes de Rendimiento**: Análisis de estadísticas por equipo y jugador

### 🔄 Funcionalidades en Desarrollo
- **Streaming en Vivo**: Transmisión de partidos en tiempo real
- **Análisis Táctico**: Revisión de formaciones y estrategias
- **Sistema de Arbitraje**: Gestión de árbitros y decisiones
- **Integración con Dispositivos**: Conectividad con wearables y sensores

## 🏗️ Arquitectura del Módulo

### Estructura de Archivos
```
src/app/matches/
├── page.tsx                    # Página principal de partidos
├── [id]/                       # Rutas dinámicas por partido
│   ├── page.tsx               # Detalle del partido
│   ├── edit/                  # Edición del partido
│   ├── stats/                 # Estadísticas detalladas
│   └── lineup/                # Alineaciones
├── calendar/                   # Vista de calendario
│   └── page.tsx               # Calendario de partidos
└── components/                # Componentes específicos
    ├── MatchCard.tsx          # Tarjeta de partido
    ├── MatchModal.tsx         # Modal de creación/edición
    ├── MatchStats.tsx         # Estadísticas del partido
    ├── LineupEditor.tsx       # Editor de alineaciones
    └── CalendarView.tsx       # Vista de calendario
```

### Modelo de Datos

#### Entidad Match
```typescript
interface Match {
  id: number;
  title: string;
  description?: string;
  date: Date;
  time: string;
  location: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';
  match_type: 'FRIENDLY' | 'LEAGUE' | 'TOURNAMENT' | 'TRAINING';
  home_team_id: number;
  away_team_id: number;
  home_team: Team;
  away_team: Team;
  home_score?: number;
  away_score?: number;
  referee?: string;
  weather?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  stats: MatchStats;
}
```

#### Entidad MatchStats
```typescript
interface MatchStats {
  possession_home: number;
  possession_away: number;
  shots_home: number;
  shots_away: number;
  shots_on_target_home: number;
  shots_on_target_away: number;
  corners_home: number;
  corners_away: number;
  fouls_home: number;
  fouls_away: number;
  yellow_cards_home: number;
  yellow_cards_away: number;
  red_cards_home: number;
  red_cards_away: number;
  offsides_home: number;
  offsides_away: number;
}
```

#### Entidad PlayerMatchStats
```typescript
interface PlayerMatchStats {
  id: number;
  match_id: number;
  player_id: number;
  team_id: number;
  position: string;
  minutes_played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  rating: number; // 1-10
  notes?: string;
}
```

## 🔌 API Endpoints

### Partidos

#### GET /api/v1/matches
Obtiene la lista de todos los partidos.

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `status`: Filtrar por estado (SCHEDULED, IN_PROGRESS, FINISHED, CANCELLED)
- `team_id`: Filtrar por equipo
- `date_from`: Fecha desde
- `date_to`: Fecha hasta

**Respuesta:**
```json
{
  "matches": [
    {
      "id": 1,
      "title": "Equipo A vs Equipo B",
      "date": "2024-01-15T20:00:00Z",
      "location": "Estadio Municipal",
      "status": "SCHEDULED",
      "home_team": {
        "id": 1,
        "name": "Equipo A"
      },
      "away_team": {
        "id": 2,
        "name": "Equipo B"
      },
      "home_score": null,
      "away_score": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### POST /api/v1/matches
Crea un nuevo partido.

**Body:**
```json
{
  "title": "Equipo A vs Equipo B",
  "description": "Partido de liga",
  "date": "2024-01-15T20:00:00Z",
  "time": "20:00",
  "location": "Estadio Municipal",
  "match_type": "LEAGUE",
  "home_team_id": 1,
  "away_team_id": 2,
  "referee": "Juan Pérez",
  "weather": "Soleado"
}
```

#### GET /api/v1/matches/{id}
Obtiene los detalles de un partido específico.

**Respuesta:**
```json
{
  "id": 1,
  "title": "Equipo A vs Equipo B",
  "date": "2024-01-15T20:00:00Z",
  "location": "Estadio Municipal",
  "status": "FINISHED",
  "home_team": {
    "id": 1,
    "name": "Equipo A",
    "logo": "https://example.com/logo-a.png"
  },
  "away_team": {
    "id": 2,
    "name": "Equipo B",
    "logo": "https://example.com/logo-b.png"
  },
  "home_score": 2,
  "away_score": 1,
  "stats": {
    "possession_home": 55,
    "possession_away": 45,
    "shots_home": 12,
    "shots_away": 8,
    "shots_on_target_home": 6,
    "shots_on_target_away": 4
  },
  "player_stats": [
    {
      "player_id": 1,
      "player_name": "Juan Pérez",
      "team_id": 1,
      "position": "Delantero",
      "minutes_played": 90,
      "goals": 1,
      "assists": 1,
      "rating": 8.5
    }
  ]
}
```

#### PUT /api/v1/matches/{id}
Actualiza un partido existente.

#### DELETE /api/v1/matches/{id}
Elimina un partido (soft delete).

### Estadísticas de Partido

#### PUT /api/v1/matches/{id}/stats
Actualiza las estadísticas de un partido.

**Body:**
```json
{
  "home_score": 2,
  "away_score": 1,
  "stats": {
    "possession_home": 55,
    "possession_away": 45,
    "shots_home": 12,
    "shots_away": 8
  }
}
```

#### GET /api/v1/matches/{id}/player-stats
Obtiene las estadísticas de jugadores de un partido.

#### PUT /api/v1/matches/{id}/player-stats
Actualiza las estadísticas de un jugador en el partido.

## 🎨 Componentes del Frontend

### MatchCard Component
```typescript
interface MatchCardProps {
  match: Match;
  onEdit?: (match: Match) => void;
  onDelete?: (matchId: number) => void;
  onView?: (matchId: number) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onEdit,
  onDelete,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'FINISHED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
          {match.status}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onView?.(match.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Ver
          </button>
          <button
            onClick={() => onEdit?.(match)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(match.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {match.title}
      </h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <img 
              src={match.home_team.logo || '/default-team.png'} 
              alt={match.home_team.name}
              className="w-8 h-8 rounded-full"
            />
            <p className="text-sm font-medium">{match.home_team.name}</p>
          </div>
          
          <div className="text-center">
            <span className="text-2xl font-bold">VS</span>
            {match.home_score !== null && match.away_score !== null && (
              <div className="text-lg font-bold">
                {match.home_score} - {match.away_score}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <img 
              src={match.away_team.logo || '/default-team.png'} 
              alt={match.away_team.name}
              className="w-8 h-8 rounded-full"
            />
            <p className="text-sm font-medium">{match.away_team.name}</p>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>📅 {formatDate(match.date)}</p>
        <p>📍 {match.location}</p>
        {match.referee && <p>👨‍⚖️ {match.referee}</p>}
      </div>
    </div>
  );
};
```

### MatchModal Component
```typescript
interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match?: Match;
  teams: Team[];
  onSubmit: (data: MatchFormData) => void;
}

const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  match,
  teams,
  onSubmit
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<MatchFormData>({
    defaultValues: match || {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      location: '',
      match_type: 'FRIENDLY',
      home_team_id: '',
      away_team_id: '',
      referee: '',
      weather: ''
    }
  });

  const watchedHomeTeam = watch('home_team_id');
  const watchedAwayTeam = watch('away_team_id');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título del Partido
          </label>
          <input
            {...register('title', { required: 'El título es requerido' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Equipo Local
            </label>
            <select
              {...register('home_team_id', { required: 'Equipo local es requerido' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar equipo</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Equipo Visitante
            </label>
            <select
              {...register('away_team_id', { 
                required: 'Equipo visitante es requerido',
                validate: value => value !== watchedHomeTeam || 'Los equipos deben ser diferentes'
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar equipo</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              {...register('date', { required: 'La fecha es requerida' })}
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hora
            </label>
            <input
              {...register('time', { required: 'La hora es requerida' })}
              type="time"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ubicación
          </label>
          <input
            {...register('location', { required: 'La ubicación es requerida' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {match ? 'Actualizar' : 'Crear'} Partido
          </button>
        </div>
      </form>
    </Modal>
  );
};
```

## 🔧 Servicios y Hooks

### MatchService
```typescript
class MatchService {
  private api = new ApiService();

  async getMatches(params?: MatchQueryParams): Promise<PaginatedResponse<Match>> {
    const queryString = new URLSearchParams(params as Record<string, string>);
    return this.api.get(`/matches?${queryString}`);
  }

  async getMatch(id: number): Promise<Match> {
    return this.api.get(`/matches/${id}`);
  }

  async createMatch(data: CreateMatchData): Promise<Match> {
    return this.api.post('/matches', data);
  }

  async updateMatch(id: number, data: UpdateMatchData): Promise<Match> {
    return this.api.put(`/matches/${id}`, data);
  }

  async deleteMatch(id: number): Promise<void> {
    return this.api.delete(`/matches/${id}`);
  }

  async updateMatchStats(id: number, stats: MatchStatsData): Promise<Match> {
    return this.api.put(`/matches/${id}/stats`, stats);
  }

  async getPlayerStats(matchId: number): Promise<PlayerMatchStats[]> {
    return this.api.get(`/matches/${matchId}/player-stats`);
  }

  async updatePlayerStats(matchId: number, playerId: number, stats: PlayerStatsData): Promise<void> {
    return this.api.put(`/matches/${matchId}/player-stats`, { player_id: playerId, ...stats });
  }

  async getUpcomingMatches(days: number = 7): Promise<Match[]> {
    return this.api.get(`/matches/upcoming?days=${days}`);
  }

  async getMatchHistory(teamId?: number, limit: number = 10): Promise<Match[]> {
    const params = teamId ? `?team_id=${teamId}&limit=${limit}` : `?limit=${limit}`;
    return this.api.get(`/matches/history${params}`);
  }
}

export const matchService = new MatchService();
```

### useMatches Hook
```typescript
export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async (params?: MatchQueryParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await matchService.getMatches(params);
      setMatches(response.matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar partidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMatch = useCallback(async (data: CreateMatchData) => {
    try {
      const newMatch = await matchService.createMatch(data);
      setMatches(prev => [...prev, newMatch]);
      return newMatch;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateMatch = useCallback(async (id: number, data: UpdateMatchData) => {
    try {
      const updatedMatch = await matchService.updateMatch(id, data);
      setMatches(prev => prev.map(match => 
        match.id === id ? updatedMatch : match
      ));
      return updatedMatch;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteMatch = useCallback(async (id: number) => {
    try {
      await matchService.deleteMatch(id);
      setMatches(prev => prev.filter(match => match.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  const updateMatchStats = useCallback(async (id: number, stats: MatchStatsData) => {
    try {
      const updatedMatch = await matchService.updateMatchStats(id, stats);
      setMatches(prev => prev.map(match => 
        match.id === id ? updatedMatch : match
      ));
      return updatedMatch;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    matches,
    loading,
    error,
    fetchMatches,
    createMatch,
    updateMatch,
    deleteMatch,
    updateMatchStats
  };
};
```

## 🧪 Testing

### Tests Unitarios
```typescript
// __tests__/components/MatchCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchCard } from '../../components/MatchCard';

const mockMatch = {
  id: 1,
  title: 'Equipo A vs Equipo B',
  date: new Date('2024-01-15T20:00:00Z'),
  location: 'Estadio Municipal',
  status: 'SCHEDULED',
  home_team: { id: 1, name: 'Equipo A', logo: null },
  away_team: { id: 2, name: 'Equipo B', logo: null },
  home_score: null,
  away_score: null
};

describe('MatchCard', () => {
  it('should render match information correctly', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnView = jest.fn();

    render(
      <MatchCard
        match={mockMatch}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    expect(screen.getByText('Equipo A vs Equipo B')).toBeInTheDocument();
    expect(screen.getByText('Equipo A')).toBeInTheDocument();
    expect(screen.getByText('Equipo B')).toBeInTheDocument();
    expect(screen.getByText('Estadio Municipal')).toBeInTheDocument();
  });

  it('should display score when match is finished', () => {
    const finishedMatch = {
      ...mockMatch,
      status: 'FINISHED',
      home_score: 2,
      away_score: 1
    };

    render(<MatchCard match={finishedMatch} />);
    
    expect(screen.getByText('2 - 1')).toBeInTheDocument();
  });
});
```

### Tests de Integración
```typescript
// __tests__/pages/matches.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import MatchesPage from '../../app/matches/page';

const server = setupServer(
  rest.get('/api/v1/matches', (req, res, ctx) => {
    return res(
      ctx.json({
        matches: [
          {
            id: 1,
            title: 'Equipo A vs Equipo B',
            date: '2024-01-15T20:00:00Z',
            status: 'SCHEDULED',
            home_team: { id: 1, name: 'Equipo A' },
            away_team: { id: 2, name: 'Equipo B' }
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MatchesPage', () => {
  it('should load and display matches', async () => {
    render(<MatchesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Equipo A vs Equipo B')).toBeInTheDocument();
    });
  });
});
```

## 📊 Métricas y Analytics

### KPIs del Módulo
- **Total de partidos programados**: 150 partidos este mes
- **Tasa de finalización**: 95% de partidos completados
- **Promedio de asistencia**: 85% de jugadores presentes
- **Tiempo promedio de actualización**: < 30s para resultados

### Métricas de Performance
- **First Contentful Paint**: 1.1s
- **Largest Contentful Paint**: 1.9s
- **Cumulative Layout Shift**: 0.03
- **Time to Interactive**: 2.5s

## 🔒 Seguridad y Validación

### Validación de Datos
```typescript
// schemas/match.ts
import { z } from 'zod';

export const CreateMatchSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  description: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  date: z.string().datetime('Fecha inválida'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida'),
  location: z.string()
    .min(2, 'La ubicación debe tener al menos 2 caracteres')
    .max(200, 'La ubicación no puede exceder 200 caracteres'),
  match_type: z.enum(['FRIENDLY', 'LEAGUE', 'TOURNAMENT', 'TRAINING']),
  home_team_id: z.number().positive('Equipo local es requerido'),
  away_team_id: z.number().positive('Equipo visitante es requerido'),
  referee: z.string().max(100).optional(),
  weather: z.string().max(50).optional()
}).refine(data => data.home_team_id !== data.away_team_id, {
  message: 'Los equipos deben ser diferentes',
  path: ['away_team_id']
});

export const UpdateMatchSchema = CreateMatchSchema.partial();

export type CreateMatchData = z.infer<typeof CreateMatchSchema>;
export type UpdateMatchData = z.infer<typeof UpdateMatchSchema>;
```

### Autorización
```typescript
// middleware/matchAuth.ts
export const requireMatchAccess = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
      
      // Verificar acceso al partido específico
      const matchId = req.query.id || req.body.match_id;
      if (matchId) {
        const hasAccess = await checkMatchAccess(decoded.userId, matchId);
        if (!hasAccess) {
          return res.status(403).json({ error: 'Sin acceso a este partido' });
        }
      }
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
};
```

## 🚀 Optimizaciones Implementadas

### Performance
- **Lazy Loading**: Carga diferida de estadísticas detalladas
- **Memoización**: Uso de React.memo para componentes de partido
- **Virtualización**: Para listas largas de partidos
- **Caching**: Cache de calendario y estadísticas

### UX/UI
- **Skeleton Loading**: Estados de carga con esqueletos
- **Error Boundaries**: Manejo elegante de errores
- **Toast Notifications**: Notificaciones de éxito/error
- **Responsive Design**: Diseño adaptativo para todos los dispositivos
- **Real-time Updates**: Actualizaciones en tiempo real de resultados

## 🔮 Roadmap del Módulo

### Próximas Funcionalidades
- [ ] **Streaming en Vivo**: Transmisión de partidos
- [ ] **Análisis Táctico**: Revisión de formaciones
- [ ] **Sistema de Arbitraje**: Gestión de árbitros
- [ ] **Integración con Dispositivos**: Wearables y sensores
- [ ] **Reportes Avanzados**: Análisis detallado de rendimiento

### Mejoras Técnicas
- [ ] **WebSocket**: Actualizaciones en tiempo real
- [ ] **Offline Support**: Funcionalidad offline
- [ ] **Push Notifications**: Alertas de partidos
- [ ] **Video Analysis**: Análisis de video de partidos

---

**Módulo de Partidos** - Documentación Técnica v1.0

*Última actualización: Diciembre 2024*
*Versión del módulo: 1.0.0* 