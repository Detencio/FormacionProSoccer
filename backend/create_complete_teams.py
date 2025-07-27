#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Player, Team, PositionZone, PositionSpecific, User
from app.crud import create_player, get_team, get_position_zone_by_abbreviation, create_user, create_admin_user
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_complete_teams():
    db = SessionLocal()
    try:
        print("Creando equipos completos con jugadores y supervisores...")
        
        # Obtener posiciones
        def_pos = get_position_zone_by_abbreviation(db, "DEF")
        med_pos = get_position_zone_by_abbreviation(db, "MED")
        del_pos = get_position_zone_by_abbreviation(db, "DEL")
        por_pos = get_position_zone_by_abbreviation(db, "POR")
        
        # Crear equipos
        print("1. Creando equipos...")
        
        # Equipo 1: Santiago United (24 jugadores)
        team1 = Team(
            name="Santiago United",
            city="Santiago",
            country="Chile",
            founded=2018,
            description="Equipo profesional de Santiago con gran historia",
            logo_url=""
        )
        db.add(team1)
        db.flush()
        
        # Equipo 2: Valparaíso FC (14 jugadores)
        team2 = Team(
            name="Valparaíso FC",
            city="Valparaíso",
            country="Chile",
            founded=2020,
            description="Equipo emergente de la región de Valparaíso",
            logo_url=""
        )
        db.add(team2)
        db.flush()
        
        print(f"✅ Equipos creados: {team1.name} (ID: {team1.id}), {team2.name} (ID: {team2.id})")
        
        # Crear supervisores
        print("2. Creando supervisores...")
        
        # Supervisor Santiago United
        from app.schemas import UserCreate
        supervisor1_data = UserCreate(
            email="supervisor@santiagounited.cl",
            password="supervisor123",
            full_name="Carlos Mendoza",
            phone="+56912345678"
        )
        supervisor1 = create_user(db, supervisor1_data)
        supervisor1.role = "supervisor"
        supervisor1.team_id = team1.id
        
        # Supervisor Valparaíso FC
        supervisor2_data = UserCreate(
            email="supervisor@valparaisofc.cl",
            password="supervisor123",
            full_name="María González",
            phone="+56987654321"
        )
        supervisor2 = create_user(db, supervisor2_data)
        supervisor2.role = "supervisor"
        supervisor2.team_id = team2.id
        
        print(f"✅ Supervisores creados: {supervisor1.full_name}, {supervisor2.full_name}")
        
        # Santiago United - 24 jugadores
        santiago_players = [
            # Porteros (3)
            {"name": "Diego Torres", "email": "diego.torres@santiagounited.cl", "phone": "+56911111111", "position_zone_id": por_pos.id, "jersey_number": 1, "skill_level": 8, "height": 185, "weight": 80},
            {"name": "Roberto Silva", "email": "roberto.silva@santiagounited.cl", "phone": "+56911111112", "position_zone_id": por_pos.id, "jersey_number": 12, "skill_level": 7, "height": 182, "weight": 78},
            {"name": "Felipe Morales", "email": "felipe.morales@santiagounited.cl", "phone": "+56911111113", "position_zone_id": por_pos.id, "jersey_number": 25, "skill_level": 6, "height": 180, "weight": 75},
            
            # Defensas (8)
            {"name": "Alejandro Castro", "email": "alejandro.castro@santiagounited.cl", "phone": "+56911111114", "position_zone_id": def_pos.id, "jersey_number": 2, "skill_level": 8, "height": 178, "weight": 75},
            {"name": "Miguel Rojas", "email": "miguel.rojas@santiagounited.cl", "phone": "+56911111115", "position_zone_id": def_pos.id, "jersey_number": 3, "skill_level": 7, "height": 176, "weight": 73},
            {"name": "Carlos Herrera", "email": "carlos.herrera@santiagounited.cl", "phone": "+56911111116", "position_zone_id": def_pos.id, "jersey_number": 4, "skill_level": 8, "height": 185, "weight": 80},
            {"name": "Sebastián Vega", "email": "sebastian.vega@santiagounited.cl", "phone": "+56911111117", "position_zone_id": def_pos.id, "jersey_number": 5, "skill_level": 7, "height": 182, "weight": 78},
            {"name": "Francisco Contreras", "email": "francisco.contreras@santiagounited.cl", "phone": "+56911111118", "position_zone_id": def_pos.id, "jersey_number": 6, "skill_level": 6, "height": 179, "weight": 76},
            {"name": "Daniel Paredes", "email": "daniel.paredes@santiagounited.cl", "phone": "+56911111119", "position_zone_id": def_pos.id, "jersey_number": 13, "skill_level": 7, "height": 177, "weight": 74},
            {"name": "Andrés Muñoz", "email": "andres.munoz@santiagounited.cl", "phone": "+56911111120", "position_zone_id": def_pos.id, "jersey_number": 15, "skill_level": 6, "height": 181, "weight": 77},
            {"name": "Roberto Valenzuela", "email": "roberto.valenzuela@santiagounited.cl", "phone": "+56911111121", "position_zone_id": def_pos.id, "jersey_number": 16, "skill_level": 7, "height": 183, "weight": 79},
            
            # Centrocampistas (8)
            {"name": "Nicolás González", "email": "nicolas.gonzalez@santiagounited.cl", "phone": "+56911111122", "position_zone_id": med_pos.id, "jersey_number": 7, "skill_level": 9, "height": 175, "weight": 70},
            {"name": "Matías Silva", "email": "matias.silva@santiagounited.cl", "phone": "+56911111123", "position_zone_id": med_pos.id, "jersey_number": 8, "skill_level": 8, "height": 173, "weight": 68},
            {"name": "Cristian Morales", "email": "cristian.morales@santiagounited.cl", "phone": "+56911111124", "position_zone_id": med_pos.id, "jersey_number": 10, "skill_level": 9, "height": 176, "weight": 72},
            {"name": "Diego Rojas", "email": "diego.rojas@santiagounited.cl", "phone": "+56911111125", "position_zone_id": med_pos.id, "jersey_number": 11, "skill_level": 7, "height": 174, "weight": 71},
            {"name": "Felipe Castro", "email": "felipe.castro@santiagounited.cl", "phone": "+56911111126", "position_zone_id": med_pos.id, "jersey_number": 14, "skill_level": 8, "height": 177, "weight": 73},
            {"name": "Alejandro Herrera", "email": "alejandro.herrera@santiagounited.cl", "phone": "+56911111127", "position_zone_id": med_pos.id, "jersey_number": 17, "skill_level": 6, "height": 172, "weight": 69},
            {"name": "Miguel Vega", "email": "miguel.vega@santiagounited.cl", "phone": "+56911111128", "position_zone_id": med_pos.id, "jersey_number": 18, "skill_level": 7, "height": 175, "weight": 71},
            {"name": "Carlos Contreras", "email": "carlos.contreras@santiagounited.cl", "phone": "+56911111129", "position_zone_id": med_pos.id, "jersey_number": 19, "skill_level": 8, "height": 178, "weight": 74},
            
            # Delanteros (5)
            {"name": "Roberto González", "email": "roberto.gonzalez@santiagounited.cl", "phone": "+56911111130", "position_zone_id": del_pos.id, "jersey_number": 9, "skill_level": 9, "height": 180, "weight": 75},
            {"name": "Sebastián Silva", "email": "sebastian.silva@santiagounited.cl", "phone": "+56911111131", "position_zone_id": del_pos.id, "jersey_number": 20, "skill_level": 8, "height": 178, "weight": 73},
            {"name": "Francisco Morales", "email": "francisco.morales@santiagounited.cl", "phone": "+56911111132", "position_zone_id": del_pos.id, "jersey_number": 21, "skill_level": 7, "height": 182, "weight": 76},
            {"name": "Daniel Rojas", "email": "daniel.rojas@santiagounited.cl", "phone": "+56911111133", "position_zone_id": del_pos.id, "jersey_number": 22, "skill_level": 8, "height": 179, "weight": 74},
            {"name": "Andrés Castro", "email": "andres.castro@santiagounited.cl", "phone": "+56911111134", "position_zone_id": del_pos.id, "jersey_number": 23, "skill_level": 6, "height": 181, "weight": 77},
        ]
        
        # Valparaíso FC - 14 jugadores
        valparaiso_players = [
            # Porteros (2)
            {"name": "Luis Martínez", "email": "luis.martinez@valparaisofc.cl", "phone": "+56922222221", "position_zone_id": por_pos.id, "jersey_number": 1, "skill_level": 7, "height": 183, "weight": 78},
            {"name": "Pedro López", "email": "pedro.lopez@valparaisofc.cl", "phone": "+56922222222", "position_zone_id": por_pos.id, "jersey_number": 12, "skill_level": 6, "height": 180, "weight": 75},
            
            # Defensas (5)
            {"name": "Juan Ramírez", "email": "juan.ramirez@valparaisofc.cl", "phone": "+56922222223", "position_zone_id": def_pos.id, "jersey_number": 2, "skill_level": 8, "height": 179, "weight": 76},
            {"name": "Carlos Torres", "email": "carlos.torres@valparaisofc.cl", "phone": "+56922222224", "position_zone_id": def_pos.id, "jersey_number": 3, "skill_level": 7, "height": 177, "weight": 74},
            {"name": "Miguel Sánchez", "email": "miguel.sanchez@valparaisofc.cl", "phone": "+56922222225", "position_zone_id": def_pos.id, "jersey_number": 4, "skill_level": 6, "height": 181, "weight": 77},
            {"name": "Roberto Díaz", "email": "roberto.diaz@valparaisofc.cl", "phone": "+56922222226", "position_zone_id": def_pos.id, "jersey_number": 5, "skill_level": 8, "height": 185, "weight": 80},
            {"name": "Alejandro Ruiz", "email": "alejandro.ruiz@valparaisofc.cl", "phone": "+56922222227", "position_zone_id": def_pos.id, "jersey_number": 6, "skill_level": 7, "height": 178, "weight": 75},
            
            # Centrocampistas (4)
            {"name": "Diego Fernández", "email": "diego.fernandez@valparaisofc.cl", "phone": "+56922222228", "position_zone_id": med_pos.id, "jersey_number": 7, "skill_level": 9, "height": 175, "weight": 70},
            {"name": "Sebastián Morales", "email": "sebastian.morales@valparaisofc.cl", "phone": "+56922222229", "position_zone_id": med_pos.id, "jersey_number": 8, "skill_level": 8, "height": 173, "weight": 68},
            {"name": "Felipe González", "email": "felipe.gonzalez@valparaisofc.cl", "phone": "+56922222230", "position_zone_id": med_pos.id, "jersey_number": 10, "skill_level": 7, "height": 176, "weight": 72},
            {"name": "Nicolás Silva", "email": "nicolas.silva@valparaisofc.cl", "phone": "+56922222231", "position_zone_id": med_pos.id, "jersey_number": 11, "skill_level": 8, "height": 174, "weight": 71},
            
            # Delanteros (3)
            {"name": "Roberto Herrera", "email": "roberto.herrera@valparaisofc.cl", "phone": "+56922222232", "position_zone_id": del_pos.id, "jersey_number": 9, "skill_level": 9, "height": 180, "weight": 75},
            {"name": "Carlos Vega", "email": "carlos.vega@valparaisofc.cl", "phone": "+56922222233", "position_zone_id": del_pos.id, "jersey_number": 20, "skill_level": 8, "height": 178, "weight": 73},
            {"name": "Miguel Castro", "email": "miguel.castro@valparaisofc.cl", "phone": "+56922222234", "position_zone_id": del_pos.id, "jersey_number": 21, "skill_level": 7, "height": 182, "weight": 76},
        ]
        
        print("3. Creando jugadores de Santiago United...")
        santiago_users = []
        for i, player_data in enumerate(santiago_players):
            # Crear usuario
            user_data = UserCreate(
                email=player_data["email"],
                password="123456",
                full_name=player_data["name"],
                phone=player_data["phone"]
            )
            user = create_user(db, user_data)
            user.role = "player"
            santiago_users.append(user)
            
            # Crear jugador
            player = Player(
                user_id=user.id,
                team_id=team1.id,
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
            db.add(player)
            
            if (i + 1) % 5 == 0:
                print(f"   ✅ {i + 1}/{len(santiago_players)} jugadores de Santiago United creados")
        
        print("4. Creando jugadores de Valparaíso FC...")
        valparaiso_users = []
        for i, player_data in enumerate(valparaiso_players):
            # Crear usuario
            user_data = UserCreate(
                email=player_data["email"],
                password="123456",
                full_name=player_data["name"],
                phone=player_data["phone"]
            )
            user = create_user(db, user_data)
            user.role = "player"
            valparaiso_users.append(user)
            
            # Crear jugador
            player = Player(
                user_id=user.id,
                team_id=team2.id,
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
            db.add(player)
            
            if (i + 1) % 5 == 0:
                print(f"   ✅ {i + 1}/{len(valparaiso_players)} jugadores de Valparaíso FC creados")
        
        db.commit()
        
        print("\n🎉 EQUIPOS COMPLETOS CREADOS EXITOSAMENTE!")
        print("=" * 50)
        print(f"🏆 {team1.name}: {len(santiago_players)} jugadores")
        print(f"   👤 Supervisor: {supervisor1.full_name} ({supervisor1.email})")
        print(f"   🔑 Contraseña: supervisor123")
        print()
        print(f"🏆 {team2.name}: {len(valparaiso_players)} jugadores")
        print(f"   👤 Supervisor: {supervisor2.full_name} ({supervisor2.email})")
        print(f"   🔑 Contraseña: supervisor123")
        print()
        print("👥 Todos los jugadores tienen:")
        print("   🔑 Contraseña: 123456")
        print("   👤 Rol: player")
        print("   📧 Email: [nombre]@[equipo].cl")
        print()
        print("📊 RESUMEN:")
        print(f"   • {team1.name}: 24 jugadores + 1 supervisor")
        print(f"   • {team2.name}: 14 jugadores + 1 supervisor")
        print(f"   • Total: 38 jugadores + 2 supervisores")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creando equipos: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    create_complete_teams() 