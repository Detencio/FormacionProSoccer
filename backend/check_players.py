#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Player, Team, User
from app.crud import get_players_by_team, get_teams

def check_players():
    db = SessionLocal()
    try:
        print("=== JUGADORES REGISTRADOS ===")
        players = db.query(Player).all()
        
        if not players:
            print("❌ No hay jugadores registrados en la base de datos")
            return False
            
        for player in players:
            print(f"ID: {player.id}")
            print(f"  Nombre: {player.name}")
            print(f"  Email: {player.email}")
            print(f"  Equipo: {player.team.name if player.team else 'Sin equipo'}")
            print(f"  Posición: {player.position_zone.name_es}")
            print(f"  Nivel: {player.skill_level}/10")
            print(f"  Altura: {player.height}cm")
            print(f"  Peso: {player.weight}kg")
            print("---")
            
        print(f"\n✅ Total de jugadores: {len(players)}")
        return True
        
    except Exception as e:
        print(f"❌ Error al consultar jugadores: {e}")
        return False
    finally:
        db.close()

def check_teams():
    db = SessionLocal()
    try:
        print("\n=== EQUIPOS REGISTRADOS ===")
        teams = get_teams(db, skip=0, limit=100)
        
        if not teams:
            print("❌ No hay equipos registrados en la base de datos")
            return False
            
        for team in teams:
            print(f"ID: {team.id}")
            print(f"  Nombre: {team.name}")
            print(f"  Ciudad: {team.city}")
            print(f"  Jugadores: {len(team.players)}")
            print("---")
            
        print(f"\n✅ Total de equipos: {len(teams)}")
        return True
        
    except Exception as e:
        print(f"❌ Error al consultar equipos: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Verificando datos en la base de datos...")
    print("=" * 50)
    
    has_players = check_players()
    has_teams = check_teams()
    
    if has_players and has_teams:
        print("\n🎉 Base de datos tiene datos válidos para Team-Generator")
    else:
        print("\n⚠️  Faltan datos para usar Team-Generator con jugadores reales") 