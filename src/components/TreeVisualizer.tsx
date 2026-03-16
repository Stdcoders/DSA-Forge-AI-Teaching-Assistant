import React, { useEffect, useState } from 'react';

export interface TreeNode {
  id: string;
  value: string | number;
  left?: string;
  right?: string;
  highlight?: 'active' | 'visited' | 'none';
}

export interface TreeState {
  name: string;
  nodes: TreeNode[];
  traversalOrder?: (string | number)[];
  activeNodeId?: string;
}

function getNodeStyle(node: TreeNode, activeNodeId?: string): string {
  const isActive = node.id === activeNodeId || node.highlight === 'active';
  const isVisited = node.highlight === 'visited';

  if (isActive) {
    return 'border-primary bg-primary/20 text-primary shadow-[0_0_16px_hsl(185_100%_55%/0.4)]';
  }
  if (isVisited) {
    return 'border-dsa-green bg-dsa-green/20 text-dsa-green shadow-[0_0_12px_hsl(145_70%_50%/0.3)]';
  }
  return 'border-border/60 bg-card text-foreground/70';
}

function getEdgeColor(childNode?: TreeNode, activeNodeId?: string): string {
  if (!childNode) return 'hsl(var(--border) / 0.4)';
  const isActive = childNode.id === activeNodeId || childNode.highlight === 'active';
  const isVisited = childNode.highlight === 'visited';
  if (isActive) return 'hsl(185, 100%, 55%)';
  if (isVisited) return 'hsl(145, 70%, 50%)';
  return 'hsl(var(--border) / 0.5)';
}

export default function TreeVisualizer({ state }: { state: TreeState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!state || !state.nodes || state.nodes.length === 0) return null;

  const { name, nodes, traversalOrder = [], activeNodeId } = state;

  const nodeMap = new Map<string, TreeNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  // Find root
  const children = new Set<string>();
  nodes.forEach(n => {
    if (n.left) children.add(n.left);
    if (n.right) children.add(n.right);
  });
  const root = nodes.find(n => !children.has(n.id)) || nodes[0];

  // Calculate tree layout using BFS width assignments
  interface LayoutNode {
    id: string;
    x: number;
    y: number;
    node: TreeNode;
  }

  const layouts: LayoutNode[] = [];
  const NODE_SIZE = 44;
  const V_GAP = 64;
  const H_GAP = 28;

  function calculateWidth(nodeId?: string): number {
    if (!nodeId) return 0;
    const n = nodeMap.get(nodeId);
    if (!n) return 0;
    const leftW = calculateWidth(n.left);
    const rightW = calculateWidth(n.right);
    return Math.max(NODE_SIZE, leftW + rightW + H_GAP);
  }

  function layoutTree(nodeId: string | undefined, x: number, y: number) {
    if (!nodeId) return;
    const n = nodeMap.get(nodeId);
    if (!n) return;

    const leftW = calculateWidth(n.left);
    const rightW = calculateWidth(n.right);
    const totalW = Math.max(NODE_SIZE, leftW + rightW + H_GAP);

    const nodeX = x + totalW / 2;
    layouts.push({ id: n.id, x: nodeX, y, node: n });

    if (n.left) {
      layoutTree(n.left, x, y + V_GAP);
    }
    if (n.right) {
      layoutTree(n.right, x + leftW + H_GAP, y + V_GAP);
    }
  }

  layoutTree(root.id, 0, 20);

  // Calculate SVG dimensions
  const maxX = Math.max(...layouts.map(l => l.x)) + NODE_SIZE;
  const maxY = Math.max(...layouts.map(l => l.y)) + NODE_SIZE;
  const svgWidth = maxX + 20;
  const svgHeight = maxY + 20;

  const layoutMap = new Map<string, LayoutNode>();
  layouts.forEach(l => layoutMap.set(l.id, l));

  // Collect edges
  const edges: { from: LayoutNode; to: LayoutNode; childNode: TreeNode }[] = [];
  nodes.forEach(n => {
    const from = layoutMap.get(n.id);
    if (!from) return;
    if (n.left) {
      const to = layoutMap.get(n.left);
      const childNode = nodeMap.get(n.left);
      if (to && childNode) edges.push({ from, to, childNode });
    }
    if (n.right) {
      const to = layoutMap.get(n.right);
      const childNode = nodeMap.get(n.right);
      if (to && childNode) edges.push({ from, to, childNode });
    }
  });

  return (
    <div className={`flex flex-col gap-3 select-none transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      {/* Title */}
      <div className="font-mono text-sm font-semibold text-primary">{name}</div>

      {/* Tree SVG */}
      <div className="flex justify-center overflow-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="flex-shrink-0"
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const color = getEdgeColor(edge.childNode, activeNodeId);
            const isVisitedEdge = edge.childNode.highlight === 'visited' || edge.childNode.id === activeNodeId;
            return (
              <line
                key={i}
                x1={edge.from.x}
                y1={edge.from.y + NODE_SIZE / 2}
                x2={edge.to.x}
                y2={edge.to.y - NODE_SIZE / 2 + 6}
                stroke={color}
                strokeWidth={isVisitedEdge ? 2.5 : 1.5}
                strokeDasharray={isVisitedEdge ? 'none' : '4 3'}
                className="transition-all duration-400"
              />
            );
          })}

          {/* Nodes */}
          {layouts.map(layout => {
            const style = getNodeStyle(layout.node, activeNodeId);
            const isActive = layout.node.id === activeNodeId || layout.node.highlight === 'active';
            const isVisited = layout.node.highlight === 'visited';

            return (
              <g key={layout.id}>
                {/* Node glow for active */}
                {isActive && (
                  <circle
                    cx={layout.x}
                    cy={layout.y}
                    r={NODE_SIZE / 2 + 4}
                    fill="none"
                    stroke="hsl(185, 100%, 55%)"
                    strokeWidth="1"
                    opacity="0.4"
                    className="animate-tree-visit"
                  />
                )}
                {/* Node circle */}
                <circle
                  cx={layout.x}
                  cy={layout.y}
                  r={NODE_SIZE / 2 - 2}
                  fill={isActive ? 'hsl(185 100% 55% / 0.15)' : isVisited ? 'hsl(145 70% 50% / 0.15)' : 'hsl(var(--card))'}
                  stroke={isActive ? 'hsl(185, 100%, 55%)' : isVisited ? 'hsl(145, 70%, 50%)' : 'hsl(var(--border) / 0.5)'}
                  strokeWidth="2.5"
                  className="transition-all duration-400"
                />
                {/* Value text */}
                <text
                  x={layout.x}
                  y={layout.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono font-bold"
                  fontSize="13"
                  fill={isActive ? 'hsl(185, 100%, 55%)' : isVisited ? 'hsl(145, 70%, 50%)' : 'hsl(var(--foreground) / 0.7)'}
                >
                  {String(layout.node.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal Order */}
      {traversalOrder.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            Traversal Order:
          </span>
          <div className="flex items-center gap-1">
            {traversalOrder.map((val, i) => (
              <React.Fragment key={i}>
                <span className="text-sm font-mono font-bold text-dsa-green bg-dsa-green/10 px-1.5 py-0.5 rounded">
                  {String(val)}
                </span>
                {i < traversalOrder.length - 1 && (
                  <span className="text-muted-foreground text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
