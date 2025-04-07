import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Chip } from '@mui/material';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData } from '../types';
import { ApiService } from '../services/ApiService';

interface GraphVisualizationProps {
  query?: string;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ query }) => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await ApiService.getGraphData();
        setGraphData(data);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError('Failed to load graph data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      
      const executeQuery = async () => {
        try {
          await ApiService.executeQuery(query);
          // Refresh graph data after query
          const data = await ApiService.getGraphData();
          setGraphData(data);
        } catch (err) {
          console.error('Error executing query:', err);
          setError('Failed to execute query. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      executeQuery();
    }
  }, [query]);

  const getNodeColor = (node: any) => {
    switch (node.type) {
      case 'account':
        return node.properties.isFraudulent ? '#ff4444' : '#4444ff';
      case 'ip':
        return node.properties.isSuspicious ? '#ff8800' : '#44aa44';
      default:
        return '#aaaaaa';
    }
  };

  const getLinkColor = (link: any) => {
    switch (link.type) {
      case 'CONNECTS_FROM':
        return '#888888';
      case 'RELATED_TO':
        return '#ff0000';
      default:
        return '#cccccc';
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Fraud Graph Visualization</Typography>
        <Box>
          <Chip label="Account" sx={{ bgcolor: '#4444ff', color: 'white', mr: 1 }} />
          <Chip label="Fraudulent Account" sx={{ bgcolor: '#ff4444', color: 'white', mr: 1 }} />
          <Chip label="IP Address" sx={{ bgcolor: '#44aa44', color: 'white', mr: 1 }} />
          <Chip label="Suspicious IP" sx={{ bgcolor: '#ff8800', color: 'white' }} />
        </Box>
      </Box>
      
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {loading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 10
          }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>Loading graph data...</Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%'
          }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        {graphData && !loading && !error && (
          <ForceGraph2D
            graphData={graphData}
            nodeLabel={(node: any) => `${node.label} (${node.type})`}
            nodeColor={getNodeColor}
            linkColor={getLinkColor}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.25}
            nodeRelSize={6}
            linkWidth={1.5}
            linkLabel={(link: any) => link.type}
            cooldownTicks={100}
            onNodeClick={(node: any) => {
              console.log('Node clicked:', node);
              // Could show a modal with node details here
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default GraphVisualization;
