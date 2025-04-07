from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import json

# Mock Neo4j integration
# In a real implementation, this would connect to a Neo4j database

router = APIRouter(
    prefix="/api/neo4j",
    tags=["neo4j"],
    responses={404: {"description": "Not found"}},
)

class CypherQuery(BaseModel):
    query: str
    parameters: Optional[Dict[str, Any]] = None

class GraphNode(BaseModel):
    id: str
    labels: List[str]
    properties: Dict[str, Any]

class GraphRelationship(BaseModel):
    id: str
    type: str
    startNode: str
    endNode: str
    properties: Dict[str, Any]

class GraphResult(BaseModel):
    nodes: List[GraphNode]
    relationships: List[GraphRelationship]

# Mock data for Neo4j graph database
mock_nodes = [
    {
        "id": "n1",
        "labels": ["Account"],
        "properties": {
            "id": "1",
            "username": "user123",
            "email": "user123@example.com",
            "createdAt": "2025-04-07T10:15:30Z"
        }
    },
    {
        "id": "n2",
        "labels": ["Account"],
        "properties": {
            "id": "2",
            "username": "johndoe",
            "email": "john.doe@example.com",
            "createdAt": "2025-04-07T10:16:45Z"
        }
    },
    {
        "id": "n3",
        "labels": ["Account"],
        "properties": {
            "id": "3",
            "username": "alice_smith",
            "email": "alice.smith@example.com",
            "createdAt": "2025-04-07T10:17:20Z"
        }
    },
    {
        "id": "n4",
        "labels": ["Account"],
        "properties": {
            "id": "4",
            "username": "bob_jones",
            "email": "bob.jones@example.com",
            "createdAt": "2025-04-07T11:30:15Z"
        }
    },
    {
        "id": "n5",
        "labels": ["IPAddress"],
        "properties": {
            "address": "192.168.1.100",
            "location": "Unknown",
            "isSuspicious": True
        }
    },
    {
        "id": "n6",
        "labels": ["IPAddress"],
        "properties": {
            "address": "192.168.1.101",
            "location": "Unknown",
            "isSuspicious": False
        }
    }
]

mock_relationships = [
    {
        "id": "r1",
        "type": "CONNECTS_FROM",
        "startNode": "n1",
        "endNode": "n5",
        "properties": {
            "timestamp": "2025-04-07T10:15:30Z"
        }
    },
    {
        "id": "r2",
        "type": "CONNECTS_FROM",
        "startNode": "n2",
        "endNode": "n5",
        "properties": {
            "timestamp": "2025-04-07T10:16:45Z"
        }
    },
    {
        "id": "r3",
        "type": "CONNECTS_FROM",
        "startNode": "n3",
        "endNode": "n5",
        "properties": {
            "timestamp": "2025-04-07T10:17:20Z"
        }
    },
    {
        "id": "r4",
        "type": "CONNECTS_FROM",
        "startNode": "n4",
        "endNode": "n6",
        "properties": {
            "timestamp": "2025-04-07T11:30:15Z"
        }
    },
    {
        "id": "r5",
        "type": "RELATED_TO",
        "startNode": "n1",
        "endNode": "n2",
        "properties": {
            "confidence": 0.95,
            "reason": "Same IP address within short time window"
        }
    },
    {
        "id": "r6",
        "type": "RELATED_TO",
        "startNode": "n2",
        "endNode": "n3",
        "properties": {
            "confidence": 0.95,
            "reason": "Same IP address within short time window"
        }
    },
    {
        "id": "r7",
        "type": "RELATED_TO",
        "startNode": "n1",
        "endNode": "n3",
        "properties": {
            "confidence": 0.95,
            "reason": "Same IP address within short time window"
        }
    }
]

# API routes
@router.get("/", response_model=Dict[str, str])
async def neo4j_status():
    return {"status": "connected", "version": "5.13.0"}

@router.post("/query", response_model=GraphResult)
async def execute_cypher(query: CypherQuery):
    # In a real implementation, this would execute the Cypher query against Neo4j
    # For this mock, we'll return different results based on the query content
    
    if "MATCH (a:Account)-[:CONNECTS_FROM]->(ip:IPAddress)" in query.query:
        # Query is looking for accounts connected to IP addresses
        return {
            "nodes": mock_nodes,
            "relationships": mock_relationships
        }
    elif "MATCH (a:Account)-[:CONNECTS_FROM]->(ip:IPAddress {address:" in query.query:
        # Query is looking for accounts with a specific IP
        ip_address = "192.168.1.100"  # Extract from query in a real implementation
        
        # Filter nodes and relationships for the specific IP
        ip_node = next((node for node in mock_nodes if node["labels"] == ["IPAddress"] and node["properties"]["address"] == ip_address), None)
        if not ip_node:
            return {"nodes": [], "relationships": []}
        
        ip_node_id = ip_node["id"]
        related_relationships = [rel for rel in mock_relationships if rel["endNode"] == ip_node_id and rel["type"] == "CONNECTS_FROM"]
        account_node_ids = [rel["startNode"] for rel in related_relationships]
        account_nodes = [node for node in mock_nodes if node["id"] in account_node_ids]
        
        # Also include relationships between these accounts
        account_relationships = [rel for rel in mock_relationships if rel["type"] == "RELATED_TO" and rel["startNode"] in account_node_ids and rel["endNode"] in account_node_ids]
        
        return {
            "nodes": [ip_node] + account_nodes,
            "relationships": related_relationships + account_relationships
        }
    else:
        # Default response for other queries
        return {
            "nodes": [],
            "relationships": []
        }

@router.get("/schema", response_model=Dict[str, Any])
async def get_schema():
    return {
        "nodes": [
            {
                "label": "Account",
                "properties": ["id", "username", "email", "createdAt"]
            },
            {
                "label": "IPAddress",
                "properties": ["address", "location", "isSuspicious"]
            }
        ],
        "relationships": [
            {
                "type": "CONNECTS_FROM",
                "start": "Account",
                "end": "IPAddress",
                "properties": ["timestamp"]
            },
            {
                "type": "RELATED_TO",
                "start": "Account",
                "end": "Account",
                "properties": ["confidence", "reason"]
            }
        ]
    }
