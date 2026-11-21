import { useRef, useState } from "react";
import { AVLTree } from "../../src/structures/avl/AVLTree";
import { SplayTree } from "../../src/structures/splay/SplayTree";
import type { VisualizableNode } from "../../src/visualization/treeVisualizer";
import { TreeCanvas } from "./components/TreeCanvas";

type TreeType = "AVL" | "Splay";
type Tree = AVLTree | SplayTree;
type Operation = "insert" | "search" | "delete";

interface HistoryEntry {
  id: number;
  label: string;
  message: string;
  root: VisualizableNode | null;
}

function createTree(type: TreeType): Tree {
  return type === "AVL" ? new AVLTree() : new SplayTree();
}

function cloneNode(node: VisualizableNode | null): VisualizableNode | null {
  if (node === null) {
    return null;
  }

  return {
    key: node.key,
    left: cloneNode(node.left),
    right: cloneNode(node.right),
  };
}

function App() {
  const [treeType, setTreeType] = useState<TreeType>("AVL");
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("Tree is empty.");
  const [displayRoot, setDisplayRoot] = useState<VisualizableNode | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(
    null,
  );

  const nextHistoryId = useRef(0);
  const treeRef = useRef<Tree>(createTree("AVL"));

  const refreshTree = (label: string, operationMessage: string) => {
    const snapshot = cloneNode(treeRef.current.getRoot());
    const id = nextHistoryId.current++;

    setDisplayRoot(snapshot);
    setHistory((previous) => [
      ...previous,
      { id, label, message: operationMessage, root: snapshot },
    ]);
    setSelectedHistoryId(id);
  };

  const handleTreeTypeChange = (type: TreeType) => {
    treeRef.current = createTree(type);
    setTreeType(type);
    setInput("");
    setMessage("Tree is empty.");
    setDisplayRoot(null);
    setHistory([]);
    setSelectedHistoryId(null);
  };

  const handleOperation = (operation: Operation) => {
    const trimmedInput = input.trim();
    const key = Number(trimmedInput);

    if (trimmedInput === "" || !Number.isSafeInteger(key)) {
      setMessage("Please enter a valid integer.");
      return;
    }

    const tree = treeRef.current;
    let operationMessage = "";

    switch (operation) {
      case "insert":
        tree.insert(key);
        operationMessage = `Inserted ${key}.`;
        break;

      case "search": {
        const found = tree.search(key);
        operationMessage = found
          ? `Key ${key} found.`
          : `Key ${key} not found.`;
        break;
      }

      case "delete": {
        const deleted = tree.delete(key);
        operationMessage = deleted
          ? `Deleted ${key}.`
          : `Key ${key} not found.`;
        break;
      }
    }

    setMessage(operationMessage);
    setInput("");
    refreshTree(`${operation}(${key})`, operationMessage);
  };

  const handleReset = () => {
    treeRef.current = createTree(treeType);
    setInput("");
    setMessage("Tree has been reset.");
    setDisplayRoot(null);
    setHistory([]);
    setSelectedHistoryId(null);
  };

  const handleRunExample = () => {
    const tree = createTree(treeType);

    for (const key of [30, 20, 10]) {
      tree.insert(key);
    }

    treeRef.current = tree;
    setMessage("Example completed: insert(30), insert(20), insert(10).");
    setHistory([]);
    setSelectedHistoryId(null);
    refreshTree(
      "Example: insert(30), insert(20), insert(10)",
      "Example completed: insert(30), insert(20), insert(10).",
    );
  };

  const selectedHistoryIndex = history.findIndex(
    (entry) => entry.id === selectedHistoryId,
  );

  const selectedEntry =
    selectedHistoryIndex >= 0 ? history[selectedHistoryIndex] : null;

  const visibleRoot = selectedEntry ? selectedEntry.root : displayRoot;

  const currentStep = selectedHistoryIndex >= 0 ? selectedHistoryIndex + 1 : 0;

  const handlePrevious = () => {
    if (selectedHistoryIndex <= 0) {
      return;
    }

    setSelectedHistoryId(history[selectedHistoryIndex - 1].id);
  };

  const handleNext = () => {
    if (
      selectedHistoryIndex < 0 ||
      selectedHistoryIndex >= history.length - 1
    ) {
      return;
    }

    setSelectedHistoryId(history[selectedHistoryIndex + 1].id);
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>Advanced Data Structures</h1>
      <p>AVL Tree & Splay Tree Visualizer</p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() => handleTreeTypeChange("AVL")}
          disabled={treeType === "AVL"}
        >
          AVL Tree
        </button>

        <button
          onClick={() => handleTreeTypeChange("Splay")}
          disabled={treeType === "Splay"}
        >
          Splay Tree
        </button>

        <button onClick={handleRunExample}>Run Example</button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="number"
          step="1"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter integer"
          aria-label="Tree key"
          style={{ padding: "8px" }}
        />

        <button onClick={() => handleOperation("insert")}>Insert</button>

        <button onClick={() => handleOperation("search")}>Search</button>

        <button onClick={() => handleOperation("delete")}>Delete</button>

        <button onClick={handleReset}>Reset</button>
      </div>

      <p role="status" style={{ marginTop: "20px" }}>
        {selectedEntry?.message ?? message}
      </p>

      <div style={{ marginTop: "32px" }}>
        <h2>{treeType} Tree</h2>
        <TreeCanvas root={visibleRoot} />
      </div>

      <section style={{ marginTop: "32px" }}>
        <h2>Operation History</h2>

        {history.length === 0 ? (
          <p>No operations yet.</p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <button
                onClick={handlePrevious}
                disabled={selectedHistoryIndex <= 0}
              >
                Previous
              </button>

              <span aria-live="polite">
                Step {currentStep} of {history.length}
              </span>

              <button
                onClick={handleNext}
                disabled={
                  selectedHistoryIndex < 0 ||
                  selectedHistoryIndex >= history.length - 1
                }
              >
                Next
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedHistoryId(entry.id)}
                  aria-pressed={selectedHistoryId === entry.id}
                  style={{
                    border:
                      selectedHistoryId === entry.id
                        ? "2px solid #818cf8"
                        : undefined,
                  }}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default App;
