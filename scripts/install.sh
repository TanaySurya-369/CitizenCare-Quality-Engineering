#!/usr/bin/env bash
# CitizenCare Automated Installation Script
set -e

echo "===================================================="
echo "    Installing CitizenCare Full-Stack & QA Platform"
echo "===================================================="

echo "[1/3] Installing Backend Dependencies..."
cd backend && npm install && cd ..

echo "[2/3] Installing Frontend Dependencies..."
cd frontend && npm install && cd ..

echo "[3/3] Installing Automation Framework Dependencies..."
cd automation && npm install && cd ..

echo "Generating Prisma Client and Seeding Initial Civic Data..."
cd backend
npx prisma db push
npm run prisma:seed
cd ..

echo "===================================================="
echo "    ✔ CitizenCare Installation Completed Successfully!"
echo "===================================================="
