@echo off
echo ========================================
echo    LIMPIEZA DE PUERTOS Y PROCESOS
echo ========================================
echo.

echo Limpiando todos los puertos y procesos relacionados...
echo.

REM Limpiar puerto 3000 (Frontend)
echo [1/6] Limpiando puerto 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Terminando proceso PID: %%a
    taskkill /f /pid %%a >nul 2>&1
)

REM Limpiar puerto 9000 (Backend)
echo [2/6] Limpiando puerto 9000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :9000') do (
    echo Terminando proceso PID: %%a
    taskkill /f /pid %%a >nul 2>&1
)

REM Limpiar otros puertos comunes de desarrollo
echo [3/6] Limpiando puertos adicionales...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo Terminando proceso PID: %%a (puerto 3001)
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do (
    echo Terminando proceso PID: %%a (puerto 3002)
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    echo Terminando proceso PID: %%a (puerto 8000)
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do (
    echo Terminando proceso PID: %%a (puerto 8001)
    taskkill /f /pid %%a >nul 2>&1
)

REM Limpiar procesos de Node.js
echo [4/6] Limpiando procesos de Node.js...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.cmd >nul 2>&1
taskkill /f /im npx.cmd >nul 2>&1

REM Limpiar procesos de Python/Uvicorn
echo [5/6] Limpiando procesos de Python/Uvicorn...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im uvicorn.exe >nul 2>&1

echo [6/6] Esperando que los procesos se terminen...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    LIMPIEZA COMPLETADA
echo ========================================
echo.
echo Puertos liberados:
echo - 3000 (Frontend)
echo - 9000 (Backend)
echo - 3001, 3002 (Puertos adicionales)
echo - 8000, 8001 (Puertos adicionales)
echo.
echo Procesos terminados:
echo - Node.js
echo - Python/Uvicorn
echo.
echo Ahora puedes ejecutar start-final.bat sin problemas.
echo.
pause 