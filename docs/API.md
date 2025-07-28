# API Documentation - Formación ProSoccer

## Información General

- **Base URL**: `http://localhost:9000`
- **Documentación Swagger**: `http://localhost:9000/docs`
- **Documentación ReDoc**: `http://localhost:9000/redoc`
- **Versión**: 2.0

## Autenticación

### JWT Token

```http
Authorization: Bearer <token>
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@prosoccer.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "admin@prosoccer.com",
    "role": "admin",
    "team_id": null
  }
}
```

## Endpoints Principales

### Jugadores

#### Obtener Jugadores

```http
GET /players/
Authorization: Bearer <token>
```

**Query Parameters:**

- `team_id` (optional): Filtrar por equipo
- `position` (optional): Filtrar por posición
- `skill_level` (optional): Filtrar por nivel de habilidad

**Response:**

```json
[
  {
    "id": 1,
    "name": "Danilo Atencio",
    "email": "danilo@matizfc.com",
    "skill_level": 8,
    "position_zone": {
      "id": 1,
      "name_es": "Defensa",
      "abbreviation": "DEF"
    },
    "position_specific": {
      "id": 2,
      "name_es": "Defensa Central",
      "abbreviation": "DEF"
    },
    "team": {
      "id": 1,
      "name": "Matiz FC"
    },
    "is_guest": false,
    "rit": 7,
    "tir": 8,
    "pas": 6,
    "tec": 7,
    "fis": 8,
    "men": 6
  }
]
```

#### Crear Jugador

```http
POST /players/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuevo Jugador",
  "email": "nuevo@equipo.com",
  "skill_level": 5,
  "position_zone_id": 1,
  "position_specific_id": 2,
  "team_id": 1,
  "rit": 5,
  "tir": 6,
  "pas": 5,
  "tec": 6,
  "fis": 5,
  "men": 5
}
```

#### Actualizar Jugador

```http
PUT /players/{player_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jugador Actualizado",
  "skill_level": 6
}
```

#### Eliminar Jugador

```http
DELETE /players/{player_id}
Authorization: Bearer <token>
```

### Equipos

#### Obtener Equipos

```http
GET /teams/
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Matiz FC",
    "description": "Equipo principal",
    "players": [
      {
        "id": 1,
        "name": "Danilo Atencio",
        "skill_level": 8
      }
    ]
  }
]
```

#### Crear Equipo

```http
POST /teams/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuevo Equipo",
  "description": "Descripción del equipo"
}
```

### Posiciones

#### Obtener Zonas de Posición

```http
GET /position-zones/
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "name_es": "Portero",
    "name_en": "Goalkeeper",
    "abbreviation": "POR"
  },
  {
    "id": 2,
    "name_es": "Defensa",
    "name_en": "Defense",
    "abbreviation": "DEF"
  },
  {
    "id": 3,
    "name_es": "Mediocampo",
    "name_en": "Midfield",
    "abbreviation": "MED"
  },
  {
    "id": 4,
    "name_es": "Delantero",
    "name_en": "Forward",
    "abbreviation": "DEL"
  }
]
```

#### Obtener Posiciones Específicas

```http
GET /position-specifics/
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "name_es": "Portero",
    "name_en": "Goalkeeper",
    "abbreviation": "POR",
    "zone_id": 1,
    "zone": {
      "id": 1,
      "name_es": "Portero",
      "abbreviation": "POR"
    }
  },
  {
    "id": 2,
    "name_es": "Defensa Central",
    "name_en": "Center Back",
    "abbreviation": "DEF",
    "zone_id": 2,
    "zone": {
      "id": 2,
      "name_es": "Defensa",
      "abbreviation": "DEF"
    }
  }
]
```

### Pagos

#### Obtener Pagos

```http
GET /payments/
Authorization: Bearer <token>
```

**Query Parameters:**

- `player_id` (optional): Filtrar por jugador
- `month` (optional): Filtrar por mes (YYYY-MM)
- `status` (optional): Filtrar por estado (paid, pending, overdue)

#### Crear Pago

```http
POST /payments/
Authorization: Bearer <token>
Content-Type: application/json

{
  "player_id": 1,
  "amount": 50000,
  "month": "2024-12",
  "status": "paid",
  "payment_date": "2024-12-15"
}
```

### Gastos

#### Obtener Gastos

```http
GET /expenses/
Authorization: Bearer <token>
```

#### Crear Gasto

```http
POST /expenses/
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Compra de balones",
  "amount": 150000,
  "category": "equipment",
  "date": "2024-12-15"
}
```

### Partidos

#### Obtener Partidos

```http
GET /matches/
Authorization: Bearer <token>
```

#### Crear Partido

```http
POST /matches/
Authorization: Bearer <token>
Content-Type: application/json

{
  "home_team": "Matiz FC",
  "away_team": "Equipo Rival",
  "date": "2024-12-20T15:00:00",
  "location": "Estadio Municipal",
  "type": "friendly"
}
```

## Nuevos Endpoints - Team Generator

### Generación de Equipos

#### Generar Equipos

```http
POST /teams/generate/
Authorization: Bearer <token>
Content-Type: application/json

{
  "players": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "game_type": "5v5",
  "formation": "1-2-2",
  "team_id": 1
}
```

**Response:**

```json
{
  "home_team": {
    "name": "Equipo A",
    "starters": [
      {
        "id": 1,
        "name": "Danilo Atencio",
        "position": "DEF",
        "skill_level": 8
      }
    ],
    "substitutes": [],
    "average_skill": 7.5
  },
  "away_team": {
    "name": "Equipo B",
    "starters": [
      {
        "id": 2,
        "name": "Palito'S",
        "position": "DEF",
        "skill_level": 7
      }
    ],
    "substitutes": [],
    "average_skill": 7.0
  },
  "balance_score": 0.5,
  "game_type": "5v5",
  "formation": "1-2-2",
  "generated_at": "2024-12-15T10:30:00"
}
```

#### Obtener Configuraciones Guardadas

```http
GET /teams/saved-configurations/
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Formación 5v5 - Matiz FC",
    "game_type": "5v5",
    "formation": "1-2-2",
    "players": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "created_at": "2024-12-15T10:30:00"
  }
]
```

#### Guardar Configuración

```http
POST /teams/save-configuration/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mi Formación Favorita",
  "game_type": "5v5",
  "formation": "1-2-2",
  "players": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

### Jugadores Manuales

#### Crear Jugador Manual

```http
POST /players/manual/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jugador Invitado",
  "skill_level": 5,
  "position_zone_id": 2,
  "position_specific_id": 3,
  "rit": 5,
  "tir": 6,
  "pas": 5,
  "tec": 6,
  "fis": 5,
  "men": 5,
  "is_guest": true
}
```

## Códigos de Error

### Errores Comunes

#### 400 - Bad Request

```json
{
  "detail": "Datos de entrada inválidos",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

#### 401 - Unauthorized

```json
{
  "detail": "Token de autenticación inválido o expirado"
}
```

#### 403 - Forbidden

```json
{
  "detail": "No tienes permisos para realizar esta acción"
}
```

#### 404 - Not Found

```json
{
  "detail": "Recurso no encontrado"
}
```

#### 422 - Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "skill_level"],
      "msg": "El nivel de habilidad debe estar entre 1 y 5",
      "type": "value_error"
    }
  ]
}
```

#### 500 - Internal Server Error

```json
{
  "detail": "Error interno del servidor"
}
```

## Rate Limiting

- **Límite por IP**: 100 requests por minuto
- **Límite por usuario**: 1000 requests por hora
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite actual
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Tiempo de reset

## Webhooks (Futuro)

### Eventos Disponibles

- `player.created`
- `player.updated`
- `player.deleted`
- `payment.completed`
- `match.scheduled`

### Configuración de Webhook

```http
POST /webhooks/
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://tu-servidor.com/webhook",
  "events": ["player.created", "payment.completed"],
  "secret": "tu-clave-secreta"
}
```

## Ejemplos de Uso

### JavaScript/TypeScript

```typescript
// Cliente API
class ProSoccerAPI {
  private baseURL = 'http://localhost:9000';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getPlayers(teamId?: number): Promise<Player[]> {
    const url = teamId
      ? `${this.baseURL}/players/?team_id=${teamId}`
      : `${this.baseURL}/players/`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async generateTeams(
    players: number[],
    config: TeamConfig
  ): Promise<TeamDistribution> {
    const response = await fetch(`${this.baseURL}/teams/generate/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ players, ...config }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Uso
const api = new ProSoccerAPI('tu-token');
const players = await api.getPlayers(1);
const teams = await api.generateTeams([1, 2, 3, 4, 5], {
  game_type: '5v5',
  formation: '1-2-2',
});
```

### Python

```python
import requests

class ProSoccerClient:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def get_players(self, team_id: int = None):
        params = {'team_id': team_id} if team_id else {}
        response = requests.get(
            f'{self.base_url}/players/',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def generate_teams(self, players: list, game_type: str, formation: str):
        data = {
            'players': players,
            'game_type': game_type,
            'formation': formation
        }
        response = requests.post(
            f'{self.base_url}/teams/generate/',
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()

# Uso
client = ProSoccerClient('http://localhost:9000', 'tu-token')
players = client.get_players(team_id=1)
teams = client.generate_teams(
    players=[1, 2, 3, 4, 5],
    game_type='5v5',
    formation='1-2-2'
)
```

## Testing de la API

### Usando curl

```bash
# Login
curl -X POST "http://localhost:9000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@prosoccer.com", "password": "admin123"}'

# Obtener jugadores
curl -X GET "http://localhost:9000/players/" \
  -H "Authorization: Bearer <token>"

# Generar equipos
curl -X POST "http://localhost:9000/teams/generate/" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"players": [1,2,3,4,5], "game_type": "5v5", "formation": "1-2-2"}'
```

### Usando Postman

1. **Collection**: Importar la colección de Postman
2. **Environment**: Configurar variables de entorno
3. **Tests**: Ejecutar tests automatizados

---

_Documentación de API actualizada: Julio 2025_ _Versión: 1.0.0 - Team Generator
Avanzado_
