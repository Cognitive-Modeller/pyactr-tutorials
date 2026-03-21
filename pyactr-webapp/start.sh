#!/bin/bash

echo "🚀 Starting PyACT-R Tutorial Web App..."

# Check if Docker is installed
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✅ Docker detected. Starting with Docker Compose..."
    docker-compose up
else
    echo "📦 Docker not found. Starting services manually..."

    # Start backend
    echo "Starting backend server..."
    cd backend
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload &
    BACKEND_PID=$!
    cd ..

    # Start frontend
    echo "Starting frontend..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    npm run dev &
    FRONTEND_PID=$!
    cd ..

    echo "✅ Services started!"
    echo "Frontend: http://localhost:5173"
    echo "Backend: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop..."

    # Wait for interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID" INT
    wait
fi