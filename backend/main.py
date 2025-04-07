from fastapi import FastAPI
import uvicorn

if __name__ == "__main__":
    # Import the app from the app module
    from app import app
    
    # Run the FastAPI application with Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
