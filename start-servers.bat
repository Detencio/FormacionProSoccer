@echo off
echo ========================================
echo    FormacionProSoccer - Servidores
echo ========================================
echo.

echo Iniciando Backend (FastAPI)...
start "Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Esperando 3 segundos para que el backend inicie...
timeout /t 3 /nobreak > nul

echo.
echo Iniciando Frontend (Next.js)...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Servidores iniciados:
echo    - Backend: http://localhost:8000
echo    - Frontend: http://localhost:3000
echo    - API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul 