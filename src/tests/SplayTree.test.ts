import { describe, expect, it } from "vitest";
import { SplayNode } from "../structures/splay/SplayNode";
import { SplayTree } from "../structures/splay/SplayTree";

function validateBST(
  node: Readonly<SplayNode> | null,
  min = -Infinity,
  max = Infinity,
): number {
  if (node === null) {
    return 0;
  }

  expect(node.key).toBeGreaterThan(min);
  expect(node.key).toBeLessThan(max);

  const leftCount = validateBST(node.left, min, node.key);
  const rightCount = validateBST(node.right, node.key, max);

  return 1 + leftCount + rightCount;
}

function createTreeWithRoot(root: SplayNode): SplayTree {
  const tree = new SplayTree();

  // Set up a controlled initial tree structure for testing
  (tree as unknown as { root: SplayNode }).root = root;

  return tree;
}

describe("SplayTree", () => {
  describe("SplayNode", () => {
    it("should initialize a node with a key and null children", () => {
      const node = new SplayNode(10);

      expect(node.key).toBe(10);
      expect(node.left).toBeNull();
      expect(node.right).toBeNull();
    });
  });

  describe("initialization", () => {
    it("should initialize an empty tree", () => {
      const tree = new SplayTree();

      expect(tree.getRoot()).toBeNull();
    });
  });

  describe("insert", () => {
    it("should insert a single key as root", () => {
      const tree = new SplayTree();

      tree.insert(10);

      expect(tree.getRoot()?.key).toBe(10);
    });

    it("should move each newly inserted key to root", () => {
      const tree = new SplayTree();

      for (const key of [30, 20, 10, 40, 50]) {
        tree.insert(key);

        expect(tree.getRoot()?.key).toBe(key);
      }
    });

    it("should ignore duplicate keys", () => {
      const tree = new SplayTree();

      tree.insert(10);
      tree.insert(10);

      expect(tree.getRoot()?.key).toBe(10);
      expect(tree.getRoot()?.left).toBeNull();
      expect(tree.getRoot()?.right).toBeNull();
    });
  });

  describe("search", () => {
    it("should return false when searching an empty tree", () => {
      const tree = new SplayTree();

      expect(tree.search(10)).toBe(false);
      expect(tree.getRoot()).toBeNull();
    });

    it("should find an existing key and move it to root", () => {
      const tree = new SplayTree();

      [10, 20, 30, 40, 50].forEach((key) => tree.insert(key));

      expect(tree.search(10)).toBe(true);
      expect(tree.getRoot()?.key).toBe(10);
    });

    it("should return false when searching a missing key", () => {
      const tree = new SplayTree();

      [10, 20, 30].forEach((key) => tree.insert(key));

      expect(tree.search(99)).toBe(false);
    });

    it("should move frequently accessed keys to root", () => {
      const tree = new SplayTree();

      [10, 20, 30, 40, 50].forEach((key) => tree.insert(key));

      for (const key of [10, 30, 20, 50, 10]) {
        expect(tree.search(key)).toBe(true);
        expect(tree.getRoot()?.key).toBe(key);
      }
    });
  });

  describe("delete", () => {
    it("should return false when deleting from an empty tree", () => {
      const tree = new SplayTree();

      expect(tree.delete(10)).toBe(false);
      expect(tree.getRoot()).toBeNull();
    });

    it("should delete a single-node tree", () => {
      const tree = new SplayTree();

      tree.insert(10);

      expect(tree.delete(10)).toBe(true);
      expect(tree.getRoot()).toBeNull();
    });

    it("should delete a leaf node", () => {
      const tree = new SplayTree();

      [20, 10, 30].forEach((key) => tree.insert(key));

      expect(tree.delete(10)).toBe(true);
      expect(tree.search(10)).toBe(false);
      expect(tree.search(20)).toBe(true);
      expect(tree.search(30)).toBe(true);
    });

    it("should delete a node with one child", () => {
      const tree = new SplayTree();

      [20, 10, 30, 25].forEach((key) => tree.insert(key));

      expect(tree.delete(30)).toBe(true);
      expect(tree.search(30)).toBe(false);
      expect(tree.search(25)).toBe(true);
    });

    it("should delete a node with two children", () => {
      const tree = new SplayTree();

      [20, 10, 30, 25, 40].forEach((key) => tree.insert(key));

      expect(tree.delete(30)).toBe(true);
      expect(tree.search(30)).toBe(false);
      expect(tree.search(25)).toBe(true);
      expect(tree.search(40)).toBe(true);
    });

    it("should return false when deleting a missing key", () => {
      const tree = new SplayTree();

      [10, 20, 30].forEach((key) => tree.insert(key));

      expect(tree.delete(99)).toBe(false);
      expect(tree.search(10)).toBe(true);
      expect(tree.search(20)).toBe(true);
      expect(tree.search(30)).toBe(true);
    });

    it("should delete all elements", () => {
      const tree = new SplayTree();

      const keys = [50, 30, 70, 20, 40, 60, 80];

      keys.forEach((key) => tree.insert(key));

      for (const key of keys) {
        expect(tree.delete(key)).toBe(true);
        expect(tree.search(key)).toBe(false);
      }

      expect(tree.getRoot()).toBeNull();
    });
  });

  describe("BST invariants", () => {
    it("should preserve BST ordering after insertions", () => {
      const tree = new SplayTree();
      const keys = [50, 30, 70, 20, 40, 60, 80];

      for (const key of keys) {
        tree.insert(key);

        expect(tree.getRoot()?.key).toBe(key);
        validateBST(tree.getRoot());
      }

      expect(validateBST(tree.getRoot())).toBe(keys.length);
    });

    it("should preserve BST ordering after searches", () => {
      const tree = new SplayTree();

      [50, 30, 70, 20, 40, 60, 80].forEach((key) => tree.insert(key));

      for (const key of [20, 60, 30, 80, 50]) {
        expect(tree.search(key)).toBe(true);
        expect(tree.getRoot()?.key).toBe(key);
        expect(validateBST(tree.getRoot())).toBe(7);
      }
    });

    it("should preserve BST ordering after deletions", () => {
      const tree = new SplayTree();
      const keys = [50, 30, 70, 20, 40, 60, 80];

      keys.forEach((key) => tree.insert(key));

      for (const [index, key] of keys.entries()) {
        expect(tree.delete(key)).toBe(true);
        expect(validateBST(tree.getRoot())).toBe(keys.length - index - 1);
      }

      expect(tree.getRoot()).toBeNull();
    });

    it("should not create duplicate nodes", () => {
      const tree = new SplayTree();

      [10, 20, 10, 30, 20, 30].forEach((key) => tree.insert(key));

      expect(validateBST(tree.getRoot())).toBe(3);
    });

    it("should preserve BST ordering after unsuccessful searches", () => {
      const tree = new SplayTree();

      [10, 20, 30, 40, 50].forEach((key) => tree.insert(key));

      for (const key of [5, 15, 35, 55]) {
        expect(tree.search(key)).toBe(false);
        expect(validateBST(tree.getRoot())).toBe(5);
      }
    });
  });

  describe("splay rotations", () => {
    it("should perform Zig rotation", () => {
      const tree = new SplayTree();

      [10, 20].forEach((key) => tree.insert(key));

      expect(tree.search(10)).toBe(true);

      const root = tree.getRoot();

      expect(root?.key).toBe(10);
      expect(root?.right?.key).toBe(20);
      expect(validateBST(root)).toBe(2);
    });

    it("should perform Zig-Zig (left-left)", () => {
      const tree = new SplayTree();

      [10, 20, 30].forEach((key) => tree.insert(key));

      expect(tree.search(10)).toBe(true);

      const root = tree.getRoot();

      expect(root?.key).toBe(10);
      expect(root?.right?.key).toBe(20);
      expect(root?.right?.right?.key).toBe(30);
      expect(validateBST(root)).toBe(3);
    });

    it("should perform Zig-Zig (right-right)", () => {
      const tree = new SplayTree();

      [30, 20, 10].forEach((key) => tree.insert(key));

      expect(tree.search(30)).toBe(true);

      const root = tree.getRoot();

      expect(root?.key).toBe(30);
      expect(root?.left?.key).toBe(20);
      expect(root?.left?.left?.key).toBe(10);
      expect(validateBST(root)).toBe(3);
    });

    it("should perform Zig-Zag (left-right)", () => {
      const tree = new SplayTree();

      [20, 10, 30].forEach((key) => tree.insert(key));

      expect(tree.search(20)).toBe(true);

      const root = tree.getRoot();

      expect(root?.key).toBe(20);
      expect(validateBST(root)).toBe(3);
    });

    it("should perform Zig-Zag (right-left)", () => {
      const tree = new SplayTree();

      [20, 30, 10].forEach((key) => tree.insert(key));

      expect(tree.search(20)).toBe(true);

      const root = tree.getRoot();

      expect(root?.key).toBe(20);
      expect(validateBST(root)).toBe(3);
    });

    describe("controlled rotation scenarios", () => {
      it.each([
        {
          rotation: "Zig-Zig LL",
          keys: [30, 20, 10],
          target: 10,
          expectedLeft: null,
          expectedRight: 20,
        },
        {
          rotation: "Zig-Zig RR",
          keys: [10, 20, 30],
          target: 30,
          expectedLeft: 20,
          expectedRight: null,
        },
        {
          rotation: "Zig-Zag LR",
          keys: [30, 10, 20],
          target: 20,
          expectedLeft: 10,
          expectedRight: 30,
        },
        {
          rotation: "Zig-Zag RL",
          keys: [10, 30, 20],
          target: 20,
          expectedLeft: 10,
          expectedRight: 30,
        },
      ])(
        "should correctly perform $rotation",
        ({ keys, target, expectedLeft, expectedRight }) => {
          const tree = new SplayTree();

          keys.forEach((key) => tree.insert(key));

          expect(tree.search(target)).toBe(true);

          const root = tree.getRoot();

          expect(root?.key).toBe(target);
          expect(root?.left?.key ?? null).toBe(expectedLeft);
          expect(root?.right?.key ?? null).toBe(expectedRight);
          expect(validateBST(root)).toBe(keys.length);
        },
      );
    });

    describe("exact rotation scenarios", () => {
      it("should perform Zig (right rotation)", () => {
        const root = new SplayNode(30);
        root.left = new SplayNode(20);

        const tree = createTreeWithRoot(root);

        expect(tree.search(20)).toBe(true);

        expect(tree.getRoot()?.key).toBe(20);
        expect(tree.getRoot()?.right?.key).toBe(30);
        expect(validateBST(tree.getRoot())).toBe(2);
      });

      it("should perform Zig-Zig (left-left)", () => {
        const root = new SplayNode(30);
        root.left = new SplayNode(20);
        root.left.left = new SplayNode(10);

        const tree = createTreeWithRoot(root);

        expect(tree.search(10)).toBe(true);

        expect(tree.getRoot()?.key).toBe(10);
        expect(tree.getRoot()?.right?.key).toBe(20);
        expect(tree.getRoot()?.right?.right?.key).toBe(30);
        expect(validateBST(tree.getRoot())).toBe(3);
      });

      it("should perform Zig-Zig (right-right)", () => {
        const root = new SplayNode(10);
        root.right = new SplayNode(20);
        root.right.right = new SplayNode(30);

        const tree = createTreeWithRoot(root);

        expect(tree.search(30)).toBe(true);

        expect(tree.getRoot()?.key).toBe(30);
        expect(tree.getRoot()?.left?.key).toBe(20);
        expect(tree.getRoot()?.left?.left?.key).toBe(10);
        expect(validateBST(tree.getRoot())).toBe(3);
      });

      it("should perform Zig-Zag (left-right)", () => {
        const root = new SplayNode(30);
        root.left = new SplayNode(10);
        root.left.right = new SplayNode(20);

        const tree = createTreeWithRoot(root);

        expect(tree.search(20)).toBe(true);

        expect(tree.getRoot()?.key).toBe(20);
        expect(tree.getRoot()?.left?.key).toBe(10);
        expect(tree.getRoot()?.right?.key).toBe(30);
        expect(validateBST(tree.getRoot())).toBe(3);
      });

      it("should perform Zig-Zag (right-left)", () => {
        const root = new SplayNode(10);
        root.right = new SplayNode(30);
        root.right.left = new SplayNode(20);

        const tree = createTreeWithRoot(root);

        expect(tree.search(20)).toBe(true);

        expect(tree.getRoot()?.key).toBe(20);
        expect(tree.getRoot()?.left?.key).toBe(10);
        expect(tree.getRoot()?.right?.key).toBe(30);
        expect(validateBST(tree.getRoot())).toBe(3);
      });
    });
  });
});
