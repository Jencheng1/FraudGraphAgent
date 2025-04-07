# Fraud Analysis System with RASA and GraphRAG

A comprehensive conversational AI system for fraud analysts to analyze labeled fraud patterns using graph databases, natural language processing, and multi-agent systems.

## Overview

This system provides an end-to-end solution for fraud analysts to interact with fraud data through natural language queries. It focuses on detecting the "same IP multiple accounts at the same time" fraud pattern using a combination of:

- Conversational AI with RASA for natural language understanding
- Graph database (Neo4j) for storing and querying fraud relationships
- Vector database (Pinecone) for semantic search capabilities
- GraphRAG (Graph Retrieval Augmented Generation) for enhanced information retrieval
- Multi-agent system with LangGraph for coordinated analysis

## System Architecture

The system consists of the following components:

1. **Frontend**: React.js application with Material UI components
   - Chat interface for natural language queries
   - Graph visualization for fraud patterns
   - Tabular data display for fraud accounts and clusters

2. **Backend**: FastAPI service with multiple integrations
   - RASA NLU for intent classification and entity extraction
   - Neo4j integration for graph database queries
   - LangGraph for multi-agent orchestration
   - GraphQL endpoint for structured data queries

3. **Agents**:
   - Query Understanding Agent: Processes natural language queries
   - GraphQL Generator: Converts natural language to graph queries
   - Retrieval Agent: Searches vector database for relevant information
   - Graph Data Agent: Analyzes graph patterns for fraud detection

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python 3.10+
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fraud-analysis-system.git
   cd fraud-analysis-system
   ```

2. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. Install frontend dependencies:
   ```
   cd frontend/fraud-analysis-ui
   npm install
   cd ../..
   ```

### Running the Demo

1. Use the provided startup script:
   ```
   ./start_demo.sh
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

3. Try example queries:
   - "Find accounts with same IP"
   - "Show fraud graph"
   - "Analyze this pattern"
   - "Explain why this is fraudulent"

## Features

### Natural Language Query Processing

The system uses RASA NLU to understand user queries and extract relevant entities. For example:

- "Find accounts with same IP" → Intent: find_accounts_with_same_ip
- "Show me accounts from 192.168.1.100" → Intent: find_accounts_with_same_ip, Entity: ip_address=192.168.1.100

### Graph-based Fraud Detection

The system uses Neo4j to store and query relationships between accounts, IP addresses, and other entities. This enables detection of complex fraud patterns like:

- Multiple accounts created from the same IP address within a short time window
- Suspicious login patterns across different accounts
- Relationship analysis between potentially fraudulent accounts

### Multi-Agent Collaboration

The system uses LangGraph to orchestrate multiple specialized agents:

1. **Query Agent**: Understands the user's natural language query
2. **GraphQL Generator**: Converts the query to a structured graph query
3. **Retrieval Agent**: Fetches relevant information from the vector database
4. **Graph Data Agent**: Analyzes the graph data for fraud patterns

### Interactive Visualization

The frontend provides interactive visualizations:

- Force-directed graph showing relationships between accounts and IP addresses
- Color-coded nodes to highlight fraudulent accounts and suspicious IP addresses
- Tabular data with filtering and sorting capabilities

## API Endpoints

### Main API

- `GET /api/accounts` - Get all accounts
- `GET /api/clusters` - Get fraud clusters
- `GET /api/graph` - Get graph data for visualization
- `POST /api/chat` - Send a message to the chat interface
- `POST /api/query` - Execute a natural language query

### RASA Integration

- `POST /api/rasa/parse` - Parse a message for intent and entities
- `POST /api/rasa/chat` - Chat with the RASA assistant

### Neo4j Integration

- `POST /api/neo4j/query` - Execute a Cypher query
- `GET /api/neo4j/schema` - Get the graph schema

### GraphQL Integration

- `POST /api/graphql` - Execute a GraphQL query

### LangGraph Integration

- `POST /api/langgraph/query` - Execute a query through the multi-agent system

## Sample Data

The system includes sample data focused on the "same IP multiple accounts" fraud pattern:

- 3 accounts sharing IP address 192.168.1.100 created within minutes of each other
- 1 legitimate account with a different IP address
- Graph relationships showing connections between accounts and IP addresses

## Development

### Project Structure

```
fraud_analysis_system/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   ├── accounts.json
│   │   │   ├── clusters.json
│   │   │   ├── graph.json
│   │   │   └── responses.json
│   │   ├── routers/
│   │   │   ├── neo4j.py
│   │   │   ├── rasa.py
│   │   │   ├── langgraph.py
│   │   │   └── graphql.py
│   │   └── main.py
│   └── main.py
├── frontend/
│   └── fraud-analysis-ui/
│       ├── public/
│       └── src/
│           ├── components/
│           │   ├── Chat.tsx
│           │   ├── GraphVisualization.tsx
│           │   └── FraudTable.tsx
│           ├── pages/
│           │   └── Dashboard.tsx
│           ├── services/
│           │   └── ApiService.ts
│           ├── types/
│           │   └── index.ts
│           └── App.tsx
├── diagrams/
│   ├── system_architecture.png
│   ├── conversational_flow.png
│   ├── graphrag_architecture.png
│   ├── multi_agent_interaction.png
│   └── fraud_detection_workflow.png
└── start_demo.sh
```

### Extending the System

To extend the system with new fraud patterns:

1. Add new sample data in the `backend/app/data/` directory
2. Update the mock API responses in the respective router files
3. Add new intents and entities in the RASA integration
4. Update the frontend visualization components as needed

## Limitations

This demo version has the following limitations:

- Uses mock data instead of real database connections
- Simulates multi-agent behavior without actual LLM calls
- Focuses only on the "same IP multiple accounts" fraud pattern
- Does not include authentication or authorization

## Future Enhancements

Potential enhancements for a production version:

- Integration with real Neo4j database
- Connection to actual LLM services for agent intelligence
- Additional fraud patterns and detection algorithms
- User authentication and role-based access control
- Performance optimizations for large-scale data

## License

This project is licensed under the MIT License - see the LICENSE file for details.
