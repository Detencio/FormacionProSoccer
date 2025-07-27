#!/usr/bin/env python3
"""
Script para crear las posiciones por zona y específicas en la base de datos.
Ejecutar después de crear las tablas con alembic.
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import PositionZone, PositionSpecific

def create_position_zones():
    """Crear las posiciones por zona básicas"""
    db = SessionLocal()
    
    zones = [
        {"abbreviation": "POR", "name_es": "Portero", "name_en": "Goalkeeper"},
        {"abbreviation": "DEF", "name_es": "Defensa", "name_en": "Defender"},
        {"abbreviation": "MED", "name_es": "Mediocampista", "name_en": "Midfielder"},
        {"abbreviation": "DEL", "name_es": "Delantero", "name_en": "Forward"}
    ]
    
    for zone_data in zones:
        existing = db.query(PositionZone).filter_by(abbreviation=zone_data["abbreviation"]).first()
        if not existing:
            zone = PositionZone(**zone_data)
            db.add(zone)
            print(f"✅ Creada zona: {zone_data['abbreviation']} - {zone_data['name_es']}")
    
    db.commit()
    db.close()

def create_position_specifics():
    """Crear las posiciones específicas"""
    db = SessionLocal()
    
    # Obtener las zonas creadas
    zones = {zone.abbreviation: zone.id for zone in db.query(PositionZone).all()}
    
    specifics = [
        # Posiciones específicas de Defensa
        {"abbreviation": "LD", "name_es": "Lateral Derecho", "name_en": "Right Back", 
         "zone_id": zones["DEF"], "description_es": "Defensa que juega por la banda derecha", 
         "description_en": "Defender who plays on the right wing"},
        {"abbreviation": "LI", "name_es": "Lateral Izquierdo", "name_en": "Left Back", 
         "zone_id": zones["DEF"], "description_es": "Defensa que juega por la banda izquierda", 
         "description_en": "Defender who plays on the left wing"},
        {"abbreviation": "DFC", "name_es": "Defensa Central", "name_en": "Center Back", 
         "zone_id": zones["DEF"], "description_es": "Defensa que juega en el centro de la defensa", 
         "description_en": "Defender who plays in the center of defense"},
        {"abbreviation": "CAI", "name_es": "Carrilero Izquierdo", "name_en": "Left Wing Back", 
         "zone_id": zones["DEF"], "description_es": "Defensa que sube por la banda izquierda", 
         "description_en": "Defender who advances on the left wing"},
        {"abbreviation": "CAD", "name_es": "Carrilero Derecho", "name_en": "Right Wing Back", 
         "zone_id": zones["DEF"], "description_es": "Defensa que sube por la banda derecha", 
         "description_en": "Defender who advances on the right wing"},
        
        # Posiciones específicas de Mediocampo
        {"abbreviation": "MCD", "name_es": "Mediocentro Defensivo", "name_en": "Defensive Midfielder", 
         "zone_id": zones["MED"], "description_es": "Mediocampista que se enfoca en la recuperación", 
         "description_en": "Midfielder focused on ball recovery"},
        {"abbreviation": "MC", "name_es": "Mediocentro", "name_en": "Center Midfielder", 
         "zone_id": zones["MED"], "description_es": "Mediocampista que juega en el centro del campo", 
         "description_en": "Midfielder who plays in the center of the field"},
        {"abbreviation": "MCO", "name_es": "Mediocentro Ofensivo", "name_en": "Attacking Midfielder", 
         "zone_id": zones["MED"], "description_es": "Mediocampista que se enfoca en el ataque", 
         "description_en": "Midfielder focused on attacking"},
        {"abbreviation": "MD", "name_es": "Volante por la Derecha", "name_en": "Right Winger", 
         "zone_id": zones["MED"], "description_es": "Mediocampista que juega por la banda derecha", 
         "description_en": "Midfielder who plays on the right wing"},
        {"abbreviation": "MI", "name_es": "Volante por la Izquierda", "name_en": "Left Winger", 
         "zone_id": zones["MED"], "description_es": "Mediocampista que juega por la banda izquierda", 
         "description_en": "Midfielder who plays on the left wing"},
        
        # Posiciones específicas de Ataque
        {"abbreviation": "ED", "name_es": "Extremo Derecho", "name_en": "Right Winger", 
         "zone_id": zones["DEL"], "description_es": "Delantero que juega por la banda derecha", 
         "description_en": "Forward who plays on the right wing"},
        {"abbreviation": "EI", "name_es": "Extremo Izquierdo", "name_en": "Left Winger", 
         "zone_id": zones["DEL"], "description_es": "Delantero que juega por la banda izquierda", 
         "description_en": "Forward who plays on the left wing"},
        {"abbreviation": "DC", "name_es": "Delantero Centro", "name_en": "Center Forward", 
         "zone_id": zones["DEL"], "description_es": "Delantero que juega en el centro del ataque", 
         "description_en": "Forward who plays in the center of attack"},
        {"abbreviation": "SD", "name_es": "Segundo Delantero", "name_en": "Second Striker", 
         "zone_id": zones["DEL"], "description_es": "Delantero que juega detrás del delantero centro", 
         "description_en": "Forward who plays behind the center forward"}
    ]
    
    for specific_data in specifics:
        existing = db.query(PositionSpecific).filter_by(abbreviation=specific_data["abbreviation"]).first()
        if not existing:
            specific = PositionSpecific(**specific_data)
            db.add(specific)
            print(f"✅ Creada posición específica: {specific_data['abbreviation']} - {specific_data['name_es']}")
    
    db.commit()
    db.close()

def main():
    """Función principal para crear todas las posiciones"""
    print("🚀 Iniciando creación de posiciones...")
    
    try:
        # Crear posiciones por zona
        print("\n📋 Creando posiciones por zona...")
        create_position_zones()
        
        # Crear posiciones específicas
        print("\n🎯 Creando posiciones específicas...")
        create_position_specifics()
        
        print("\n✅ ¡Todas las posiciones han sido creadas exitosamente!")
        print("\n📊 Resumen:")
        print("   • 4 posiciones por zona (POR, DEF, MED, DEL)")
        print("   • 14 posiciones específicas")
        print("   • Total: 18 posiciones disponibles")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Asegúrate de que las tablas existan en la base de datos")

if __name__ == "__main__":
    main() 