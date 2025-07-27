# Script final automatizado para iniciar servidores de FormacionProSoccer
Write-Host "Iniciando servidores de FormacionProSoccer..." -ForegroundColor Green

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Función para esperar a que un puerto esté disponible
function Wait-ForPort {
    param([int]$Port, [int]$TimeoutSeconds = 30)
    $startTime = Get-Date
    while ((Get-Date) -lt ($startTime.AddSeconds($TimeoutSeconds))) {
        if (Test-Port -Port $Port) {
            return $true
        }
        Start-Sleep -Seconds 1
    }
    return $false
}

# Función para matar procesos en un puerto específico
function Stop-ProcessOnPort {
    param([int]$Port)
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | ForEach-Object { $_.OwningProcess }
    foreach ($processId in $processes) {
        try {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Write-Host "Proceso $processId terminado en puerto $Port" -ForegroundColor Yellow
        }
        catch {
            Write-Host "No se pudo terminar el proceso $processId" -ForegroundColor Red
        }
    }
}

# Limpiar puertos si están en uso
Write-Host "Limpiando puertos..." -ForegroundColor Yellow
if (Test-Port -Port 9000) {
    Write-Host "Puerto 9000 en uso, terminando proceso..." -ForegroundColor Yellow
    Stop-ProcessOnPort -Port 9000
}
if (Test-Port -Port 3000) {
    Write-Host "Puerto 3000 en uso, terminando proceso..." -ForegroundColor Yellow
    Stop-ProcessOnPort -Port 3000
}

# Esperar un momento para que los puertos se liberen
Start-Sleep -Seconds 2

# Iniciar Backend
Write-Host "Iniciando Backend (puerto 9000)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\daten\Documents\FormacionProSoccer\backend"
    & "C:\Users\daten\Documents\FormacionProSoccer\backend\venv\Scripts\Activate.ps1"
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 9000
}

# Esperar a que el backend esté listo
Write-Host "Esperando que el backend esté listo..." -ForegroundColor Yellow
if (Wait-ForPort -Port 9000 -TimeoutSeconds 30) {
    Write-Host "Backend iniciado correctamente en puerto 9000" -ForegroundColor Green
} else {
    Write-Host "Error: Backend no se inició correctamente" -ForegroundColor Red
    exit 1
}

# Iniciar Frontend
Write-Host "Iniciando Frontend (puerto 3000)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\daten\Documents\FormacionProSoccer"
    npm run dev
}

# Esperar a que el frontend esté listo
Write-Host "Esperando que el frontend esté listo..." -ForegroundColor Yellow
if (Wait-ForPort -Port 3000 -TimeoutSeconds 60) {
    Write-Host "Frontend iniciado correctamente en puerto 3000" -ForegroundColor Green
} else {
    Write-Host "Error: Frontend no se inició correctamente" -ForegroundColor Red
    exit 1
}

# Mostrar estado final
Write-Host ""
Write-Host "Servidores iniciados correctamente!" -ForegroundColor Green
Write-Host "Estado de los servidores:" -ForegroundColor White
Write-Host "   Backend:  http://localhost:9000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   API Docs: http://localhost:9000/docs" -ForegroundColor Cyan

Write-Host ""
Write-Host "Para detener los servidores, presiona Ctrl+C" -ForegroundColor Yellow

# Mantener el script ejecutándose
try {
    while ($true) {
        Start-Sleep -Seconds 10
        
        # Verificar que ambos servidores sigan funcionando
        $backendRunning = Test-Port -Port 9000
        $frontendRunning = Test-Port -Port 3000
        
        if (-not $backendRunning) {
            Write-Host "Backend se detuvo inesperadamente" -ForegroundColor Red
        }
        if (-not $frontendRunning) {
            Write-Host "Frontend se detuvo inesperadamente" -ForegroundColor Red
        }
        
        if ($backendRunning -and $frontendRunning) {
            Write-Host "Ambos servidores funcionando correctamente" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host ""
    Write-Host "Deteniendo servidores..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "Servidores detenidos" -ForegroundColor Green
} 