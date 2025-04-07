#!/usr/bin/env python3
from diagrams import Diagram, Cluster, Edge
from diagrams.programming.language import Python
from diagrams.custom import Custom

with Diagram("Fraud Detection Workflow - Same IP Multiple Accounts", show=False, filename="fraud_detection_workflow", outformat="png"):
    
    # User Input
    user = Custom("Fraud Analyst", "./custom_icons/agent.png")
    
    # Query Input
    with Cluster("Query Input"):
        query = Custom("Natural Language Query", "./custom_icons/agent.png")
        example = Custom("'Find accounts with same IP at the same time'", "./custom_icons/agent.png")
    
    # Query Processing
    with Cluster("Query Processing"):
        nlp_processor = Custom("NLP Processor", "./custom_icons/rasa.png")
        query_agent = Custom("Query Understanding Agent", "./custom_icons/agent.png")
    
    # Graph Query Generation
    with Cluster("Graph Query Generation"):
        graphql_generator = Custom("GraphQL Generator", "./custom_icons/graphql.png")
        query_template = Custom("Query Template Selection", "./custom_icons/agent.png")
    
    # Graph Database Query
    with Cluster("Graph Database Query"):
        neo4j = Custom("Neo4j Graph DB", "./custom_icons/graph.png")
        cypher = Custom("Cypher Query", "./custom_icons/graph.png")
        
    # Pattern Detection
    with Cluster("Fraud Pattern Detection"):
        pattern_detector = Custom("Pattern Detector", "./custom_icons/agent.png")
        ip_clustering = Custom("IP Address Clustering", "./custom_icons/agent.png")
        temporal_analysis = Custom("Temporal Analysis", "./custom_icons/agent.png")
    
    # Results
    with Cluster("Results"):
        fraud_results = Custom("Fraud Detection Results", "./custom_icons/agent.png")
        visualization = Custom("Graph Visualization", "./custom_icons/graph.png")
    
    # Flow
    user >> query
    query >> example
    example >> nlp_processor
    
    nlp_processor >> query_agent
    query_agent >> graphql_generator
    
    graphql_generator >> query_template
    query_template >> cypher
    
    cypher >> neo4j
    neo4j >> pattern_detector
    
    pattern_detector >> ip_clustering
    pattern_detector >> temporal_analysis
    
    ip_clustering >> fraud_results
    temporal_analysis >> fraud_results
    
    fraud_results >> visualization
    visualization >> user
