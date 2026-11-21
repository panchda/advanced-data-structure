import { describe, expect, it } from "vitest";
import type { DataStructure } from "../structures/DataStructure";
import { AVLTree } from "../structures/avl/AVLTree";
import { SplayTree } from "../structures/splay/SplayTree";

const structures: {
  name: string;
  create: () => DataStructure;
}[] = [
  { name: "AVL Tree", create: () => new AVLTree() },
  { name: "Splay Tree", create: () => new SplayTree() },
];

describe("DataStructure interface", () => {
  it.each(structures)(
    "should support insert, search and delete: $name",
    ({ create }) => {
      const structure = create();

      structure.insert(10);
      structure.insert(20);
      structure.insert(30);

      expect(structure.search(10)).toBe(true);
      expect(structure.search(20)).toBe(true);
      expect(structure.search(99)).toBe(false);

      expect(structure.delete(20)).toBe(true);
      expect(structure.search(20)).toBe(false);
      expect(structure.delete(20)).toBe(false);

      expect(structure.search(10)).toBe(true);
      expect(structure.search(30)).toBe(true);
    },
  );
});
