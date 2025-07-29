#!/usr/bin/env python3
"""
Script para verificar los IDs reales de las posiciones en la base de datos
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import PositionZone, PositionSpecific

def check_real_ids():
    db = SessionLocal()
    try:
        print("🔍 VERIFICANDO IDs REALES EN LA BASE DE DATOS")
        print("=" * 50)
        
        print("\n📋 ZONAS DE POSICIÓN:")
        zones = db.query(PositionZone).filter(PositionZone.is_active == True).order_by(PositionZone.id).all()
        for zone in zones:
            print(f"   ID {zone.id}: {zone.abbreviation} ({zone.name_es})")
        
        print("\n📋 POSICIONES ESPECÍFICAS:")
        specifics = db.query(PositionSpecific).filter(PositionSpecific.is_active == True).order_by(PositionSpecific.id).all()
        for specific in specifics:
            print(f"   ID {specific.id}: {specific.abbreviation} ({specific.name_es}) - Zona: {specific.zone_id}")
        
        print("\n📊 RESUMEN:")
        print(f"   - Total zonas: {len(zones)}")
        print(f"   - Total posiciones específicas: {len(specifics)}")
        
        # Agrupar por zona
        print("\n🎯 POSICIONES POR ZONA:")
        for zone in zones:
            zone_specifics = [s for s in specifics if s.zone_id == zone.id]
            print(f"   {zone.abbreviation} (ID {zone.id}): {[s.abbreviation for s in zone_specifics]}")
        
    except Exception as e:
        print(f"❌ Error consultando la base de datos: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_real_ids() 