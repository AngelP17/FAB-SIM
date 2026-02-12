import { useMemo, useState, useCallback } from "react";
import type { LedgerEntry, MerkleNode } from "@/types";
import { buildMerkleTree } from "@/lib/crypto";
import { cn } from "@/lib/utils";
import { Check, X, Loader2 } from "lucide-react";

function short(h: string) {
  const x = h.startsWith("0x") ? h.slice(2) : h;
  return `0x${x.slice(0, 6)}…${x.slice(-4)}`;
}

interface NodeRowProps {
  node: MerkleNode;
  expanded: Set<string>;
  toggle: (id: string) => void;
  depth: number;
}

function NodeRow({ node, expanded, toggle, depth }: NodeRowProps) {
  const isLeaf = !node.left && !node.right;
  const isOpen = expanded.has(node.id);

  return (
    <div style={{ paddingLeft: depth * 16 }} className="font-mono text-[11px]">
      <button
        onClick={() => !isLeaf && toggle(node.id)}
        className={cn(
          "flex gap-2 items-center w-full py-1.5 text-left transition-colors",
          isLeaf ? "cursor-default" : "cursor-pointer hover:bg-neutral-800/30"
        )}
        disabled={isLeaf}
      >
        <span className="w-5 text-neutral-400 text-center">
          {isLeaf ? "●" : isOpen ? "▼" : "▶"}
        </span>
        <span className="text-neutral-500 w-16">{node.id}</span>
        <span className={cn(isLeaf ? "text-neutral-400" : "text-white")}>
          {short(node.hash)}
        </span>
        <span className="ml-auto text-neutral-600 text-[10px]">lvl {node.level}</span>
      </button>

      {isOpen && node.left && (
        <NodeRow node={node.left} expanded={expanded} toggle={toggle} depth={depth + 1} />
      )}
      {isOpen && node.right && (
        <NodeRow node={node.right} expanded={expanded} toggle={toggle} depth={depth + 1} />
      )}
    </div>
  );
}

interface MerkleExplorerProps {
  entries: LedgerEntry[];
  rootExpected?: string;
}

export function MerkleExplorer({ entries, rootExpected }: MerkleExplorerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]));
  const [root, setRoot] = useState<MerkleNode | null>(null);
  const [status, setStatus] = useState<"IDLE" | "BUILDING" | "VALID" | "MISMATCH">("IDLE");

  const leaves = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.seq - b.seq);
    return sorted.map(e => e.eventHash);
  }, [entries]);

  const rebuild = useCallback(async () => {
    setStatus("BUILDING");
    try {
      const tree = await buildMerkleTree(leaves);
      setRoot(tree as MerkleNode);

      if (rootExpected && tree.hash !== rootExpected) {
        setStatus("MISMATCH");
      } else {
        setStatus("VALID");
      }
    } catch (error) {
      console.error("Failed to build Merkle tree:", error);
      setStatus("MISMATCH");
    }
  }, [leaves, rootExpected]);

  const toggle = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="border border-neutral-800 rounded-md overflow-hidden bg-[#0a0a0a] h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#111111] border-b border-neutral-800">
        <div className="font-mono text-[11px] text-neutral-400 tracking-widest uppercase font-semibold">
          Merkle Explorer
        </div>
        <button
          onClick={rebuild}
          disabled={status === "BUILDING"}
          className="font-mono text-[11px] px-3 py-1.5 rounded border border-neutral-700 bg-[#0a0a0a] text-neutral-300 hover:bg-neutral-800/50 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {status === "BUILDING" && <Loader2 className="w-3 h-3 animate-spin" />}
          Verify Root
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div className="font-mono text-[11px] text-neutral-500 mb-3">
          Leaves: <span className="text-neutral-300">{leaves.length}</span>
        </div>

        {root && (
          <div className="font-mono text-[11px] mb-4 p-2 bg-neutral-800/30 rounded border border-neutral-700/50">
            <span className="text-neutral-400">Root:</span>{" "}
            <span className="text-neutral-400 break-all">{root.hash}</span>
            <span className={cn(
              "ml-3 px-2 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-1",
              status === "VALID" ? "bg-white/10 text-white" :
              status === "MISMATCH" ? "bg-neutral-500/20 text-neutral-400" :
              "bg-neutral-700/50 text-neutral-400"
            )}>
              {status === "VALID" && <Check className="w-3 h-3" />}
              {status === "MISMATCH" && <X className="w-3 h-3" />}
              {status}
            </span>
          </div>
        )}

        {root ? (
          <NodeRow node={root} expanded={expanded} toggle={toggle} depth={0} />
        ) : (
          <div className="font-mono text-[11px] text-neutral-500 text-center py-8">
            Click &quot;Verify Root&quot; to build and validate the Merkle tree.
          </div>
        )}
      </div>
    </div>
  );
}
