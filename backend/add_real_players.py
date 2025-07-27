#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Player, Team, PositionZone, PositionSpecific
from app.crud import create_player, get_team, get_position_zone_by_abbreviation

def add_real_players():
    db = SessionLocal()
    try:
        print("Agregando jugadores reales de Matiz FC...")
        
        # Obtener el equipo Matiz FC
        team = get_team(db, 1)  # ID 1 = Matiz FC
        if not team:
            print("❌ Error: No se encontró el equipo Matiz FC")
            return False
            
        # Obtener posiciones
        def_pos = get_position_zone_by_abbreviation(db, "DEF")
        med_pos = get_position_zone_by_abbreviation(db, "MED")
        del_pos = get_position_zone_by_abbreviation(db, "DEL")
        por_pos = get_position_zone_by_abbreviation(db, "POR")
        
        # Jugadores reales de Matiz FC
        real_players = [
            {
                "name": "Danilo Atencio",
                "email": "datencio.trabajo@gmail.com",
                "phone": "+56912345678",
                "position_zone_id": def_pos.id,
                "jersey_number": 6,
                "skill_level": 8,
                "height": 175,
                "weight": 75
            },
            {
                "name": "Palito'S",
                "email": "palitos@matizfc.com",
                "phone": "+56987654321",
                "position_zone_id": def_pos.id,
                "jersey_number": 4,
                "skill_level": 7,
                "height": 180,
                "weight": 78
            },
            {
                "name": "NachoToro",
                "email": "nacho.toro@matizfc.com",
                "phone": "+56911223344",
                "position_zone_id": med_pos.id,
                "jersey_number": 11,
                "skill_level": 8,
                "height": 172,
                "weight": 70
            },
            {
                "name": "Chalo G",
                "email": "chalo.g@matizfc.com",
                "phone": "+56955667788",
                "position_zone_id": del_pos.id,
                "jersey_number": 9,
                "skill_level": 9,
                "height": 178,
                "weight": 72
            },
            {
                "name": "Alex",
                "email": "alex@matizfc.com",
                "phone": "+56999887766",
                "position_zone_id": def_pos.id,
                "jersey_number": 3,
                "skill_level": 7,
                "height": 176,
                "weight": 74
            },
            {
                "name": "Zear",
                "email": "zear@matizfc.com",
                "phone": "+56955443322",
                "position_zone_id": por_pos.id,
                "jersey_number": 1,
                "skill_level": 8,
                "height": 185,
                "weight": 80
            },
            {
                "name": "Diego",
                "email": "diego@matizfc.com",
                "phone": "+56911223344",
                "position_zone_id": def_pos.id,
                "jersey_number": 2,
                "skill_level": 6,
                "height": 174,
                "weight": 73
            },
            {
                "name": "Asmatiz",
                "email": "asmatiz@matizfc.com",
                "phone": "+56999887766",
                "position_zone_id": med_pos.id,
                "jersey_number": 8,
                "skill_level": 7,
                "height": 170,
                "weight": 68
            },
            {
                "name": "Chask",
                "email": "chask@matizfc.com",
                "phone": "+56955443322",
                "position_zone_id": por_pos.id,
                "jersey_number": 12,
                "skill_level": 7,
                "height": 182,
                "weight": 78
            },
            {
                "name": "Jonthan",
                "email": "jonthan@matizfc.com",
                "phone": "+56911223344",
                "position_zone_id": med_pos.id,
                "jersey_number": 10,
                "skill_level": 8,
                "height": 175,
                "weight": 71
            },
            {
                "name": "Nico Payo",
                "email": "nico.payo@matizfc.com",
                "phone": "+56999887766",
                "position_zone_id": del_pos.id,
                "jersey_number": 7,
                "skill_level": 8,
                "height": 177,
                "weight": 73
            },
            {
                "name": "Reyse Montana",
                "email": "reyse.montana@matizfc.com",
                "phone": "+56955443322",
                "position_zone_id": def_pos.id,
                "jersey_number": 5,
                "skill_level": 7,
                "height": 179,
                "weight": 76
            },
            {
                "name": "Galleta 1",
                "email": "galleta1@matizfc.com",
                "phone": "+56911223344",
                "position_zone_id": med_pos.id,
                "jersey_number": 14,
                "skill_level": 6,
                "height": 173,
                "weight": 69
            },
            {
                "name": "Galleta 2",
                "email": "galleta2@matizfc.com",
                "phone": "+56999887766",
                "position_zone_id": med_pos.id,
                "jersey_number": 15,
                "skill_level": 6,
                "height": 171,
                "weight": 67
            }
        ]
        
        # Crear jugadores
        created_count = 0
        for player_data in real_players:
            try:
                # Verificar si el jugador ya existe
                existing_player = db.query(Player).filter(Player.name == player_data["name"]).first()
                if existing_player:
                    print(f"⚠️  Jugador {player_data['name']} ya existe, saltando...")
                    continue
                    
                # Crear nuevo jugador
                new_player = Player(
                    user_id=1,  # Usuario admin
                    team_id=team.id,
                    position_zone_id=player_data["position_zone_id"],
                    name=player_data["name"],
                    email=player_data["email"],
                    phone=player_data["phone"],
                    jersey_number=player_data["jersey_number"],
                    height=player_data["height"],
                    weight=player_data["weight"],
                    skill_level=player_data["skill_level"],
                    is_active=True
                )
                
                db.add(new_player)
                created_count += 1
                print(f"✅ Agregado: {player_data['name']} ({player_data['jersey_number']})")
                
            except Exception as e:
                print(f"❌ Error agregando {player_data['name']}: {e}")
        
        db.commit()
        print(f"\n🎉 Se agregaron {created_count} jugadores reales de Matiz FC")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Agregando jugadores reales de Matiz FC a la base de datos...")
    print("=" * 60)
    
    if add_real_players():
        print("\n✅ Jugadores reales agregados correctamente")
        print("Ahora el Team Generator usará los jugadores reales de Matiz FC")
    else:
        print("\n❌ Error al agregar jugadores") 