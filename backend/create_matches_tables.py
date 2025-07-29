"""
Script para crear las tablas del sistema de partidos
Ejecutar después de crear las tablas principales
"""
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def create_matches_tables():
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("🔧 Creando tablas del sistema de partidos...")
        
        # Crear tabla venues (canchas)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS venues (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                capacity INTEGER,
                surface VARCHAR(50) DEFAULT 'grass',
                facilities TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        print("✅ Tabla 'venues' creada")
        
        # Crear tabla matches (partidos)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS matches (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                date TIMESTAMP NOT NULL,
                venue_id INTEGER REFERENCES venues(id),
                match_type VARCHAR(50) NOT NULL,
                home_team_id INTEGER REFERENCES teams(id),
                away_team_id INTEGER REFERENCES teams(id),
                generated_team_a_id INTEGER REFERENCES teams(id),
                generated_team_b_id INTEGER REFERENCES teams(id),
                status VARCHAR(50) DEFAULT 'scheduled',
                home_score INTEGER,
                away_score INTEGER,
                created_by INTEGER REFERENCES users(id) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        print("✅ Tabla 'matches' creada")
        
        # Crear tabla player_attendance (asistencia)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS player_attendance (
                id SERIAL PRIMARY KEY,
                match_id INTEGER REFERENCES matches(id) NOT NULL,
                player_id INTEGER REFERENCES players(id) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                confirmed_at TIMESTAMP,
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        print("✅ Tabla 'player_attendance' creada")
        
        # Crear tabla match_events (eventos del partido)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS match_events (
                id SERIAL PRIMARY KEY,
                match_id INTEGER REFERENCES matches(id) NOT NULL,
                player_id INTEGER REFERENCES players(id) NOT NULL,
                event_type VARCHAR(50) NOT NULL,
                minute INTEGER NOT NULL,
                team_side VARCHAR(10) NOT NULL,
                description TEXT,
                timestamp TIMESTAMP DEFAULT NOW()
            );
        """)
        print("✅ Tabla 'match_events' creada")
        
        # Crear tabla championships (campeonatos)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS championships (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                season VARCHAR(50) NOT NULL,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                status VARCHAR(50) DEFAULT 'upcoming',
                points_for_win INTEGER DEFAULT 3,
                points_for_draw INTEGER DEFAULT 1,
                points_for_loss INTEGER DEFAULT 0,
                max_players_per_team INTEGER DEFAULT 11,
                min_players_per_team INTEGER DEFAULT 7,
                substitution_limit INTEGER DEFAULT 3,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        print("✅ Tabla 'championships' creada")
        
        # Crear tabla championship_teams (equipos en campeonatos)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS championship_teams (
                id SERIAL PRIMARY KEY,
                championship_id INTEGER REFERENCES championships(id) NOT NULL,
                team_id INTEGER REFERENCES teams(id) NOT NULL,
                played INTEGER DEFAULT 0,
                won INTEGER DEFAULT 0,
                drawn INTEGER DEFAULT 0,
                lost INTEGER DEFAULT 0,
                goals_for INTEGER DEFAULT 0,
                goals_against INTEGER DEFAULT 0,
                points INTEGER DEFAULT 0,
                position INTEGER,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        print("✅ Tabla 'championship_teams' creada")
        
        # Crear tabla external_teams (equipos externos)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS external_teams (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                logo_url TEXT,
                description TEXT,
                level VARCHAR(50) DEFAULT 'intermediate',
                contact_name VARCHAR(255) NOT NULL,
                contact_email VARCHAR(255) NOT NULL,
                contact_phone VARCHAR(50),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        print("✅ Tabla 'external_teams' creada")
        
        # Crear tabla notifications (notificaciones)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                recipient_id INTEGER REFERENCES users(id) NOT NULL,
                match_id INTEGER REFERENCES matches(id),
                read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP
            );
        """)
        print("✅ Tabla 'notifications' creada")
        
        # Insertar datos de ejemplo
        print("\n📝 Insertando datos de ejemplo...")
        
        # Insertar canchas de ejemplo
        cursor.execute("""
            INSERT INTO venues (name, address, capacity, surface) VALUES
            ('Cancha Municipal', 'Av. Principal 123', 200, 'grass'),
            ('Estadio Deportivo', 'Calle Deportiva 456', 500, 'artificial'),
            ('Complejo Deportivo', 'Zona Deportiva 789', 300, 'grass')
            ON CONFLICT DO NOTHING;
        """)
        print("✅ Canchas de ejemplo insertadas")
        
        # Insertar equipos externos de ejemplo
        cursor.execute("""
            INSERT INTO external_teams (name, level, contact_name, contact_email, contact_phone, description) VALUES
            ('Los Tigres', 'intermediate', 'Juan Pérez', 'juan@tigres.com', '+56912345678', 'Equipo amistoso de barrio'),
            ('Los Leones', 'advanced', 'Carlos López', 'carlos@leones.com', '+56987654321', 'Equipo competitivo'),
            ('Los Águilas', 'beginner', 'Miguel García', 'miguel@aguilas.com', '+56911223344', 'Equipo en formación')
            ON CONFLICT DO NOTHING;
        """)
        print("✅ Equipos externos de ejemplo insertados")
        
        # Insertar campeonato de ejemplo
        cursor.execute("""
            INSERT INTO championships (name, season, start_date, end_date, status) VALUES
            ('Liga Local 2025', '2025', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'upcoming')
            ON CONFLICT DO NOTHING;
        """)
        print("✅ Campeonato de ejemplo insertado")
        
        conn.commit()
        print("\n🎉 ¡Sistema de partidos creado exitosamente!")
        print("\n📊 Resumen de tablas creadas:")
        print("   - venues (canchas)")
        print("   - matches (partidos)")
        print("   - player_attendance (asistencia)")
        print("   - match_events (eventos)")
        print("   - championships (campeonatos)")
        print("   - championship_teams (equipos en campeonatos)")
        print("   - external_teams (equipos externos)")
        print("   - notifications (notificaciones)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    create_matches_tables() 