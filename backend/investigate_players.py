import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def investigate_players():
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("🔍 Investigando diferencias entre jugadores...")
        
        # Jugadores que SÍ mantienen país
        cursor.execute("""
            SELECT id, name, nationality, position_zone_id, position_specific_id, 
                   height, weight, skill_level, created_at
            FROM players 
            WHERE name IN ('Danilo Atencio', 'Reyse Montana', 'Palito''S') 
            ORDER BY name
        """)
        good_players = cursor.fetchall()
        
        print("\n✅ Jugadores que SÍ mantienen país:")
        for p in good_players:
            print(f"  {p[1]}: nationality='{p[2]}', zone={p[3]}, specific={p[4]}, height={p[5]}, weight={p[6]}, skill={p[7]}, created={p[8]}")
        
        # Otros jugadores
        cursor.execute("""
            SELECT id, name, nationality, position_zone_id, position_specific_id, 
                   height, weight, skill_level, created_at
            FROM players 
            WHERE name NOT IN ('Danilo Atencio', 'Reyse Montana', 'Palito''S') 
            AND name LIKE '%'
            ORDER BY name
        """)
        other_players = cursor.fetchall()
        
        print("\n❌ Otros jugadores:")
        for p in other_players:
            print(f"  {p[1]}: nationality='{p[2]}', zone={p[3]}, specific={p[4]}, height={p[5]}, weight={p[6]}, skill={p[7]}, created={p[8]}")
        
        # Verificar si hay diferencias en la estructura de datos
        print("\n🔍 Análisis de diferencias:")
        
        # Verificar nacionalidades
        cursor.execute("SELECT DISTINCT nationality FROM players WHERE nationality IS NOT NULL")
        nationalities = cursor.fetchall()
        print(f"  Nacionalidades únicas en BD: {[n[0] for n in nationalities]}")
        
        # Verificar si hay jugadores con nationality NULL
        cursor.execute("SELECT COUNT(*) FROM players WHERE nationality IS NULL")
        null_count = cursor.fetchone()[0]
        print(f"  Jugadores con nationality NULL: {null_count}")
        
        # Verificar si hay jugadores con nationality vacío
        cursor.execute("SELECT COUNT(*) FROM players WHERE nationality = ''")
        empty_count = cursor.fetchone()[0]
        print(f"  Jugadores con nationality vacío: {empty_count}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    investigate_players() 