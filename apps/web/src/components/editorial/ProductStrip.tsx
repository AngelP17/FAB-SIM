import { useRef } from "react";
import { Database, GitBranch, Lock, ArrowRight, Terminal, Activity, Cpu, Sparkles, FileText, Image } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

// Static data - hoisted outside components for performance
const FABSIM_FEATURES = [
  "Schema-bound event generation",
  "Deterministic replay with seeds",
  "Vision-to-hash pipeline",
  "Real-time event streaming"
];

const DUTYOS_FEATURES = [
  "Decimal arithmetic with explicit rounding",
  "Merkle tree batch verification",
  "Immutable claim sealing",
  "Browser-side proof validation"
];

const TRUST_PROOFS = [
  { icon: Database, title: "Deterministic Replay", desc: "Same seed → same root, always" },
  { icon: Lock, title: "Tamper-evident Ledger", desc: "Event hash + Merkle proof" },
  { icon: Activity, title: "Sealed Claims", desc: "Immutable snapshots with provenance" },
];

const AI_FEATURES = [
  "PDF document extraction with OCR",
  "Image-based inventory recognition",
  "Natural language entity extraction",
  "LangChain orchestration pipeline"
];

// Pre-computed hex values to avoid Math.random() in render
const MOCK_HASHES = [
  "0xa3f7b2c8",
  "0x8d9e1f4a",
  "0x2c5b7e9d",
  "0x7f1a4c6e",
  "0x5b8d3f2a",
  "0x9c4e7b1d"
];

// FAB-SIM Product Card (Monochrome)
function FabsimCard() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal(ref, []);
  
  return (
    <div 
      ref={ref}
      data-reveal
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-700"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="grid lg:grid-cols-2 min-h-[500px]">
        {/* Content */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full w-fit mb-6">
            <Database className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[10px] font-mono text-white/80 tracking-widest uppercase">Event Generation</span>
          </div>
          
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-white leading-[0.95] mb-6">
            FAB-SIM
          </h2>
          
          <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
            Deterministic factory simulation engine. Generate reproducible material loss events with cryptographic provenance and configurable entropy seeds.
          </p>
          
          <ul className="space-y-3 mb-8">
            {FABSIM_FEATURES.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                {item}
              </li>
            ))}
          </ul>
          
          <a 
            href="/#/console"
            className="group inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all"
          >
            Explore FAB-SIM
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        
        {/* Visual */}
        <div className="relative bg-black/20 flex items-center justify-center p-8">
          {/* Simulated device mockup */}
          <div className="relative w-full max-w-sm">
            <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              {/* Mock header */}
              <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                </div>
                <span className="ml-2 text-[10px] font-mono text-white/40">FAB-SIM Event Stream</span>
              </div>
              {/* Mock content */}
              <div className="p-4 space-y-2 font-mono text-[10px]">
                {MOCK_HASHES.map((hash, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60">
                    <span className="text-white/30">{String(i + 1).padStart(5, '0')}</span>
                    <span className="text-neutral-400">MATERIAL_LOSS</span>
                    <span className="text-white/40">{hash}…</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-white/80" />
                <span className="text-xs font-mono text-white/80">Live Stream</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// DutyOS Product Card (Monochrome)
function DutyosCard() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal(ref, []);
  
  return (
    <div 
      ref={ref}
      data-reveal
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="grid lg:grid-cols-2 min-h-[500px]">
        {/* Visual - Left on desktop */}
        <div className="relative bg-black/20 flex items-center justify-center p-8 order-2 lg:order-1">
          <div className="relative w-full max-w-sm">
            <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              {/* Mock console */}
              <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-white/60" />
                <span className="text-[10px] font-mono text-white/40">DutyOS Console</span>
              </div>
              <div className="p-4 space-y-3 font-mono text-[10px]">
                {/* Merkle tree visualization */}
                <div className="flex justify-center">
                  <div className="text-center">
                    <div className="px-3 py-1.5 bg-white/10 border border-white/20 rounded text-white">
                      0x7d2a…9e4b1c
                    </div>
                    <div className="h-4 w-px bg-white/20 mx-auto" />
                    <div className="flex gap-8">
                      <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-neutral-400">0x3a1f…</div>
                      <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-neutral-400">0x8b2e…</div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white/40">Verification:</span>
                  <span className="px-2 py-0.5 bg-white/10 text-white rounded border border-white/20">VALID</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content - Right on desktop */}
        <div className="p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full w-fit mb-6">
            <GitBranch className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[10px] font-mono text-white/80 tracking-widest uppercase">Reconciliation</span>
          </div>
          
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-white leading-[0.95] mb-6">
            DutyOS
          </h2>
          
          <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
            Reconcile factory events into duty calculations with cryptographic verification. Immutable audit trails, Merkle batch proofs, and deterministic arithmetic.
          </p>
          
          <ul className="space-y-3 mb-8">
            {DUTYOS_FEATURES.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                {item}
              </li>
            ))}
          </ul>
          
          <a 
            href="/#/console"
            className="group inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all"
          >
            Explore DutyOS
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// AI Pipeline Card (Monochrome)
function AiPipelineCard() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal(ref, []);
  
  return (
    <div 
      ref={ref}
      data-reveal
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="grid lg:grid-cols-2 min-h-[500px]">
        {/* Content - Left on desktop */}
        <div className="p-8 lg:p-12 flex flex-col justify-center order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full w-fit mb-6">
            <Cpu className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[10px] font-mono text-white/80 tracking-widest uppercase">Document Intelligence</span>
          </div>
          
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-white leading-[0.95] mb-6">
            AI Pipeline
          </h2>
          
          <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
            LangChain-powered document intelligence. Extract, validate, and seal factory data from any source — PDFs, images, emails, or unstructured text.
          </p>
          
          <ul className="space-y-3 mb-8">
            {AI_FEATURES.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                {item}
              </li>
            ))}
          </ul>
          
          <a 
            href="/#/ai"
            className="group inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all"
          >
            Explore AI Pipeline
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        
        {/* Visual - Right on desktop */}
        <div className="relative bg-black/20 flex items-center justify-center p-8 order-2">
          <div className="relative w-full max-w-sm space-y-3">
            {/* AI Pipeline Visual */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 space-y-3">
              {/* Pipeline Steps */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded text-white">
                  <FileText className="w-3 h-3" />
                  <span>PDF</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-600" />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-neutral-300">
                  <Sparkles className="w-3 h-3" />
                  <span>Extract</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-600" />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-neutral-400">
                  <Lock className="w-3 h-3" />
                  <span>Seal</span>
                </div>
              </div>
              
              {/* Mock Extraction Result */}
              <div className="p-2 bg-neutral-900/50 rounded border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span className="text-[10px] text-neutral-500">MaterialLossEvent detected</span>
                </div>
                <div className="font-mono text-[10px] text-neutral-300 space-y-1">
                  <div>materialType: "Copper Wire"</div>
                  <div>quantity: 2500</div>
                  <div>confidence: 0.96</div>
                </div>
              </div>
              
              {/* Hash Badge */}
              <div className="flex items-center gap-2 p-2 bg-neutral-900/50 rounded border border-white/5">
                <span className="text-[10px] text-neutral-600">hash:</span>
                <span className="text-[10px] font-mono text-neutral-300">0x7a3f...e291</span>
                <span className="ml-auto px-1.5 py-0.5 bg-white/10 text-white text-[9px] rounded">SEALED</span>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -bottom-2 -right-2 flex gap-2">
              <div className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Image className="w-3 h-3 text-white/80" />
                  <span className="text-[10px] text-white/80">OCR</span>
                </div>
              </div>
              <div className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-white/80" />
                  <span className="text-[10px] text-white/80">LLM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trust Section (Monochrome)
function TrustSection() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal(ref, []);
  
  return (
    <div 
      ref={ref}
      data-reveal
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10 p-8 lg:p-12"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="relative z-10">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl text-white mb-4">
            Cryptographic Trust
          </h2>
          <p className="text-white/70 text-base max-w-xl mx-auto">
            Every event, calculation, and claim is cryptographically verifiable. No black boxes. No trusted intermediaries.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {TRUST_PROOFS.map((proof, i) => (
            <div 
              key={i}
              className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <proof.icon className="w-6 h-6 text-white/90" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{proof.title}</h3>
              <p className="text-white/60 text-sm">{proof.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
    </div>
  );
}

// Main Product Strip
export function ProductStrip() {
  return (
    <section 
      className="py-24 px-4 sm:px-6 lg:px-8 bg-black"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <FabsimCard />
        <DutyosCard />
        <AiPipelineCard />
        <TrustSection />
      </div>
    </section>
  );
}
