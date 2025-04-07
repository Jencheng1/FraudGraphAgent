from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import uuid

# Initialize FastAPI app
app = FastAPI(
    title="Fraud Analysis API",
    description="API for fraud analysis with GraphRAG and RASA integration",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data models
class Message(BaseModel):
    id: str
    text: str
    sender: str
    timestamp: datetime

class FraudAccount(BaseModel):
    id: str
    username: str
    email: str
    ip: str
    loginTime: str
    isFraudulent: bool
    relatedAccounts: Optional[List[str]] = None

class FraudCluster(BaseModel):
    id: str
    ip: str
    accounts: List[FraudAccount]
    timestamp: str
    confidence: float

class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    properties: Dict[str, Any]

class GraphLink(BaseModel):
    source: str
    target: str
    type: str
    properties: Optional[Dict[str, Any]] = None

class GraphData(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphLink]

class Query(BaseModel):
    text: str

class MessageResponse(BaseModel):
    id: str
    text: str
    sender: str
    timestamp: datetime

# Mock data for fraud accounts with same IP
mock_fraud_accounts = [
    {
        "id": "1",
        "username": "user123",
        "email": "user123@example.com",
        "ip": "192.168.1.100",
        "loginTime": "2025-04-07T10:15:30Z",
        "isFraudulent": True,
        "relatedAccounts": ["2", "3"]
    },
    {
        "id": "2",
        "username": "johndoe",
        "email": "john.doe@example.com",
        "ip": "192.168.1.100",
        "loginTime": "2025-04-07T10:16:45Z",
        "isFraudulent": True,
        "relatedAccounts": ["1", "3"]
    },
    {
        "id": "3",
        "username": "alice_smith",
        "email": "alice.smith@example.com",
        "ip": "192.168.1.100",
        "loginTime": "2025-04-07T10:17:20Z",
        "isFraudulent": True,
        "relatedAccounts": ["1", "2"]
    },
    {
        "id": "4",
        "username": "bob_jones",
        "email": "bob.jones@example.com",
        "ip": "192.168.1.101",
        "loginTime": "2025-04-07T11:30:15Z",
        "isFraudulent": False
    }
]

# Mock fraud clusters
mock_fraud_clusters = [
    {
        "id": "cluster1",
        "ip": "192.168.1.100",
        "accounts": [account for account in mock_fraud_accounts if account["ip"] == "192.168.1.100"],
        "timestamp": "2025-04-07T10:20:00Z",
        "confidence": 0.95
    }
]

# Mock graph data for visualization
mock_graph_data = {
    "nodes": [
        *[{
            "id": f"account-{account['id']}",
            "label": account["username"],
            "type": "account",
            "properties": {
                "email": account["email"],
                "loginTime": account["loginTime"],
                "isFraudulent": account["isFraudulent"]
            }
        } for account in mock_fraud_accounts],
        {
            "id": "ip-1",
            "label": "192.168.1.100",
            "type": "ip",
            "properties": {
                "count": 3,
                "isSuspicious": True
            }
        },
        {
            "id": "ip-2",
            "label": "192.168.1.101",
            "type": "ip",
            "properties": {
                "count": 1,
                "isSuspicious": False
            }
        }
    ],
    "links": [
        {"source": "account-1", "target": "ip-1", "type": "CONNECTS_FROM"},
        {"source": "account-2", "target": "ip-1", "type": "CONNECTS_FROM"},
        {"source": "account-3", "target": "ip-1", "type": "CONNECTS_FROM"},
        {"source": "account-4", "target": "ip-2", "type": "CONNECTS_FROM"},
        {"source": "account-1", "target": "account-2", "type": "RELATED_TO"},
        {"source": "account-2", "target": "account-3", "type": "RELATED_TO"},
        {"source": "account-1", "target": "account-3", "type": "RELATED_TO"}
    ]
}

# Mock chat responses
mock_responses = {
    "hello": "Hello! I'm your fraud analysis assistant. How can I help you today?",
    "help": "I can help you analyze potential fraud patterns. Try asking about accounts sharing the same IP address.",
    "find accounts with same ip": "I found 3 accounts sharing the IP address 192.168.1.100. This appears to be a suspicious pattern.",
    "show fraud graph": "Displaying the fraud graph visualization for accounts with shared IP addresses.",
    "analyze": "Based on my analysis, accounts user123, johndoe, and alice_smith are likely fraudulent as they share the same IP address and were created within minutes of each other.",
    "explain": "These accounts show a classic pattern of fraud where multiple accounts are created from the same IP address in a short time window. This is often indicative of a single actor creating multiple accounts for malicious purposes."
}

# API routes
@app.get("/")
async def root():
    return {"message": "Welcome to the Fraud Analysis API"}

@app.post("/api/chat", response_model=MessageResponse)
async def chat(query: Query):
    # Find a matching response or use default
    response_text = "I don't understand that query. Try asking about fraud patterns or accounts with the same IP."
    
    for key, response in mock_responses.items():
        if key in query.text.lower():
            response_text = response
            break
    
    return {
        "id": str(uuid.uuid4()),
        "text": response_text,
        "sender": "bot",
        "timestamp": datetime.now()
    }

@app.get("/api/accounts", response_model=List[FraudAccount])
async def get_accounts():
    return mock_fraud_accounts

@app.get("/api/clusters", response_model=List[FraudCluster])
async def get_clusters():
    return mock_fraud_clusters

@app.get("/api/graph", response_model=GraphData)
async def get_graph():
    return mock_graph_data

@app.post("/api/query")
async def execute_query(query: Query):
    if "same ip" in query.text.lower():
        return {
            "accounts": [account for account in mock_fraud_accounts if account["ip"] == "192.168.1.100"],
            "clusters": mock_fraud_clusters
        }
    
    return {
        "message": "No results found for this query"
    }
