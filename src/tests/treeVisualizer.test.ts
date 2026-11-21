import { describe, expect, it } from "vitest";
import { visualizeTree } from "../visualization/treeVisualizer";
import { AVLTree } from "../structures/avl/AVLTree";
import { SplayTree } from "../structures/splay/SplayTree";

describe("Tree visualizer", () => {
  it("should visualize an empty tree", () => {
    expect(visualizeTree(null)).toBe("(empty tree)");
  });

  it("should visualize a single node", () => {
    const tree = new AVLTree();
    tree.insert(10);

    expect(visualizeTree(tree.getRoot())).toBe("10");
  });

  it("should visualize an AVL tree after rotation", () => {
    const tree = new AVLTree();

    tree.insert(30);
    tree.insert(20);
    tree.insert(10);

    expect(visualizeTree(tree.getRoot())).toBe(
      ["20", "├── L: 10", "└── R: 30"].join("\n"),
    );
  });

  it("should visualize a Splay tree after search", () => {
    const tree = new SplayTree();

    tree.insert(10);
    tree.insert(20);
    tree.insert(30);

    tree.search(10);

    expect(visualizeTree(tree.getRoot())).toBe(
      ["10", "└── R: 20", "    └── R: 30"].join("\n"),
    );
  });

  it("should visualize left and right subtrees", () => {
    const tree = new AVLTree();

    for (const key of [40, 20, 60, 10, 30, 50, 70]) {
      tree.insert(key);
    }

    expect(visualizeTree(tree.getRoot())).toBe(
      [
        "40",
        "├── L: 20",
        "│   ├── L: 10",
        "│   └── R: 30",
        "└── R: 60",
        "    ├── L: 50",
        "    └── R: 70",
      ].join("\n"),
    );
  });
});
