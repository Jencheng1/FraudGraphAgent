import axios from 'axios';
import { FraudAccount, FraudCluster, GraphData, Message } from '../types';

// Create axios instance with base URL
const API = axios.create({
  baseURL: window.API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service methods
export const ApiService = {
  // Chat API
  sendMessage: async (message: string): Promise<Message> => {
    try {
      const response = await API.post('/api/chat', { text: message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to mock response if API fails
      return {
        id: Date.now().toString(),
        text: 'Sorry, there was an error connecting to the server. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
    }
  },
  
  // Fraud accounts API
  getFraudAccounts: async (): Promise<FraudAccount[]> => {
    try {
      const response = await API.get('/api/accounts');
      return response.data;
    } catch (error) {
      console.error('Error fetching fraud accounts:', error);
      // Return empty array if API fails
      return [];
    }
  },
  
  // Fraud clusters API
  getFraudClusters: async (): Promise<FraudCluster[]> => {
    try {
      const response = await API.get('/api/clusters');
      return response.data;
    } catch (error) {
      console.error('Error fetching fraud clusters:', error);
      // Return empty array if API fails
      return [];
    }
  },
  
  // Graph data API
  getGraphData: async (): Promise<GraphData> => {
    try {
      const response = await API.get('/api/graph');
      return response.data;
    } catch (error) {
      console.error('Error fetching graph data:', error);
      // Return empty graph if API fails
      return { nodes: [], links: [] };
    }
  },
  
  // Query API - natural language to GraphQL conversion
  executeQuery: async (query: string): Promise<any> => {
    try {
      const response = await API.post('/api/query', { text: query });
      return response.data;
    } catch (error) {
      console.error('Error executing query:', error);
      // Return error message if API fails
      return {
        message: 'Error executing query. Please try again later.'
      };
    }
  },

  // RASA NLU API
  parseMessage: async (message: string): Promise<any> => {
    try {
      const response = await API.post('/api/rasa/parse', { 
        text: message,
        sender_id: 'user-' + Date.now()
      });
      return response.data;
    } catch (error) {
      console.error('Error parsing message with RASA:', error);
      return null;
    }
  },

  // Neo4j API
  executeGraphQuery: async (query: string, parameters = {}): Promise<any> => {
    try {
      const response = await API.post('/api/neo4j/query', { 
        query,
        parameters
      });
      return response.data;
    } catch (error) {
      console.error('Error executing graph query:', error);
      return { nodes: [], relationships: [] };
    }
  },

  // GraphQL API
  executeGraphQLQuery: async (query: string, variables = {}): Promise<any> => {
    try {
      const response = await API.post('/api/graphql', { 
        query,
        variables
      });
      return response.data;
    } catch (error) {
      console.error('Error executing GraphQL query:', error);
      return { data: {}, errors: [{ message: 'Failed to connect to GraphQL endpoint' }] };
    }
  },

  // LangGraph API
  executeLangGraphQuery: async (query: string, context = {}): Promise<any> => {
    try {
      const response = await API.post('/api/langgraph/query', { 
        query,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Error executing LangGraph query:', error);
      return { 
        query: query,
        responses: [],
        final_answer: 'Failed to connect to LangGraph service',
        execution_time: 0,
        trace_id: ''
      };
    }
  }
};

export default ApiService;
