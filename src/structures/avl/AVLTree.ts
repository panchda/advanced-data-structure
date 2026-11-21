import { AVLNode } from "./AVLNode";
import type { DataStructure } from "../DataStructure";

export class AVLTree implements DataStructure {
  private root: AVLNode | null = null;

  public getRoot(): Readonly<AVLNode> | null {
    return this.root;
  }

  private getHeight(node: AVLNode | null): number {
    return node?.height ?? 0;
  }

  private updateHeight(node: AVLNode): void {
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  private getBalance(node: AVLNode): number {
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  private rotateRight(y: AVLNode): AVLNode {
    const x = y.left!;

    y.left = x.right;
    x.right = y;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  private rotateLeft(x: AVLNode): AVLNode {
    const y = x.right!;

    x.right = y.left;
    y.left = x;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  public search(key: number): boolean {
    let current = this.root;

    while (current !== null) {
      if (key === current.key) {
        return true;
      }

      current = key < current.key ? current.left : current.right;
    }

    return false;
  }

  public insert(key: number): void {
    this.root = this.insertNode(this.root, key);
  }

  private insertNode(node: AVLNode | null, key: number): AVLNode {
    if (node === null) {
      return new AVLNode(key);
    }

    if (key < node.key) {
      node.left = this.insertNode(node.left, key);
    } else if (key > node.key) {
      node.right = this.insertNode(node.right, key);
    } else {
      return node;
    }

    this.updateHeight(node);

    const balance = this.getBalance(node);

    // LL
    if (balance > 1 && key < node.left!.key) {
      return this.rotateRight(node);
    }

    // RR
    if (balance < -1 && key > node.right!.key) {
      return this.rotateLeft(node);
    }

    // LR
    if (balance > 1 && key > node.left!.key) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // RL
    if (balance < -1 && key < node.right!.key) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  public delete(key: number): boolean {
    if (!this.search(key)) {
      return false;
    }

    this.root = this.deleteNode(this.root, key);
    return true;
  }

  private findMin(node: AVLNode): AVLNode {
    let current = node;

    while (current.left !== null) {
      current = current.left;
    }

    return current;
  }

  private deleteNode(node: AVLNode | null, key: number): AVLNode | null {
    if (node === null) {
      return null;
    }

    if (key < node.key) {
      node.left = this.deleteNode(node.left, key);
    } else if (key > node.key) {
      node.right = this.deleteNode(node.right, key);
    } else {
      // Node with zero or one child
      if (node.left === null) {
        return node.right;
      }

      if (node.right === null) {
        return node.left;
      }

      // Node with two children
      const successor = this.findMin(node.right);
      node.key = successor.key;
      node.right = this.deleteNode(node.right, successor.key);
    }

    this.updateHeight(node);

    const balance = this.getBalance(node);

    // LL
    if (balance > 1 && this.getBalance(node.left!) >= 0) {
      return this.rotateRight(node);
    }

    // LR
    if (balance > 1 && this.getBalance(node.left!) < 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // RR
    if (balance < -1 && this.getBalance(node.right!) <= 0) {
      return this.rotateLeft(node);
    }

    // RL
    if (balance < -1 && this.getBalance(node.right!) > 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }
}
