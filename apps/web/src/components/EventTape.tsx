import { useMemo, useState, useCallback, useEffect } from "react";
import type { LedgerEntry, EventType } from "@truthgrid/types";
import { cn } from "@/lib/utils";

function shortHex(h: string, a = 6, b = 4) {
  if (!h) return "";
  const x = h.startsWith("0x") ? h.slice(2) : h;
  return `0x${x.slice(0, a)}…${x.slice(-b)}`;
}

// Format timestamp for mobile - just show HH:MM:SS
function formatTimeMobile(iso: string) {
  const d = new Date(iso);
  return d.toISOString().split("T")[1].slice(0, 8);
}

function formatTs(iso: string) {
  const d = new Date(iso);
  const t = d.toISOString().split("T")[1];
  return t.replace("Z", "Z");
}

// Monochrome event type colors
const TYPE_COLOR: Record<EventType, string> = {
  CONFIG_COMMIT: "#737373",
  MATERIAL_LOSS: "#a3a3a3",
  DUTY_CALCULATED: "#d4d4d4",
  DUTY_SEALED: "#737373",
};

const TYPE_BG: Record<EventType, string> = {
  CONFIG_COMMIT: "bg-neutral-500/10",
  MATERIAL_LOSS: "bg-neutral-400/10",
  DUTY_CALCULATED: "bg-neutral-300/10",
  DUTY_SEALED: "bg-neutral-500/10",
};

const TYPE_BORDER: Record<EventType, string> = {
  CONFIG_COMMIT: "border-neutral-500/30",
  MATERIAL_LOSS: "border-neutral-400/30",
  DUTY_CALCULATED: "border-neutral-300/30",
  DUTY_SEALED: "border-neutral-500/30",
};

interface EventTapeProps {
  entries: LedgerEntry[];
  onSelect: (e: LedgerEntry) => void;
  selectedSeq?: number;
}

export function EventTape({ entries, onSelect, selectedSeq }: EventTapeProps) {
  const [filter, setFilter] = useState<EventType | "ALL">("ALL");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const rows = useMemo(() => {
    const arr = [...entries].sort((a, b) => b.seq - a.seq);
    return filter === "ALL" ? arr : arr.filter(x => x.record.type === filter);
  }, [entries, filter]);

  const handleSelect = useCallback((entry: LedgerEntry, index: number) => {
    setSelectedIndex(index);
    onSelect(entry);
  }, [onSelect]);

  // Keyboard navigation (J/K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        setSelectedIndex(prev => {
          const next = Math.min(prev + 1, rows.length - 1);
          if (next >= 0 && next < rows.length) {
            onSelect(rows[next]);
          }
          return next;
        });
      } else if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        setSelectedIndex(prev => {
          const next = Math.max(prev - 1, 0);
          if (next >= 0 && next < rows.length) {
            onSelect(rows[next]);
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rows, onSelect]);

  return (
    <div className="border border-neutral-800 rounded-md overflow-hidden bg-[#0a0a0a] h-full flex flex-col">
      <div className="flex justify-between items-center px-3 py-2.5 bg-[#111111] border-b border-neutral-800">
        <div className="font-mono text-[11px] text-neutral-400 tracking-widest uppercase font-semibold">
          Event Tape
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">J/K nav</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as EventType | "ALL")}
            className="bg-[#0a0a0a] text-neutral-300 border border-neutral-700 rounded px-2 py-1 font-mono text-[11px] focus:outline-none focus:border-neutral-500 min-h-[32px]"
          >
            <option value="ALL">ALL</option>
            <option value="CONFIG_COMMIT">CONFIG</option>
            <option value="MATERIAL_LOSS">LOSS</option>
            <option value="DUTY_CALCULATED">CALC</option>
            <option value="DUTY_SEALED">SEALED</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Desktop Header */}
        <div className="hidden sm:grid grid-cols-[70px_100px_130px_140px_1fr] gap-2 px-3 py-2 bg-[#111111] text-[10px] font-mono text-neutral-500 border-b border-neutral-800 sticky top-0">
          <span>SEQ</span>
          <span>TIME</span>
          <span>TYPE</span>
          <span>HASH</span>
          <span>SOURCE</span>
        </div>
        
        {/* Mobile Header */}
        <div className="sm:hidden grid grid-cols-[60px_80px_1fr_100px] gap-2 px-3 py-2 bg-[#111111] text-[10px] font-mono text-neutral-500 border-b border-neutral-800 sticky top-0">
          <span>SEQ</span>
          <span>TYPE</span>
          <span>HASH</span>
          <span className="text-right">TIME</span>
        </div>
        
        {rows.map((e, idx) => {
          const t = e.record.type;
          const color = TYPE_COLOR[t];
          const isSelected = selectedSeq === e.seq || selectedIndex === idx;

          return [
            // Desktop row
            <button
              key={`${e.seq}-desktop`}
              onClick={() => handleSelect(e, idx)}
              className={cn(
                "hidden sm:grid w-full text-left grid-cols-[70px_100px_130px_140px_1fr] gap-2 px-3 py-2 border-b border-neutral-800/50 cursor-pointer font-mono text-[11px] transition-colors min-h-[44px] items-center",
                isSelected ? "bg-neutral-800/60" : "hover:bg-neutral-800/30",
                idx % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0d0d0d]"
              )}
            >
              <span className="text-neutral-500">{String(e.seq).padStart(6, "0")}</span>
              <span className="text-neutral-400">{formatTs(e.record.committedAt)}</span>
              <span 
                className={cn(
                  "font-bold px-1.5 py-0.5 rounded text-[10px] w-fit",
                  TYPE_BG[t],
                  TYPE_BORDER[t]
                )}
                style={{ color }}
              >
                {t}
              </span>
              <span className="text-neutral-400">{shortHex(e.eventHash)}</span>
              <span className="text-neutral-500 truncate">{e.record.sourceId}</span>
            </button>,
            // Mobile row
            <button
              key={`${e.seq}-mobile`}
              onClick={() => handleSelect(e, idx)}
              className={cn(
                "sm:hidden w-full text-left grid grid-cols-[60px_80px_1fr_100px] gap-2 px-3 py-2.5 border-b border-neutral-800/50 cursor-pointer font-mono text-[11px] transition-colors min-h-[48px] items-center",
                isSelected ? "bg-neutral-800/60" : "hover:bg-neutral-800/30",
                idx % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0d0d0d]"
              )}
            >
              <span className="text-neutral-500">{String(e.seq).padStart(4, "0")}</span>
              <span 
                className={cn(
                  "font-bold px-1 py-0.5 rounded text-[9px] w-fit truncate",
                  TYPE_BG[t],
                  TYPE_BORDER[t]
                )}
                style={{ color }}
              >
                {t.replace("_", " ")}
              </span>
              <span className="text-neutral-400 truncate">{shortHex(e.eventHash, 4, 4)}</span>
              <span className="text-neutral-500 text-right text-[10px]">{formatTimeMobile(e.record.committedAt)}</span>
            </button>
          ];
        })}
      </div>
    </div>
  );
}
