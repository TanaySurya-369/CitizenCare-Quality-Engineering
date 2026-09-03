# CitizenCare PowerShell Installation Script
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    Installing CitizenCare Full-Stack & QA Platform" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host "`n[1/3] Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host "`n[2/3] Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "`n[3/3] Installing Automation Framework Dependencies..." -ForegroundColor Yellow
Set-Location automation
npm install
Set-Location ..

Write-Host "`nGenerating Prisma Database & Seeding Civic Data..." -ForegroundColor Green
Set-Location backend
npx prisma db push
npm run prisma:seed
Set-Location ..

Write-Host "`n✔ CitizenCare Installation Completed Successfully!" -ForegroundColor Green
