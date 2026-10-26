#!/bin/bash

echo "========================================================"
echo "⚡ Starting AWS Lambda & CloudWatch Simulator Full-Stack"
echo "========================================================"

# Directory paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📂 Project root: $PROJECT_ROOT"

# Check Python environment
if command -v python3 &>/dev/null; then
    PYTHON_BIN="python3"
else
    PYTHON_BIN="python"
fi

echo "🐍 Using Python binary: $($PYTHON_BIN --version)"

# Install Python backend dependencies if needed
echo "📦 Checking Python dependencies..."
$PYTHON_BIN -m pip install -r "$PROJECT_ROOT/backend/requirements.txt" &>/dev/null || true

# Start Flask backend in background
echo "🚀 Starting Flask API backend on http://localhost:5001..."
PYTHONPATH="$PROJECT_ROOT" $PYTHON_BIN "$PROJECT_ROOT/backend/app.py" &
BACKEND_PID=$!

# Trap signals to kill backend process on exit
trap "kill $BACKEND_PID 2>/dev/null || true" EXIT

sleep 2

# Check Node environment
echo "💻 Starting Vite Frontend development server..."
cd "$PROJECT_ROOT"

if command -v npm &>/dev/null; then
    VITE_API_URL=http://localhost:5001 npm run dev
else
    echo "❌ npm not found. Please run 'npm run dev' or 'npx vite' manually."
fi
