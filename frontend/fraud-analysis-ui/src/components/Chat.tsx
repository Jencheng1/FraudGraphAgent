import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Message } from '../types';
import { ApiService } from '../services/ApiService';

interface ChatProps {
  onQuerySubmit?: (query: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onQuerySubmit }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: 'Hello! I\'m your fraud analysis assistant. Ask me to find accounts with the same IP or analyze fraud patterns.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Notify parent component about the query if callback exists
    if (onQuerySubmit) {
      onQuerySubmit(input);
    }
    
    try {
      // Get bot response
      const botResponse = await ApiService.sendMessage(input);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Sorry, there was an error processing your request.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        Fraud Analysis Assistant
      </Typography>
      
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1,
        bgcolor: '#f5f5f5'
      }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Box sx={{ display: 'flex', maxWidth: '70%' }}>
              {message.sender === 'bot' && (
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>AI</Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
              {message.sender === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main', ml: 1, width: 32, height: 32 }}>U</Avatar>
              )}
            </Box>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
              <Typography variant="body1">Thinking...</Typography>
            </Paper>
          </Box>
        )}
      </Box>
      
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about fraud patterns or accounts with same IP..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          size="small"
          sx={{ mr: 1 }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          endIcon={<SendIcon />} 
          onClick={handleSend}
          disabled={isLoading || input.trim() === ''}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chat;
