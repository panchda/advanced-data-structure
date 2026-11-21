import { SplayNode } from "./SplayNode";
import type { DataStructure } from "../DataStructure";

export class SplayTree implements DataStructure {
  private root: SplayNode | null = null;

  public getRoot(): Readonly<SplayNode> | null {
    return this.root;
  }

  private rotateRight(node: SplayNode): SplayNode {
    const newRoot = node.left!;

    node.left = newRoot.right;
    newRoot.right = node;

    return newRoot;
  }

  private rotateLeft(node: SplayNode): SplayNode {
    const newRoot = node.right!;

    node.right = newRoot.left;
    newRoot.left = node;

    return newRoot;
  }

  private splay(root: SplayNode | null, key: number): SplayNode | null {
    if (root === null || root.key === key) {
      return root;
    }

    if (key < root.key) {
      if (root.left === null) {
        return root;
      }

      // Zig-Zig (Left-Left)
      if (key < root.left.key) {
        root.left.left = this.splay(root.left.left, key);
        root = this.rotateRight(root);
      }
      // Zig-Zag (Left-Right)
      else if (key > root.left.key) {
        root.left.right = this.splay(root.left.right, key);

        if (root.left.right !== null) {
          root.left = this.rotateLeft(root.left);
        }
      }

      // Final Zig rotation
      return root.left === null ? root : this.rotateRight(root);
    }

    if (root.right === null) {
      return root;
    }

    // Zig-Zig (Right-Right)
    if (key > root.right.key) {
      root.right.right = this.splay(root.right.right, key);
      root = this.rotateLeft(root);
    }
    // Zig-Zag (Right-Left)
    else if (key < root.right.key) {
      root.right.left = this.splay(root.right.left, key);

      if (root.right.left !== null) {
        root.right = this.rotateRight(root.right);
      }
    }

    // Final Zig rotation
    return root.right === null ? root : this.rotateLeft(root);
  }

  public insert(key: number): void {
    if (this.root === null) {
      this.root = new SplayNode(key);
      return;
    }

    this.root = this.splay(this.root, key);

    // Ignore duplicate keys
    if (this.root!.key === key) {
      return;
    }

    const newNode = new SplayNode(key);

    if (key < this.root!.key) {
      newNode.right = this.root;
      newNode.left = this.root!.left;
      this.root!.left = null;
    } else {
      newNode.left = this.root;
      newNode.right = this.root!.right;
      this.root!.right = null;
    }

    this.root = newNode;
  }

  public search(key: number): boolean {
    if (this.root === null) {
      return false;
    }

    this.root = this.splay(this.root, key);

    return this.root!.key === key;
  }

  public delete(key: number): boolean {
    if (this.root === null) {
      return false;
    }

    // Move the requested key (or the closest accessed node) to root
    this.root = this.splay(this.root, key);

    if (this.root!.key !== key) {
      return false;
    }

    const leftSubtree = this.root!.left;
    const rightSubtree = this.root!.right;

    // No left subtree: the right subtree becomes the new tree
    if (leftSubtree === null) {
      this.root = rightSubtree;
      return true;
    }

    // Move the maximum key of the left subtree to its root
    this.root = this.splay(leftSubtree, key);

    // All keys in the right subtree are greater
    this.root!.right = rightSubtree;

    return true;
  }
}
