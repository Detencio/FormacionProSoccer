import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def final_insert():
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("🧹 Limpiando tabla position_specifics...")
        cursor.execute("DELETE FROM position_specifics")
        print("✅ Tabla limpiada")
        
        print("🔧 Insertando posiciones específicas...")
        
        # Obtener zonas
        cursor.execute("SELECT id, abbreviation FROM position_zones WHERE is_active = true")
        zones = cursor.fetchall()
        print(f"Zonas encontradas: {zones}")
        
        zone_map = {zone[1]: zone[0] for zone in zones}
        
        # Posiciones específicas con nombres cortos
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
                print(f"⚠️  Saltando {abbreviation} - zona no encontrada")
                continue
                
            print(f"🔧 Insertando {abbreviation}: {name_es} (zona {zone_id})")
            
            try:
                cursor.execute("""
                    INSERT INTO position_specifics 
                    (abbreviation, name_es, name_en, zone_id, is_active, created_at)
                    VALUES (%s, %s, %s, %s, true, NOW())
                """, (abbreviation, name_es, name_es, zone_id))
                
                print(f"✅ {abbreviation}: {name_es}")
            except Exception as e:
                print(f"❌ Error insertando {abbreviation}: {e}")
        
        conn.commit()
        print("✅ Posiciones insertadas correctamente")
        
        # Verificar
        cursor.execute("SELECT id, abbreviation, name_es, zone_id FROM position_specifics WHERE is_active = true ORDER BY zone_id, abbreviation")
        inserted = cursor.fetchall()
        print(f"📊 Total: {len(inserted)} posiciones")
        for pos in inserted:
            print(f"  ID {pos[0]}: {pos[1]} ({pos[2]}) - Zona {pos[3]}")
        
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
    final_insert() 