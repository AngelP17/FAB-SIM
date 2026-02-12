import { useRef } from "react";

export function ConsolePreview() {
  const terminalRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={terminalRef} className="relative group">
      {/* Glow effect - monochrome */}
      <div className="absolute -inset-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
      
      <div className="relative bg-[#0a0a0a] border border-neutral-700/80 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111111] border-b border-neutral-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-600" />
            <div className="w-3 h-3 rounded-full bg-neutral-600" />
            <div className="w-3 h-3 rounded-full bg-neutral-600" />
          </div>
          <div className="ml-3 text-[11px] font-mono text-neutral-500">truthgrid-console — zsh</div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-4 font-mono">
          {/* Event row */}
          <div className="grid grid-cols-[50px_80px_100px_100px_1fr] gap-3 text-[11px]">
            <span className="text-neutral-600">000024</span>
            <span className="text-neutral-500">14:32:18Z</span>
            <span className="text-neutral-300 bg-neutral-700/20 px-2 py-0.5 rounded w-fit border border-neutral-700/30">DUTY_SEALED</span>
            <span className="text-neutral-400">0x8a3f…e291</span>
            <span className="text-neutral-600">sealer_01</span>
          </div>
          
          {/* Merkle root */}
          <div className="flex items-center gap-3 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
            <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center">
              <span className="text-neutral-500 text-xs">#</span>
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-neutral-600 uppercase tracking-wider">Merkle Root</div>
              <div className="text-[12px] text-neutral-400">0x7d2a8f…9e4b1c</div>
            </div>
            <span className="px-2 py-1 bg-white/10 text-white text-[10px] rounded border border-white/20">VALID</span>
          </div>
          
          {/* Seal badge */}
          <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/10 rounded-lg">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs">◆</span>
            </div>
            <span className="text-[12px] font-mono text-white tracking-wider">SEALED (IMMUTABLE)</span>
          </div>
          
          {/* Lineage */}
          <div className="flex items-center gap-2 text-[11px]">
            <div className="px-2 py-1 bg-neutral-800 rounded text-neutral-400">EVENT</div>
            <span className="text-neutral-600">→</span>
            <div className="px-2 py-1 bg-white/10 rounded text-white border border-white/20">CALC</div>
            <span className="text-neutral-600">→</span>
            <div className="px-2 py-1 bg-neutral-700/20 rounded text-neutral-400 border border-neutral-700/30">SEALED</div>
          </div>
        </div>
      </div>
    </div>
  );
}
