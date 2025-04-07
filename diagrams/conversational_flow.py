#!/usr/bin/env python3
from diagrams import Diagram, Cluster, Edge
from diagrams.programming.language import Python
from diagrams.custom import Custom

with Diagram("Conversational Flow with RASA and LangGraph", show=False, filename="conversational_flow", outformat="png"):
    
    # User Input
    user = Custom("User", "./custom_icons/agent.png")
    
    # RASA Components
    with Cluster("RASA NLU Pipeline"):
        nlu = Custom("NLU", "./custom_icons/rasa.png")
        intent = Custom("Intent Classification", "./custom_icons/rasa.png")
        entity = Custom("Entity Extraction", "./custom_icons/rasa.png")
    
    # LangGraph Components
    with Cluster("LangGraph Flow"):
        with Cluster("Query Processing"):
            query_agent = Custom("Query Agent", "./custom_icons/agent.png")
            query_refiner = Custom("Query Refiner", "./custom_icons/agent.png")
        
        with Cluster("Graph Query Generation"):
            graphql_generator = Custom("GraphQL Generator", "./custom_icons/graphql.png")
        
        with Cluster("Knowledge Retrieval"):
            retrieval = Custom("Retrieval Agent", "./custom_icons/retrieval.png")
            vector_search = Custom("Vector Search", "./custom_icons/pinecone.png")
            graph_search = Custom("Graph Search", "./custom_icons/graph.png")
        
        with Cluster("Response Generation"):
            response_agent = Custom("Response Agent", "./custom_icons/agent.png")
    
    # Response
    response = Custom("Response to User", "./custom_icons/agent.png")
    
    # Flow
    user >> nlu
    nlu >> intent
    nlu >> entity
    
    intent >> query_agent
    entity >> query_agent
    
    query_agent >> query_refiner
    query_refiner >> graphql_generator
    
    graphql_generator >> retrieval
    retrieval >> vector_search
    retrieval >> graph_search
    
    vector_search >> response_agent
    graph_search >> response_agent
    
    response_agent >> response
    response >> user
