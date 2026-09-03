# CitizenCare PowerShell Launch Script
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    Launching CitizenCare Development Services" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host "Starting Backend API on http://localhost:5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/../backend'; npm run dev"

Write-Host "Starting Frontend Client on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/../frontend'; npm run dev"

Write-Host "`n✔ CitizenCare Services Launched in background windows!" -ForegroundColor Cyan
Write-Host "Frontend Portal: http://localhost:5173"
Write-Host "Backend REST API: http://localhost:5000/api"
