import { useRef } from "react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { useCountUp } from "@/hooks/useCountUp";

// Static data - hoisted outside component
const STATS_DATA = [
  { value: 24783, label: "Events", sublabel: "Processed", color: "text-white" },
  { value: 8259, label: "Claims", sublabel: "Sealed", color: "text-white" },
  { value: 100, label: "Deterministic", sublabel: "Rate", suffix: "%", color: "text-neutral-300" },
  { value: 50, label: "Verification", sublabel: "Latency", prefix: "<", suffix: "ms", color: "text-neutral-400" },
];

// Sparkline SVG component
function Sparkline({ color = "currentColor" }: { color?: string }) {
  // Pre-defined points for visual effect (static, not random)
  const pathD = "M 0 40 L 8 25 L 16 35 L 24 15 L 32 25 L 40 5 L 48 20 L 56 0 L 64 10 L 72 25 L 80 20 L 88 30";
  
  return (
    <svg viewBox="0 0 88 50" className="w-full h-8 opacity-40" preserveAspectRatio="none">
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Single stat item
function StatItem({ 
  value, 
  label, 
  sublabel,
  prefix = "",
  suffix = "",
  color = "text-white"
}: { 
  value: number;
  label: string;
  sublabel: string;
  prefix?: string;
  suffix?: string;
  color?: string;
}) {
  const { count, ref } = useCountUp(value, 2500);
  
  return (
    <div ref={ref} className="text-center p-6">
      <div className={`text-4xl lg:text-5xl font-mono font-bold ${color} tabular-nums tracking-tight mb-2`}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="text-[10px] text-neutral-600">
        {sublabel}
      </div>
      <div className="mt-4">
        <Sparkline color="#666" />
      </div>
    </div>
  );
}

// Pulse indicator
function PulseIndicator({ color = "bg-white" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`}></span>
    </span>
  );
}

// Main Stats Strip
export function StatsStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-16 bg-black border-y border-white/10"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div data-reveal className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <PulseIndicator color="bg-white" />
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">Live Network Activity</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-600">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Healthy
            </span>
            <span>Last block: 14s ago</span>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div data-reveal className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {STATS_DATA.map((stat, i) => (
            <div 
              key={i} 
              className="relative bg-white/[0.02] border border-white/10 rounded-xl hover:border-white/20 transition-colors"
            >
              <StatItem {...stat} />
            </div>
          ))}
        </div>
        
        {/* Bottom info */}
        <div data-reveal className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] font-mono text-neutral-600">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            SHA-256 Verified
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            Merkle Roots Valid
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            Schema v2.1
          </span>
        </div>
      </div>
    </section>
  );
}
