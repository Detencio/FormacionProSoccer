@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   VALIDACION DE DEPENDENCIAS - FPS
echo ========================================
echo.

:: Configuración de colores
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

:: Variables de estado
set "FRONTEND_OK=0"
set "BACKEND_OK=0"
set "NODE_OK=0"
set "PYTHON_OK=0"
set "PORTS_OK=0"
set "TOTAL_TESTS=0"
set "PASSED_TESTS=0"

echo %BLUE%[1/8] Verificando Node.js y npm...%RESET%
call :test_node
echo.

echo %BLUE%[2/8] Verificando Python y pip...%RESET%
call :test_python
echo.

echo %BLUE%[3/8] Verificando dependencias del Frontend...%RESET%
call :test_frontend_deps
echo.

echo %BLUE%[4/8] Verificando dependencias del Backend...%RESET%
call :test_backend_deps
echo.

echo %BLUE%[5/8] Verificando configuración de Tailwind...%RESET%
call :test_tailwind_config
echo.

echo %BLUE%[6/8] Verificando puertos disponibles...%RESET%
call :test_ports
echo.

echo %BLUE%[7/8] Verificando archivos críticos...%RESET%
call :test_critical_files
echo.

echo %BLUE%[8/8] Verificando vulnerabilidades...%RESET%
call :test_vulnerabilities
echo.

:: Mostrar resumen
echo ========================================
echo   RESUMEN DE VALIDACION
echo ========================================
echo.
echo %BLUE%Tests ejecutados:%RESET% %TOTAL_TESTS%
echo %GREEN%Tests exitosos:%RESET% %PASSED_TESTS%
set /a "FAILED_TESTS=%TOTAL_TESTS%-%PASSED_TESTS%"
if %FAILED_TESTS% gtr 0 (
    echo %RED%Tests fallidos:%RESET% %FAILED_TESTS%
) else (
    echo %GREEN%Tests fallidos:%RESET% 0
)
echo.

if %FAILED_TESTS% equ 0 (
    echo %GREEN%✅ TODAS LAS VALIDACIONES EXITOSAS%RESET%
    echo %GREEN%El proyecto está listo para desarrollo%RESET%
) else (
    echo %RED%❌ SE ENCONTRARON PROBLEMAS%RESET%
    echo %YELLOW%Revisa los errores arriba y corrígelos%RESET%
)
echo.

pause
goto :eof

:: ========================================
:: FUNCIONES DE VALIDACION
:: ========================================

:test_node
set /a "TOTAL_TESTS+=1"
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%  ✅ Node.js instalado%RESET%
    set /a "NODE_OK=1"
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ Node.js no encontrado%RESET%
    set /a "NODE_OK=0"
)

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%  ✅ npm instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ npm no encontrado%RESET%
)
set /a "TOTAL_TESTS+=1"
goto :eof

:test_python
set /a "TOTAL_TESTS+=1"
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%  ✅ Python instalado%RESET%
    set /a "PYTHON_OK=1"
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ Python no encontrado%RESET%
    set /a "PYTHON_OK=0"
)

set /a "TOTAL_TESTS+=1"
pip --version >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%  ✅ pip instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ pip no encontrado%RESET%
)
goto :eof

:test_frontend_deps
if not exist "package.json" (
    echo %RED%  ❌ package.json no encontrado%RESET%
    goto :eof
)

set /a "TOTAL_TESTS+=1"
if exist "node_modules" (
    echo %GREEN%  ✅ node_modules existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %YELLOW%  ⚠️ node_modules no encontrado%RESET%
    echo %YELLOW%     Ejecuta: npm install%RESET%
)

:: Verificar dependencias críticas
set /a "TOTAL_TESTS+=1"
if exist "node_modules\next" (
    echo %GREEN%  ✅ Next.js instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ Next.js no instalado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "node_modules\@tanstack\react-query" (
    echo %GREEN%  ✅ @tanstack/react-query instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ @tanstack/react-query no instalado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "node_modules\recharts" (
    echo %GREEN%  ✅ recharts instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ recharts no instalado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "node_modules\react-icons" (
    echo %GREEN%  ✅ react-icons instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ react-icons no instalado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "node_modules\tailwindcss-animate" (
    echo %GREEN%  ✅ tailwindcss-animate instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ tailwindcss-animate no instalado%RESET%
)
goto :eof

:test_backend_deps
if not exist "backend\requirements.txt" (
    echo %RED%  ❌ requirements.txt no encontrado%RESET%
    goto :eof
)

set /a "TOTAL_TESTS+=1"
if exist "backend\venv" (
    echo %GREEN%  ✅ Entorno virtual existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %YELLOW%  ⚠️ Entorno virtual no encontrado%RESET%
    echo %YELLOW%     Ejecuta: python -m venv backend\venv%RESET%
)

:: Verificar dependencias críticas del backend
set /a "TOTAL_TESTS+=1"
if exist "backend\venv\Lib\site-packages\fastapi" (
    echo %GREEN%  ✅ FastAPI instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ FastAPI no instalado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "backend\venv\Lib\site-packages\sqlalchemy" (
    echo %GREEN%  ✅ SQLAlchemy instalado%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ SQLAlchemy no instalado%RESET%
)
goto :eof

:test_tailwind_config
set /a "TOTAL_TESTS+=1"
if exist "tailwind.config.js" (
    echo %GREEN%  ✅ tailwind.config.js existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ tailwind.config.js no encontrado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "postcss.config.js" (
    echo %GREEN%  ✅ postcss.config.js existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ postcss.config.js no encontrado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "src\app\globals.css" (
    echo %GREEN%  ✅ globals.css existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ globals.css no encontrado%RESET%
)
goto :eof

:test_ports
set /a "TOTAL_TESTS+=1"
netstat -an | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo %YELLOW%  ⚠️ Puerto 3000 ocupado%RESET%
) else (
    echo %GREEN%  ✅ Puerto 3000 disponible%RESET%
    set /a "PASSED_TESTS+=1"
)

set /a "TOTAL_TESTS+=1"
netstat -an | findstr ":9000" >nul
if %errorlevel% equ 0 (
    echo %YELLOW%  ⚠️ Puerto 9000 ocupado%RESET%
) else (
    echo %GREEN%  ✅ Puerto 9000 disponible%RESET%
    set /a "PASSED_TESTS+=1"
)
goto :eof

:test_critical_files
set /a "TOTAL_TESTS+=1"
if exist "next.config.js" (
    echo %GREEN%  ✅ next.config.js existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ next.config.js no encontrado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "tsconfig.json" (
    echo %GREEN%  ✅ tsconfig.json existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ tsconfig.json no encontrado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "src\app\layout.tsx" (
    echo %GREEN%  ✅ layout.tsx existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ layout.tsx no encontrado%RESET%
)

set /a "TOTAL_TESTS+=1"
if exist "backend\app\main.py" (
    echo %GREEN%  ✅ main.py existe%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %RED%  ❌ main.py no encontrado%RESET%
)
goto :eof

:test_vulnerabilities
set /a "TOTAL_TESTS+=1"
npm audit --audit-level=moderate >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%  ✅ Sin vulnerabilidades críticas%RESET%
    set /a "PASSED_TESTS+=1"
) else (
    echo %YELLOW%  ⚠️ Vulnerabilidades encontradas%RESET%
    echo %YELLOW%     Ejecuta: npm audit fix%RESET%
)
goto :eof 