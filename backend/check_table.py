import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_table():
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("🔍 Verificando estructura de position_specifics...")
        
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'position_specifics' 
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        for col in columns:
            print(f"  {col[0]}: {col[1]} ({col[2]})")
        
        print("\n🔍 Verificando datos actuales...")
        cursor.execute("SELECT COUNT(*) FROM position_specifics")
        count = cursor.fetchone()[0]
        print(f"  Total de registros: {count}")
        
        if count > 0:
            cursor.execute("SELECT id, abbreviation, name_es, zone_id FROM position_specifics LIMIT 5")
            rows = cursor.fetchall()
            for row in rows:
                print(f"  ID {row[0]}: {row[1]} ({row[2]}) - Zona {row[3]}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    check_table() 