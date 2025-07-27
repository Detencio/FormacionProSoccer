# 🔌 API y Servicios - Formación Pro Soccer

## 📋 Descripción

Esta documentación describe la arquitectura de la API, servicios y comunicación entre el frontend y backend de Formación Pro Soccer.

## 🏗️ Arquitectura de la API

### Estructura del Backend
```
backend/
├── 📁 app/                      # Aplicación principal
│   ├── main.py                  # Punto de entrada FastAPI
│   ├── config.py                # Configuración de la app
│   ├── database.py              # Configuración de base de datos
│   ├── auth.py                  # Autenticación y autorización
│   ├── models.py                # Modelos de base de datos
│   ├── schemas.py               # Esquemas Pydantic
│   ├── crud.py                  # Operaciones CRUD
│   └── api/                     # Rutas de la API
│       ├── v1/                  # Versión 1 de la API
│       │   ├── auth.py          # Rutas de autenticación
│       │   ├── teams.py         # Rutas de equipos
│       │   ├── players.py       # Rutas de jugadores
│       │   ├── payments.py      # Rutas de pagos
│       │   └── team_generator.py # Rutas del generador
│       └── dependencies.py      # Dependencias compartidas
├── 📁 tests/                    # Tests de la API
├── 📁 alembic/                  # Migraciones de base de datos
├── requirements.txt              # Dependencias Python
└── create_admin.py              # Script de inicialización
```

## 🔐 Autenticación y Autorización

### JWT Token System
```python
# app/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

# Configuración
SECRET_KEY = "tu-clave-secreta-aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Funciones de autenticación
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username
```

### Endpoints de Autenticación
```python
# app/api/v1/auth.py
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register(user: UserCreate):
    return create_user(user)

@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
```

## 🏆 API de Equipos

### Modelos de Datos
```python
# app/models.py
class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    colors = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    players = relationship("Player", back_populates="team")
    payments = relationship("Payment", back_populates="team")
```

### Esquemas Pydantic
```python
# app/schemas.py
class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    colors: Optional[Dict[str, str]] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

### Endpoints de Equipos
```python
# app/api/v1/teams.py
@router.get("/", response_model=List[Team])
async def get_teams(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    """Obtener lista de equipos"""
    teams = get_teams_by_user(current_user.id, skip=skip, limit=limit)
    return teams

@router.post("/", response_model=Team)
async def create_team(
    team: TeamCreate,
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo equipo"""
    return create_team_for_user(team, current_user.id)

@router.get("/{team_id}", response_model=Team)
async def get_team(
    team_id: int,
    current_user: User = Depends(get_current_user)
):
    """Obtener equipo específico"""
    team = get_team_by_id(team_id, current_user.id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.put("/{team_id}", response_model=Team)
async def update_team(
    team_id: int,
    team: TeamUpdate,
    current_user: User = Depends(get_current_user)
):
    """Actualizar equipo"""
    updated_team = update_team_by_id(team_id, team, current_user.id)
    if not updated_team:
        raise HTTPException(status_code=404, detail="Team not found")
    return updated_team

@router.delete("/{team_id}")
async def delete_team(
    team_id: int,
    current_user: User = Depends(get_current_user)
):
    """Eliminar equipo"""
    success = delete_team_by_id(team_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Team not found")
    return {"message": "Team deleted successfully"}
```

## 👥 API de Jugadores

### Modelos de Datos
```python
# app/models.py
class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    position = Column(String)
    jersey_number = Column(Integer)
    skill = Column(Integer, default=3)
    photo_url = Column(String, nullable=True)
    stats = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    team_id = Column(Integer, ForeignKey("teams.id"))
    team = relationship("Team", back_populates="players")
    payments = relationship("Payment", back_populates="player")
```

### Endpoints de Jugadores
```python
# app/api/v1/players.py
@router.get("/", response_model=List[Player])
async def get_players(
    team_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    """Obtener lista de jugadores"""
    players = get_players_by_team(team_id, current_user.id, skip=skip, limit=limit)
    return players

@router.post("/", response_model=Player)
async def create_player(
    player: PlayerCreate,
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo jugador"""
    return create_player_for_team(player, current_user.id)

@router.get("/{player_id}", response_model=Player)
async def get_player(
    player_id: int,
    current_user: User = Depends(get_current_user)
):
    """Obtener jugador específico"""
    player = get_player_by_id(player_id, current_user.id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.put("/{player_id}", response_model=Player)
async def update_player(
    player_id: int,
    player: PlayerUpdate,
    current_user: User = Depends(get_current_user)
):
    """Actualizar jugador"""
    updated_player = update_player_by_id(player_id, player, current_user.id)
    if not updated_player:
        raise HTTPException(status_code=404, detail="Player not found")
    return updated_player

@router.delete("/{player_id}")
async def delete_player(
    player_id: int,
    current_user: User = Depends(get_current_user)
):
    """Eliminar jugador"""
    success = delete_player_by_id(player_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Player not found")
    return {"message": "Player deleted successfully"}
```

## 🎯 API del Generador de Equipos

### Endpoints del Generador
```python
# app/api/v1/team_generator.py
@router.post("/generate-teams")
async def generate_teams(
    request: GenerateTeamsRequest,
    current_user: User = Depends(get_current_user)
):
    """Generar equipos balanceados"""
    try:
        # Validar jugadores disponibles
        available_players = get_players_by_ids(
            request.player_ids, 
            current_user.id
        )
        
        if len(available_players) < request.required_players:
            raise HTTPException(
                status_code=400,
                detail=f"Se necesitan al menos {request.required_players} jugadores"
            )
        
        # Generar equipos balanceados
        teams = generate_balanced_teams(
            available_players,
            request.formation,
            request.game_mode
        )
        
        return {
            "teams": teams,
            "formation": request.formation,
            "game_mode": request.game_mode,
            "total_players": len(available_players)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-formation")
async def save_formation(
    request: SaveFormationRequest,
    current_user: User = Depends(get_current_user)
):
    """Guardar formación generada"""
    formation = save_team_formation(request, current_user.id)
    return formation

@router.get("/formations")
async def get_formations(
    team_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Obtener formaciones guardadas"""
    formations = get_saved_formations(team_id, current_user.id, skip=skip, limit=limit)
    return formations
```

### Algoritmo de Balanceo
```python
# app/services/team_generator.py
def generate_balanced_teams(players: List[Player], formation: str, game_mode: str):
    """Generar equipos balanceados basado en habilidades"""
    
    # 1. Ordenar jugadores por habilidad
    sorted_players = sorted(players, key=lambda p: p.skill, reverse=True)
    
    # 2. Calcular jugadores por equipo
    players_per_team = get_players_per_team(game_mode)
    
    # 3. Distribuir jugadores equitativamente
    team_a = []
    team_b = []
    
    for i, player in enumerate(sorted_players):
        if i % 2 == 0:
            team_a.append(player)
        else:
            team_b.append(player)
    
    # 4. Asignar posiciones según formación
    team_a_with_positions = assign_positions(team_a, formation)
    team_b_with_positions = assign_positions(team_b, formation)
    
    return {
        "team_a": {
            "name": "Equipo A",
            "players": team_a_with_positions,
            "average_skill": calculate_average_skill(team_a)
        },
        "team_b": {
            "name": "Equipo B", 
            "players": team_b_with_positions,
            "average_skill": calculate_average_skill(team_b)
        }
    }

def assign_positions(players: List[Player], formation: str):
    """Asignar posiciones a jugadores según formación"""
    positions = get_formation_positions(formation)
    
    # Ordenar jugadores por posición preferida
    players_by_position = group_players_by_position(players)
    
    assigned_players = []
    for position in positions:
        if players_by_position.get(position):
            player = players_by_position[position].pop(0)
            assigned_players.append({
                **player.dict(),
                "assigned_position": position
            })
    
    return assigned_players
```

## 💰 API de Pagos

### Modelos de Datos
```python
# app/models.py
class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    description = Column(String)
    payment_date = Column(DateTime)
    due_date = Column(DateTime)
    status = Column(String)  # pending, paid, overdue
    payment_method = Column(String, nullable=True)
    reference = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    player_id = Column(Integer, ForeignKey("players.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    player = relationship("Player", back_populates="payments")
    team = relationship("Team", back_populates="payments")
```

### Endpoints de Pagos
```python
# app/api/v1/payments.py
@router.get("/", response_model=List[Payment])
async def get_payments(
    team_id: Optional[int] = None,
    player_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    """Obtener lista de pagos"""
    payments = get_payments_by_filters(
        team_id, player_id, status, current_user.id, skip=skip, limit=limit
    )
    return payments

@router.post("/", response_model=Payment)
async def create_payment(
    payment: PaymentCreate,
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo pago"""
    return create_payment_for_user(payment, current_user.id)

@router.put("/{payment_id}/status")
async def update_payment_status(
    payment_id: int,
    status: str,
    current_user: User = Depends(get_current_user)
):
    """Actualizar estado de pago"""
    updated_payment = update_payment_status_by_id(payment_id, status, current_user.id)
    if not updated_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return updated_payment

@router.get("/reports/summary")
async def get_payment_summary(
    team_id: Optional[int] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    """Obtener resumen de pagos"""
    summary = get_payment_summary_by_filters(
        team_id, month, year, current_user.id
    )
    return summary
```

## 🔧 Servicios del Frontend

### Configuración de API
```typescript
// src/lib/api.ts
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login si token expiró
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### Servicios de Autenticación
```typescript
// src/services/authService.ts
import api from '@/lib/api'

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  full_name: string
}

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data)
    const { access_token } = response.data
    localStorage.setItem('access_token', access_token)
    return response.data
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async logout() {
    localStorage.removeItem('access_token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  }
}
```

### Servicios de Equipos
```typescript
// src/services/teamService.ts
import api from '@/lib/api'

export interface Team {
  id: number
  name: string
  description?: string
  logo_url?: string
  colors?: Record<string, string>
  created_at: string
  updated_at: string
}

export interface CreateTeamData {
  name: string
  description?: string
  logo_url?: string
  colors?: Record<string, string>
}

export const teamService = {
  async getTeams(params?: { skip?: number; limit?: number }) {
    const response = await api.get('/teams', { params })
    return response.data
  },

  async getTeam(id: number) {
    const response = await api.get(`/teams/${id}`)
    return response.data
  },

  async createTeam(data: CreateTeamData) {
    const response = await api.post('/teams', data)
    return response.data
  },

  async updateTeam(id: number, data: Partial<CreateTeamData>) {
    const response = await api.put(`/teams/${id}`, data)
    return response.data
  },

  async deleteTeam(id: number) {
    await api.delete(`/teams/${id}`)
  }
}
```

### Servicios del Generador
```typescript
// src/services/teamGeneratorService.ts
import api from '@/lib/api'

export interface GenerateTeamsRequest {
  player_ids: number[]
  formation: string
  game_mode: string
  required_players: number
}

export interface GeneratedTeam {
  name: string
  players: Player[]
  average_skill: number
}

export interface GenerateTeamsResponse {
  teams: {
    team_a: GeneratedTeam
    team_b: GeneratedTeam
  }
  formation: string
  game_mode: string
  total_players: number
}

export const teamGeneratorService = {
  async generateTeams(data: GenerateTeamsRequest): Promise<GenerateTeamsResponse> {
    const response = await api.post('/team-generator/generate-teams', data)
    return response.data
  },

  async saveFormation(data: any) {
    const response = await api.post('/team-generator/save-formation', data)
    return response.data
  },

  async getFormations(params?: { team_id?: number; skip?: number; limit?: number }) {
    const response = await api.get('/team-generator/formations', { params })
    return response.data
  }
}
```

## 📊 Monitoreo y Logging

### Configuración de Logging
```python
# app/config.py
import logging
from logging.handlers import RotatingFileHandler

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('app.log', maxBytes=10000000, backupCount=5),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

### Middleware de Logging
```python
# app/middleware.py
from fastapi import Request
import time
import logging

logger = logging.getLogger(__name__)

async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url}")
    
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} - {process_time:.2f}s")
    
    return response
```

## 🧪 Testing de la API

### Tests Unitarios
```python
# tests/test_teams.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_team():
    team_data = {
        "name": "Test Team",
        "description": "Test Description"
    }
    response = client.post("/api/v1/teams/", json=team_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Test Team"

def test_get_teams():
    response = client.get("/api/v1/teams/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### Tests de Integración
```python
# tests/test_team_generator.py
def test_generate_teams():
    request_data = {
        "player_ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "formation": "1-2-2-2",
        "game_mode": "futbolito",
        "required_players": 7
    }
    response = client.post("/api/v1/team-generator/generate-teams", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert "teams" in data
    assert "team_a" in data["teams"]
    assert "team_b" in data["teams"]
```

## 🚀 Deployment

### Configuración de Producción
```python
# app/config.py
class Settings(BaseSettings):
    # Base de datos
    DATABASE_URL: str = "postgresql://user:pass@localhost/formacion_pro"
    
    # JWT
    SECRET_KEY: str = "tu-clave-secreta-aqui"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

**API y Servicios** - El motor de Formación Pro Soccer ⚽ 