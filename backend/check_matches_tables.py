"""
Script para verificar las tablas del sistema de partidos
"""
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_matches_tables():
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("🔍 Verificando tablas del sistema de partidos...")
        
        # Lista de tablas a verificar
        tables = [
            'venues',
            'matches', 
            'player_attendance',
            'match_events',
            'championships',
            'championship_teams',
            'external_teams',
            'notifications'
        ]
        
        for table in tables:
            cursor.execute(f"""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = '{table}'
                ORDER BY ordinal_position;
            """)
            
            columns = cursor.fetchall()
            print(f"\n📋 Tabla '{table}':")
            print(f"   Columnas encontradas: {len(columns)}")
            
            for col in columns:
                nullable = "NULL" if col[2] == "YES" else "NOT NULL"
                print(f"   - {col[0]}: {col[1]} ({nullable})")
        
        # Verificar datos de ejemplo
        print("\n📊 Verificando datos de ejemplo...")
        
        # Verificar venues
        cursor.execute("SELECT COUNT(*) FROM venues;")
        venues_count = cursor.fetchone()[0]
        print(f"   - Venues (canchas): {venues_count} registros")
        
        # Verificar external_teams
        cursor.execute("SELECT COUNT(*) FROM external_teams;")
        teams_count = cursor.fetchone()[0]
        print(f"   - External teams: {teams_count} registros")
        
        # Verificar championships
        cursor.execute("SELECT COUNT(*) FROM championships;")
        championships_count = cursor.fetchone()[0]
        print(f"   - Championships: {championships_count} registros")
        
        # Mostrar algunos datos de ejemplo
        print("\n📝 Datos de ejemplo:")
        
        # Venues
        cursor.execute("SELECT name, address, capacity FROM venues LIMIT 3;")
        venues = cursor.fetchall()
        print("   Canchas:")
        for venue in venues:
            print(f"     - {venue[0]} ({venue[1]}) - Capacidad: {venue[2]}")
        
        # External teams
        cursor.execute("SELECT name, level, contact_name FROM external_teams LIMIT 3;")
        teams = cursor.fetchall()
        print("   Equipos externos:")
        for team in teams:
            print(f"     - {team[0]} (Nivel: {team[1]}) - Contacto: {team[2]}")
        
        # Championships
        cursor.execute("SELECT name, season, status FROM championships LIMIT 3;")
        championships = cursor.fetchall()
        print("   Campeonatos:")
        for championship in championships:
            print(f"     - {championship[0]} ({championship[1]}) - Estado: {championship[2]}")
        
        print("\n✅ Verificación completada exitosamente!")
        
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
    check_matches_tables() 