import { useMemo } from "react";
import type { LedgerEntry, DutyCalculated, DutySealed, LineageNode, LineageEdge } from "@/types";


function short(h: string) {
  const x = h.startsWith("0x") ? h.slice(2) : h;
  return `0x${x.slice(0, 6)}…${x.slice(-4)}`;
}

function buildLineage(entries: LedgerEntry[]) {
  const nodes: LineageNode[] = [];
  const edges: LineageEdge[] = [];

  const byHash = new Map<string, LedgerEntry>();
  for (const e of entries) byHash.set(e.eventHash, e);

  for (const e of entries) {
    const t = e.record.type;
    if (t === "MATERIAL_LOSS") {
      nodes.push({ id: `E:${e.eventHash}`, kind: "EVENT", label: "MATERIAL_LOSS", hash: e.eventHash, seq: e.seq });
    } else if (t === "DUTY_CALCULATED") {
      nodes.push({ id: `C:${e.eventHash}`, kind: "CALC", label: "DUTY_CALCULATED", hash: e.eventHash, seq: e.seq });
    } else if (t === "DUTY_SEALED") {
      nodes.push({ id: `S:${e.eventHash}`, kind: "SEALED", label: "DUTY_SEALED", hash: e.eventHash, seq: e.seq });
    }
  }

  for (const e of entries) {
    if (e.record.type === "DUTY_CALCULATED") {
      const rec = e.record as DutyCalculated;
      edges.push({
        from: `E:${rec.sourceEventHash}`,
        to: `C:${e.eventHash}`,
        label: "derives",
      });
    }

    if (e.record.type === "DUTY_SEALED") {
      const rec = e.record as DutySealed;
      edges.push({
        from: `C:${rec.calculationHash}`,
        to: `S:${e.eventHash}`,
        label: "seals",
      });
    }
  }

  return { nodes, edges };
}

interface LineageGraphProps {
  entries: LedgerEntry[];
  onNodeSelect: (hash: string) => void;
  selectedHash?: string;
}

export function LineageGraph({ entries, onNodeSelect, selectedHash }: LineageGraphProps) {
  const { nodes, edges } = useMemo(() => buildLineage(entries), [entries]);

  // Responsive lane positions - tighter on mobile
  const laneX: Record<string, number> = { EVENT: 60, CALC: 280, SEALED: 500 };
  const nodeWidth = 200;
  const byKind = {
    EVENT: nodes.filter(n => n.kind === "EVENT").sort((a, b) => b.seq - a.seq).slice(0, 8),
    CALC: nodes.filter(n => n.kind === "CALC").sort((a, b) => b.seq - a.seq).slice(0, 8),
    SEALED: nodes.filter(n => n.kind === "SEALED").sort((a, b) => b.seq - a.seq).slice(0, 8),
  };

  const pos = new Map<string, { x: number; y: number; node: LineageNode }>();
  const rowH = 70;
  const startY = 60;

  (Object.keys(byKind) as Array<keyof typeof byKind>).forEach((k) => {
    byKind[k].forEach((n, i) => {
      pos.set(n.id, { x: laneX[n.kind], y: startY + i * rowH, node: n });
    });
  });

  const width = 580;
  const height = 60 + Math.max(byKind.EVENT.length, byKind.CALC.length, byKind.SEALED.length) * rowH;

  return (
    <div className="border border-neutral-800 rounded-md overflow-hidden bg-[#0a0a0a]">
      <div className="px-3 py-2.5 bg-[#111111] border-b border-neutral-800 font-mono text-[11px] text-neutral-400 tracking-widest uppercase font-semibold">
        <span className="hidden sm:inline">Lineage Graph (Evidence → Calculation → Seal)</span>
        <span className="sm:hidden">Lineage (Event → Calc → Seal)</span>
      </div>

      <div className="overflow-auto">
        <svg 
          width="100%" 
          viewBox={`0 0 ${width} ${height}`} 
          className="block min-w-[320px] sm:min-w-[580px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Lane titles */}
          {(["EVENT", "CALC", "SEALED"] as const).map((k) => (
            <text 
              key={k} 
              x={laneX[k]} 
              y={28} 
              fill="#737373" 
              fontFamily="JetBrains Mono, monospace" 
              fontSize="11"
              fontWeight="500"
            >
              {k === "EVENT" ? "EVENT" : k === "CALC" ? "CALC" : "SEALED"}
            </text>
          ))}

          {/* Edges */}
          {edges.map((e, i) => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b) return null;

            const x1 = a.x + (nodeWidth / 2) - 10, y1 = a.y;
            const x2 = b.x - 15, y2 = b.y;
            const cx = (x1 + x2) / 2;

            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                  stroke="#404040"
                  strokeWidth="1.5"
                  fill="none"
                />
                <text 
                  x={cx} 
                  y={(y1 + y2) / 2 - 6} 
                  fill="#525252" 
                  fontFamily="JetBrains Mono, monospace" 
                  fontSize="9"
                  textAnchor="middle"
                >
                  {e.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {[...pos.values()].map(({ x, y, node }) => {
            const isSelected = selectedHash === node.hash;
            const fill =
              node.kind === "EVENT" ? "#0a0a0a" :
              node.kind === "CALC" ? "#171717" :
              "#262626";

            const stroke =
              node.kind === "EVENT" ? (isSelected ? "#ffffff" : "#404040") :
              node.kind === "CALC" ? (isSelected ? "#d4d4d4" : "#737373") :
              isSelected ? "#a3a3a3" : "#525252";

            const strokeWidth = isSelected ? 2 : 1;

            return (
              <g 
                key={node.id} 
                onClick={() => onNodeSelect(node.hash)} 
                className="cursor-pointer"
              >
                <rect 
                  x={x - 10} 
                  y={y - 18} 
                  width={nodeWidth} 
                  height={40} 
                  rx={6} 
                  fill={fill} 
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  className="transition-all hover:stroke-opacity-80"
                />
                <text 
                  x={x} 
                  y={y - 2} 
                  fill="#e5e5e5" 
                  fontFamily="JetBrains Mono, monospace" 
                  fontSize="10"
                >
                  {node.label}
                </text>
                <text 
                  x={x + 100} 
                  y={y - 2} 
                  fill="#a3a3a3" 
                  fontFamily="JetBrains Mono, monospace" 
                  fontSize="10"
                >
                  {short(node.hash)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
