import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Chip } from '@mui/material';
import * as d3 from 'd3';
import { ApiService } from '../services/ApiService';

interface NodeObject {
  id: string;
  label: string;
  type: string;
  properties: {
    isFraudulent?: boolean;
    isSuspicious?: boolean;
  };
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkObject {
  source: string | NodeObject;
  target: string | NodeObject;
  type: string;
}

interface GraphVisualizationProps {
  query?: string;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ query }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: NodeObject[]; links: LinkObject[] } | null>(null);
  const [filteredData, setFilteredData] = useState<{ nodes: NodeObject[]; links: LinkObject[] } | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const getNodeColor = (node: NodeObject): string => {
    switch (node.type) {
      case 'account':
        return node.properties.isFraudulent ? '#ff4444' : '#4444ff';
      case 'ip':
        return node.properties.isSuspicious ? '#ff8800' : '#44aa44';
      default:
        return '#aaaaaa';
    }
  };

  const getLinkColor = (link: LinkObject): string => {
    switch (link.type) {
      case 'CONNECTS_FROM':
        return '#888888';
      case 'RELATED_TO':
        return '#ff0000';
      default:
        return '#cccccc';
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  };

  useEffect(() => {
    if (!graphData) return;

    if (activeFilters.size === 0) {
      setFilteredData(graphData);
      return;
    }

    const filteredNodes = graphData.nodes.filter(node => {
      if (activeFilters.has('Account') && node.type === 'account' && !node.properties.isFraudulent) return true;
      if (activeFilters.has('Fraudulent Account') && node.type === 'account' && node.properties.isFraudulent) return true;
      if (activeFilters.has('IP Address') && node.type === 'ip' && !node.properties.isSuspicious) return true;
      if (activeFilters.has('Suspicious IP') && node.type === 'ip' && node.properties.isSuspicious) return true;
      return false;
    });

    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = graphData.links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });

    setFilteredData({ nodes: filteredNodes, links: filteredLinks });
  }, [graphData, activeFilters]);

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

  useEffect(() => {
    if (!filteredData || !svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create force simulation
    const simulation = d3.forceSimulation<NodeObject>(filteredData.nodes)
      .force('link', d3.forceLink<NodeObject, LinkObject>(filteredData.links)
        .id((d: NodeObject) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create arrow marker for directed edges
    svg.append('defs').selectAll('marker')
      .data(['end'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // Create links
    const links = svg.append('g')
      .selectAll<SVGLineElement, LinkObject>('line')
      .data(filteredData.links)
      .join('line')
      .attr('stroke', getLinkColor)
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');

    // Create nodes
    const nodes = svg.append('g')
      .selectAll<SVGCircleElement, NodeObject>('circle')
      .data(filteredData.nodes)
      .join('circle')
      .attr('r', 6)
      .attr('fill', getNodeColor)
      .call((selection) => drag(simulation)(selection as d3.Selection<SVGCircleElement, NodeObject, any, any>));

    // Add labels
    const labels = svg.append('g')
      .selectAll<SVGTextElement, NodeObject>('text')
      .data(filteredData.nodes)
      .join('text')
      .text((d: NodeObject) => `${d.label} (${d.type})`)
      .attr('font-size', '12px')
      .attr('dx', 8)
      .attr('dy', 4);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', (d: LinkObject) => (d.source as NodeObject).x!)
        .attr('y1', (d: LinkObject) => (d.source as NodeObject).y!)
        .attr('x2', (d: LinkObject) => (d.target as NodeObject).x!)
        .attr('y2', (d: LinkObject) => (d.target as NodeObject).y!);

      nodes
        .attr('cx', (d: NodeObject) => d.x!)
        .attr('cy', (d: NodeObject) => d.y!);

      labels
        .attr('x', (d: NodeObject) => d.x!)
        .attr('y', (d: NodeObject) => d.y!);
    });

    // Drag behavior
    function drag(simulation: d3.Simulation<NodeObject, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGCircleElement, NodeObject, NodeObject>) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, NodeObject, NodeObject>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, NodeObject, NodeObject>) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag<SVGCircleElement, NodeObject>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [filteredData]);

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Fraud Graph Visualization</Typography>
        <Box>
          <Chip 
            label="Account" 
            sx={{ 
              bgcolor: activeFilters.has('Account') ? '#4444ff' : 'grey.300',
              color: activeFilters.has('Account') ? 'white' : 'text.primary',
              mr: 1,
              cursor: 'pointer'
            }}
            onClick={() => handleFilterClick('Account')}
          />
          <Chip 
            label="Fraudulent Account" 
            sx={{ 
              bgcolor: activeFilters.has('Fraudulent Account') ? '#ff4444' : 'grey.300',
              color: activeFilters.has('Fraudulent Account') ? 'white' : 'text.primary',
              mr: 1,
              cursor: 'pointer'
            }}
            onClick={() => handleFilterClick('Fraudulent Account')}
          />
          <Chip 
            label="IP Address" 
            sx={{ 
              bgcolor: activeFilters.has('IP Address') ? '#44aa44' : 'grey.300',
              color: activeFilters.has('IP Address') ? 'white' : 'text.primary',
              mr: 1,
              cursor: 'pointer'
            }}
            onClick={() => handleFilterClick('IP Address')}
          />
          <Chip 
            label="Suspicious IP" 
            sx={{ 
              bgcolor: activeFilters.has('Suspicious IP') ? '#ff8800' : 'grey.300',
              color: activeFilters.has('Suspicious IP') ? 'white' : 'text.primary',
              cursor: 'pointer'
            }}
            onClick={() => handleFilterClick('Suspicious IP')}
          />
        </Box>
      </Box>
      
      <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '500px' }}>
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
        
        {filteredData && !loading && !error && (
          <svg
            ref={svgRef}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default GraphVisualization;
