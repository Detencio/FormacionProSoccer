# ⚽ Generador de Equipos - Formación Pro Soccer

## 📋 Descripción General

El **Generador de Equipos** es una funcionalidad innovadora y central del sistema Formación Pro Soccer que permite crear equipos balanceados automáticamente. Utiliza algoritmos inteligentes para distribuir jugadores según sus posiciones por zona y específicas, habilidades, y formaciones tácticas, optimizando el balance y la competitividad de los equipos generados.

## 🎯 Funcionalidades Principales

### ✅ Funcionalidades Implementadas
- **Generación Automática de Equipos**: Algoritmos inteligentes de balanceo
- **Sistema de Posiciones Avanzado**: Soporte para posiciones por zona y específicas
- **Formaciones Tácticas**: 4-4-2, 4-3-3, 3-5-2, 4-2-3-1, 5-3-2
- **Balance por Habilidades**: Distribución equitativa de niveles de habilidad
- **Visualización de Cancha**: Interfaz gráfica de posiciones en el campo
- **Múltiples Modos de Juego**: 5v5, 7v7, 11v11
- **Exportación de Equipos**: Generación de reportes de equipos
- **Historial de Generaciones**: Guardado de configuraciones anteriores
- **Validación de Posiciones**: Verificación de compatibilidad de posiciones

### 🔄 Funcionalidades en Desarrollo
- **IA para Balanceo**: Machine Learning para optimización
- **Análisis de Rendimiento**: Predicción de resultados
- **Formaciones Personalizadas**: Creación de formaciones únicas
- **Estadísticas de Equipos**: Métricas de balance y competitividad
- **Sistema de Scouts**: Evaluación automática de jugadores
- **Integración con Partidos**: Conexión directa con calendario

## 🏗️ Arquitectura del Módulo

### Estructura de Archivos
```
src/app/team-generator/
├── page.tsx                    # Página principal del generador
├── components/                 # Componentes específicos
│   ├── TeamFormation.tsx      # Visualización de formación
│   ├── PlayerList.tsx         # Lista de jugadores disponibles
│   ├── PlayerCard.tsx         # Tarjeta individual de jugador
│   ├── PlayerCardModal.tsx    # Modal de detalles del jugador
│   ├── FormationSelector.tsx  # Selector de formaciones
│   ├── TeamBalancer.tsx       # Componente de balanceo
│   └── TeamExport.tsx         # Exportación de equipos
├── hooks/                     # Hooks personalizados
│   ├── useTeamGenerator.ts    # Lógica principal del generador
│   ├── useFormations.ts       # Gestión de formaciones
│   └── usePlayerBalance.ts    # Algoritmos de balanceo
└── utils/                     # Utilidades
    ├── formations.ts          # Definiciones de formaciones
    ├── balanceAlgorithms.ts   # Algoritmos de balanceo
    └── exportUtils.ts         # Utilidades de exportación
```

### Modelo de Datos

#### Entidad TeamFormation
```typescript
interface TeamFormation {
  id: string;
  name: string;  // "4-4-2", "4-3-3", etc.
  description: string;
  positions: FormationPosition[];
  is_active: boolean;
  created_at: string;
}

interface FormationPosition {
  id: number;
  position_id: number;
  position: PlayerPosition;  // Relación con la tabla de posiciones
  x: number; // Coordenada X en la cancha (0-100)
  y: number; // Coordenada Y en la cancha (0-100)
  team: 'HOME' | 'AWAY';
  player_id?: number;
  player?: Player;
  is_captain: boolean;
}

// Sistema de posiciones implementado
interface PositionZone {
  id: number;
  abbreviation: 'POR' | 'DEF' | 'MED' | 'DEL';
  name_es: string;  // Portero, Defensa, Mediocampista, Delantero
  name_en: string;  // Goalkeeper, Defender, Midfielder, Forward
  is_active: boolean;
}

interface PositionSpecific {
  id: number;
  abbreviation: 'LD' | 'LI' | 'DFC' | 'CAI' | 'CAD' | 'MCD' | 'MC' | 'MCO' | 'MD' | 'MI' | 'ED' | 'EI' | 'DC' | 'SD';
  name_es: string;  // Lateral Derecho, Lateral Izquierdo, etc.
  name_en: string;  // Right Back, Left Back, etc.
  zone_id: number;
  description_es?: string;
  description_en?: string;
  is_active: boolean;
  zone: PositionZone;
}

interface Player {
  id: number;
  user_id: number;
  team_id?: number;
  position_zone_id: number;
  position_specific_id?: number;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  jersey_number?: number;
  height?: number; // en centímetros
  weight?: number; // en kilogramos
  skill_level: number; // 1-10
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  position_zone: PositionZone;
  position_specific?: PositionSpecific;
  team?: Team;
  user?: User;
}
```

#### Entidad GeneratedTeam
```typescript
interface GeneratedTeam {
  id: string;
  formation_id: string;
  formation: TeamFormation;
  home_team: Player[];
  away_team: Player[];
  balance_score: number; // 0-100, indica qué tan balanceados están los equipos
  generation_date: string;
  created_by: string;
  notes?: string;
}

interface PlayerBalance {
  player_id: number;
  player: Player;
  assigned_team: 'HOME' | 'AWAY';
  position_assigned: string;
  balance_contribution: number; // Contribución al balance del equipo
}
```

## 🔌 API Endpoints

### Generación de Equipos
```typescript
// POST /team-generator/generate
interface GenerateTeamRequest {
  player_ids: number[];
  formation_id: string;
  balance_preferences: {
    skill_level_weight: number; // 0-1
    position_balance_weight: number; // 0-1
    team_size_weight: number; // 0-1
  };
  game_type: '5v5' | '7v7' | '11v11';
}

interface GenerateTeamResponse {
  data: GeneratedTeam;
}

// GET /team-generator/formations
interface GetFormationsResponse {
  data: TeamFormation[];
}

// GET /team-generator/formations/{id}
interface GetFormationResponse {
  data: TeamFormation;
}

// POST /team-generator/save
interface SaveTeamRequest {
  generated_team: GeneratedTeam;
  name?: string;
  description?: string;
}

// GET /team-generator/history
interface GetTeamHistoryResponse {
  data: GeneratedTeam[];
}
```

### Posiciones
```typescript
// GET /positions/zones/
interface GetPositionZonesResponse {
  data: PositionZone[];
}

// GET /positions/specifics/zone/{zone_id}
interface GetPositionSpecificsByZoneResponse {
  data: PositionSpecific[];
}
```

## 🎮 Componentes del Frontend

### TeamFormation
```typescript
// components/team-generator/TeamFormation.tsx
interface TeamFormationProps {
  formation: TeamFormation;
  homeTeam: Player[];
  awayTeam: Player[];
  onPlayerClick: (player: Player) => void;
  onPositionClick: (position: FormationPosition) => void;
}

const TeamFormation: React.FC<TeamFormationProps> = ({
  formation,
  homeTeam,
  awayTeam,
  onPlayerClick,
  onPositionClick
}) => {
  return (
    <div className="relative w-full h-96 bg-green-600 rounded-lg overflow-hidden">
      {/* Líneas del campo */}
      <div className="absolute inset-0">
        {/* Línea central */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white"></div>
        {/* Círculo central */}
        <div className="absolute left-1/2 top-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        {/* Áreas */}
        <div className="absolute left-0 top-1/4 w-1/4 h-1/2 border-2 border-white"></div>
        <div className="absolute right-0 top-1/4 w-1/4 h-1/2 border-2 border-white"></div>
      </div>

      {/* Posiciones de la formación */}
      {formation.positions.map((position) => {
        const player = position.team === 'HOME' 
          ? homeTeam.find(p => p.id === position.player_id)
          : awayTeam.find(p => p.id === position.player_id);

        return (
          <div
            key={position.id}
            className={`absolute w-12 h-12 rounded-full border-2 cursor-pointer transition-all ${
              position.team === 'HOME' 
                ? 'bg-blue-500 border-blue-600 text-white' 
                : 'bg-red-500 border-red-600 text-white'
            } ${
              player ? 'ring-2 ring-yellow-400' : 'ring-2 ring-gray-300'
            }`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onPositionClick(position)}
          >
            <div className="flex flex-col items-center justify-center h-full text-xs">
              <div className="font-bold">
                {player ? player.position_specific?.abbreviation || player.position_zone.abbreviation : position.position.abbreviation}
              </div>
              {player && (
                <div className="text-xs opacity-75">
                  {player.name.split(' ')[0]}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Equipo Local</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Equipo Visitante</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### PlayerList
```typescript
// components/team-generator/PlayerList.tsx
interface PlayerListProps {
  players: Player[];
  selectedPlayers: Player[];
  onPlayerSelect: (player: Player) => void;
  onPlayerDeselect: (player: Player) => void;
  filterByPosition?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  onPlayerDeselect,
  filterByPosition
}) => {
  const filteredPlayers = filterByPosition 
    ? players.filter(p => 
        p.position_zone.abbreviation === filterByPosition ||
        p.position_specific?.abbreviation === filterByPosition
      )
    : players;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Jugadores Disponibles ({filteredPlayers.length})
        </h3>
        <div className="text-sm text-gray-500">
          Seleccionados: {selectedPlayers.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => {
          const isSelected = selectedPlayers.some(p => p.id === player.id);
          
          return (
            <div
              key={player.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => isSelected ? onPlayerDeselect(player) : onPlayerSelect(player)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">{player.name}</div>
                <div className={`px-2 py-1 text-xs font-semibold rounded ${
                  getPositionColor(player.position_zone.name_es)
                }`}>
                  {player.position_specific?.abbreviation || player.position_zone.abbreviation}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Nivel: {player.skill_level}/10</span>
                {player.jersey_number && (
                  <span>#{player.jersey_number}</span>
                )}
              </div>

              {player.position_specific && (
                <div className="mt-2 text-xs text-gray-500">
                  {player.position_specific.name_es}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getPositionColor = (position: string) => {
  switch (position) {
    case 'Portero': return 'bg-yellow-100 text-yellow-800';
    case 'Defensa': return 'bg-blue-100 text-blue-800';
    case 'Mediocampista': return 'bg-green-100 text-green-800';
    case 'Delantero': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

### FormationSelector
```typescript
// components/team-generator/FormationSelector.tsx
interface FormationSelectorProps {
  formations: TeamFormation[];
  selectedFormation: TeamFormation | null;
  onFormationSelect: (formation: TeamFormation) => void;
  gameType: '5v5' | '7v7' | '11v11';
}

const FormationSelector: React.FC<FormationSelectorProps> = ({
  formations,
  selectedFormation,
  onFormationSelect,
  gameType
}) => {
  const getFormationIcon = (formation: TeamFormation) => {
    // Generar icono visual de la formación
    const positions = formation.positions;
    const rows = positions.reduce((acc, pos) => {
      const row = Math.floor(pos.y / 20);
      if (!acc[row]) acc[row] = [];
      acc[row].push(pos);
      return acc;
    }, {} as Record<number, FormationPosition[]>);

    return (
      <div className="w-16 h-12 flex flex-col justify-center items-center space-y-1">
        {Object.values(rows).map((row, index) => (
          <div key={index} className="flex space-x-1">
            {row.map((pos, posIndex) => (
              <div
                key={posIndex}
                className={`w-2 h-2 rounded-full ${
                  pos.team === 'HOME' ? 'bg-blue-500' : 'bg-red-500'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Seleccionar Formación
        </h3>
        <div className="text-sm text-gray-500">
          Modo: {gameType}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formations
          .filter(f => f.is_active)
          .map((formation) => (
            <button
              key={formation.id}
              onClick={() => onFormationSelect(formation)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedFormation?.id === formation.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                {getFormationIcon(formation)}
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{formation.name}</div>
                  <div className="text-xs text-gray-500">{formation.description}</div>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};
```

### TeamBalancer
```typescript
// components/team-generator/TeamBalancer.tsx
interface TeamBalancerProps {
  homeTeam: Player[];
  awayTeam: Player[];
  onBalanceChange: (homeTeam: Player[], awayTeam: Player[]) => void;
  balanceScore: number;
}

const TeamBalancer: React.FC<TeamBalancerProps> = ({
  homeTeam,
  awayTeam,
  onBalanceChange,
  balanceScore
}) => {
  const getBalanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBalanceLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    if (score >= 40) return 'Regular';
    return 'Pobre';
  };

  const calculateTeamStats = (team: Player[]) => {
    const totalSkill = team.reduce((sum, player) => sum + player.skill_level, 0);
    const avgSkill = team.length > 0 ? totalSkill / team.length : 0;
    
    const positions = team.reduce((acc, player) => {
      const pos = player.position_specific?.abbreviation || player.position_zone.abbreviation;
      acc[pos] = (acc[pos] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { avgSkill, positions };
  };

  const homeStats = calculateTeamStats(homeTeam);
  const awayStats = calculateTeamStats(awayTeam);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Balance de Equipos
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Puntuación:</span>
          <span className={`font-semibold ${getBalanceColor(balanceScore)}`}>
            {balanceScore}/100
          </span>
          <span className={`text-sm ${getBalanceColor(balanceScore)}`}>
            ({getBalanceLabel(balanceScore)})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipo Local */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Equipo Local</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Jugadores:</span>
              <span className="font-medium">{homeTeam.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nivel Promedio:</span>
              <span className="font-medium">{homeStats.avgSkill.toFixed(1)}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Posiciones:</span>
              <span className="font-medium">{Object.keys(homeStats.positions).length}</span>
            </div>
          </div>
        </div>

        {/* Equipo Visitante */}
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-3">Equipo Visitante</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Jugadores:</span>
              <span className="font-medium">{awayTeam.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nivel Promedio:</span>
              <span className="font-medium">{awayStats.avgSkill.toFixed(1)}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Posiciones:</span>
              <span className="font-medium">{Object.keys(awayStats.positions).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Balance de Equipos</span>
          <span className={`font-medium ${getBalanceColor(balanceScore)}`}>
            {balanceScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              balanceScore >= 80 ? 'bg-green-500' :
              balanceScore >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${balanceScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};
```

## 🧪 Tests Unitarios

### Tests de Componentes
```typescript
// __tests__/components/TeamFormation.test.tsx
import { render, screen } from '@testing-library/react'
import TeamFormation from '@/components/team-generator/TeamFormation'

describe('TeamFormation', () => {
  const mockFormation = {
    id: '1',
    name: '4-4-2',
    description: 'Formación clásica',
    positions: [
      { id: 1, x: 50, y: 90, team: 'HOME', position: { abbreviation: 'POR' } },
      { id: 2, x: 20, y: 70, team: 'HOME', position: { abbreviation: 'DEF' } }
    ],
    is_active: true,
    created_at: '2024-01-01'
  }

  const mockHomeTeam = [
    { id: 1, name: 'Juan', skill_level: 8, position_zone: { abbreviation: 'POR', name_es: 'Portero' } }
  ]

  const mockAwayTeam = [
    { id: 2, name: 'Pedro', skill_level: 7, position_zone: { abbreviation: 'DEF', name_es: 'Defensa' } }
  ]

  it('should render formation with players', () => {
    render(
      <TeamFormation
        formation={mockFormation}
        homeTeam={mockHomeTeam}
        awayTeam={mockAwayTeam}
        onPlayerClick={jest.fn()}
        onPositionClick={jest.fn()}
      />
    )

    expect(screen.getByText('POR')).toBeInTheDocument()
    expect(screen.getByText('DEF')).toBeInTheDocument()
  })
})
```

### Tests de Algoritmos
```typescript
// __tests__/utils/balanceAlgorithms.test.ts
import { balanceTeamByFormation, calculateBalanceScore } from '@/utils/balanceAlgorithms'

describe('Balance Algorithms', () => {
  const mockPlayers = [
    { id: 1, name: 'Juan', skill_level: 8, position_zone: { abbreviation: 'POR' } },
    { id: 2, name: 'Pedro', skill_level: 7, position_zone: { abbreviation: 'DEF' } },
    { id: 3, name: 'Carlos', skill_level: 9, position_zone: { abbreviation: 'MED' } },
    { id: 4, name: 'Luis', skill_level: 6, position_zone: { abbreviation: 'DEL' } }
  ]

  it('should balance teams correctly', () => {
    const result = balanceTeamByFormation(mockPlayers, '4-4-2')
    
    expect(result.homeTeam).toHaveLength(2)
    expect(result.awayTeam).toHaveLength(2)
    expect(result.balance_score).toBeGreaterThan(60)
  })

  it('should calculate balance score correctly', () => {
    const homeTeam = [mockPlayers[0], mockPlayers[1]]
    const awayTeam = [mockPlayers[2], mockPlayers[3]]
    
    const score = calculateBalanceScore(homeTeam, awayTeam)
    
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})
```

## 📊 Métricas y Analytics

### Métricas de Generación
```typescript
interface GenerationMetrics {
  total_generations: number;
  average_balance_score: number;
  most_used_formations: {
    formation_id: string;
    formation_name: string;
    usage_count: number;
  }[];
  balance_distribution: {
    excellent: number; // 80-100
    good: number;      // 60-79
    fair: number;      // 40-59
    poor: number;      // 0-39
  };
  generation_time: {
    average_ms: number;
    fastest_ms: number;
    slowest_ms: number;
  };
}
```

### Dashboard de Métricas
```typescript
// components/TeamGeneratorDashboard.tsx
const TeamGeneratorDashboard: React.FC<{ metrics: GenerationMetrics }> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Generaciones</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total_generations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Balance Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.average_balance_score.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formaciones Más Usadas */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Formaciones Más Usadas</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {metrics.most_used_formations.map((formation, index) => (
              <div key={formation.formation_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{formation.formation_name}</div>
                    <div className="text-sm text-gray-500">{formation.usage_count} usos</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {((formation.usage_count / metrics.total_generations) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 🔐 Seguridad y Validación

### Validaciones del Frontend
```typescript
// utils/teamGeneratorValidation.ts
import { z } from 'zod'

export const teamGenerationSchema = z.object({
  player_ids: z.array(z.number()).min(2, 'Debe seleccionar al menos 2 jugadores'),
  formation_id: z.string().min(1, 'Debe seleccionar una formación'),
  balance_preferences: z.object({
    skill_level_weight: z.number().min(0).max(1),
    position_balance_weight: z.number().min(0).max(1),
    team_size_weight: z.number().min(0).max(1)
  }),
  game_type: z.enum(['5v5', '7v7', '11v11'])
})

export const validateFormationCompatibility = (
  players: Player[],
  formation: TeamFormation,
  gameType: '5v5' | '7v7' | '11v11'
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Validar número de jugadores según tipo de juego
  const requiredPlayers = gameType === '5v5' ? 10 : gameType === '7v7' ? 14 : 22
  if (players.length < requiredPlayers) {
    errors.push(`Se necesitan al menos ${requiredPlayers} jugadores para ${gameType}`)
  }
  
  // Validar posiciones requeridas
  const requiredPositions = formation.positions.map(p => p.position.abbreviation)
  const playerPositions = players.map(p => p.position_specific?.abbreviation || p.position_zone.abbreviation)
  
  const missingPositions = requiredPositions.filter(pos => !playerPositions.includes(pos))
  if (missingPositions.length > 0) {
    errors.push(`Faltan posiciones: ${missingPositions.join(', ')}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
```

### Validaciones del Backend
```python
# backend/app/main.py
@app.post("/team-generator/generate", response_model=schemas.GeneratedTeamOut)
def generate_team(request: schemas.GenerateTeamRequest, db: Session = Depends(get_db)):
    """Generate balanced teams"""
    # Validar jugadores
    players = []
    for player_id in request.player_ids:
        player = crud.get_player(db, player_id)
        if not player:
            raise HTTPException(status_code=400, detail=f"Jugador {player_id} no encontrado")
        players.append(player)
    
    # Validar formación
    formation = crud.get_formation(db, request.formation_id)
    if not formation:
        raise HTTPException(status_code=400, detail="Formación no encontrada")
    
    # Validar compatibilidad
    validation_result = validate_formation_compatibility(players, formation, request.game_type)
    if not validation_result['is_valid']:
        raise HTTPException(status_code=400, detail=validation_result['errors'])
    
    # Generar equipos
    home_team, away_team = balance_teams(players, formation, request.balance_preferences)
    
    # Calcular puntuación de balance
    balance_score = calculate_balance_score(home_team, away_team)
    
    # Crear equipo generado
    generated_team = crud.create_generated_team(db, formation, home_team, away_team, balance_score)
    
    return generated_team
```

## 🚀 Optimizaciones Implementadas

### Algoritmos de Balanceo
```typescript
// utils/balanceAlgorithms.ts
export const balanceTeamByFormation = (
  players: Player[],
  formation: TeamFormation,
  preferences: BalancePreferences
): { homeTeam: Player[], awayTeam: Player[], balanceScore: number } => {
  // Agrupar jugadores por posición
  const playersByPosition = groupPlayersByPosition(players)
  
  // Asignar jugadores según formación
  const homeTeam: Player[] = []
  const awayTeam: Player[] = []
  
  formation.positions.forEach((position, index) => {
    const availablePlayers = playersByPosition[position.position.abbreviation] || []
    
    if (availablePlayers.length === 0) return
    
    // Ordenar por nivel de habilidad
    const sortedPlayers = availablePlayers.sort((a, b) => b.skill_level - a.skill_level)
    
    // Alternar entre equipos para balance
    const targetTeam = index % 2 === 0 ? homeTeam : awayTeam
    const player = sortedPlayers.shift()
    
    if (player) {
      targetTeam.push(player)
      // Remover jugador de la lista disponible
      const playerIndex = playersByPosition[position.position.abbreviation].indexOf(player)
      if (playerIndex > -1) {
        playersByPosition[position.position.abbreviation].splice(playerIndex, 1)
      }
    }
  })
  
  // Distribuir jugadores restantes
  const remainingPlayers = Object.values(playersByPosition).flat()
  remainingPlayers.forEach((player, index) => {
    const targetTeam = index % 2 === 0 ? homeTeam : awayTeam
    targetTeam.push(player)
  })
  
  const balanceScore = calculateBalanceScore(homeTeam, awayTeam, preferences)
  
  return { homeTeam, awayTeam, balanceScore }
}

const calculateBalanceScore = (
  homeTeam: Player[],
  awayTeam: Player[],
  preferences: BalancePreferences
): number => {
  const homeAvgSkill = homeTeam.reduce((sum, p) => sum + p.skill_level, 0) / homeTeam.length
  const awayAvgSkill = awayTeam.reduce((sum, p) => sum + p.skill_level, 0) / awayTeam.length
  
  const skillBalance = 100 - Math.abs(homeAvgSkill - awayAvgSkill) * 10
  
  const homePositions = new Set(homeTeam.map(p => p.position_zone.abbreviation))
  const awayPositions = new Set(awayTeam.map(p => p.position_zone.abbreviation))
  const positionBalance = 100 - Math.abs(homePositions.size - awayPositions.size) * 20
  
  const sizeBalance = 100 - Math.abs(homeTeam.length - awayTeam.length) * 10
  
  return (
    skillBalance * preferences.skill_level_weight +
    positionBalance * preferences.position_balance_weight +
    sizeBalance * preferences.team_size_weight
  ) / 3
}
```

### Caching de Formaciones
```typescript
// hooks/useFormations.ts
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export const useFormations = () => {
  const [formations, setFormations] = useState<TeamFormation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFormations = async () => {
      try {
        const formationsData = await apiClient.getFormations()
        setFormations(formationsData)
      } catch (err) {
        setError('Error cargando formaciones')
        console.error('Error loading formations:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadFormations()
  }, [])

  const getFormationById = (id: string) => {
    return formations.find(f => f.id === id)
  }

  const getFormationsByGameType = (gameType: '5v5' | '7v7' | '11v11') => {
    return formations.filter(f => f.game_type === gameType)
  }

  return {
    formations,
    loading,
    error,
    getFormationById,
    getFormationsByGameType
  }
}
```

## 🗺️ Roadmap del Módulo

### ✅ Funcionalidades Completadas
- [x] **Sistema de posiciones avanzado**: Soporte para posiciones por zona y específicas
- [x] **Algoritmos de balanceo**: Distribución inteligente de jugadores
- [x] **Formaciones tácticas**: Múltiples formaciones predefinidas
- [x] **Visualización de cancha**: Interfaz gráfica de posiciones
- [x] **Validaciones robustas**: Verificación de compatibilidad
- [x] **API completa**: Endpoints para todas las operaciones
- [x] **Componentes reutilizables**: Interfaz modular y escalable
- [x] **Métricas de balance**: Puntuación de equilibrio de equipos

### 🔄 Funcionalidades en Desarrollo
- [ ] **IA para balanceo**: Machine Learning para optimización
- [ ] **Análisis de rendimiento**: Predicción de resultados
- [ ] **Formaciones personalizadas**: Creación de formaciones únicas
- [ ] **Estadísticas avanzadas**: Métricas detalladas de equipos
- [ ] **Sistema de scouts**: Evaluación automática de jugadores
- [ ] **Integración con partidos**: Conexión directa con calendario
- [ ] **Historial de generaciones**: Guardado de configuraciones
- [ ] **Exportación avanzada**: Reportes detallados de equipos

### 🚀 Próximas Mejoras
- [ ] **Algoritmos genéticos**: Optimización evolutiva de equipos
- [ ] **Análisis de rivales**: Estrategias contra equipos específicos
- [ ] **Simulación de partidos**: Predicción de resultados
- [ ] **Integración con wearables**: Datos de fitness en tiempo real
- [ ] **API GraphQL**: Consultas optimizadas
- [ ] **WebSocket**: Actualizaciones en tiempo real
- [ ] **Realidad aumentada**: Visualización 3D de formaciones
- [ ] **Análisis de video**: Integración con análisis de partidos

---

**Generador de Equipos** - Documentación Técnica v2.0

*Última actualización: Diciembre 2024*
*Versión del sistema: 2.0.0*
*Estado: ✅ Implementado y Funcional* 