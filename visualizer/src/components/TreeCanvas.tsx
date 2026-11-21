import type { VisualizableNode } from "../../../src/visualization/treeVisualizer";

interface TreeCanvasProps {
  root: VisualizableNode | null;
}

interface PositionedNode {
  key: number;
  x: number;
  y: number;
}

interface TreeEdge {
  from: PositionedNode;
  to: PositionedNode;
}

const NODE_RADIUS = 20;
const HORIZONTAL_SPACING = 75;
const VERTICAL_SPACING = 75;
const PADDING = 35;

function calculateLayout(root: VisualizableNode) {
  const positions = new Map<VisualizableNode, PositionedNode>();
  let nextX = 0;

  // First pass: calculate positions using in-order traversal
  function assignPositions(node: VisualizableNode | null, depth: number): void {
    if (node === null) {
      return;
    }

    assignPositions(node.left, depth + 1);

    positions.set(node, {
      key: node.key,
      x: nextX * HORIZONTAL_SPACING + PADDING,
      y: depth * VERTICAL_SPACING + PADDING,
    });

    nextX++;

    assignPositions(node.right, depth + 1);
  }

  assignPositions(root, 0);

  const nodes = [...positions.values()];
  const edges: TreeEdge[] = [];

  // Second pass: connect nodes using their calculated positions
  function createEdges(node: VisualizableNode | null): void {
    if (node === null) {
      return;
    }

    const parentPosition = positions.get(node)!;

    for (const child of [node.left, node.right]) {
      if (child !== null) {
        const childPosition = positions.get(child)!;

        edges.push({
          from: parentPosition,
          to: childPosition,
        });

        createEdges(child);
      }
    }
  }

  createEdges(root);

  return { nodes, edges };
}

export function TreeCanvas({ root }: TreeCanvasProps) {
  if (root === null) {
    return <p>The tree is empty.</p>;
  }

  const { nodes, edges } = calculateLayout(root);

  const width = Math.max(...nodes.map((node) => node.x)) + PADDING;

  const height = Math.max(...nodes.map((node) => node.y)) + PADDING;

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "450px",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{
          display: "block",
          flexShrink: 0,
        }}
        role="img"
        aria-label="Tree visualization"
      >
        {edges.map((edge) => (
          <line
            key={`edge-${edge.from.key}-${edge.to.key}`}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            stroke="#94a3b8"
            strokeWidth={2}
          />
        ))}

        {nodes.map((node) => (
          <g key={node.key}>
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill="#6366f1"
              stroke="#c7d2fe"
              strokeWidth={2}
            />

            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize={14}
              fontWeight={600}
            >
              {node.key}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
