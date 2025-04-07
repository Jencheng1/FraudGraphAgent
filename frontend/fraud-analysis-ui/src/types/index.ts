export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface FraudAccount {
  id: string;
  username: string;
  email: string;
  ip: string;
  loginTime: string;
  isFraudulent: boolean;
  relatedAccounts?: string[];
}

export interface FraudCluster {
  id: string;
  ip: string;
  accounts: FraudAccount[];
  timestamp: string;
  confidence: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'account' | 'ip' | 'device' | 'transaction';
  properties: Record<string, any>;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  properties?: Record<string, any>;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
