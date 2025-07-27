#!/usr/bin/env python3
"""
Script para crear datos de prueba: equipo y jugadores
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Team, Player, PositionZone, PositionSpecific, User
from app.crud import create_user, get_team
from app.schemas import UserCreate
from datetime import date

def create_test_data():
    """Crear datos de prueba"""
    db = SessionLocal()
    
    try:
        # Obtener o crear equipo "Matiz FC"
        print("🏟️ Buscando equipo Matiz FC...")
        team = db.query(Team).filter(Team.name == "Matiz FC").first()
        
        if not team:
            print("Creando equipo Matiz FC...")
            team = Team(
                name="Matiz FC",
                city="Santiago",
                country="Chile",
                founded=2020,
                description="Equipo de fútbol amateur de Santiago"
            )
            db.add(team)
            db.commit()
            db.refresh(team)
            print(f"✅ Equipo creado: {team.name}")
        else:
            print(f"✅ Equipo encontrado: {team.name}")
        
        # Obtener posiciones
        position_zones = {zone.abbreviation: zone for zone in db.query(PositionZone).all()}
        position_specifics = {spec.abbreviation: spec for spec in db.query(PositionSpecific).all()}
        
        # Crear jugadores de prueba
        players_data = [
            {
                "name": "Juan Pérez",
                "email": "juan.perez@matizfc.com",
                "phone": "+56912345678",
                "position_zone": position_zones["DEF"],
                "position_specific": position_specifics.get("DFC"),
                "skill_level": 7,
                "jersey_number": 4
            },
            {
                "name": "Carlos López",
                "email": "carlos.lopez@matizfc.com",
                "phone": "+56987654321",
                "position_zone": position_zones["MED"],
                "position_specific": position_specifics.get("MC"),
                "skill_level": 8,
                "jersey_number": 8
            },
            {
                "name": "Miguel Rodríguez",
                "email": "miguel.rodriguez@matizfc.com",
                "phone": "+56911223344",
                "position_zone": position_zones["DEL"],
                "position_specific": position_specifics.get("DC"),
                "skill_level": 9,
                "jersey_number": 9
            },
            {
                "name": "Andrés Silva",
                "email": "andres.silva@matizfc.com",
                "phone": "+56955667788",
                "position_zone": position_zones["POR"],
                "position_specific": None,
                "skill_level": 6,
                "jersey_number": 1
            },
            {
                "name": "Roberto Martínez",
                "email": "roberto.martinez@matizfc.com",
                "phone": "+56999887766",
                "position_zone": position_zones["DEF"],
                "position_specific": position_specifics.get("LD"),
                "skill_level": 7,
                "jersey_number": 2
            }
        ]
        
        print(f"\n👥 Creando {len(players_data)} jugadores...")
        
        created_players = 0
        for i, player_data in enumerate(players_data, 1):
            # Verificar si el usuario ya existe
            existing_user = db.query(User).filter(User.email == player_data["email"]).first()
            if existing_user:
                print(f"⚠️ Usuario ya existe: {player_data['name']}")
                continue
                
            # Crear usuario para el jugador
            user_create = UserCreate(
                email=player_data["email"],
                password="123456",
                full_name=player_data["name"]
            )
            user = create_user(db, user_create)
            
            # Actualizar el usuario para marcarlo como jugador
            user.is_player = True
            user.phone = player_data["phone"]
            db.commit()
            
            # Crear jugador
            player = Player(
                user_id=user.id,
                team_id=team.id,
                name=player_data["name"],
                email=player_data["email"],
                phone=player_data["phone"],
                position_zone_id=player_data["position_zone"].id,
                position_specific_id=player_data["position_specific"].id if player_data["position_specific"] else None,
                skill_level=player_data["skill_level"],
                jersey_number=player_data["jersey_number"],
                is_active=True
            )
            
            db.add(player)
            print(f"✅ Jugador {i} creado: {player_data['name']} ({player_data['position_zone'].abbreviation})")
            created_players += 1
        
        db.commit()
        print(f"\n🎉 ¡Datos de prueba creados exitosamente!")
        print(f"   • Equipo: {team.name}")
        print(f"   • Jugadores creados: {created_players}")
        
    except Exception as e:
        print(f"❌ Error creando datos de prueba: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data() 