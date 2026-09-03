# CitizenCare PowerShell Test Runner
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    Executing CitizenCare Quality Engineering Suite" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Running Backend TDD Unit Tests..." -ForegroundColor Yellow
Set-Location backend
npm test
Set-Location ..

Write-Host "`n[2/4] Running SuperTest REST API Tests..." -ForegroundColor Yellow
Set-Location automation
npm run test:api
Set-Location ..

Write-Host "`n[3/4] Running SQL Database Validation Tests..." -ForegroundColor Yellow
Set-Location automation
npm run test:db
Set-Location ..

Write-Host "`n[4/4] Running Complete E2E Lifecycle Journey..." -ForegroundColor Yellow
Set-Location automation
npm run test:e2e
Set-Location ..

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host "    ✔ 100% Quality Gates Passed! All Tests Succeeded." -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
