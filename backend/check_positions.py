#!/usr/bin/env python3
"""
Script para verificar las posiciones en la base de datos
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import PositionZone, PositionSpecific

def check_positions():
    db = SessionLocal()
    try:
        print("📋 Zonas de posición disponibles:")
        zones = db.query(PositionZone).filter(PositionZone.is_active == True).all()
        for zone in zones:
            print(f"   - ID {zone.id}: {zone.abbreviation} ({zone.name_es})")
        
        print(f"\n📋 Posiciones específicas disponibles:")
        specifics = db.query(PositionSpecific).filter(PositionSpecific.is_active == True).all()
        for specific in specifics:
            print(f"   - ID {specific.id}: {specific.abbreviation} ({specific.name_es}) - Zona: {specific.zone_id}")
        
        print(f"\n📊 Resumen:")
        print(f"   - Total zonas: {len(zones)}")
        print(f"   - Total posiciones específicas: {len(specifics)}")
        
    except Exception as e:
        print(f"❌ Error consultando la base de datos: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_positions() 