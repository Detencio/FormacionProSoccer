#!/usr/bin/env python3
"""
Script para actualizar habilidades específicas de algunos jugadores
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.config import DATABASE_URL

def update_player_skills():
    """Actualizar habilidades específicas de algunos jugadores"""
    
    engine = create_engine(DATABASE_URL)
    
    # Datos de jugadores con habilidades específicas
    players_data = [
        # Matiz FC - Jugadores originales
        {"id": 6, "name": "Danilo Atencio", "rit": 88, "tir": 75, "pas": 82, "reg": 70, "defense": 85, "fis": 78},
        {"id": 7, "name": "Palito'S", "rit": 72, "tir": 68, "pas": 75, "reg": 65, "defense": 80, "fis": 70},
        {"id": 19, "name": "Galleta 2", "rit": 75, "tir": 70, "pas": 78, "reg": 72, "defense": 68, "fis": 65},
        
        # Santiago United - Algunos jugadores destacados
        {"id": 31, "name": "Nicolás González", "rit": 85, "tir": 90, "pas": 88, "reg": 82, "defense": 75, "fis": 80},
        {"id": 32, "name": "Matías Silva", "rit": 78, "tir": 85, "pas": 90, "reg": 75, "defense": 70, "fis": 75},
        {"id": 33, "name": "Cristian Morales", "rit": 82, "tir": 88, "pas": 85, "reg": 80, "defense": 72, "fis": 78},
        
        # Valparaíso FC - Algunos jugadores destacados
        {"id": 51, "name": "Diego Fernández", "rit": 90, "tir": 85, "pas": 88, "reg": 92, "defense": 75, "fis": 82},
        {"id": 52, "name": "Sebastián Morales", "rit": 80, "tir": 75, "pas": 85, "reg": 78, "defense": 70, "fis": 75},
        {"id": 55, "name": "Roberto Herrera", "rit": 85, "tir": 92, "pas": 80, "reg": 85, "defense": 68, "fis": 78},
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
    print("🚀 Actualizando habilidades específicas de jugadores...")
    update_player_skills()
    print("✅ Actualización completada!") 