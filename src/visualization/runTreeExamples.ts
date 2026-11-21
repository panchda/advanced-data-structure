import { AVLTree } from "../structures/avl/AVLTree";
import { SplayTree } from "../structures/splay/SplayTree";
import { visualizeTree } from "./treeVisualizer";

function printTree(
  title: string,
  root: Parameters<typeof visualizeTree>[0],
): void {
  console.log(`\n${title}`);
  console.log(visualizeTree(root));
}

function runAVLExample(): void {
  const tree = new AVLTree();

  console.log("\n=== AVL TREE ===");

  for (const key of [30, 20, 10]) {
    tree.insert(key);
    printTree(`After insert(${key}):`, tree.getRoot());
  }

  tree.delete(10);
  printTree("After delete(10):", tree.getRoot());
}

function runSplayExample(): void {
  const tree = new SplayTree();

  console.log("\n=== SPLAY TREE ===");

  for (const key of [10, 20, 30]) {
    tree.insert(key);
    printTree(`After insert(${key}):`, tree.getRoot());
  }

  tree.search(10);
  printTree("After search(10):", tree.getRoot());

  tree.delete(20);
  printTree("After delete(20):", tree.getRoot());
}

runAVLExample();
runSplayExample();
