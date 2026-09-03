#!/usr/bin/env bash
# CitizenCare Automated Full-Suite Test Runner
set -e

echo "===================================================="
echo "    Executing CitizenCare Quality Engineering Suite"
echo "===================================================="

echo "`n[1/4] Running Backend TDD Unit Tests..."
cd backend && npm test && cd ..

echo "`n[2/4] Running SuperTest REST API Tests..."
cd automation && npm run test:api && cd ..

echo "`n[3/4] Running SQL Database Validation Tests..."
cd automation && npm run test:db && cd ..

echo "`n[4/4] Running Complete E2E Lifecycle Journey..."
cd automation && npm run test:e2e && cd ..

echo "===================================================="
echo "    ✔ 100% Quality Gates Passed! All Tests Succeeded."
echo "===================================================="
