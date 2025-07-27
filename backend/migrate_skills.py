#!/usr/bin/env python3
"""
Script para agregar columnas de habilidades específicas a la tabla players
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.config import DATABASE_URL

def migrate_skills():
    """Agregar columnas de habilidades específicas a la tabla players"""
    
    engine = create_engine(DATABASE_URL)
    
    with engine.begin() as conn:
        try:
            # Verificar si las columnas ya existen
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'players' 
                AND column_name IN ('rit', 'tir', 'pas', 'reg', 'defense', 'fis')
            """))
            
            existing_columns = [row[0] for row in result.fetchall()]
            
            # Agregar columnas que no existen
            columns_to_add = [
                ('rit', 'INTEGER'),
                ('tir', 'INTEGER'),
                ('pas', 'INTEGER'),
                ('reg', 'INTEGER'),
                ('defense', 'INTEGER'),
                ('fis', 'INTEGER')
            ]
            
            for column_name, column_type in columns_to_add:
                if column_name not in existing_columns:
                    print(f"Agregando columna {column_name}...")
                    conn.execute(text(f"ALTER TABLE players ADD COLUMN {column_name} {column_type}"))
                    print(f"✅ Columna {column_name} agregada exitosamente")
                else:
                    print(f"⏭️  Columna {column_name} ya existe")
            
            print("\n🎉 Migración completada exitosamente!")
            
        except Exception as e:
            print(f"❌ Error durante la migración: {e}")
            raise

if __name__ == "__main__":
    print("🚀 Iniciando migración de habilidades específicas...")
    migrate_skills()
    print("✅ Migración completada!") 