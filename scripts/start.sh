#!/usr/bin/env bash
# CitizenCare Development Servers Startup Script

echo "Starting CitizenCare Backend on http://localhost:5000..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "Starting CitizenCare Frontend on http://localhost:5173..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "CitizenCare is running!"
echo "Backend API: http://localhost:5000/api"
echo "Frontend App: http://localhost:5173"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
