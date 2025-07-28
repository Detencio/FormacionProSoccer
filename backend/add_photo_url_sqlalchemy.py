#!/usr/bin/env python3
"""
Script para agregar la columna photo_url usando SQLAlchemy
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.config import settings

def add_photo_url_column():
    """Agrega la columna photo_url a la tabla players usando SQLAlchemy"""
    
    try:
        # Crear conexión usando SQLAlchemy
        engine = create_engine(settings.DATABASE_URL)
        
        with engine.connect() as conn:
            print("✅ Conexión exitosa a la base de datos")
            
            # Verificar si la columna ya existe
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'players' 
                AND column_name = 'photo_url'
            """))
            
            if result.fetchone():
                print("✅ La columna 'photo_url' ya existe en la tabla 'players'")
                return
            
            # Agregar la columna photo_url
            conn.execute(text("""
                ALTER TABLE players 
                ADD COLUMN photo_url TEXT
            """))
            
            conn.commit()
            print("✅ Columna 'photo_url' agregada exitosamente a la tabla 'players'")
            
    except Exception as e:
        print(f"❌ Error al agregar la columna: {e}")
        print("💡 Verifica la configuración de la base de datos")
        raise
    finally:
        if 'engine' in locals():
            engine.dispose()

if __name__ == "__main__":
    print("🔄 Agregando columna photo_url a la tabla players...")
    add_photo_url_column()
    print("✅ Proceso completado") 