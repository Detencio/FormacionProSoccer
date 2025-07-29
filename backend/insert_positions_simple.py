#!/usr/bin/env python3
import psycopg2
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def insert_position_specifics():
    # Configuración de la base de datos
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        # Conectar a la base de datos
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("Insertando posiciones específicas...")
        
        # Obtener las zonas de posición
        cursor.execute("SELECT id, abbreviation FROM position_zones WHERE is_active = true")
        zones = cursor.fetchall()
        print(f"Zonas encontradas: {zones}")
        
        # Mapear zonas por abreviatura
        zone_map = {zone[1]: zone[0] for zone in zones}
        
        # Posiciones específicas para insertar
        positions = [
            # DEF positions
            ("LD", "Lateral Derecho", "Right Back", zone_map.get("DEF"), "Defensa que juega por la banda derecha", "Defender who plays on the right wing"),
            ("LI", "Lateral Izquierdo", "Left Back", zone_map.get("DEF"), "Defensa que juega por la banda izquierda", "Defender who plays on the left wing"),
            ("DFC", "Defensa Central", "Center Back", zone_map.get("DEF"), "Defensa que juega en el centro de la defensa", "Defender who plays in the center of defense"),
            ("CAI", "Carrilero Izquierdo", "Left Wing Back", zone_map.get("DEF"), "Defensa que sube por la banda izquierda", "Defender who advances on the left wing"),
            ("CAD", "Carrilero Derecho", "Right Wing Back", zone_map.get("DEF"), "Defensa que sube por la banda derecha", "Defender who advances on the right wing"),
            
            # MED positions
            ("MCD", "Mediocentro Defensivo", "Defensive Midfielder", zone_map.get("MED"), "Mediocampista que se enfoca en la recuperación", "Midfielder focused on ball recovery"),
            ("MC", "Mediocentro", "Center Midfielder", zone_map.get("MED"), "Mediocampista que juega en el centro del campo", "Midfielder who plays in the center of the field"),
            ("MCO", "Mediocentro Ofensivo", "Attacking Midfielder", zone_map.get("MED"), "Mediocampista que se enfoca en el ataque", "Midfielder focused on attacking"),
            ("MD", "Volante por la Derecha", "Right Winger", zone_map.get("MED"), "Mediocampista que juega por la banda derecha", "Midfielder who plays on the right wing"),
            ("MI", "Volante por la Izquierda", "Left Winger", zone_map.get("MED"), "Mediocampista que juega por la banda izquierda", "Midfielder who plays on the left wing"),
            
            # DEL positions
            ("ED", "Extremo Derecho", "Right Forward", zone_map.get("DEL"), "Delantero que juega por la banda derecha", "Forward who plays on the right wing"),
            ("EI", "Extremo Izquierdo", "Left Forward", zone_map.get("DEL"), "Delantero que juega por la banda izquierda", "Forward who plays on the left wing"),
            ("DC", "Delantero Centro", "Center Forward", zone_map.get("DEL"), "Delantero que juega en el centro del ataque", "Forward who plays in the center of attack"),
            ("SD", "Segundo Delantero", "Second Forward", zone_map.get("DEL"), "Delantero que juega detrás del delantero centro", "Forward who plays behind the center forward")
        ]
        
        # Insertar cada posición
        for pos in positions:
            abbreviation, name_es, name_en, zone_id, desc_es, desc_en = pos
            
            if zone_id is None:
                print(f"⚠️  Saltando {abbreviation} - zona no encontrada")
                continue
                
            cursor.execute("""
                INSERT INTO position_specifics 
                (abbreviation, name_es, name_en, zone_id, description_es, description_en, is_active, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, true, NOW())
                ON CONFLICT (abbreviation) DO NOTHING
            """, (abbreviation, name_es, name_en, zone_id, desc_es, desc_en))
            
            print(f"✅ Insertada: {abbreviation} ({name_es})")
        
        # Confirmar cambios
        conn.commit()
        print("✅ Todas las posiciones específicas han sido insertadas")
        
        # Verificar las posiciones insertadas
        cursor.execute("SELECT id, abbreviation, name_es, zone_id FROM position_specifics WHERE is_active = true ORDER BY zone_id, abbreviation")
        inserted = cursor.fetchall()
        print(f"📊 Total de posiciones específicas en BD: {len(inserted)}")
        for pos in inserted:
            print(f"  - ID {pos[0]}: {pos[1]} ({pos[2]}) - Zona {pos[3]}")
        
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
    insert_position_specifics() 