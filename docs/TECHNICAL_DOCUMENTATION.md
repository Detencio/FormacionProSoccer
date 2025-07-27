# 📚 Documentación Técnica Completa - Formación Pro Soccer

## 🎯 Visión General del Sistema

**Formación Pro Soccer** es una aplicación web moderna diseñada para la gestión integral de equipos de fútbol, incluyendo generación automática de formaciones, gestión de jugadores, pagos, gastos y partidos. El sistema está construido siguiendo las mejores prácticas de ingeniería de software y arquitectura de aplicaciones web.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### Frontend
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript 5.x
- **Estilos**: Tailwind CSS 3.x
- **Gestión de Estado**: Zustand
- **Formularios**: React Hook Form + Zod
- **UI Components**: Componentes personalizados con diseño EA SPORTS FC
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

#### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Base de Datos**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.x
- **Autenticación**: JWT con OAuth2
- **Validación**: Pydantic 2.x
- **Documentación**: OpenAPI/Swagger
- **Testing**: Pytest

#### Infraestructura
- **Contenedores**: Docker + Docker Compose
- **Deployment**: Vercel (Frontend) + Railway (Backend)
- **Base de Datos**: PostgreSQL en Railway
- **Cache**: Redis (opcional)
- **CDN**: Vercel Edge Network

## 📁 Estructura del Proyecto

```
FormacionProSoccer/
├── 📁 src/                      # Frontend Next.js
│   ├── 📁 app/                  # App Router
│   │   ├── 📁 dashboard/        # Dashboard principal
│   │   ├── 📁 teams/           # Gestión de equipos
│   │   ├── 📁 matches/         # Gestión de partidos
│   │   ├── 📁 payments/        # Sistema de pagos
│   │   ├── 📁 expenses/        # Gestión de gastos
│   │   ├── 📁 team-generator/  # Generador de equipos
│   │   └── 📁 register-player/ # Registro de jugadores
│   ├── 📁 components/          # Componentes reutilizables
│   ├── 📁 hooks/              # Custom hooks
│   ├── 📁 services/           # Servicios de API
│   ├── 📁 store/              # Estado global (Zustand)
│   ├── 📁 types/              # Tipos TypeScript
│   └── 📁 lib/                # Utilidades y configuraciones
├── 📁 backend/                 # Backend FastAPI
│   ├── 📁 app/                # Aplicación principal
│   │   ├── main.py            # Punto de entrada
│   │   ├── config.py          # Configuración
│   │   ├── database.py        # Configuración DB
│   │   ├── auth.py            # Autenticación
│   │   ├── models.py          # Modelos SQLAlchemy
│   │   ├── schemas.py         # Esquemas Pydantic
│   │   └── crud.py            # Operaciones CRUD
│   ├── requirements.txt       # Dependencias Python
│   └── create_admin.py        # Script de inicialización
├── 📁 docs/                   # Documentación
├── 📁 public/                 # Archivos estáticos
├── package.json               # Dependencias Node.js
├── docker-compose.yml         # Configuración Docker
└── README.md                  # Documentación principal
```

## 🔐 Sistema de Autenticación y Autorización

### Arquitectura de Seguridad

El sistema implementa un sistema de autenticación robusto basado en JWT (JSON Web Tokens) con las siguientes características:

- **Autenticación**: JWT con expiración configurable
- **Autorización**: Roles y permisos granulares
- **Seguridad**: Hashing de contraseñas con bcrypt
- **Protección**: Rate limiting y CORS configurado

### Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant DB as Base de Datos

    U->>F: Ingresa credenciales
    F->>B: POST /auth/login
    B->>DB: Verifica usuario
    DB-->>B: Datos del usuario
    B-->>F: JWT Token
    F->>F: Almacena token
    F->>B: Requests con Authorization header
    B->>B: Valida JWT
    B-->>F: Respuesta autenticada
```

## 🗄️ Modelo de Datos

### Entidades Principales

#### Usuario (User)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Jugador (Player)
```sql
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    position VARCHAR(50),
    skill_level INTEGER CHECK (skill_level >= 1 AND skill_level <= 10),
    is_active BOOLEAN DEFAULT TRUE,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Equipo (Team)
```sql
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Pago (Payment)
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Patrones de Diseño Implementados

### Frontend
- **Component Pattern**: Componentes reutilizables y modulares
- **Custom Hooks**: Lógica de negocio reutilizable
- **Context Pattern**: Estado global con Zustand
- **Service Layer**: Separación de lógica de API
- **Container/Presentational**: Separación de lógica y presentación

### Backend
- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer**: Lógica de negocio centralizada
- **Dependency Injection**: Inyección de dependencias
- **Factory Pattern**: Creación de objetos complejos
- **Observer Pattern**: Notificaciones y eventos

## 🧪 Estrategia de Testing

### Frontend Testing
```typescript
// Ejemplo de test de componente
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerCard } from '../components/PlayerCard';

describe('PlayerCard', () => {
  it('should display player information correctly', () => {
    const player = {
      id: 1,
      name: 'Juan Pérez',
      position: 'Delantero',
      skill_level: 8
    };

    render(<PlayerCard player={player} />);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Delantero')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });
});
```

### Backend Testing
```python
# Ejemplo de test de API
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_player():
    response = client.post(
        "/api/v1/players/",
        json={
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "position": "Delantero",
            "skill_level": 8
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Juan Pérez"
```

## 📊 Métricas de Calidad

### Cobertura de Código
- **Meta**: >80% de cobertura total
- **Frontend**: Tests unitarios y de integración
- **Backend**: Tests unitarios, de integración y E2E
- **API**: Tests de endpoints y validaciones

### Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3.5s

### Seguridad
- **OWASP Top 10**: Todas las vulnerabilidades mitigadas
- **CORS**: Configurado correctamente
- **Rate Limiting**: Implementado en endpoints críticos
- **Input Validation**: Validación en frontend y backend
- **SQL Injection**: Prevenido con ORM

## 🚀 Estrategia de Deployment

### Entornos
1. **Desarrollo**: Docker Compose local
2. **Staging**: Vercel + Railway (preview deployments)
3. **Producción**: Vercel + Railway + PostgreSQL

### Pipeline CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm run test
          npm run test:e2e
          
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📚 Documentación por Módulos

### 1. [Equipos](./TEAMS.md)
- Gestión completa de equipos
- Asignación de jugadores
- Estadísticas y reportes

### 2. [Partidos](./MATCHES.md)
- Programación de partidos
- Resultados y estadísticas
- Historial de encuentros

### 3. [Pagos](./PAYMENTS.md)
- Sistema de cuotas mensuales
- Historial de pagos
- Reportes financieros

### 4. [Gastos](./EXPENSES.md)
- Control de gastos del club
- Categorización de gastos
- Reportes de presupuesto

### 5. [Generador de Equipos](./TEAM_GENERATOR.md)
- Algoritmo de balanceo automático
- Visualización de cancha
- Múltiples formaciones

### 6. [Registro de Jugadores](./REGISTER_PLAYER.md)
- Gestión de perfiles
- Evaluación de habilidades
- Historial de rendimiento

## 🔧 Configuración y Herramientas

### Scripts de Desarrollo
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "docker:build": "docker build -t formacion-prosoccer .",
    "docker:run": "docker run -p 3000:3000 formacion-prosoccer"
  }
}
```

### Variables de Entorno
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Formación Pro Soccer

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/formacion_prosoccer
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🎯 Mejores Prácticas Implementadas

### Código Limpio
- **Naming Conventions**: Nombres descriptivos y consistentes
- **Single Responsibility**: Cada función/clase tiene una responsabilidad
- **DRY Principle**: Evitar duplicación de código
- **SOLID Principles**: Principios de diseño orientado a objetos

### Performance
- **Code Splitting**: Carga lazy de componentes
- **Image Optimization**: Optimización automática de imágenes
- **Caching**: Cache de API y assets estáticos
- **Bundle Analysis**: Análisis de tamaño de bundle

### Accesibilidad
- **WCAG 2.1 AA**: Cumplimiento de estándares
- **Semantic HTML**: HTML semántico correcto
- **Keyboard Navigation**: Navegación por teclado
- **Screen Readers**: Compatibilidad con lectores de pantalla

## 🔮 Roadmap Técnico

### Corto Plazo (1-3 meses)
- [ ] Optimización de performance
- [ ] Implementación de PWA
- [ ] Tests de integración completos
- [ ] Monitoreo y analytics

### Mediano Plazo (3-6 meses)
- [ ] WebSocket para tiempo real
- [ ] API GraphQL
- [ ] Internacionalización (i18n)
- [ ] Modo offline

### Largo Plazo (6+ meses)
- [ ] IA para balanceo avanzado
- [ ] Machine Learning para predicciones
- [ ] Microservicios
- [ ] Escalabilidad horizontal

---

**Formación Pro Soccer** - Documentación Técnica v1.0

*Última actualización: Diciembre 2024*
*Versión del sistema: 1.0.0* 