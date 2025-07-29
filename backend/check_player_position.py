#!/usr/bin/env python3
"""
Script para verificar la posición del jugador Chalo G en la base de datos
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Player, PositionZone, PositionSpecific

def check_player_position():
    db = SessionLocal()
    try:
        # Buscar el jugador Chalo G
        player = db.query(Player).filter(Player.name == "Chalo G").first()
        
        if not player:
            print("❌ Jugador 'Chalo G' no encontrado en la base de datos")
            return
        
        print(f"✅ Jugador encontrado: {player.name}")
        print(f"📊 Información del jugador:")
        print(f"   - ID: {player.id}")
        print(f"   - Nombre: {player.name}")
        print(f"   - Email: {player.email}")
        print(f"   - Position Zone ID: {player.position_zone_id}")
        print(f"   - Position Specific ID: {player.position_specific_id}")
        print(f"   - Skill Level: {player.skill_level}")
        print(f"   - Team ID: {player.team_id}")
        
        # Obtener información de la zona de posición
        zone = db.query(PositionZone).filter(PositionZone.id == player.position_zone_id).first()
        if zone:
            print(f"   - Zona de Posición: {zone.abbreviation} ({zone.name_es})")
        else:
            print(f"   - Zona de Posición: NO ENCONTRADA (ID: {player.position_zone_id})")
        
        # Obtener información de la posición específica
        if player.position_specific_id:
            specific = db.query(PositionSpecific).filter(PositionSpecific.id == player.position_specific_id).first()
            if specific:
                print(f"   - Posición Específica: {specific.abbreviation} ({specific.name_es})")
            else:
                print(f"   - Posición Específica: NO ENCONTRADA (ID: {player.position_specific_id})")
        else:
            print(f"   - Posición Específica: Sin especificar")
        
        # Mostrar todas las zonas de posición disponibles
        print(f"\n📋 Zonas de posición disponibles:")
        zones = db.query(PositionZone).filter(PositionZone.is_active == True).all()
        for zone in zones:
            print(f"   - ID {zone.id}: {zone.abbreviation} ({zone.name_es})")
        
        # Mostrar posiciones específicas para la zona actual del jugador
        if player.position_zone_id:
            print(f"\n📋 Posiciones específicas para zona {player.position_zone_id}:")
            specifics = db.query(PositionSpecific).filter(
                PositionSpecific.zone_id == player.position_zone_id,
                PositionSpecific.is_active == True
            ).all()
            for specific in specifics:
                print(f"   - ID {specific.id}: {specific.abbreviation} ({specific.name_es})")
        
    except Exception as e:
        print(f"❌ Error consultando la base de datos: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_player_position() 