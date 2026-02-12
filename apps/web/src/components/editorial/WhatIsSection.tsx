import { useRef } from "react";
import { Fingerprint, GitCommit, ShieldCheck, Database, Lock, Layers } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const CORE_PILLARS = [
  {
    icon: Fingerprint,
    title: "Deterministic Generation",
    description: "Every factory event is generated from a cryptographic seed, ensuring identical inputs produce identical outputs—enabling full reproducibility of audit trails."
  },
  {
    icon: GitCommit,
    title: "Immutable Chain",
    description: "Each event hashes the previous event's hash, creating an unbreakable chain of custody. Tampering with any entry invalidates the entire sequence."
  },
  {
    icon: ShieldCheck,
    title: "Merkle Verification",
    description: "Batch events into Merkle trees for efficient verification. Prove inclusion of any event with a compact proof, without revealing the entire dataset."
  },
  {
    icon: Database,
    title: "Schema Enforcement",
    description: "Strict JSON Schema validation ensures every event conforms to expected structure, preventing malformed data from entering the audit trail."
  },
  {
    icon: Lock,
    title: "Sealed Claims",
    description: "Once calculated, duty claims are cryptographically sealed with timestamp and proof, creating legally defensible documentation."
  },
  {
    icon: Layers,
    title: "Provable Lineage",
    description: "Trace any claim back through its constituent events, calculations, and transformations—with mathematical certainty."
  }
];

export function WhatIsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useGsapReveal(sectionRef, []);

  return (
    <section 
      ref={sectionRef}
      id="what-is"
      className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-neutral-950"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}
    >
      <div ref={contentRef} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-reveal className="max-w-3xl mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">System Overview</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] tracking-tight mb-6">
            What is<br />
            <span className="text-neutral-500">TRUTHGRID?</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">
            TRUTHGRID is an audit-grade infrastructure platform for manufacturing telemetry. 
            It generates cryptographically verifiable records of material loss events, 
            enabling manufacturers to claim duty drawbacks with mathematical certainty.
          </p>
        </div>

        {/* The Problem Statement */}
        <div data-reveal className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20 lg:mb-32">
          <div className="space-y-6">
            <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest">The Problem</h3>
            <p className="text-2xl lg:text-3xl text-white leading-snug">
              Manufacturing duty recovery relies on fragmented, trust-based record keeping.
            </p>
            <div className="space-y-4 text-neutral-400 leading-relaxed">
              <p>
                Auditors must manually reconcile spreadsheets, inventory logs, and shipping 
                documents—trusting that each data point hasn't been altered or corrupted.
              </p>
              <p>
                When disputes arise, manufacturers struggle to provide tamper-proof evidence 
                of material losses, resulting in rejected claims and lost revenue.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-sm font-mono text-white uppercase tracking-widest">The Solution</h3>
            <p className="text-2xl lg:text-3xl text-white leading-snug">
              Cryptographically sealed event streams with zero-trust verification.
            </p>
            <div className="space-y-4 text-neutral-400 leading-relaxed">
              <p>
                TRUTHGRID replaces trust with mathematics. Every material loss event is 
                hashed, chained, and batched into Merkle trees—creating tamper-evident 
                audit trails that auditors can verify independently.
              </p>
              <p>
                The result: defensible duty claims backed by cryptographic proofs, 
                not promises.
              </p>
            </div>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div data-reveal>
          <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-10">
            Core Infrastructure
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_PILLARS.map((pillar, i) => (
              <div 
                key={i}
                className="group p-6 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <pillar.icon className="w-5 h-5 text-white/70" />
                </div>
                <h4 className="text-white font-medium text-lg mb-3">{pillar.title}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAB-SIM vs DutyOS */}
        <div data-reveal className="mt-20 lg:mt-32 grid lg:grid-cols-2 gap-8">
          <div className="p-8 lg:p-10 bg-white/[0.02] border border-white/10 rounded-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
              <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Generation Layer</span>
            </div>
            <h4 className="font-display text-3xl lg:text-4xl text-white mb-4">FAB-SIM</h4>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Deterministic factory simulation engine. Generates reproducible material loss 
              events from configurable seeds. Schema-bound, cryptographically hashed, and 
              ready for audit.
            </p>
            <ul className="space-y-2 font-mono text-xs text-neutral-500">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                Seed-based event generation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                SHA-256 cryptographic hashing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                JSON Schema validation
              </li>
            </ul>
          </div>
          
          <div className="p-8 lg:p-10 bg-white/[0.02] border border-white/10 rounded-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
              <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Reconciliation Layer</span>
            </div>
            <h4 className="font-display text-3xl lg:text-4xl text-white mb-4">DutyOS</h4>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Duty reconciliation operating system. Transforms event streams into sealed 
              claims with full provenance. Merkle batching, decimal-precision arithmetic, 
              and zero-knowledge verification.
            </p>
            <ul className="space-y-2 font-mono text-xs text-neutral-500">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                Merkle tree batching
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                Deterministic decimal arithmetic
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                Immutable claim sealing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
