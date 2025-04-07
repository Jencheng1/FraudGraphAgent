#!/usr/bin/env python3
from diagrams import Diagram, Cluster, Edge
from diagrams.onprem.database import MongoDB
from diagrams.onprem.queue import Kafka
from diagrams.onprem.compute import Server
from diagrams.programming.framework import React
from diagrams.programming.language import Python
from diagrams.custom import Custom
from diagrams.aws.storage import SimpleStorageServiceS3

with Diagram("Fraud Analysis System Architecture", show=False, filename="system_architecture", outformat="png"):
    
    # Frontend
    with Cluster("Frontend"):
        react = React("React.js UI")
        
    # Backend
    with Cluster("Backend"):
        with Cluster("FastAPI Service"):
            fastapi = Python("FastAPI")
            
        with Cluster("RASA NLU"):
            rasa = Custom("RASA", "./custom_icons/rasa.png")
            
        with Cluster("Multi-Agent System"):
            langchain = Custom("LangChain", "./custom_icons/langchain.png")
            langgraph = Custom("LangGraph", "./custom_icons/langgraph.png")
            
            with Cluster("Agents"):
                query_agent = Custom("Query Agent", "./custom_icons/agent.png")
                graphql_agent = Custom("GraphQL Generator", "./custom_icons/graphql.png")
                retrieval_agent = Custom("Retrieval Agent", "./custom_icons/retrieval.png")
                graph_data_agent = Custom("Graph Data Agent", "./custom_icons/graph.png")
    
    # Databases
    with Cluster("Databases"):
        neo4j = Custom("Neo4j Graph DB", "./custom_icons/graph.png")
        pinecone = Custom("Pinecone Vector DB", "./custom_icons/pinecone.png")
        
    # Flow
    react >> fastapi
    fastapi >> rasa
    rasa >> langchain
    langchain >> langgraph
    
    langgraph >> query_agent
    query_agent >> graphql_agent
    graphql_agent >> retrieval_agent
    retrieval_agent >> graph_data_agent
    
    graph_data_agent >> neo4j
    retrieval_agent >> pinecone
    
    neo4j >> graph_data_agent
    pinecone >> retrieval_agent
    
    graph_data_agent >> fastapi
    fastapi >> react
