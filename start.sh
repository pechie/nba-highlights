#!/bin/bash

cleanup() {
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

cd "$(dirname "$0")"

if [ ! -d "backend/.venv" ]; then
  echo "Setting up backend..."
  python3 -m venv backend/.venv
  backend/.venv/bin/python3 -m pip install -r backend/requirements.txt
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Setting up frontend..."
  (cd frontend && npm install)
fi

echo "Starting backend..."
(cd backend && .venv/bin/python3 -m uvicorn main:app --reload) &
BACKEND_PID=$!

echo "Starting frontend..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both servers."

wait
