from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import json
import os

# GraphQL mock integration
# In a real implementation, this would connect to a GraphQL server

router = APIRouter(
    prefix="/api/graphql",
    tags=["graphql"],
    responses={404: {"description": "Not found"}},
)

class GraphQLQuery(BaseModel):
    query: str
    variables: Optional[Dict[str, Any]] = None

class GraphQLResponse(BaseModel):
    data: Dict[str, Any]
    errors: Optional[List[Dict[str, Any]]] = None

# Load sample data
def get_sample_data():
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_path, "data")
    
    with open(os.path.join(data_path, "accounts.json"), "r") as f:
        accounts = json.load(f)
    
    with open(os.path.join(data_path, "clusters.json"), "r") as f:
        clusters = json.load(f)
    
    with open(os.path.join(data_path, "graph.json"), "r") as f:
        graph = json.load(f)
    
    return {
        "accounts": accounts["accounts"],
        "clusters": clusters["clusters"],
        "graph": graph["graph"]
    }

# API routes
@router.get("/", response_model=Dict[str, str])
async def graphql_status():
    return {"status": "running", "version": "1.0.0"}

@router.post("/", response_model=GraphQLResponse)
async def execute_graphql(query: GraphQLQuery):
    # In a real implementation, this would execute the GraphQL query
    # For this mock, we'll parse the query string and return appropriate data
    
    sample_data = get_sample_data()
    query_str = query.query.lower()
    
    # Handle different query types
    if "accounts" in query_str:
        if "ip: { shared: true }" in query_str or "sameipmultipleaccounts" in query_str:
            # Query for accounts with shared IP
            shared_ip_accounts = [acc for acc in sample_data["accounts"] if acc["ip"] == "192.168.1.100"]
            return {
                "data": {
                    "accounts": shared_ip_accounts
                }
            }
        else:
            # Return all accounts
            return {
                "data": {
                    "accounts": sample_data["accounts"]
                }
            }
    
    elif "clusters" in query_str:
        return {
            "data": {
                "clusters": sample_data["clusters"]
            }
        }
    
    elif "graph" in query_str:
        return {
            "data": {
                "graph": sample_data["graph"]
            }
        }
    
    # Default response for unrecognized queries
    return {
        "data": {},
        "errors": [{
            "message": "Query not recognized",
            "locations": [{"line": 1, "column": 1}],
            "path": ["query"]
        }]
    }

@router.get("/schema", response_model=Dict[str, Any])
async def get_schema():
    return {
        "types": [
            {
                "name": "Account",
                "fields": [
                    {"name": "id", "type": "ID!"},
                    {"name": "username", "type": "String!"},
                    {"name": "email", "type": "String!"},
                    {"name": "ip", "type": "String!"},
                    {"name": "loginTime", "type": "DateTime!"},
                    {"name": "isFraudulent", "type": "Boolean!"},
                    {"name": "relatedAccounts", "type": "[ID]"}
                ]
            },
            {
                "name": "FraudCluster",
                "fields": [
                    {"name": "id", "type": "ID!"},
                    {"name": "ip", "type": "String!"},
                    {"name": "accounts", "type": "[Account!]!"},
                    {"name": "timestamp", "type": "DateTime!"},
                    {"name": "confidence", "type": "Float!"}
                ]
            },
            {
                "name": "GraphData",
                "fields": [
                    {"name": "nodes", "type": "[Node!]!"},
                    {"name": "links", "type": "[Link!]!"}
                ]
            }
        ],
        "queries": [
            {
                "name": "accounts",
                "args": [
                    {"name": "filter", "type": "AccountFilter"}
                ],
                "type": "[Account!]!"
            },
            {
                "name": "clusters",
                "args": [
                    {"name": "filter", "type": "ClusterFilter"}
                ],
                "type": "[FraudCluster!]!"
            },
            {
                "name": "graph",
                "args": [],
                "type": "GraphData!"
            }
        ]
    }
