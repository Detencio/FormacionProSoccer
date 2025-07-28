#!/usr/bin/env python3
"""
Script para agregar la columna photo_url a la tabla players
"""

import sqlite3
import os

def add_photo_url_column():
    """Agrega la columna photo_url a la tabla players"""
    
    # Ruta a la base de datos SQLite
    db_path = "prosoccer.db"
    
    if not os.path.exists(db_path):
        print(f"❌ No se encontró la base de datos: {db_path}")
        return
    
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar si la columna ya existe
        cursor.execute("PRAGMA table_info(players)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'photo_url' in columns:
            print("✅ La columna 'photo_url' ya existe en la tabla 'players'")
            return
        
        # Agregar la columna photo_url
        cursor.execute("""
            ALTER TABLE players 
            ADD COLUMN photo_url TEXT
        """)
        
        conn.commit()
        print("✅ Columna 'photo_url' agregada exitosamente a la tabla 'players'")
        
    except Exception as e:
        print(f"❌ Error al agregar la columna: {e}")
        raise
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("🔄 Agregando columna photo_url a la tabla players...")
    add_photo_url_column()
    print("✅ Proceso completado") 