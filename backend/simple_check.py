#!/usr/bin/env python3
"""
Script simple para verificar IDs de posiciones
"""

import psycopg2
import os

def check_positions_simple():
    try:
        # Conectar a la base de datos
        conn = psycopg2.connect(
            dbname="prosoccer_db",
            user="postgres", 
            password="postgres",
            host="localhost",
            port="5432"
        )
        
        cursor = conn.cursor()
        
        print("🔍 VERIFICANDO IDs REALES EN LA BASE DE DATOS")
        print("=" * 50)
        
        # Verificar zonas de posición
        print("\n📋 ZONAS DE POSICIÓN:")
        cursor.execute("SELECT id, abbreviation, name_es FROM position_zones WHERE is_active = true ORDER BY id")
        zones = cursor.fetchall()
        for zone in zones:
            print(f"   ID {zone[0]}: {zone[1]} ({zone[2]})")
        
        # Verificar posiciones específicas
        print("\n📋 POSICIONES ESPECÍFICAS:")
        cursor.execute("SELECT id, abbreviation, name_es, zone_id FROM position_specifics WHERE is_active = true ORDER BY id")
        specifics = cursor.fetchall()
        for specific in specifics:
            print(f"   ID {specific[0]}: {specific[1]} ({specific[2]}) - Zona: {specific[3]}")
        
        print("\n📊 RESUMEN:")
        print(f"   - Total zonas: {len(zones)}")
        print(f"   - Total posiciones específicas: {len(specifics)}")
        
        # Agrupar por zona
        print("\n🎯 POSICIONES POR ZONA:")
        for zone in zones:
            zone_specifics = [s for s in specifics if s[3] == zone[0]]
            print(f"   {zone[1]} (ID {zone[0]}): {[s[1] for s in zone_specifics]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_positions_simple() 