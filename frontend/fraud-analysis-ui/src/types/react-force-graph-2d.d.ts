declare module 'react-force-graph-2d' {
  import { FC } from 'react';

  interface NodeObject {
    id: string;
    label: string;
    type: string;
    properties: {
      isFraudulent?: boolean;
      isSuspicious?: boolean;
    };
    [key: string]: any;
  }

  interface LinkObject {
    source: string | NodeObject;
    target: string | NodeObject;
    type: string;
    [key: string]: any;
  }

  interface ForceGraph2DProps {
    graphData: {
      nodes: NodeObject[];
      links: LinkObject[];
    };
    nodeId?: ((node: NodeObject) => string) | string;
    nodeLabel?: ((node: NodeObject) => string) | string;
    nodeColor?: ((node: NodeObject) => string) | string;
    linkSource?: ((link: LinkObject) => string) | string;
    linkTarget?: ((link: LinkObject) => string) | string;
    linkColor?: ((link: LinkObject) => string) | string;
    nodeRelSize?: number;
    linkDirectionalArrowLength?: number;
    linkDirectionalArrowRelPos?: number;
    linkCurvature?: number;
    linkWidth?: number;
    cooldownTicks?: number;
    onNodeClick?: (node: NodeObject) => void;
    [key: string]: any;
  }

  const ForceGraph2D: FC<ForceGraph2DProps>;
  export default ForceGraph2D;
} 