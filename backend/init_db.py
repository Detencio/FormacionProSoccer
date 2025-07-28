#!/usr/bin/env python3
"""
Script para inicializar la base de datos con el campo photo_url
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models import User, PositionZone, PositionSpecific, Team, Player

def init_database():
    """Inicializa la base de datos con todas las tablas"""
    
    try:
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        print("✅ Base de datos inicializada exitosamente")
        print("✅ Todas las tablas creadas incluyendo el campo photo_url")
        
    except Exception as e:
        print(f"❌ Error al inicializar la base de datos: {e}")
        raise

if __name__ == "__main__":
    print("🔄 Inicializando base de datos...")
    init_database()
    print("✅ Proceso completado") 