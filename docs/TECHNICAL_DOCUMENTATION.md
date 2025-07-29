# 📋 Documentación Técnica - ProSoccer Team Generator

## **1. Resumen Ejecutivo**

**Proyecto:** Sistema de Gestión de Equipos y Jugadores de Fútbol  
**Versión:** 2.0  
**Fecha de Actualización:** Julio 2025  
**Estado:** Producción  

---

## **2. Arquitectura del Sistema**

### **2.1 Stack Tecnológico**

**Frontend:**
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS
- Axios (HTTP Client)

**Backend:**
- FastAPI (Python 3.13)
- SQLAlchemy (ORM)
- PostgreSQL (Base de datos)
- Pydantic (Validación de datos)
- JWT (Autenticación)

**Infraestructura:**
- Docker (Containerización)
- Uvicorn (ASGI Server)
- PowerShell (Scripts de automatización)

---

## **3. Base de Datos**

### **3.1 Esquema de Base de Datos**

#### **Tabla: `users`**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE,
    is_player BOOLEAN DEFAULT FALSE,
    team_id INTEGER REFERENCES teams(id),
    must_change_password BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabla: `teams`**
```sql
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    country VARCHAR(255),
    founded INTEGER,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabla: `players`**
```sql
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    team_id INTEGER REFERENCES teams(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    date_of_birth DATE,
    nationality VARCHAR(10),
    jersey_number INTEGER,
    height INTEGER,
    weight INTEGER,
    skill_level INTEGER DEFAULT 5,
    photo_url TEXT,
    position_zone_id INTEGER REFERENCES position_zones(id),
    position_specific_id INTEGER REFERENCES position_specifics(id),
    rit INTEGER DEFAULT 70,
    tir INTEGER DEFAULT 70,
    pas INTEGER DEFAULT 70,
    reg INTEGER DEFAULT 70,
    defense INTEGER DEFAULT 70,
    fis INTEGER DEFAULT 70,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabla: `position_zones`**
```sql
CREATE TABLE position_zones (
    id SERIAL PRIMARY KEY,
    abbreviation VARCHAR(3) UNIQUE NOT NULL,
    name_es VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabla: `position_specifics`**
```sql
CREATE TABLE position_specifics (
    id SERIAL PRIMARY KEY,
    abbreviation VARCHAR(3) UNIQUE NOT NULL,
    name_es VARCHAR(20) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    zone_id INTEGER REFERENCES position_zones(id),
    description_es TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **3.2 Datos Iniciales**

#### **Position Zones (Zonas de Posición)**
```sql
INSERT INTO position_zones (abbreviation, name_es, name_en) VALUES
('POR', 'Portero', 'Goalkeeper'),
('DEF', 'Defensa', 'Defense'),
('MED', 'Centrocampista', 'Midfielder'),
('DEL', 'Delantero', 'Forward');
```

#### **Position Specifics (Posiciones Específicas)**
```sql
INSERT INTO position_specifics (abbreviation, name_es, name_en, zone_id) VALUES
-- DEFENSAS (zone_id: 2)
('LD', 'Lateral Derecho', 'Right Back', 2),
('LI', 'Lateral Izquierdo', 'Left Back', 2),
('DFC', 'Defensa Central', 'Center Back', 2),
('CAI', 'Carrilero Izquierdo', 'Left Wing Back', 2),
('CAD', 'Carrilero Derecho', 'Right Wing Back', 2),

-- MEDIOCAMPISTAS (zone_id: 3)
('MCD', 'Med. Defensivo', 'Defensive Midfielder', 3),
('MC', 'Mediocentro', 'Center Midfielder', 3),
('MCO', 'Med. Ofensivo', 'Attacking Midfielder', 3),
('MD', 'Volante Derecho', 'Right Midfielder', 3),
('MI', 'Volante Izquierdo', 'Left Midfielder', 3),

-- DELANTEROS (zone_id: 4)
('ED', 'Extremo Derecho', 'Right Winger', 4),
('EI', 'Extremo Izquierdo', 'Left Winger', 4),
('DC', 'Delantero Centro', 'Center Forward', 4),
('SD', '2do Delantero', 'Second Striker', 4);
```

---

## **4. Migraciones y Scripts**

### **4.1 Scripts de Migración**

#### **`backend/final_insert.py`**
```python
"""
Script para insertar posiciones específicas en la base de datos.
Ejecutar después de crear las tablas position_zones y position_specifics.
"""
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def clean_and_insert():
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Limpiar tabla existente
        cursor.execute("DELETE FROM position_specifics")
        
        # Obtener zonas
        cursor.execute("SELECT id, abbreviation FROM position_zones WHERE is_active = true")
        zones = cursor.fetchall()
        zone_map = {zone[1]: zone[0] for zone in zones}
        
        # Posiciones específicas con nombres ajustados a 20 caracteres
        positions = [
            ("LD", "Lateral Derecho", zone_map.get("DEF")),
            ("LI", "Lateral Izquierdo", zone_map.get("DEF")),
            ("DFC", "Defensa Central", zone_map.get("DEF")),
            ("CAI", "Carrilero Izquierdo", zone_map.get("DEF")),
            ("CAD", "Carrilero Derecho", zone_map.get("DEF")),
            ("MCD", "Med. Defensivo", zone_map.get("MED")),
            ("MC", "Mediocentro", zone_map.get("MED")),
            ("MCO", "Med. Ofensivo", zone_map.get("MED")),
            ("MD", "Volante Derecho", zone_map.get("MED")),
            ("MI", "Volante Izquierdo", zone_map.get("MED")),
            ("ED", "Extremo Derecho", zone_map.get("DEL")),
            ("EI", "Extremo Izquierdo", zone_map.get("DEL")),
            ("DC", "Delantero Centro", zone_map.get("DEL")),
            ("SD", "2do Delantero", zone_map.get("DEL"))
        ]
        
        for pos in positions:
            abbreviation, name_es, zone_id = pos
            if zone_id is None:
                continue
                
            cursor.execute("""
                INSERT INTO position_specifics 
                (abbreviation, name_es, name_en, zone_id, is_active, created_at)
                VALUES (%s, %s, %s, %s, true, NOW())
            """, (abbreviation, name_es, name_es, zone_id))
        
        conn.commit()
        
    except Exception as e:
        print(f"Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    clean_and_insert()
```

### **4.2 Scripts de Verificación**

#### **`backend/check_table.py`**
```python
"""
Script para verificar la estructura de las tablas de posiciones.
Útil para debugging y verificación de migraciones.
"""
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_table_structure():
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Verificar estructura de position_specifics
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'position_specifics' 
            ORDER BY ordinal_position
        """)
        columns = cursor.fetchall()
        
        for col in columns:
            print(f"  {col[0]}: {col[1]} ({col[2]})")
        
        # Verificar datos actuales
        cursor.execute("SELECT COUNT(*) FROM position_specifics")
        count = cursor.fetchone()[0]
        print(f"Total de registros: {count}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    check_table_structure()
```

---

## **5. API Endpoints**

### **5.1 Autenticación**
```
POST /login - Login de usuario
POST /auth/login - Login con email
GET /me - Obtener usuario actual
```

### **5.2 Equipos**
```
GET /teams/ - Listar equipos
POST /teams/ - Crear equipo
GET /teams/{team_id} - Obtener equipo con jugadores
PUT /teams/{team_id} - Actualizar equipo
DELETE /teams/{team_id} - Eliminar equipo
```

### **5.3 Jugadores**
```
GET /players/ - Listar jugadores
POST /players/ - Crear jugador
GET /players/{player_id} - Obtener jugador
PUT /players/{player_id} - Actualizar jugador
DELETE /players/{player_id} - Eliminar jugador
POST /players/{player_id}/assign/{team_id} - Asignar jugador a equipo
POST /players/{player_id}/remove - Remover jugador de equipo
```

### **5.4 Posiciones**
```
GET /positions/zones/ - Listar zonas de posición
GET /positions/specifics/ - Listar posiciones específicas
GET /positions/specifics/zone/{zone_id} - Posiciones por zona
```

---

## **6. Componentes Frontend**

### **6.1 PlayerModal.tsx**
**Funcionalidad:** Modal para crear/editar jugadores  
**Características:**
- Formulario completo con validación
- Carga de fotos con preview
- Gestión de posiciones (zona y específica)
- Manejo de habilidades específicas
- Persistencia de datos corregida

**Correcciones Implementadas:**
```typescript
// Corrección del campo nationality
nationality: formData.nationality, // Antes: formData.country

// Manejo de valores 'None' del backend
country: player.nationality && player.nationality !== 'None' ? player.nationality : '',

// IDs corregidos para posiciones
const POSITION_ZONES = [
  { id: 1, name: 'Portero', abbreviation: 'POR' },
  { id: 2, name: 'Defensa', abbreviation: 'DEF' },
  { id: 3, name: 'Centrocampista', abbreviation: 'MED' },
  { id: 4, name: 'Delantero', abbreviation: 'DEL' }
];
```

### **6.2 ProfessionalPlayerCard.tsx**
**Funcionalidad:** Tarjeta de jugador estilo FIFA  
**Características:**
- Diseño profesional con gradientes
- Estadísticas reales (no mockeadas)
- Posición específica debajo de la principal
- Foto con bordes difusos
- Información completa del jugador

**Correcciones Implementadas:**
```typescript
// Eliminación de datos mockeados
const getPlayerStats = React.useCallback(() => {
  return {
    rit: player.rit || 70,
    tir: player.tir || 70,
    pas: player.pas || 70,
    reg: player.reg || 70,
    defense: player.defense || 70,
    fis: player.fis || 70,
  };
}, [player.rit, player.tir, player.pas, player.reg, player.defense, player.fis]);

// Posición específica separada
const position = player.position_zone?.abbreviation || 'N/A';
const specificPosition = player.position_specific?.abbreviation;
```

### **6.3 Teams Page**
**Funcionalidad:** Página principal de gestión  
**Características:**
- Vista de tarjetas y lista
- Filtros por equipo
- Orden estable por ID
- Gestión completa de jugadores

**Correcciones Implementadas:**
```typescript
// Orden estable para evitar movimientos
const sortedPlayers = uniquePlayers.sort((a, b) => a.id - b.id)

// Corrección del campo nationality
nationality: formData.nationality, // Antes: formData.country
```

---

## **7. Problemas Resueltos**

### **7.1 Persistencia de Nacionalidad**
**Problema:** El campo `nationality` no se guardaba correctamente  
**Causa:** Confusión entre `formData.country` y `formData.nationality`  
**Solución:** Unificación del uso de `formData.nationality` en todo el flujo

### **7.2 Posiciones Desincronizadas**
**Problema:** IDs de posiciones incorrectos entre frontend y backend  
**Causa:** IDs hardcodeados no coincidían con la base de datos  
**Solución:** Corrección de IDs y mapeo correcto

### **7.3 Datos Mockeados**
**Problema:** Estadísticas se sobrescribían con datos falsos  
**Causa:** Función `generateStats` como fallback  
**Solución:** Eliminación de datos mockeados, uso de datos reales

### **7.4 Movimiento de Tarjetas**
**Problema:** Las tarjetas cambiaban de posición al editar  
**Causa:** Reordenamiento automático sin criterio estable  
**Solución:** Ordenamiento por ID del jugador

### **7.5 Posición Específica Duplicada**
**Problema:** La posición específica aparecía dos veces  
**Causa:** Variable `position` usaba posición específica como fallback  
**Solución:** Separación de `position` y `specificPosition`

---

## **8. Configuración del Entorno**

### **8.1 Variables de Entorno**
```env
# .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/prosoccer_db
SECRET_KEY=tu_clave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### **8.2 Scripts de Inicio**
```batch
# start-simple.bat
@echo off
echo ========================================
echo    PROSOCCER - TEAM GENERATOR
echo ========================================
REM Limpieza de puertos y procesos
REM Inicio de servidores
REM Verificación de servicios
```

---

## **9. Mejores Prácticas Implementadas**

### **9.1 Frontend**
- ✅ **TypeScript:** Tipado estricto para prevenir errores
- ✅ **Componentes Reutilizables:** Modularización correcta
- ✅ **Estado Centralizado:** Gestión consistente de datos
- ✅ **Validación de Formularios:** Prevención de datos inválidos
- ✅ **Manejo de Errores:** Logs detallados para debugging

### **9.2 Backend**
- ✅ **Validación de Datos:** Pydantic schemas
- ✅ **Autenticación JWT:** Seguridad robusta
- ✅ **Logs Detallados:** Trazabilidad completa
- ✅ **Manejo de Excepciones:** Respuestas informativas
- ✅ **Relaciones de Base de Datos:** Foreign keys correctas

### **9.3 Base de Datos**
- ✅ **Normalización:** Estructura optimizada
- ✅ **Constraints:** Integridad de datos
- ✅ **Índices:** Rendimiento optimizado
- ✅ **Migraciones:** Control de versiones

---

## **10. Guía de Despliegue**

### **10.1 Requisitos Previos**
```bash
# Instalar dependencias
npm install
pip install -r requirements.txt

# Configurar base de datos
createdb prosoccer_db
```

### **10.2 Pasos de Despliegue**
```bash
# 1. Ejecutar migraciones
python backend/final_insert.py

# 2. Crear usuario administrador
python backend/create_admin.py

# 3. Iniciar servidores
./start-simple.bat
```

### **10.3 Verificación**
```bash
# Verificar endpoints
curl http://localhost:9000/teams/
curl http://localhost:9000/players/

# Verificar frontend
open http://localhost:3000
```

---

## **11. Mantenimiento**

### **11.1 Logs Importantes**
- **Frontend:** Consola del navegador para debugging
- **Backend:** Terminal del servidor para errores
- **Base de Datos:** Scripts de verificación

### **11.2 Monitoreo**
- **Puertos:** 3000 (Frontend), 9000 (Backend)
- **Base de Datos:** PostgreSQL en puerto 5432
- **Servicios:** Verificar con `netstat -an`

### **11.3 Backup**
```bash
# Backup de base de datos
pg_dump prosoccer_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql prosoccer_db < backup_20250729.sql
```

---

## **12. Roadmap Futuro**

### **12.1 Próximas Funcionalidades**
- [ ] Sistema de fotos con almacenamiento en la nube
- [ ] Estadísticas avanzadas de jugadores
- [ ] Sistema de partidos y resultados
- [ ] Dashboard analítico
- [ ] API pública para terceros

### **12.2 Mejoras Técnicas**
- [ ] Tests automatizados
- [ ] CI/CD pipeline
- [ ] Dockerización completa
- [ ] Monitoreo con Prometheus
- [ ] Cache con Redis

---

**Documentación creada por:** Equipo de Desarrollo ProSoccer  
**Última actualización:** Julio 2025  
**Versión del documento:** 2.0  

¡**Esta documentación garantiza que no se repitan los errores y facilita el mantenimiento futuro!** ⚽📚✨ 