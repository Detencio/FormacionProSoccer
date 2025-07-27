#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from app.models import Base

def test_database():
    try:
        print("Probando conexión a la base de datos...")
        # Crear las tablas
        Base.metadata.create_all(bind=engine)
        print("✅ Base de datos conectada y tablas creadas correctamente")
        
        # Probar una consulta simple
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Consulta de prueba exitosa")
            
    except Exception as e:
        print(f"❌ Error en la base de datos: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_database() 