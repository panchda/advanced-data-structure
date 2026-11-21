import { describe, expect, it } from "vitest";
import { AVLTree } from "../structures/avl/AVLTree";
import type { AVLNode } from "../structures/avl/AVLNode";

function validateAVL(
  node: Readonly<AVLNode> | null,
  min = -Infinity,
  max = Infinity,
): number {
  if (node === null) {
    return 0;
  }

  // BST ordering
  expect(node.key).toBeGreaterThan(min);
  expect(node.key).toBeLessThan(max);

  const leftHeight = validateAVL(node.left, min, node.key);
  const rightHeight = validateAVL(node.right, node.key, max);

  // Height correctness
  const expectedHeight = 1 + Math.max(leftHeight, rightHeight);
  expect(node.height).toBe(expectedHeight);

  // AVL balance
  expect(Math.abs(leftHeight - rightHeight)).toBeLessThanOrEqual(1);

  return expectedHeight;
}

describe("AVLTree", () => {
  describe("search", () => {
    it("should return false when searching an empty tree", () => {
      const tree = new AVLTree();

      expect(tree.search(10)).toBe(false);
    });
  });

  describe("insert", () => {
    it("should insert a single key", () => {
      const tree = new AVLTree();

      tree.insert(10);

      expect(tree.search(10)).toBe(true);
    });

    it("should insert multiple keys", () => {
      const tree = new AVLTree();

      [30, 20, 10, 40, 50].forEach((key) => tree.insert(key));

      expect(tree.search(10)).toBe(true);
      expect(tree.search(30)).toBe(true);
      expect(tree.search(50)).toBe(true);
      expect(tree.search(100)).toBe(false);
    });

    it("should ignore duplicate keys", () => {
      const tree = new AVLTree();

      tree.insert(10);
      tree.insert(10);

      expect(tree.search(10)).toBe(true);

      const root = tree.getRoot();

      expect(root?.key).toBe(10);
      expect(root?.left).toBeNull();
      expect(root?.right).toBeNull();

      validateAVL(root);
    });

    describe("rotations", () => {
      it.each([
        { rotation: "LL", keys: [30, 20, 10] },
        { rotation: "RR", keys: [10, 20, 30] },
        { rotation: "LR", keys: [30, 10, 20] },
        { rotation: "RL", keys: [10, 30, 20] },
      ])("should correctly balance $rotation rotation", ({ keys }) => {
        const tree = new AVLTree();

        keys.forEach((key) => tree.insert(key));

        const root = tree.getRoot();

        expect(root?.key).toBe(20);
        expect(root?.left?.key).toBe(10);
        expect(root?.right?.key).toBe(30);
        expect(root?.height).toBe(2);
      });
    });
  });

  describe("delete", () => {
    it("should return false when deleting from an empty tree", () => {
      const tree = new AVLTree();

      expect(tree.delete(10)).toBe(false);
    });

    it("should delete a leaf node", () => {
      const tree = new AVLTree();

      [20, 10, 30].forEach((key) => tree.insert(key));

      expect(tree.delete(10)).toBe(true);
      expect(tree.search(10)).toBe(false);
      expect(tree.search(20)).toBe(true);
      expect(tree.search(30)).toBe(true);
    });

    it("should delete a node with one child", () => {
      const tree = new AVLTree();

      [20, 10, 30, 25].forEach((key) => tree.insert(key));

      expect(tree.delete(30)).toBe(true);
      expect(tree.search(30)).toBe(false);
      expect(tree.search(25)).toBe(true);
    });

    it("should delete a node with two children", () => {
      const tree = new AVLTree();

      [20, 10, 30, 25, 40].forEach((key) => tree.insert(key));

      expect(tree.delete(30)).toBe(true);
      expect(tree.search(30)).toBe(false);
      expect(tree.search(25)).toBe(true);
      expect(tree.search(40)).toBe(true);
    });

    it("should return false when deleting a missing key", () => {
      const tree = new AVLTree();

      tree.insert(10);

      expect(tree.delete(99)).toBe(false);
      expect(tree.search(10)).toBe(true);
    });
  });

  describe("AVL invariants", () => {
    it("should maintain invariants after sequential insertions", () => {
      const tree = new AVLTree();

      for (let key = 1; key <= 1000; key++) {
        tree.insert(key);

        if (key % 50 === 0 || key === 1000) {
          validateAVL(tree.getRoot());
        }
      }

      for (let key = 1; key <= 1000; key++) {
        expect(tree.search(key)).toBe(true);
      }
    });

    it("should maintain invariants after reverse insertions", () => {
      const tree = new AVLTree();

      for (let key = 1000; key >= 1; key--) {
        tree.insert(key);

        if (key % 50 === 0 || key === 1) {
          validateAVL(tree.getRoot());
        }
      }

      for (let key = 1; key <= 1000; key++) {
        expect(tree.search(key)).toBe(true);
      }
    });

    it("should maintain invariants after multiple deletions", () => {
      const tree = new AVLTree();

      for (let key = 1; key <= 100; key++) {
        tree.insert(key);
      }

      for (let key = 1; key <= 100; key += 2) {
        expect(tree.delete(key)).toBe(true);
        validateAVL(tree.getRoot());
      }

      for (let key = 1; key <= 100; key++) {
        expect(tree.search(key)).toBe(key % 2 === 0);
      }
    });

    it("should remain valid after deleting all elements", () => {
      const tree = new AVLTree();

      [50, 30, 70, 20, 40, 60, 80].forEach((key) => tree.insert(key));

      for (const key of [50, 30, 70, 20, 40, 60, 80]) {
        expect(tree.delete(key)).toBe(true);
        validateAVL(tree.getRoot());
      }

      expect(tree.getRoot()).toBeNull();
    });

    it("should maintain invariants after every insertion and deletion", () => {
      const tree = new AVLTree();
      const keys = Array.from({ length: 100 }, (_, index) => index + 1);

      // Insert all keys and validate after every operation
      for (const key of keys) {
        tree.insert(key);

        expect(tree.search(key)).toBe(true);
        validateAVL(tree.getRoot());
      }

      // Delete all keys in reverse order
      for (const key of [...keys].reverse()) {
        expect(tree.delete(key)).toBe(true);
        expect(tree.search(key)).toBe(false);

        validateAVL(tree.getRoot());
      }

      expect(tree.getRoot()).toBeNull();
    });
  });
});
