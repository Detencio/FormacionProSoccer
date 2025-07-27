#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import PositionZone, PositionSpecific
from app.crud import get_position_zone_by_abbreviation

def create_position_specifics():
    db = SessionLocal()
    try:
        print("Creando posiciones específicas...")
        
        # Obtener zonas de posición
        def_zone = get_position_zone_by_abbreviation(db, "DEF")
        med_zone = get_position_zone_by_abbreviation(db, "MED")
        del_zone = get_position_zone_by_abbreviation(db, "DEL")
        por_zone = get_position_zone_by_abbreviation(db, "POR")
        
        if not all([def_zone, med_zone, del_zone, por_zone]):
            print("❌ Error: No se encontraron todas las zonas de posición")
            return False
        
        # Posiciones específicas para DEF
        def_positions = [
            {
                "abbreviation": "LD",
                "name_es": "Lateral Derecho",
                "name_en": "Right Back",
                "zone_id": def_zone.id,
                "description_es": "Defensa que juega por la banda derecha",
                "description_en": "Defender who plays on the right wing"
            },
            {
                "abbreviation": "LI",
                "name_es": "Lateral Izquierdo",
                "name_en": "Left Back",
                "zone_id": def_zone.id,
                "description_es": "Defensa que juega por la banda izquierda",
                "description_en": "Defender who plays on the left wing"
            },
            {
                "abbreviation": "DFC",
                "name_es": "Defensa Central",
                "name_en": "Center Back",
                "zone_id": def_zone.id,
                "description_es": "Defensa que juega en el centro de la defensa",
                "description_en": "Defender who plays in the center of defense"
            },
            {
                "abbreviation": "CAI",
                "name_es": "Carrilero Izquierdo",
                "name_en": "Left Wing Back",
                "zone_id": def_zone.id,
                "description_es": "Defensa que sube por la banda izquierda",
                "description_en": "Defender who advances on the left wing"
            },
            {
                "abbreviation": "CAD",
                "name_es": "Carrilero Derecho",
                "name_en": "Right Wing Back",
                "zone_id": def_zone.id,
                "description_es": "Defensa que sube por la banda derecha",
                "description_en": "Defender who advances on the right wing"
            }
        ]
        
        # Posiciones específicas para MED
        med_positions = [
            {
                "abbreviation": "MCD",
                "name_es": "Mediocentro Defensivo",
                "name_en": "Defensive Midfielder",
                "zone_id": med_zone.id,
                "description_es": "Mediocampista que se enfoca en la recuperación",
                "description_en": "Midfielder focused on ball recovery"
            },
            {
                "abbreviation": "MC",
                "name_es": "Mediocentro",
                "name_en": "Center Midfielder",
                "zone_id": med_zone.id,
                "description_es": "Mediocampista que juega en el centro del campo",
                "description_en": "Midfielder who plays in the center of the field"
            },
            {
                "abbreviation": "MCO",
                "name_es": "Mediocentro Ofensivo",
                "name_en": "Attacking Midfielder",
                "zone_id": med_zone.id,
                "description_es": "Mediocampista que se enfoca en el ataque",
                "description_en": "Midfielder focused on attacking"
            },
            {
                "abbreviation": "MD",
                "name_es": "Volante por la Derecha",
                "name_en": "Right Winger",
                "zone_id": med_zone.id,
                "description_es": "Mediocampista que juega por la banda derecha",
                "description_en": "Midfielder who plays on the right wing"
            },
            {
                "abbreviation": "MI",
                "name_es": "Volante por la Izquierda",
                "name_en": "Left Winger",
                "zone_id": med_zone.id,
                "description_es": "Mediocampista que juega por la banda izquierda",
                "description_en": "Midfielder who plays on the left wing"
            }
        ]
        
        # Posiciones específicas para DEL
        del_positions = [
            {
                "abbreviation": "ED",
                "name_es": "Extremo Derecho",
                "name_en": "Right Winger",
                "zone_id": del_zone.id,
                "description_es": "Delantero que juega por la banda derecha",
                "description_en": "Forward who plays on the right wing"
            },
            {
                "abbreviation": "EI",
                "name_es": "Extremo Izquierdo",
                "name_en": "Left Winger",
                "zone_id": del_zone.id,
                "description_es": "Delantero que juega por la banda izquierda",
                "description_en": "Forward who plays on the left wing"
            },
            {
                "abbreviation": "DC",
                "name_es": "Delantero Centro",
                "name_en": "Center Forward",
                "zone_id": del_zone.id,
                "description_es": "Delantero que juega en el centro del ataque",
                "description_en": "Forward who plays in the center of attack"
            },
            {
                "abbreviation": "SD",
                "name_es": "Segundo Delantero",
                "name_en": "Second Striker",
                "zone_id": del_zone.id,
                "description_es": "Delantero que juega detrás del delantero centro",
                "description_en": "Forward who plays behind the center forward"
            }
        ]
        
        # Crear todas las posiciones específicas
        all_positions = def_positions + med_positions + del_positions
        
        print(f"1. Creando {len(all_positions)} posiciones específicas...")
        
        for i, pos_data in enumerate(all_positions):
            # Verificar si ya existe
            existing = db.query(PositionSpecific).filter(
                PositionSpecific.abbreviation == pos_data["abbreviation"]
            ).first()
            
            if existing:
                print(f"   ⚠️  {pos_data['abbreviation']} ya existe, saltando...")
                continue
            
            position = PositionSpecific(**pos_data)
            db.add(position)
            
            if (i + 1) % 5 == 0:
                print(f"   ✅ {i + 1}/{len(all_positions)} posiciones creadas")
        
        db.commit()
        
        print("\n🎉 POSICIONES ESPECÍFICAS CREADAS EXITOSAMENTE!")
        print("=" * 50)
        print("📊 RESUMEN:")
        print(f"   • Defensa (DEF): {len(def_positions)} posiciones")
        print(f"   • Mediocampo (MED): {len(med_positions)} posiciones")
        print(f"   • Delantero (DEL): {len(del_positions)} posiciones")
        print(f"   • Portero (POR): 0 posiciones (sin específicas)")
        print(f"   • Total: {len(all_positions)} posiciones específicas")
        print()
        print("🎯 POSICIONES DISPONIBLES:")
        print("   DEF: LD, LI, DFC, CAI, CAD")
        print("   MED: MCD, MC, MCO, MD, MI")
        print("   DEL: ED, EI, DC, SD")
        print("   POR: Sin posiciones específicas")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creando posiciones específicas: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    create_position_specifics() 