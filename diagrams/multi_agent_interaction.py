#!/usr/bin/env python3
from diagrams import Diagram, Cluster, Edge
from diagrams.programming.language import Python
from diagrams.custom import Custom

with Diagram("Multi-Agent Interaction for Fraud Analysis", show=False, filename="multi_agent_interaction", outformat="png"):
    
    # User
    user = Custom("Fraud Analyst", "./custom_icons/agent.png")
    
    # Orchestrator
    with Cluster("LangGraph Orchestrator"):
        orchestrator = Custom("LangGraph Orchestrator", "./custom_icons/langgraph.png")
    
    # Agents
    with Cluster("Agent Network"):
        # Query Understanding
        query_agent = Custom("Query Understanding Agent", "./custom_icons/agent.png")
        
        # Data Retrieval
        with Cluster("Data Retrieval Agents"):
            vector_agent = Custom("Vector Search Agent", "./custom_icons/retrieval.png")
            graph_agent = Custom("Graph Data Agent", "./custom_icons/graph.png")
        
        # Analysis
        with Cluster("Analysis Agents"):
            pattern_agent = Custom("Pattern Recognition Agent", "./custom_icons/agent.png")
            fraud_detection = Custom("Fraud Detection Agent", "./custom_icons/agent.png")
            
        # Explanation
        explanation_agent = Custom("Explanation Agent", "./custom_icons/agent.png")
    
    # Knowledge Stores
    with Cluster("Knowledge Stores"):
        pinecone = Custom("Pinecone Vector DB", "./custom_icons/pinecone.png")
        neo4j = Custom("Neo4j Graph DB", "./custom_icons/graph.png")
    
    # Response
    response = Custom("Analysis Results", "./custom_icons/agent.png")
    
    # Flow
    user >> orchestrator
    
    orchestrator >> query_agent
    
    query_agent >> vector_agent
    query_agent >> graph_agent
    
    vector_agent >> pinecone
    graph_agent >> neo4j
    
    pinecone >> vector_agent
    neo4j >> graph_agent
    
    vector_agent >> pattern_agent
    graph_agent >> pattern_agent
    
    pattern_agent >> fraud_detection
    
    fraud_detection >> explanation_agent
    
    explanation_agent >> response
    
    response >> user
