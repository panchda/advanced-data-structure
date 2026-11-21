export interface VisualizableNode {
  readonly key: number;
  readonly left: VisualizableNode | null;
  readonly right: VisualizableNode | null;
}

export function visualizeTree(root: VisualizableNode | null): string {
  if (root === null) {
    return "(empty tree)";
  }

  const lines: string[] = [String(root.key)];

  function visit(node: VisualizableNode, prefix: string): void {
    const children: {
      label: string;
      node: VisualizableNode;
    }[] = [];

    if (node.left !== null) {
      children.push({ label: "L", node: node.left });
    }

    if (node.right !== null) {
      children.push({ label: "R", node: node.right });
    }

    children.forEach(({ label, node: child }, index) => {
      const isLast = index === children.length - 1;
      const connector = isLast ? "└── " : "├── ";

      lines.push(`${prefix}${connector}${label}: ${child.key}`);

      visit(child, prefix + (isLast ? "    " : "│   "));
    });
  }

  visit(root, "");

  return lines.join("\n");
}
