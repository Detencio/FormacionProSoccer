#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.crud import create_admin_user

def main():
    db = SessionLocal()
    try:
        # Crear usuario admin
        admin_user = create_admin_user(
            db, 
            email="admin@prosoccer.com", 
            password="123456", 
            full_name="Administrador"
        )
        print(f"✅ Usuario admin creado exitosamente:")
        print(f"   Email: {admin_user.email}")
        print(f"   Nombre: {admin_user.full_name}")
        print(f"   Es admin: {admin_user.is_admin}")
        
    except Exception as e:
        print(f"❌ Error creando usuario admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main() 