@echo off
echo ========================================
echo   LIMPIEZA Y REINICIO DEL DESARROLLO
echo ========================================

echo [1/4] Terminando procesos de Node.js...
taskkill /f /im node.exe >nul 2>&1

echo [2/4] Terminando procesos de Python/Uvicorn...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im uvicorn.exe >nul 2>&1

echo [3/4] Limpiando puertos...
netstat -ano | findstr :3000 >nul 2>&1 && (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
)
netstat -ano | findstr :9000 >nul 2>&1 && (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9000') do taskkill /f /pid %%a >nul 2>&1
)

echo [4/4] Esperando que los procesos se terminen...
timeout /t 3 /nobreak >nul

echo ========================================
echo   REINICIANDO SERVICIOS
echo ========================================
call start-simple.bat 