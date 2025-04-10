import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Grid, Paper, Tabs, Tab } from '@mui/material';
import Chat from '../components/Chat';
import GraphVisualization from '../components/GraphVisualization';
import FraudTable from '../components/FraudTable';

const Dashboard: React.FC = () => {
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleQuerySubmit = (query: string) => {
    setCurrentQuery(query);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fraud Analysis System
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth={false} sx={{ mt: 2, flexGrow: 1 }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          {/* Left panel - Chat */}
          <Grid component="div" item xs={12} md={4} sx={{ height: { md: 'calc(100vh - 140px)' } }}>
            <Chat onQuerySubmit={handleQuerySubmit} />
          </Grid>
          
          {/* Right panel - Visualization and Tables */}
          <Grid component="div" item xs={12} md={8} sx={{ height: { md: 'calc(100vh - 140px)' } }}>
            <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="fraud analysis tabs">
                  <Tab label="Graph Visualization" />
                  <Tab label="Fraud Analysis Results" />
                </Tabs>
              </Box>
              
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {activeTab === 0 && (
                  <Box sx={{ flexGrow: 1, height: '100%' }}>
                    <GraphVisualization query={currentQuery} />
                  </Box>
                )}
                
                {activeTab === 1 && (
                  <Box sx={{ flexGrow: 1, height: '100%' }}>
                    <FraudTable query={currentQuery} />
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
