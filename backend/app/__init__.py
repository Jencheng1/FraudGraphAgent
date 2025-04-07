from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import neo4j, rasa, langgraph

# Import main app models and routes
from app.main import app

# Include routers
app.include_router(neo4j.router)
app.include_router(rasa.router)
app.include_router(langgraph.router)

# Add CORS middleware if not already added in main.py
if not any(isinstance(middleware, CORSMiddleware) for middleware in app.user_middleware):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
