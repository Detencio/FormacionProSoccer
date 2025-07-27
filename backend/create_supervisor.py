#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, Team
from app.crud import create_user
from app.schemas import UserCreate
from app.crud import pwd_context

def create_supervisor():
    db = SessionLocal()
    try:
        print("Creando usuario supervisor para Matiz FC...")
        
        # Obtener el equipo Matiz FC
        team = db.query(Team).filter(Team.name == "Matiz FC").first()
        if not team:
            print("❌ Error: No se encontró el equipo Matiz FC")
            return False
        
        # Crear usuario supervisor
        supervisor_data = UserCreate(
            email="supervisor@matizfc.com",
            password="supervisor123",
            full_name="Supervisor Matiz FC",
            phone="+56987654321"
        )
        
        # Verificar si el supervisor ya existe
        existing_supervisor = db.query(User).filter(User.email == supervisor_data.email).first()
        if existing_supervisor:
            print(f"⚠️  Supervisor ya existe: {existing_supervisor.email}")
            # Actualizar rol y equipo
            existing_supervisor.role = "supervisor"
            existing_supervisor.team_id = team.id
            existing_supervisor.is_admin = False
            existing_supervisor.is_player = False
            db.commit()
            print(f"✅ Supervisor actualizado: {existing_supervisor.email} -> supervisor (equipo: {team.name})")
            return True
        
        # Crear nuevo supervisor
        user = create_user(db, supervisor_data)
        user.role = "supervisor"
        user.team_id = team.id
        user.is_admin = False
        user.is_player = False
        
        db.commit()
        print(f"✅ Supervisor creado: {user.email} -> supervisor (equipo: {team.name})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creando supervisor: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Creando usuario supervisor para Matiz FC...")
    print("=" * 50)
    
    if create_supervisor():
        print("\n✅ Supervisor creado exitosamente")
        print("Credenciales:")
        print("- Email: supervisor@matizfc.com")
        print("- Password: supervisor123")
        print("- Rol: supervisor")
        print("- Equipo: Matiz FC")
    else:
        print("\n❌ Error creando supervisor") 