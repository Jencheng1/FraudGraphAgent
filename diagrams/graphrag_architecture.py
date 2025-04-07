#!/usr/bin/env python3
from diagrams import Diagram, Cluster, Edge
from diagrams.programming.language import Python
from diagrams.custom import Custom

with Diagram("GraphRAG Architecture with Neo4j and Pinecone", show=False, filename="graphrag_architecture", outformat="png"):
    
    # User Query
    user_query = Custom("Natural Language Query", "./custom_icons/agent.png")
    
    # Query Processing
    with Cluster("Query Processing"):
        query_processor = Custom("Query Processor", "./custom_icons/agent.png")
        query_embedding = Custom("Query Embedding", "./custom_icons/agent.png")
    
    # Vector Search
    with Cluster("Vector Search"):
        pinecone = Custom("Pinecone Vector DB", "./custom_icons/pinecone.png")
        vector_results = Custom("Vector Search Results", "./custom_icons/retrieval.png")
    
    # Graph Query Generation
    with Cluster("Graph Query Generation"):
        graphql_generator = Custom("GraphQL Generator", "./custom_icons/graphql.png")
        cypher_generator = Custom("Cypher Generator", "./custom_icons/graph.png")
    
    # Graph Database
    with Cluster("Graph Database"):
        neo4j = Custom("Neo4j Graph DB", "./custom_icons/graph.png")
        graph_results = Custom("Graph Query Results", "./custom_icons/graph.png")
    
    # Result Fusion
    with Cluster("Result Fusion"):
        fusion_agent = Custom("Fusion Agent", "./custom_icons/agent.png")
        ranking = Custom("Result Ranking", "./custom_icons/agent.png")
    
    # Response Generation
    response = Custom("Response Generation", "./custom_icons/agent.png")
    
    # Flow
    user_query >> query_processor
    query_processor >> query_embedding
    
    query_embedding >> pinecone
    pinecone >> vector_results
    
    query_processor >> graphql_generator
    graphql_generator >> cypher_generator
    cypher_generator >> neo4j
    neo4j >> graph_results
    
    vector_results >> fusion_agent
    graph_results >> fusion_agent
    fusion_agent >> ranking
    ranking >> response
