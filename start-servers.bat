@echo off
echo Iniciando servidores de FormacionProSoccer...
echo.

echo Iniciando Backend (FastAPI)...
start "Backend" cmd /k "cd backend && .\venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Esperando 3 segundos...
timeout /t 3 /nobreak > nul

echo Iniciando Frontend (Next.js)...
start "Frontend" cmd /k "npm run dev"

echo.
echo Servidores iniciados:
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:3001
echo - Documentacion: http://localhost:8000/docs
echo - Debug: http://localhost:3001/debug
echo.
echo Credenciales de prueba:
echo - Email: admin@prosoccer.com
echo - Password: 123456
echo.
pause 