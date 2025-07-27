@echo off
echo Iniciando servidores de FormacionProSoccer...
echo.

echo Iniciando Backend (FastAPI)...
start "Backend" cmd /k "cd backend && .\venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak > nul

echo Iniciando Frontend (Next.js)...
start "Frontend" cmd /k "npm run dev"

echo.
echo Servidores iniciados en ventanas separadas:
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:3000
echo - Documentacion: http://localhost:8000/docs
echo.
echo Credenciales de prueba:
echo - Email: admin@prosoccer.com
echo - Password: 123456
echo.
echo Los servidores estan corriendo en ventanas separadas.
echo Cierra esta ventana cuando quieras.
pause 