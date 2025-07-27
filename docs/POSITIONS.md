# 🎯 Sistema de Posiciones de Jugadores - Formación Pro Soccer

## 📋 Descripción General

El sistema de posiciones de jugadores está diseñado para ser flexible y escalable, permitiendo el uso de posiciones básicas para fútbol 5v5 y 7v7, y posiciones específicas para fútbol 11v11. El sistema utiliza un enfoque de dos niveles: **Posiciones por Zona** (obligatorias) y **Posiciones Específicas** (opcionales).

## 🏗️ Estructura de Base de Datos Implementada

### Tabla: `position_zones` (Posiciones Básicas)
```sql
CREATE TABLE position_zones (
    id SERIAL PRIMARY KEY,
    abbreviation VARCHAR(3) UNIQUE NOT NULL,  -- POR, DEF, MED, DEL
    name_es VARCHAR(20) NOT NULL,            -- Portero, Defensa, Mediocampista, Delantero
    name_en VARCHAR(20) NOT NULL,            -- Goalkeeper, Defender, Midfielder, Forward
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `position_specifics` (Posiciones Específicas)
```sql
CREATE TABLE position_specifics (
    id SERIAL PRIMARY KEY,
    abbreviation VARCHAR(3) UNIQUE NOT NULL,  -- LD, LI, DFC, etc.
    name_es VARCHAR(20) NOT NULL,            -- Lateral Derecho, Lateral Izquierdo, etc.
    name_en VARCHAR(20) NOT NULL,            -- Right Back, Left Back, etc.
    zone_id INTEGER REFERENCES position_zones(id),  -- Relación con zona
    description_es TEXT,                      -- Descripción en español
    description_en TEXT,                      -- Descripción en inglés
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `players` (Actualizada)
```sql
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    team_id INTEGER REFERENCES teams(id),
    
    -- Sistema de posiciones por zona y específicas
    position_zone_id INTEGER REFERENCES position_zones(id),  -- Obligatorio
    position_specific_id INTEGER REFERENCES position_specifics(id),  -- Opcional
    
    -- Información personal
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(50),
    
    -- Información física y técnica
    jersey_number INTEGER,
    height INTEGER,  -- en centímetros
    weight INTEGER,  -- en kilogramos
    skill_level INTEGER CHECK (skill_level >= 1 AND skill_level <= 10),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Tipos TypeScript Implementados

### Interfaces Principales
```typescript
// types/index.ts
export interface PositionZone {
  id: number
  abbreviation: 'POR' | 'DEF' | 'MED' | 'DEL'
  name_es: string
  name_en: string
  is_active: boolean
  created_at: string
}

export interface PositionSpecific {
  id: number
  abbreviation: 'LD' | 'LI' | 'DFC' | 'CAI' | 'CAD' | 'MCD' | 'MC' | 'MCO' | 'MD' | 'MI' | 'ED' | 'EI' | 'DC' | 'SD'
  name_es: string
  name_en: string
  zone_id: number
  description_es?: string
  description_en?: string
  is_active: boolean
  created_at: string
  zone: PositionZone
}

export interface Player {
  id: number
  user_id: number
  team_id?: number
  position_zone_id: number
  position_specific_id?: number
  name: string
  email: string
  phone?: string
  date_of_birth?: string
  nationality?: string
  jersey_number?: number
  height?: number // en centímetros
  weight?: number // en kilogramos
  skill_level: number // 1-10
  is_active: boolean
  created_at: string
  updated_at?: string
  position_zone: PositionZone
  position_specific?: PositionSpecific
  team?: Team
  user?: User
}
```

## 🔌 API Endpoints Implementados

### Posiciones por Zona
```typescript
// GET /positions/zones/
interface GetPositionZonesResponse {
  data: PositionZone[]
}

// GET /positions/zones/{abbreviation}
interface GetPositionZoneResponse {
  data: PositionZone
}
```

### Posiciones Específicas
```typescript
// GET /positions/specifics/
interface GetPositionSpecificsResponse {
  data: PositionSpecific[]
}

// GET /positions/specifics/zone/{zone_id}
interface GetPositionSpecificsByZoneResponse {
  data: PositionSpecific[]
}

// GET /positions/specifics/{abbreviation}
interface GetPositionSpecificResponse {
  data: PositionSpecific
}
```

### Registro de Jugadores
```typescript
// POST /players/register/
interface PlayerRegistrationRequest {
  full_name: string
  email: string
  phone?: string
  position_zone: string  // POR, DEF, MED, DEL
  position_specific?: string  // LD, LI, DFC, etc.
  date_of_birth?: string
  nationality?: string
  jersey_number?: number
  height?: number
  weight?: number
  skill_level: number
  team_id: number
}

interface PlayerRegistrationResponse {
  data: Player
}
```

## 🎮 Uso en Diferentes Contextos

### 1. Formulario de Registro de Jugadores
```typescript
// components/PlayerRegistrationForm.tsx
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
    <form>
      {/* Posición por Zona (Obligatoria) */}
      <div>
        <label>Posición por Zona *</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
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
          <label>Posición Específica (Opcional)</label>
          <select onChange={(e) => setValue('position_specific', e.target.value)}>
            <option value="">Sin especificar</option>
            {positionSpecifics.map(specific => (
              <option key={specific.id} value={specific.abbreviation}>
                {specific.name_es} ({specific.abbreviation})
              </option>
            ))}
          </select>
          <small>Recomendado para fútbol 11v11</small>
        </div>
      )}
    </form>
  )
}
```

### 2. Tarjetas de Jugadores (Espacio Compacto)
```typescript
// components/PlayerCard.tsx
const PlayerCard: React.FC<PlayerCardProps> = ({ player, compact = false }) => {
  return (
    <div className="player-card">
      <div className="player-info">
        <span className="rating">{player.skill_level}</span>
        {/* Usar abreviación de posición específica si existe, sino de zona */}
        <span className="position">
          {player.position_specific?.abbreviation || player.position_zone.abbreviation}
        </span>
      </div>
      
      <div className="player-name">{player.name}</div>
      
      {/* Estadísticas */}
      <div className="stats">
        <span>RIT: {player.stats.rit}</span>
        <span>TIR: {player.stats.tir}</span>
        <span>PAS: {player.stats.pas}</span>
        <span>REG: {player.stats.reg}</span>
        <span>DEF: {player.stats.def}</span>
        <span>FÍS: {player.stats.fis}</span>
      </div>
    </div>
  )
}
```

### 3. Tablas de Jugadores (Nombres Completos)
```typescript
// components/PlayerTable.tsx
const PlayerTable: React.FC<{ players: Player[] }> = ({ players }) => {
  return (
    <table className="player-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Posición</th>
          <th>Nivel</th>
          <th>Equipo</th>
        </tr>
      </thead>
      <tbody>
        {players.map(player => (
          <tr key={player.id}>
            <td>{player.name}</td>
            {/* Usar nombre completo de posición específica si existe, sino de zona */}
            <td>
              {player.position_specific?.name_es || player.position_zone.name_es}
            </td>
            <td>{player.skill_level}</td>
            <td>{player.team?.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## 🎯 Casos de Uso por Tipo de Fútbol

### ✅ Fútbol 5v5 y 7v7 (Usar Posiciones Básicas)
- **Posición por Zona**: `POR`, `DEF`, `MED`, `DEL`
- **Posición Específica**: Sin especificar
- **Ejemplo**: Portero (POR), Defensa (DEF), etc.

### ✅ Fútbol 11v11 (Usar Posiciones Específicas)
- **Posición por Zona**: `DEF` (Defensa)
- **Posición Específica**: `LD` (Lateral Derecho)
- **Ejemplo**: Lateral Derecho (LD), Defensa Central (DFC), etc.

## 🧪 Testing Implementado

### Tests Unitarios
```typescript
// __tests__/utils/positions.test.ts
import { apiClient } from '@/lib/api'

describe('Position API', () => {
  it('should get position zones', async () => {
    const zones = await apiClient.getPositionZones()
    expect(zones).toHaveLength(4)
    expect(zones[0]).toHaveProperty('abbreviation')
    expect(zones[0]).toHaveProperty('name_es')
  })

  it('should get position specifics by zone', async () => {
    const specifics = await apiClient.getPositionSpecificsByZone(2) // DEF zone
    expect(specifics.length).toBeGreaterThan(0)
    expect(specifics[0].zone_id).toBe(2)
  })
})
```

## 📊 Migración de Datos

### Script de Migración Implementado
```bash
# Ejecutar migración
cd backend
python migrate_positions.py
```

### Datos Iniciales Creados
```sql
-- Posiciones por Zona
INSERT INTO position_zones (abbreviation, name_es, name_en) VALUES
('POR', 'Portero', 'Goalkeeper'),
('DEF', 'Defensa', 'Defender'),
('MED', 'Mediocampista', 'Midfielder'),
('DEL', 'Delantero', 'Forward');

-- Posiciones Específicas
INSERT INTO position_specifics (abbreviation, name_es, name_en, zone_id, description_es, description_en) VALUES
-- Defensa
('LD', 'Lateral Derecho', 'Right Back', 2, 'Defensa que juega por la banda derecha', 'Defender who plays on the right wing'),
('LI', 'Lateral Izquierdo', 'Left Back', 2, 'Defensa que juega por la banda izquierda', 'Defender who plays on the left wing'),
('DFC', 'Defensa Central', 'Center Back', 2, 'Defensa que juega en el centro de la defensa', 'Defender who plays in the center of defense'),
('CAI', 'Carrilero Izquierdo', 'Left Wing Back', 2, 'Defensa que sube por la banda izquierda', 'Defender who advances on the left wing'),
('CAD', 'Carrilero Derecho', 'Right Wing Back', 2, 'Defensa que sube por la banda derecha', 'Defender who advances on the right wing'),

-- Mediocampo
('MCD', 'Mediocentro Defensivo', 'Defensive Midfielder', 3, 'Mediocampista que se enfoca en la recuperación', 'Midfielder focused on ball recovery'),
('MC', 'Mediocentro', 'Center Midfielder', 3, 'Mediocampista que juega en el centro del campo', 'Midfielder who plays in the center of the field'),
('MCO', 'Mediocentro Ofensivo', 'Attacking Midfielder', 3, 'Mediocampista que se enfoca en el ataque', 'Midfielder focused on attacking'),
('MD', 'Volante por la Derecha', 'Right Winger', 3, 'Mediocampista que juega por la banda derecha', 'Midfielder who plays on the right wing'),
('MI', 'Volante por la Izquierda', 'Left Winger', 3, 'Mediocampista que juega por la banda izquierda', 'Midfielder who plays on the left wing'),

-- Ataque
('ED', 'Extremo Derecho', 'Right Winger', 4, 'Delantero que juega por la banda derecha', 'Forward who plays on the right wing'),
('EI', 'Extremo Izquierdo', 'Left Winger', 4, 'Delantero que juega por la banda izquierda', 'Forward who plays on the left wing'),
('DC', 'Delantero Centro', 'Center Forward', 4, 'Delantero que juega en el centro del ataque', 'Forward who plays in the center of attack'),
('SD', 'Segundo Delantero', 'Second Striker', 4, 'Delantero que juega detrás del delantero centro', 'Forward who plays behind the center forward');
```

## 🔮 Roadmap Implementado

### ✅ Funcionalidades Completadas
- [x] **Sistema de dos niveles**: Posiciones por zona y específicas
- [x] **API completa**: Endpoints para todas las operaciones
- [x] **Frontend integrado**: Componentes con sistema de posiciones
- [x] **Validaciones**: Relaciones y reglas de negocio
- [x] **Migración**: Scripts de migración automática
- [x] **Documentación**: Completa y actualizada

### 🚀 Próximas Mejoras
- [ ] **Posiciones personalizadas**: Por club o liga
- [ ] **Historial de posiciones**: Cambios de posición del jugador
- [ ] **Estadísticas por posición**: Rendimiento por zona
- [ ] **Formaciones tácticas**: Integración con generador de equipos
- [ ] **API GraphQL**: Consultas optimizadas
- [ ] **WebSocket**: Actualizaciones en tiempo real

---

**Sistema de Posiciones** - Documentación Técnica v2.0

*Última actualización: Diciembre 2024*
*Versión del sistema: 2.0.0*
*Estado: ✅ Implementado y Funcional* 