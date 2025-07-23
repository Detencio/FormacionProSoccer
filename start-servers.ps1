# FormacionProSoccer - Script de Inicio de Servidores
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FormacionProSoccer - Servidores" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Verificar si los puertos están disponibles
if (Test-Port 8000) {
    Write-Host "⚠️  Puerto 8000 (Backend) ya está en uso" -ForegroundColor Yellow
}
if (Test-Port 3000) {
    Write-Host "⚠️  Puerto 3000 (Frontend) ya está en uso" -ForegroundColor Yellow
}

Write-Host "Iniciando Backend (FastAPI)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal

Write-Host "Esperando 3 segundos para que el backend inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Iniciando Frontend (Next.js)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Servidores iniciados:" -ForegroundColor Cyan
Write-Host "    - Backend: http://localhost:8000" -ForegroundColor White
Write-Host "    - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "    - API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor Yellow
Write-Host "  Email: admin@prosoccer.com" -ForegroundColor White
Write-Host "  Password: 123456" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 