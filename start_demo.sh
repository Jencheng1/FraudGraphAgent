#!/bin/bash

# Start the backend server
echo "Starting FastAPI backend server..."
cd /home/ubuntu/fraud_analysis_system/backend
python main.py &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start the frontend development server
echo "Starting React frontend development server..."
cd /home/ubuntu/fraud_analysis_system/frontend/fraud-analysis-ui
npm start &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM

echo "Both servers are running!"
echo "Backend API is available at: http://localhost:8000"
echo "Frontend is available at: http://localhost:3000"
echo "Press Ctrl+C to stop both servers."

# Keep the script running
wait
