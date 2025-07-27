@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    FORMACION PROSOCCER - TEAM GENERATOR
echo ========================================
echo.
echo ¿Deseas limpiar puertos y procesos antes de iniciar?
echo 1. Sí, limpiar todo (recomendado)
echo 2. No, continuar directamente
echo.
set /p choice="Selecciona una opción (1 o 2): "

if "!choice!"=="1" (
    echo.
    echo Limpiando puertos y procesos anteriores...
    echo.
    
    REM Limpiar puerto 3000 (Frontend)
    echo [1/5] Limpiando puerto 3000 (Frontend)...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
        echo Terminando proceso PID: %%a
        taskkill /f /pid %%a >nul 2>&1
    )
    
    REM Limpiar puerto 9000 (Backend)
    echo [2/5] Limpiando puerto 9000 (Backend)...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :9000') do (
        echo Terminando proceso PID: %%a
        taskkill /f /pid %%a >nul 2>&1
    )
    
    REM Limpiar procesos de Node.js
    echo [3/5] Limpiando procesos de Node.js...
    taskkill /f /im node.exe >nul 2>&1
    taskkill /f /im npm.cmd >nul 2>&1
    
    REM Limpiar procesos de Python/Uvicorn
    echo [4/5] Limpiando procesos de Python/Uvicorn...
    taskkill /f /im python.exe >nul 2>&1
    taskkill /f /im uvicorn.exe >nul 2>&1
    
    echo [5/5] Esperando que los procesos se terminen...
    timeout /t 3 /nobreak >nul
) else (
    echo.
    echo Continuando sin limpieza...
    echo.
)

echo.
echo Iniciando servidores con jugadores reales...
echo.

echo [1/4] Verificando puertos libres...
netstat -an | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 3000 aún ocupado, esperando...
    timeout /t 2 /nobreak >nul
)

netstat -an | findstr ":9000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 9000 aún ocupado, esperando...
    timeout /t 2 /nobreak >nul
)

echo [2/4] Iniciando Backend (puerto 9000)...
cd backend
call venv\Scripts\activate.bat
start "Backend - Team Generator" cmd /k "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 9000"

echo [3/4] Iniciando Frontend (puerto 3000)...
cd ..
start "Frontend - Team Generator" cmd /k "npm run dev"

echo [4/4] Esperando que los servidores esten listos...
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo    SERVICIOS INICIADOS CORRECTAMENTE
echo ========================================
echo.
echo Backend API:  http://localhost:9000
echo Frontend:     http://localhost:3000
echo Team Generator: http://localhost:3000/team-generator
echo API Docs:     http://localhost:9000/docs
echo.
echo Los jugadores reales de Matiz FC estan disponibles:
echo - Danilo Atencio (DEF, #6, Nivel 8)
echo - Palito'S (DEF, #4, Nivel 7)
echo - NachoToro (MED, #11, Nivel 8)
echo - Chalo G (DEL, #9, Nivel 9)
echo - Alex (DEF, #3, Nivel 7)
echo - Zear (POR, #1, Nivel 8)
echo - Diego (DEF, #2, Nivel 6)
echo - Asmatiz (MED, #8, Nivel 7)
echo - Chask (POR, #12, Nivel 7)
echo - Jonthan (MED, #10, Nivel 8)
echo - Nico Payo (DEL, #7, Nivel 8)
echo - Reyse Montana (DEF, #5, Nivel 7)
echo - Galleta 1 (MED, #14, Nivel 6)
echo - Galleta 2 (MED, #15, Nivel 6)
echo.
echo Total: 14 jugadores reales + 5 de prueba = 19 jugadores
echo.
echo ========================================
echo    ROLES Y PERMISOS DEL SISTEMA
echo ========================================
echo.
echo ADMINISTRADOR:
echo - Email: admin@prosoccer.com
echo - Password: admin123
echo - Puede ver todos los equipos y jugadores
echo - Puede generar equipos con filtro opcional
echo.
echo SUPERVISOR MATIZ FC:
echo - Email: supervisor@matizfc.com
echo - Password: supervisor123
echo - Solo ve jugadores de Matiz FC
echo - No necesita filtro de equipo
echo.
echo JUGADOR:
echo - Solo ve jugadores de su equipo
echo - No puede generar equipos
echo.
echo INVITADO:
echo - No puede acceder al Team Generator
echo.
echo ========================================
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause

echo Abriendo Team Generator en el navegador...
start http://localhost:3000/team-generator

echo.
echo Script completado. Los servidores continuan ejecutandose.
echo Para detener los servidores, cierra las ventanas de comandos.
echo.
echo Si tienes problemas con puertos ocupados, ejecuta:
echo - kill-ports.bat (limpieza completa)
echo - start-final-fixed.bat (reinicio con limpieza)
echo.
pause 