# Sample Fraud Data for Demo

This file contains sample data for demonstrating the fraud analysis system with a focus on the "same IP multiple accounts" fraud pattern.

## Fraud Accounts

```json
[
  {
    "id": "1",
    "username": "user123",
    "email": "user123@example.com",
    "ip": "192.168.1.100",
    "loginTime": "2025-04-07T10:15:30Z",
    "isFraudulent": true,
    "relatedAccounts": ["2", "3"]
  },
  {
    "id": "2",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "ip": "192.168.1.100",
    "loginTime": "2025-04-07T10:16:45Z",
    "isFraudulent": true,
    "relatedAccounts": ["1", "3"]
  },
  {
    "id": "3",
    "username": "alice_smith",
    "email": "alice.smith@example.com",
    "ip": "192.168.1.100",
    "loginTime": "2025-04-07T10:17:20Z",
    "isFraudulent": true,
    "relatedAccounts": ["1", "2"]
  },
  {
    "id": "4",
    "username": "bob_jones",
    "email": "bob.jones@example.com",
    "ip": "192.168.1.101",
    "loginTime": "2025-04-07T11:30:15Z",
    "isFraudulent": false
  }
]
```

## Fraud Clusters

```json
[
  {
    "id": "cluster1",
    "ip": "192.168.1.100",
    "accounts": [
      {
        "id": "1",
        "username": "user123",
        "email": "user123@example.com",
        "ip": "192.168.1.100",
        "loginTime": "2025-04-07T10:15:30Z",
        "isFraudulent": true,
        "relatedAccounts": ["2", "3"]
      },
      {
        "id": "2",
        "username": "johndoe",
        "email": "john.doe@example.com",
        "ip": "192.168.1.100",
        "loginTime": "2025-04-07T10:16:45Z",
        "isFraudulent": true,
        "relatedAccounts": ["1", "3"]
      },
      {
        "id": "3",
        "username": "alice_smith",
        "email": "alice.smith@example.com",
        "ip": "192.168.1.100",
        "loginTime": "2025-04-07T10:17:20Z",
        "isFraudulent": true,
        "relatedAccounts": ["1", "2"]
      }
    ],
    "timestamp": "2025-04-07T10:20:00Z",
    "confidence": 0.95
  }
]
```

## Graph Data

```json
{
  "nodes": [
    {
      "id": "account-1",
      "label": "user123",
      "type": "account",
      "properties": {
        "email": "user123@example.com",
        "loginTime": "2025-04-07T10:15:30Z",
        "isFraudulent": true
      }
    },
    {
      "id": "account-2",
      "label": "johndoe",
      "type": "account",
      "properties": {
        "email": "john.doe@example.com",
        "loginTime": "2025-04-07T10:16:45Z",
        "isFraudulent": true
      }
    },
    {
      "id": "account-3",
      "label": "alice_smith",
      "type": "account",
      "properties": {
        "email": "alice.smith@example.com",
        "loginTime": "2025-04-07T10:17:20Z",
        "isFraudulent": true
      }
    },
    {
      "id": "account-4",
      "label": "bob_jones",
      "type": "account",
      "properties": {
        "email": "bob.jones@example.com",
        "loginTime": "2025-04-07T11:30:15Z",
        "isFraudulent": false
      }
    },
    {
      "id": "ip-1",
      "label": "192.168.1.100",
      "type": "ip",
      "properties": {
        "count": 3,
        "isSuspicious": true
      }
    },
    {
      "id": "ip-2",
      "label": "192.168.1.101",
      "type": "ip",
      "properties": {
        "count": 1,
        "isSuspicious": false
      }
    }
  ],
  "links": [
    { "source": "account-1", "target": "ip-1", "type": "CONNECTS_FROM" },
    { "source": "account-2", "target": "ip-1", "type": "CONNECTS_FROM" },
    { "source": "account-3", "target": "ip-1", "type": "CONNECTS_FROM" },
    { "source": "account-4", "target": "ip-2", "type": "CONNECTS_FROM" },
    { "source": "account-1", "target": "account-2", "type": "RELATED_TO" },
    { "source": "account-2", "target": "account-3", "type": "RELATED_TO" },
    { "source": "account-1", "target": "account-3", "type": "RELATED_TO" }
  ]
}
```

## Sample Chat Queries and Responses

1. **Query**: "Hello"
   **Response**: "Hello! I'm your fraud analysis assistant. How can I help you today?"

2. **Query**: "Help"
   **Response**: "I can help you analyze potential fraud patterns. Try asking about accounts sharing the same IP address."

3. **Query**: "Find accounts with same IP"
   **Response**: "I found 3 accounts sharing the IP address 192.168.1.100. This appears to be a suspicious pattern."

4. **Query**: "Show fraud graph"
   **Response**: "Displaying the fraud graph visualization for accounts with shared IP addresses."

5. **Query**: "Analyze"
   **Response**: "Based on my analysis, accounts user123, johndoe, and alice_smith are likely fraudulent as they share the same IP address and were created within minutes of each other."

6. **Query**: "Explain"
   **Response**: "These accounts show a classic pattern of fraud where multiple accounts are created from the same IP address in a short time window. This is often indicative of a single actor creating multiple accounts for malicious purposes."
