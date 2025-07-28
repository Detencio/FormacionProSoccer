#!/usr/bin/env python3
"""
Script para agregar la columna photo_url a la tabla players en PostgreSQL
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def add_photo_url_column():
    """Agrega la columna photo_url a la tabla players en PostgreSQL"""
    
    # Configuración de la base de datos PostgreSQL
    # Usar parámetros separados para evitar problemas de codificación
    DB_PARAMS = {
        'host': 'localhost',
        'port': 5432,
        'database': 'prosoccer',
        'user': 'postgres',
        'password': 'postgres'  # Contraseña por defecto de PostgreSQL
    }
    
    try:
        print(f"🔄 Conectando a PostgreSQL: {DB_PARAMS['host']}:{DB_PARAMS['port']}/{DB_PARAMS['database']}")
        
        # Conectar a PostgreSQL
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        
        print("✅ Conexión exitosa a PostgreSQL")
        
        # Verificar si la columna ya existe
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'players' 
            AND column_name = 'photo_url'
        """)
        
        if cursor.fetchone():
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
        print("💡 Asegúrate de que PostgreSQL esté ejecutándose y la base de datos 'prosoccer' exista")
        raise
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("🔄 Agregando columna photo_url a la tabla players en PostgreSQL...")
    add_photo_url_column()
    print("✅ Proceso completado") 