#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from app.models import Base, User, Team
from sqlalchemy import text

def migrate_roles():
    db = SessionLocal()
    try:
        print("Migrando roles y equipos en la base de datos...")
        
        # Verificar si las columnas ya existen
        inspector = db.get_bind().dialect.inspector(db.get_bind())
        columns = [col['name'] for col in inspector.get_columns('users')]
        
        if 'role' not in columns:
            print("Agregando columna 'role'...")
            db.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'player'"))
            print("✅ Columna 'role' agregada")
        else:
            print("✅ Columna 'role' ya existe")
            
        if 'team_id' not in columns:
            print("Agregando columna 'team_id'...")
            db.execute(text("ALTER TABLE users ADD COLUMN team_id INTEGER REFERENCES teams(id)"))
            print("✅ Columna 'team_id' agregada")
        else:
            print("✅ Columna 'team_id' ya existe")
        
        # Actualizar usuarios existentes
        print("\nActualizando roles de usuarios existentes...")
        
        # Obtener el primer equipo (Matiz FC)
        team = db.query(Team).first()
        if team:
            print(f"Equipo encontrado: {team.name}")
            
            # Actualizar usuarios existentes
            users = db.query(User).all()
            for user in users:
                if user.is_admin:
                    user.role = "admin"
                    print(f"✅ Usuario {user.email} -> admin")
                elif user.is_player:
                    user.role = "player"
                    # Asignar equipo si no tiene uno
                    if not user.team_id and team:
                        user.team_id = team.id
                        print(f"✅ Usuario {user.email} -> player (equipo: {team.name})")
                    else:
                        print(f"✅ Usuario {user.email} -> player")
                else:
                    user.role = "guest"
                    print(f"✅ Usuario {user.email} -> guest")
        
        db.commit()
        print("\n🎉 Migración completada exitosamente")
        
        # Mostrar resumen
        print("\n=== RESUMEN DE USUARIOS ===")
        users = db.query(User).all()
        for user in users:
            team_name = user.team.name if user.team else "Sin equipo"
            print(f"- {user.email}: {user.role} (Equipo: {team_name})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en la migración: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Migrando roles y equipos en FormacionProSoccer...")
    print("=" * 60)
    
    if migrate_roles():
        print("\n✅ Migración completada")
        print("Ahora el sistema soporta roles: admin, supervisor, player, guest")
    else:
        print("\n❌ Error en la migración") 