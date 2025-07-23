# Backend FastAPI para Formación ProSoccer

## Instalación
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # En Windows
pip install -r requirements.txt
```

## Ejecución
```bash
uvicorn app.main:app --reload
```

## Variables de entorno
Crea un archivo `.env` en la carpeta backend con:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/prosoccer
SECRET_KEY=un_clave_secreta
```

## Endpoints principales
- POST `/register` — Registro de usuario
- POST `/login` — Login (devuelve JWT)
- GET `/me` — Usuario autenticado (requiere JWT)

## Notas
- Cambia los valores de conexión a PostgreSQL según tu configuración.
- La API está lista para conectar con tu frontend Next.js.
