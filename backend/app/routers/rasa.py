from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import json
import uuid
from datetime import datetime

# Mock RASA integration
# In a real implementation, this would connect to a RASA NLU service

router = APIRouter(
    prefix="/api/rasa",
    tags=["rasa"],
    responses={404: {"description": "Not found"}},
)

class UserMessage(BaseModel):
    text: str
    sender_id: Optional[str] = None

class Intent(BaseModel):
    name: str
    confidence: float

class Entity(BaseModel):
    entity: str
    value: str
    start: int
    end: int
    confidence: Optional[float] = None

class RasaResponse(BaseModel):
    text: str
    intent: Intent
    entities: List[Entity]
    confidence: float
    sender_id: Optional[str] = None
    timestamp: datetime

# Mock intents and entities for fraud analysis
mock_intents = {
    "greet": ["hello", "hi", "hey", "good morning", "good afternoon"],
    "goodbye": ["bye", "goodbye", "see you", "talk to you later"],
    "help": ["help", "help me", "i need help", "what can you do"],
    "find_fraud": ["find fraud", "detect fraud", "identify fraud", "show fraud"],
    "find_accounts_with_same_ip": ["find accounts with same ip", "accounts sharing ip", "same ip multiple accounts", "ip address shared"],
    "analyze_pattern": ["analyze", "analyze pattern", "explain pattern", "why is this fraud"],
    "show_graph": ["show graph", "display graph", "visualize", "show visualization", "graph view"]
}

# Mock entity extraction
def extract_entities(text):
    entities = []
    
    # IP address entity
    if "192.168.1.100" in text:
        start = text.find("192.168.1.100")
        entities.append({
            "entity": "ip_address",
            "value": "192.168.1.100",
            "start": start,
            "end": start + len("192.168.1.100"),
            "confidence": 0.95
        })
    
    # Time period entity
    for time_period in ["today", "yesterday", "last week", "last month"]:
        if time_period in text:
            start = text.find(time_period)
            entities.append({
                "entity": "time_period",
                "value": time_period,
                "start": start,
                "end": start + len(time_period),
                "confidence": 0.9
            })
    
    return entities

# Find the most likely intent
def classify_intent(text):
    text_lower = text.lower()
    best_intent = "fallback"
    best_score = 0
    
    for intent, phrases in mock_intents.items():
        for phrase in phrases:
            if phrase in text_lower:
                score = len(phrase) / len(text_lower)  # Simple scoring based on phrase length
                if score > best_score:
                    best_score = score
                    best_intent = intent
    
    # Default to a minimum confidence
    confidence = max(best_score, 0.6)
    
    return {
        "name": best_intent,
        "confidence": confidence
    }

# Generate response based on intent
def generate_response(intent, entities):
    responses = {
        "greet": "Hello! I'm your fraud analysis assistant. How can I help you today?",
        "goodbye": "Goodbye! Feel free to come back if you need more fraud analysis.",
        "help": "I can help you analyze potential fraud patterns. Try asking about accounts sharing the same IP address.",
        "find_fraud": "I'm searching for fraud patterns in the data. Would you like to see accounts with the same IP address?",
        "find_accounts_with_same_ip": "I found 3 accounts sharing the IP address 192.168.1.100. This appears to be a suspicious pattern.",
        "analyze_pattern": "Based on my analysis, accounts user123, johndoe, and alice_smith are likely fraudulent as they share the same IP address and were created within minutes of each other.",
        "show_graph": "Displaying the fraud graph visualization for accounts with shared IP addresses.",
        "fallback": "I'm not sure I understand. Try asking about fraud patterns or accounts with the same IP."
    }
    
    response = responses.get(intent["name"], responses["fallback"])
    
    # Customize response based on entities
    if entities and intent["name"] == "find_accounts_with_same_ip":
        ip_entities = [e for e in entities if e["entity"] == "ip_address"]
        if ip_entities:
            ip = ip_entities[0]["value"]
            if ip == "192.168.1.100":
                response = f"I found 3 accounts sharing the IP address {ip}. This appears to be a suspicious pattern."
            else:
                response = f"I didn't find any suspicious activity for IP address {ip}."
    
    return response

# API routes
@router.get("/", response_model=Dict[str, str])
async def rasa_status():
    return {"status": "running", "version": "3.6.2"}

@router.post("/parse", response_model=RasaResponse)
async def parse_message(message: UserMessage):
    # Extract intent and entities
    intent = classify_intent(message.text)
    entities = extract_entities(message.text)
    
    # Generate response
    response_text = generate_response(intent, entities)
    
    return {
        "text": response_text,
        "intent": intent,
        "entities": entities,
        "confidence": intent["confidence"],
        "sender_id": message.sender_id or str(uuid.uuid4()),
        "timestamp": datetime.now()
    }

@router.post("/chat", response_model=Dict[str, Any])
async def chat(message: UserMessage):
    # This endpoint would typically call RASA's chat endpoint
    # For our mock, we'll use the same logic as the parse endpoint
    
    # Extract intent and entities
    intent = classify_intent(message.text)
    entities = extract_entities(message.text)
    
    # Generate response
    response_text = generate_response(intent, entities)
    
    return {
        "recipient_id": message.sender_id or str(uuid.uuid4()),
        "text": response_text,
        "metadata": {
            "intent": intent,
            "entities": entities,
            "timestamp": datetime.now().isoformat()
        }
    }
