#!/usr/bin/env python3
"""
Script para actualizar habilidades específicas de más jugadores
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.config import DATABASE_URL

def update_more_player_skills():
    """Actualizar habilidades específicas de más jugadores"""
    
    engine = create_engine(DATABASE_URL)
    
    # Datos de jugadores con habilidades específicas
    players_data = [
        # Jugadores que aparecen con barras vacías
        {"id": 1, "name": "Nico Payo", "rit": 82, "tir": 88, "pas": 75, "reg": 85, "defense": 65, "fis": 78},
        {"id": 3, "name": "Reyse Montana", "rit": 75, "tir": 70, "pas": 80, "reg": 72, "defense": 85, "fis": 76},
        {"id": 4, "name": "Galleta 1", "rit": 78, "tir": 75, "pas": 82, "reg": 80, "defense": 70, "fis": 74},
        
        # Otros jugadores de Matiz FC que podrían estar vacíos
        {"id": 5, "name": "NachoToro", "rit": 80, "tir": 75, "pas": 85, "reg": 78, "defense": 72, "fis": 76},
        {"id": 8, "name": "Chalo G", "rit": 85, "tir": 90, "pas": 78, "reg": 88, "defense": 65, "fis": 80},
        {"id": 9, "name": "Alex", "rit": 72, "tir": 68, "pas": 75, "reg": 70, "defense": 82, "fis": 74},
        {"id": 10, "name": "Zear", "rit": 70, "tir": 65, "pas": 72, "reg": 68, "defense": 88, "fis": 80},
        {"id": 11, "name": "Diego", "rit": 75, "tir": 70, "pas": 78, "reg": 72, "defense": 85, "fis": 76},
        {"id": 12, "name": "Asmatiz", "rit": 78, "tir": 75, "pas": 82, "reg": 80, "defense": 70, "fis": 74},
        {"id": 13, "name": "Chask", "rit": 68, "tir": 65, "pas": 70, "reg": 66, "defense": 85, "fis": 78},
        {"id": 14, "name": "Jonthan", "rit": 80, "tir": 75, "pas": 85, "reg": 78, "defense": 72, "fis": 76},
        
        # Algunos jugadores de Santiago United
        {"id": 34, "name": "Matías Silva", "rit": 78, "tir": 85, "pas": 90, "reg": 75, "defense": 70, "fis": 75},
        {"id": 35, "name": "Cristian Morales", "rit": 82, "tir": 88, "pas": 85, "reg": 80, "defense": 72, "fis": 78},
        {"id": 36, "name": "Diego Rojas", "rit": 76, "tir": 72, "pas": 78, "reg": 74, "defense": 75, "fis": 71},
        {"id": 37, "name": "Felipe Castro", "rit": 79, "tir": 76, "pas": 81, "reg": 77, "defense": 73, "fis": 75},
        {"id": 38, "name": "Alejandro Herrera", "rit": 74, "tir": 70, "pas": 76, "reg": 72, "defense": 78, "fis": 69},
        {"id": 39, "name": "Miguel Vega", "rit": 77, "tir": 73, "pas": 79, "reg": 75, "defense": 74, "fis": 73},
        {"id": 40, "name": "Carlos Contreras", "rit": 80, "tir": 77, "pas": 83, "reg": 79, "defense": 71, "fis": 77},
        {"id": 41, "name": "Roberto González", "rit": 85, "tir": 90, "pas": 82, "reg": 88, "defense": 68, "fis": 80},
        {"id": 42, "name": "Sebastián Silva", "rit": 78, "tir": 82, "pas": 80, "reg": 76, "defense": 70, "fis": 75},
        {"id": 43, "name": "Francisco Morales", "rit": 82, "tir": 85, "pas": 78, "reg": 84, "defense": 65, "fis": 79},
        {"id": 44, "name": "Daniel Rojas", "rit": 79, "tir": 83, "pas": 81, "reg": 77, "defense": 69, "fis": 76},
        {"id": 45, "name": "Andrés Castro", "rit": 76, "tir": 71, "pas": 77, "reg": 73, "defense": 80, "fis": 74},
        
        # Algunos jugadores de Valparaíso FC
        {"id": 46, "name": "Luis Martínez", "rit": 70, "tir": 65, "pas": 72, "reg": 68, "defense": 88, "fis": 80},
        {"id": 47, "name": "Pedro López", "rit": 68, "tir": 63, "pas": 70, "reg": 66, "defense": 85, "fis": 78},
        {"id": 48, "name": "Juan Ramírez", "rit": 78, "tir": 73, "pas": 80, "reg": 76, "defense": 85, "fis": 77},
        {"id": 49, "name": "Carlos Torres", "rit": 75, "tir": 70, "pas": 77, "reg": 73, "defense": 82, "fis": 75},
        {"id": 50, "name": "Miguel Sánchez", "rit": 72, "tir": 68, "pas": 74, "reg": 70, "defense": 80, "fis": 73},
        {"id": 51, "name": "Roberto Díaz", "rit": 80, "tir": 75, "pas": 82, "reg": 78, "defense": 85, "fis": 79},
        {"id": 52, "name": "Alejandro Ruiz", "rit": 77, "tir": 72, "pas": 79, "reg": 75, "defense": 83, "fis": 76},
        {"id": 53, "name": "Sebastián Morales", "rit": 80, "tir": 75, "pas": 85, "reg": 78, "defense": 70, "fis": 75},
        {"id": 54, "name": "Felipe González", "rit": 77, "tir": 72, "pas": 80, "reg": 76, "defense": 73, "fis": 74},
        {"id": 55, "name": "Nicolás Silva", "rit": 79, "tir": 74, "pas": 82, "reg": 78, "defense": 71, "fis": 76},
        {"id": 56, "name": "Carlos Vega", "rit": 78, "tir": 82, "pas": 76, "reg": 80, "defense": 68, "fis": 75},
        {"id": 57, "name": "Miguel Castro", "rit": 75, "tir": 79, "pas": 77, "reg": 73, "defense": 70, "fis": 74},
    ]
    
    with engine.begin() as conn:
        try:
            for player in players_data:
                print(f"Actualizando {player['name']} (ID: {player['id']})...")
                
                # Actualizar habilidades específicas
                conn.execute(text("""
                    UPDATE players 
                    SET rit = :rit, tir = :tir, pas = :pas, reg = :reg, defense = :defense, fis = :fis
                    WHERE id = :id
                """), {
                    "id": player["id"],
                    "rit": player["rit"],
                    "tir": player["tir"],
                    "pas": player["pas"],
                    "reg": player["reg"],
                    "defense": player["defense"],
                    "fis": player["fis"]
                })
                
                print(f"✅ {player['name']} actualizado exitosamente")
                print(f"   RIT: {player['rit']}, TIR: {player['tir']}, PAS: {player['pas']}")
                print(f"   REG: {player['reg']}, DEF: {player['defense']}, FIS: {player['fis']}")
                print()
            
            print("🎉 Actualización completada exitosamente!")
            
        except Exception as e:
            print(f"❌ Error durante la actualización: {e}")
            raise

if __name__ == "__main__":
    print("🚀 Actualizando habilidades específicas de más jugadores...")
    update_more_player_skills()
    print("✅ Actualización completada!") 