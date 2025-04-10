import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';

interface RectElement {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  label: string;
}

interface CircleElement {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
  fill: string;
  label: string;
}

interface ArrowElement {
  type: 'arrow';
  start: { x: number; y: number };
  end: { x: number; y: number };
  label?: string;
}

type DiagramElement = RectElement | CircleElement | ArrowElement;

interface Diagram {
  title: string;
  description: string;
  elements: DiagramElement[];
}

const diagrams: Diagram[] = [
  {
    title: 'System Architecture Overview',
    description: 'High-level view of how different components interact',
    elements: [
      { type: 'rect', x: 50, y: 50, width: 120, height: 60, fill: '#4444ff', label: 'React Frontend' },
      { type: 'rect', x: 250, y: 50, width: 120, height: 60, fill: '#44aa44', label: 'FastAPI Backend' },
      { type: 'rect', x: 450, y: 50, width: 120, height: 60, fill: '#ff8800', label: 'RASA NLU' },
      { type: 'rect', x: 250, y: 200, width: 120, height: 60, fill: '#ff4444', label: 'Graph Database' },
      { type: 'arrow', start: { x: 170, y: 80 }, end: { x: 250, y: 80 }, label: 'API Calls' },
      { type: 'arrow', start: { x: 370, y: 80 }, end: { x: 450, y: 80 }, label: 'NLU Queries' },
      { type: 'arrow', start: { x: 310, y: 110 }, end: { x: 310, y: 200 }, label: 'Data Access' }
    ]
  },
  {
    title: 'Data Flow Diagram',
    description: 'How data flows between components during fraud analysis',
    elements: [
      { type: 'circle', x: 150, y: 100, radius: 40, fill: '#4444ff', label: 'User Input' },
      { type: 'circle', x: 300, y: 100, radius: 40, fill: '#44aa44', label: 'NLU Processing' },
      { type: 'circle', x: 450, y: 100, radius: 40, fill: '#ff8800', label: 'Graph Analysis' },
      { type: 'circle', x: 300, y: 250, radius: 40, fill: '#ff4444', label: 'Results' },
      { type: 'arrow', start: { x: 190, y: 100 }, end: { x: 260, y: 100 } },
      { type: 'arrow', start: { x: 340, y: 100 }, end: { x: 410, y: 100 } },
      { type: 'arrow', start: { x: 450, y: 140 }, end: { x: 340, y: 250 } }
    ]
  },
  {
    title: 'Component Interaction',
    description: 'How React components communicate and share state',
    elements: [
      { type: 'rect', x: 50, y: 50, width: 150, height: 60, fill: '#4444ff', label: 'Dashboard' },
      { type: 'rect', x: 50, y: 200, width: 150, height: 60, fill: '#44aa44', label: 'Chat Component' },
      { type: 'rect', x: 300, y: 200, width: 150, height: 60, fill: '#ff8800', label: 'Graph Visualization' },
      { type: 'rect', x: 550, y: 200, width: 150, height: 60, fill: '#ff4444', label: 'Fraud Table' },
      { type: 'arrow', start: { x: 125, y: 110 }, end: { x: 125, y: 200 }, label: 'Props' },
      { type: 'arrow', start: { x: 125, y: 110 }, end: { x: 375, y: 200 }, label: 'State' },
      { type: 'arrow', start: { x: 125, y: 110 }, end: { x: 625, y: 200 }, label: 'Events' }
    ]
  },
  {
    title: 'Graph Data Structure',
    description: 'How fraud patterns are represented in the graph database',
    elements: [
      { type: 'circle', x: 300, y: 100, radius: 40, fill: '#4444ff', label: 'Account Node' },
      { type: 'circle', x: 150, y: 250, radius: 40, fill: '#ff4444', label: 'Fraudulent Account' },
      { type: 'circle', x: 450, y: 250, radius: 40, fill: '#44aa44', label: 'IP Address' },
      { type: 'arrow', start: { x: 300, y: 140 }, end: { x: 190, y: 250 }, label: 'Related To' },
      { type: 'arrow', start: { x: 300, y: 140 }, end: { x: 410, y: 250 }, label: 'Connects From' }
    ]
  }
];

const AnimatedDiagram: React.FC<{ diagram: Diagram }> = ({ diagram }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '400px', position: 'relative' }}>
      <Typography variant="h6" gutterBottom>{diagram.title}</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>{diagram.description}</Typography>
      <svg width="100%" height="300" viewBox="0 0 700 300">
        {diagram.elements.map((element, index) => {
          if (element.type === 'rect') {
            return (
              <motion.g
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <rect
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  fill={element.fill}
                  rx={5}
                />
                <text
                  x={element.x + element.width / 2}
                  y={element.y + element.height / 2}
                  textAnchor="middle"
                  fill="white"
                  dy=".3em"
                >
                  {element.label}
                </text>
              </motion.g>
            );
          } else if (element.type === 'circle') {
            return (
              <motion.g
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <circle
                  cx={element.x}
                  cy={element.y}
                  r={element.radius}
                  fill={element.fill}
                />
                <text
                  x={element.x}
                  y={element.y}
                  textAnchor="middle"
                  fill="white"
                  dy=".3em"
                >
                  {element.label}
                </text>
              </motion.g>
            );
          } else if (element.type === 'arrow') {
            return (
              <motion.g
                key={index}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                <line
                  x1={element.start.x}
                  y1={element.start.y}
                  x2={element.end.x}
                  y2={element.end.y}
                  stroke="#666"
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
                {element.label && (
                  <text
                    x={(element.start.x + element.end.x) / 2}
                    y={(element.start.y + element.end.y) / 2 - 10}
                    textAnchor="middle"
                    fill="#666"
                    fontSize="12"
                  >
                    {element.label}
                  </text>
                )}
              </motion.g>
            );
          }
          return null;
        })}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>
      </svg>
    </Paper>
  );
};

const Diagrams: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>System Architecture Diagrams</Typography>
      <Typography variant="body1" paragraph>
        These diagrams illustrate how different components of the Fraud Analysis System work together.
        Each diagram is interactive and animated to help understand the system's architecture.
      </Typography>
      <Grid container spacing={3}>
        {diagrams.map((diagram, index) => (
          <Grid component="div" item xs={12} md={6} key={index}>
            <AnimatedDiagram diagram={diagram} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Diagrams; 