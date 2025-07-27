# ⚽ Módulo de Registro de Jugadores - Formación Pro Soccer

## 📋 Descripción General

El módulo de **Registro de Jugadores** es el componente central para la gestión de perfiles de jugadores en el sistema Formación Pro Soccer. Permite el registro completo de jugadores con información personal, física, técnica y un sistema avanzado de posiciones por zona y específicas, adaptándose a diferentes tipos de fútbol (5v5, 7v7, 11v11).

## 🎯 Funcionalidades Principales

### ✅ Funcionalidades Implementadas
- **Registro Completo de Jugadores**: Información personal, física y técnica
- **Sistema de Posiciones Avanzado**: Posiciones por zona y específicas
- **Validación de Datos**: Verificación de información requerida
- **Gestión de Perfiles**: Creación, edición y visualización de jugadores
- **Integración con Equipos**: Asignación automática a equipos
- **Sistema de Niveles**: Evaluación de habilidad del 1 al 10
- **Información Física**: Altura, peso, número de camiseta
- **Datos Personales**: Nombre, email, teléfono, nacionalidad, fecha de nacimiento
- **Posiciones Flexibles**: Adaptable a fútbol 5v5, 7v7 y 11v11

### 🔄 Funcionalidades en Desarrollo
- **Evaluación Técnica**: Tests de habilidades específicas
- **Historial de Posiciones**: Cambios de posición del jugador
- **Estadísticas de Rendimiento**: Métricas por posición
- **Fotos de Perfil**: Gestión de imágenes de jugadores
- **Documentos**: Subida de documentos personales
- **Notas Médicas**: Información de salud y lesiones

## 🏗️ Arquitectura del Módulo

### Estructura de Archivos
```
src/app/register-player/
├── page.tsx                    # Página principal de registro
├── [id]/                       # Página de edición de jugador
│   └── page.tsx               # Formulario de edición
├── search/                     # Búsqueda de jugadores
│   └── page.tsx               # Resultados de búsqueda
└── components/                # Componentes específicos
    ├── PlayerRegistrationForm.tsx  # Formulario de registro
    ├── PlayerProfile.tsx      # Vista de perfil de jugador
    ├── PlayerSearch.tsx       # Búsqueda de jugadores
    └── PlayerStats.tsx        # Estadísticas del jugador
```

### Modelo de Datos

#### Entidad Player
```typescript
interface Player {
  id: number;
  user_id: number;
  team_id?: number;
  
  // Sistema de posiciones por zona y específicas
  position_zone_id: number;
  position_specific_id?: number;
  
  // Información personal
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  
  // Información física y técnica
  jersey_number?: number;
  height?: number; // en centímetros
  weight?: number; // en kilogramos
  skill_level: number; // 1-10
  
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  
  // Relaciones
  position_zone: PositionZone;
  position_specific?: PositionSpecific;
  team?: Team;
  user?: User;
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
```

## 🔌 API Endpoints

### Registro de Jugadores
```typescript
// POST /players/register/
interface PlayerRegistrationRequest {
  full_name: string;
  email: string;
  phone?: string;
  position_zone: string;  // POR, DEF, MED, DEL
  position_specific?: string;  // LD, LI, DFC, etc.
  date_of_birth?: string;
  nationality?: string;
  jersey_number?: number;
  height?: number;
  weight?: number;
  skill_level: number;
  team_id: number;
}

// GET /players/
interface GetPlayersResponse {
  data: Player[];
}

// GET /players/{id}
interface GetPlayerResponse {
  data: Player;
}

// PUT /players/{id}
interface UpdatePlayerRequest {
  name?: string;
  email?: string;
  phone?: string;
  position_zone_id?: number;
  position_specific_id?: number;
  date_of_birth?: string;
  nationality?: string;
  jersey_number?: number;
  height?: number;
  weight?: number;
  skill_level?: number;
  team_id?: number;
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

### PlayerRegistrationForm
```typescript
// components/PlayerRegistrationForm.tsx
interface PlayerRegistrationFormProps {
  onSubmit: (data: PlayerRegistrationFormData) => void;
  onCancel: () => void;
  teamId: number;
}

const PlayerRegistrationForm: React.FC<PlayerRegistrationFormProps> = ({
  onSubmit,
  onCancel,
  teamId
}) => {
  const [positionZones, setPositionZones] = useState<PositionZone[]>([])
  const [positionSpecifics, setPositionSpecifics] = useState<PositionSpecific[]>([])
  const [selectedZone, setSelectedZone] = useState<string>('')

  // Cargar posiciones por zona
  useEffect(() => {
    const loadPositionZones = async () => {
      const zones = await apiClient.getPositionZones()
      setPositionZones(zones)
    }
    loadPositionZones()
  }, [])

  // Cargar posiciones específicas cuando se selecciona una zona
  useEffect(() => {
    const loadPositionSpecifics = async () => {
      if (selectedZone) {
        const zone = positionZones.find(z => z.abbreviation === selectedZone)
        if (zone) {
          const specifics = await apiClient.getPositionSpecificsByZone(zone.id)
          setPositionSpecifics(specifics)
        }
      }
    }
    loadPositionSpecifics()
  }, [selectedZone, positionZones])

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Información Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre Completo *
          </label>
          <input
            {...register('full_name', { required: 'El nombre es requerido' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            {...register('email', { 
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Posición por Zona (Obligatoria) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Posición por Zona *
        </label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Seleccionar zona</option>
          {positionZones.map(zone => (
            <option key={zone.id} value={zone.abbreviation}>
              {zone.name_es} ({zone.abbreviation})
            </option>
          ))}
        </select>
      </div>

      {/* Posición Específica (Opcional) */}
      {selectedZone && positionSpecifics.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Posición Específica (Opcional)
          </label>
          <select
            onChange={(e) => setValue('position_specific', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sin especificar</option>
            {positionSpecifics.map(specific => (
              <option key={specific.id} value={specific.abbreviation}>
                {specific.name_es} ({specific.abbreviation})
              </option>
            ))}
          </select>
          <small className="text-gray-500">
            Recomendado para fútbol 11v11
          </small>
        </div>
      )}

      {/* Información Física */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Altura (cm)
          </label>
          <input
            {...register('height', { valueAsNumber: true })}
            type="number"
            min="100"
            max="250"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Peso (kg)
          </label>
          <input
            {...register('weight', { valueAsNumber: true })}
            type="number"
            min="30"
            max="150"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nivel de Habilidad *
          </label>
          <div className="mt-1">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    {...register('skill_level', { 
                      required: 'El nivel de habilidad es requerido',
                      valueAsNumber: true
                    })}
                    type="radio"
                    value={level}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    watch('skill_level') == level
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300'
                  }`}>
                    {level}
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              1 = Principiante, 10 = Experto
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
```

### PlayerProfile
```typescript
// components/PlayerProfile.tsx
interface PlayerProfileProps {
  player: Player;
  onEdit?: () => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              getPositionColor(player.position_zone.name_es)
            }`}>
              {player.position_specific?.name_es || player.position_zone.name_es}
            </span>
            {player.jersey_number && (
              <span className="text-sm text-gray-500">
                #{player.jersey_number}
              </span>
            )}
          </div>
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Editar
          </button>
        )}
      </div>

      {/* Información Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Información Personal</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <span className="ml-2 text-sm text-gray-900">{player.email}</span>
            </div>
            {player.phone && (
              <div>
                <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                <span className="ml-2 text-sm text-gray-900">{player.phone}</span>
              </div>
            )}
            {player.nationality && (
              <div>
                <span className="text-sm font-medium text-gray-500">Nacionalidad:</span>
                <span className="ml-2 text-sm text-gray-900">{player.nationality}</span>
              </div>
            )}
            {player.date_of_birth && (
              <div>
                <span className="text-sm font-medium text-gray-500">Fecha de Nacimiento:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {new Date(player.date_of_birth).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Información Física</h3>
          <div className="space-y-2">
            {player.height && (
              <div>
                <span className="text-sm font-medium text-gray-500">Altura:</span>
                <span className="ml-2 text-sm text-gray-900">{player.height} cm</span>
              </div>
            )}
            {player.weight && (
              <div>
                <span className="text-sm font-medium text-gray-500">Peso:</span>
                <span className="ml-2 text-sm text-gray-900">{player.weight} kg</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Nivel de Habilidad:</span>
              <span className="ml-2 text-sm text-gray-900">{player.skill_level}/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posición */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Posición</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Zona:</span>
            <span className="ml-2 text-sm text-gray-900">{player.position_zone.name_es}</span>
          </div>
          {player.position_specific && (
            <div>
              <span className="text-sm font-medium text-gray-500">Específica:</span>
              <span className="ml-2 text-sm text-gray-900">{player.position_specific.name_es}</span>
            </div>
          )}
        </div>
      </div>

      {/* Equipo */}
      {player.team && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipo</h3>
          <div>
            <span className="text-sm font-medium text-gray-500">Equipo:</span>
            <span className="ml-2 text-sm text-gray-900">{player.team.name}</span>
          </div>
        </div>
      )}
    </div>
  )
}
```

## 🧪 Tests Unitarios

### Tests de Componentes
```typescript
// __tests__/components/PlayerRegistrationForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PlayerRegistrationForm from '@/components/PlayerRegistrationForm'

describe('PlayerRegistrationForm', () => {
  it('should render form fields correctly', () => {
    render(<PlayerRegistrationForm onSubmit={jest.fn()} onCancel={jest.fn()} teamId={1} />)
    
    expect(screen.getByLabelText('Nombre Completo *')).toBeInTheDocument()
    expect(screen.getByLabelText('Email *')).toBeInTheDocument()
    expect(screen.getByLabelText('Posición por Zona *')).toBeInTheDocument()
    expect(screen.getByLabelText('Nivel de Habilidad *')).toBeInTheDocument()
  })

  it('should load position zones on mount', async () => {
    const mockGetPositionZones = jest.fn().mockResolvedValue([
      { id: 1, abbreviation: 'POR', name_es: 'Portero', name_en: 'Goalkeeper' },
      { id: 2, abbreviation: 'DEF', name_es: 'Defensa', name_en: 'Defender' }
    ])
    
    render(<PlayerRegistrationForm onSubmit={jest.fn()} onCancel={jest.fn()} teamId={1} />)
    
    await waitFor(() => {
      expect(screen.getByText('Portero (POR)')).toBeInTheDocument()
      expect(screen.getByText('Defensa (DEF)')).toBeInTheDocument()
    })
  })

  it('should load specific positions when zone is selected', async () => {
    const mockGetSpecifics = jest.fn().mockResolvedValue([
      { id: 1, abbreviation: 'LD', name_es: 'Lateral Derecho', zone_id: 2 }
    ])
    
    render(<PlayerRegistrationForm onSubmit={jest.fn()} onCancel={jest.fn()} teamId={1} />)
    
    const zoneSelect = screen.getByLabelText('Posición por Zona *')
    fireEvent.change(zoneSelect, { target: { value: 'DEF' } })
    
    await waitFor(() => {
      expect(screen.getByText('Lateral Derecho (LD)')).toBeInTheDocument()
    })
  })
})
```

### Tests de API
```typescript
// __tests__/api/playerRegistration.test.ts
import { apiClient } from '@/lib/api'

describe('Player Registration API', () => {
  it('should register a new player successfully', async () => {
    const playerData = {
      full_name: 'Juan Pérez',
      email: 'juan@example.com',
      position_zone: 'DEF',
      position_specific: 'LD',
      skill_level: 7,
      team_id: 1
    }
    
    const response = await apiClient.createPlayer(playerData)
    
    expect(response).toHaveProperty('id')
    expect(response.name).toBe('Juan Pérez')
    expect(response.position_zone.abbreviation).toBe('DEF')
    expect(response.position_specific?.abbreviation).toBe('LD')
  })

  it('should validate position zone and specific relationship', async () => {
    const invalidData = {
      full_name: 'Juan Pérez',
      email: 'juan@example.com',
      position_zone: 'POR',
      position_specific: 'LD', // LD belongs to DEF zone, not POR
      skill_level: 7,
      team_id: 1
    }
    
    await expect(apiClient.createPlayer(invalidData)).rejects.toThrow()
  })
})
```

## 📊 Métricas y Analytics

### Métricas de Registro
```typescript
interface RegistrationMetrics {
  total_players: number;
  players_by_position_zone: {
    POR: number;
    DEF: number;
    MED: number;
    DEL: number;
  };
  players_by_specific_position: {
    LD: number;
    LI: number;
    DFC: number;
    // ... otras posiciones específicas
  };
  average_skill_level: number;
  registration_trend: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
}
```

### Dashboard de Métricas
```typescript
// components/RegistrationDashboard.tsx
const RegistrationDashboard: React.FC<{ metrics: RegistrationMetrics }> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jugadores</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total_players}</p>
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
              <p className="text-sm font-medium text-gray-600">Nivel Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.average_skill_level.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución por Posiciones */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Distribución por Posiciones</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics.players_by_position_zone).map(([zone, count]) => (
              <div key={zone} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600">{zone}</div>
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
// utils/validation.ts
import { z } from 'zod'

export const playerRegistrationSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  position_zone: z.enum(['POR', 'DEF', 'MED', 'DEL'], {
    required_error: 'Debe seleccionar una posición por zona'
  }),
  position_specific: z.string().optional(),
  date_of_birth: z.string().optional(),
  nationality: z.string().optional(),
  jersey_number: z.number().min(1).max(99).optional(),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(150).optional(),
  skill_level: z.number().min(1).max(10),
  team_id: z.number().positive()
})

export const validatePositionRelationship = (
  zone: string,
  specific?: string
): boolean => {
  if (!specific) return true
  
  const validRelationships = {
    POR: [],
    DEF: ['LD', 'LI', 'DFC', 'CAI', 'CAD'],
    MED: ['MCD', 'MC', 'MCO', 'MD', 'MI'],
    DEL: ['ED', 'EI', 'DC', 'SD']
  }
  
  return validRelationships[zone as keyof typeof validRelationships]?.includes(specific) || false
}
```

### Validaciones del Backend
```python
# backend/app/main.py
@app.post("/players/register/", response_model=schemas.PlayerOut)
def register_player(player_data: schemas.PlayerRegistration, db: Session = Depends(get_db)):
    """Register a new player with position information"""
    # Verificar que la zona de posición existe
    zone = crud.get_position_zone_by_abbreviation(db, player_data.position_zone)
    if not zone:
        raise HTTPException(status_code=400, detail="Zona de posición inválida")
    
    # Verificar que la posición específica existe si se proporciona
    specific_id = None
    if player_data.position_specific:
        specific = crud.get_position_specific_by_abbreviation(db, player_data.position_specific)
        if not specific:
            raise HTTPException(status_code=400, detail="Posición específica inválida")
        if specific.zone_id != zone.id:
            raise HTTPException(status_code=400, detail="La posición específica no pertenece a la zona seleccionada")
        specific_id = specific.id
    
    # Validar email único
    existing_user = crud.get_user_by_email(db, player_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Validar nivel de habilidad
    if not 1 <= player_data.skill_level <= 10:
        raise HTTPException(status_code=400, detail="El nivel de habilidad debe estar entre 1 y 10")
    
    # Crear jugador
    player = crud.create_player(db, player_data, zone.id, specific_id)
    return player
```

## 🚀 Optimizaciones Implementadas

### Caching de Posiciones
```typescript
// hooks/usePositions.ts
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export const usePositions = () => {
  const [positionZones, setPositionZones] = useState<PositionZone[]>([])
  const [positionSpecifics, setPositionSpecifics] = useState<Record<number, PositionSpecific[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const zones = await apiClient.getPositionZones()
        setPositionZones(zones)
        
        // Precargar posiciones específicas para todas las zonas
        const specificsMap: Record<number, PositionSpecific[]> = {}
        for (const zone of zones) {
          const specifics = await apiClient.getPositionSpecificsByZone(zone.id)
          specificsMap[zone.id] = specifics
        }
        setPositionSpecifics(specificsMap)
      } catch (error) {
        console.error('Error loading positions:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPositions()
  }, [])

  return {
    positionZones,
    positionSpecifics,
    loading,
    getSpecificsByZone: (zoneId: number) => positionSpecifics[zoneId] || []
  }
}
```

### Lazy Loading de Componentes
```typescript
// pages/register-player/page.tsx
import dynamic from 'next/dynamic'

const PlayerRegistrationForm = dynamic(
  () => import('@/components/PlayerRegistrationForm'),
  { loading: () => <div>Cargando formulario...</div> }
)

const PlayerProfile = dynamic(
  () => import('@/components/PlayerProfile'),
  { loading: () => <div>Cargando perfil...</div> }
)
```

## 🗺️ Roadmap del Módulo

### ✅ Funcionalidades Completadas
- [x] **Sistema de posiciones avanzado**: Por zona y específicas
- [x] **Formulario de registro completo**: Con validaciones
- [x] **API robusta**: Endpoints para todas las operaciones
- [x] **Validaciones de seguridad**: Frontend y backend
- [x] **Integración con equipos**: Asignación automática
- [x] **Componentes reutilizables**: Formularios y perfiles
- [x] **Sistema de niveles**: Evaluación de habilidad
- [x] **Información física**: Altura, peso, medidas

### 🔄 Funcionalidades en Desarrollo
- [ ] **Evaluación técnica**: Tests de habilidades específicas
- [ ] **Historial de posiciones**: Cambios de posición del jugador
- [ ] **Estadísticas de rendimiento**: Métricas por posición
- [ ] **Fotos de perfil**: Gestión de imágenes de jugadores
- [ ] **Documentos**: Subida de documentos personales
- [ ] **Notas médicas**: Información de salud y lesiones
- [ ] **Evaluación continua**: Sistema de seguimiento
- [ ] **Reportes avanzados**: Análisis detallado de jugadores

### 🚀 Próximas Mejoras
- [ ] **IA para recomendaciones**: Sugerencias de posición
- [ ] **Análisis de rendimiento**: Machine Learning
- [ ] **Integración con wearables**: Datos de fitness
- [ ] **Sistema de scouts**: Evaluación externa
- [ ] **API GraphQL**: Consultas optimizadas
- [ ] **WebSocket**: Actualizaciones en tiempo real

---

**Módulo de Registro de Jugadores** - Documentación Técnica v2.0

*Última actualización: Diciembre 2024*
*Versión del sistema: 2.0.0*
*Estado: ✅ Implementado y Funcional* 