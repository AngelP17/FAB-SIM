import { useState, useEffect, useRef } from "react";
import type { LedgerEntry } from "@truthgrid/types";
import { generateSampleLedger } from "@/lib/sampleData";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Factory,
  Database,
  Calculator,
  Shield,
  CheckCircle2,
  Terminal,
  Hash,
  Activity,
  ExternalLink,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { useGsapHoverPress } from "@/hooks/useGsapHoverPress";
import { useGsapTerminal } from "@/hooks/useGsapTerminal";
import { EventTape } from "@/components/EventTape";
import { MerkleExplorer } from "@/components/MerkleExplorer";
import { LineageGraph } from "@/components/LineageGraph";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";

// Demo scenario steps with narrative flow
type DemoStep = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  narrative: string;
  highlights: string[];
  consoleOutput: string[];
  showEventTape: boolean;
  showMerkle: boolean;
  showLineage: boolean;
  selectedSeq?: number;
  filterType?: "ALL" | "MATERIAL_LOSS" | "DUTY_CALCULATED" | "DUTY_SEALED";
};

const DEMO_STEPS: DemoStep[] = [
  {
    id: "intro",
    title: "Welcome to TRADEOS",
    subtitle: "Evidence-First Audit Infrastructure",
    description: "See how manufacturing events become auditable, immutable records.",
    icon: Factory,
    narrative: "You're the operations manager at a semiconductor fab. Material losses occur daily—but now every gram is tracked with cryptographic precision.",
    highlights: [
      "Every event receives a unique SHA-256 hash",
      "Events are chained: each references the previous",
      "No data can be altered without breaking the chain"
    ],
    consoleOutput: [
      "> TRADEOS Console v2.1.0",
      "> Initializing...",
      "> Connected to: litho_bay_4, CMP-03",
      "> Schema: DUTYOS:MATERIAL_LOSS:V1",
      "> Status: ACTIVE",
      ">",
      "> Ready to demonstrate material loss tracking..."
    ],
    showEventTape: true,
    showMerkle: false,
    showLineage: false,
    filterType: "ALL"
  },
  {
    id: "material-loss",
    title: "Material Loss Event",
    subtitle: "Real-Time Event Capture",
    description: "A thermal crack is detected in wafer processing. The system immediately records this as a MATERIAL_LOSS event.",
    icon: Database,
    narrative: "At 10:23 AM, a thermal crack is detected in wafer lot MAT-2024-001. Within milliseconds, the FAB-SIM agent captures this as a cryptographically sealed event.",
    highlights: [
      "Event ID: evt-0001 with unique hash 0x7a3f...e291",
      "Links to previous event (genesis for first event)",
      "Schema version ensures data consistency"
    ],
    consoleOutput: [
      "> Event captured: MATERIAL_LOSS",
      "  Time: 2024-01-15T10:23:00.000Z",
      "  Material: MAT-2024-001",
      "  Quantity: 4.0000 units",
      "  Reason: CrackThermal",
      "  Source: litho_bay_4",
      ">",
      "> Computing event hash...",
      "  Input: schema(1) + domain(DUTYOS) + canonical(record)",
      "  Output: 0x7a3f8d2e...91b4c8e2",
      ">",
      "> Computing ledger hash...",
      "  Input: prevHash(null) + eventHash",
      "  Output: 0x8e5c3a91...7d2f1b8c"
    ],
    showEventTape: true,
    showMerkle: false,
    showLineage: false,
    selectedSeq: 1,
    filterType: "MATERIAL_LOSS"
  },
  {
    id: "duty-calculation",
    title: "Duty Calculation",
    subtitle: "Automated Derivative Events",
    description: "The system automatically calculates recoverable duty based on material value and duty rate.",
    icon: Calculator,
    narrative: "DutyOS detects the material loss and automatically calculates the recoverable duty: $45,000 × 3.4% = $1,530. This creates a DUTY_CALCULATED event that references the original loss.",
    highlights: [
      "Links to source event via sourceEventHash",
      "Material value: $45,000.00 at 3.4% duty rate",
      "Calculated duty: $1,530.00"
    ],
    consoleOutput: [
      "> Processing duty calculation...",
      "  Source event: 0x7a3f...e291",
      "  Material value: $45,000.00",
      "  Duty rate: 0.034 (3.4%)",
      "  Rounding: HalfUp",
      "",
      "> Calculated: $1,530.00",
      ">",
      "> Creating DUTY_CALCULATED event...",
      "  Event ID: evt-0002",
      "  Links to: evt-0001 (MATERIAL_LOSS)",
      "> Ledger hash: 0x9b4c...f847"
    ],
    showEventTape: true,
    showMerkle: false,
    showLineage: false,
    selectedSeq: 2,
    filterType: "DUTY_CALCULATED"
  },
  {
    id: "duty-sealed",
    title: "Claim Sealed",
    subtitle: "Final Authorization",
    description: "An operator reviews and seals the duty claim, creating an immutable record ready for audit.",
    icon: Shield,
    narrative: "Operator_03 reviews the calculation, confirms accuracy, and seals the claim. This DUTY_SEALED event completes the workflow and makes the claim auditable.",
    highlights: [
      "Sealed by authorized operator",
      "References the calculation event",
      "Ready for CBSA audit"
    ],
    consoleOutput: [
      "> Operator review initiated...",
      "  Operator: operator_03",
      "  Reviewing: evt-0002 (DUTY_CALCULATED)",
      "  Amount: $1,530.00",
      "",
      "> ✓ Calculation verified",
      "> ✓ Material value confirmed",
      "> ✓ Rate applied correctly",
      ">",
      "> Sealing claim...",
      "  Created: DUTY_SEALED event",
      "  Event ID: evt-0003",
      "  Ledger hash: 0x2d8e...a5c9"
    ],
    showEventTape: true,
    showMerkle: false,
    showLineage: false,
    selectedSeq: 3,
    filterType: "DUTY_SEALED"
  },
  {
    id: "lineage",
    title: "Event Lineage",
    subtitle: "Visual Relationship Map",
    description: "See how events connect: Material Loss → Duty Calculated → Duty Sealed.",
    icon: Activity,
    narrative: "The lineage graph shows the complete chain of custody. Each event is connected—creating an unbreakable audit trail from detection to claim.",
    highlights: [
      "Three lanes: EVENT → CALC → SEALED",
      "Arrows show derivation relationships",
      "Click any node to see full details"
    ],
    consoleOutput: [
      "> Building lineage graph...",
      "  Nodes: 24 events",
      "  Edges: 16 relationships",
      "",
      "> Relationships detected:",
      "  MATERIAL_LOSS → DUTY_CALCULATED",
      "  DUTY_CALCULATED → DUTY_SEALED",
      "",
      "> Graph ready.",
      "> Click any node to view details."
    ],
    showEventTape: false,
    showMerkle: false,
    showLineage: true
  },
  {
    id: "merkle",
    title: "Merkle Verification",
    subtitle: "Cryptographic Proof",
    description: "Build a Merkle tree to verify all events are intact and untampered.",
    icon: Hash,
    narrative: "Auditors can verify the entire ledger by computing the Merkle root. If even one bit changes in any event, the root hash will be different—proving tampering.",
    highlights: [
      "Click 'Verify Root' to build the tree",
      "Each leaf is an event hash",
      "Root hash represents entire ledger state"
    ],
    consoleOutput: [
      "> Initializing Merkle tree...",
      "  Algorithm: SHA-256 pairwise hashing",
      "  Leaves: 24 events",
      "",
      "> Building tree levels:",
      "  Level 0: 24 leaves",
      "  Level 1: 12 nodes",
      "  Level 2: 6 nodes",
      "  Level 3: 3 nodes",
      "  Level 4: 2 nodes",
      "  Level 5: 1 root",
      "",
      "> Merkle root: 0x7d2a...9e4b1c",
      "> Status: VALID ✓"
    ],
    showEventTape: false,
    showMerkle: true,
    showLineage: false
  },
  {
    id: "audit",
    title: "Audit Ready",
    subtitle: "CBSA-Compliant Evidence",
    description: "Every claim has cryptographic proof, complete lineage, and deterministic replay capability.",
    icon: Sparkles,
    narrative: "When CBSA auditors arrive, you provide the ledger hash and replay seed. They can independently verify every calculation, seal, and claim—no spreadsheets required.",
    highlights: [
      "Deterministic replay with seed: 0xFA11",
      "All hashes independently verifiable",
      "Sub-50ms verification time"
    ],
    consoleOutput: [
      "> Audit package generated:",
      "  Period: Q4 2024",
      "  Total claims: 8",
      "  Total duty: $8,473.32",
      "  Merkle root: 0x7d2a...9e4b1c",
      "",
      "> Verification data:",
      "  Seed: 0xFA11",
      "  Events: 24",
      "  Schema: DUTYOS:V1",
      "",
      "> Auditor can replay events...",
      "> All calculations deterministic ✓",
      "> AUDIT READY"
    ],
    showEventTape: true,
    showMerkle: true,
    showLineage: true,
    filterType: "ALL"
  }
];

// Console component with typewriter effect
function DemoConsole({ lines, isTyping }: { lines: string[]; isTyping: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div data-terminal className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="ml-3 text-[11px] font-mono text-neutral-500">tradeos-demo — zsh</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-neutral-500">Live</span>
        </div>
      </div>
      <div className="p-3 sm:p-4 font-mono text-[11px] sm:text-[12px] h-48 sm:h-64 overflow-auto">
        {lines.map((line, i) => (
          <div 
            key={i} 
            data-terminal-line
            className={cn(
              "py-0.5",
              line.startsWith(">") ? "text-white" : 
              line.startsWith("  ✓") ? "text-green-400" :
              line.startsWith("  Input:") || line.startsWith("  Output:") ? "text-neutral-500" :
              "text-neutral-500 pl-4"
            )}
          >
            {line}
          </div>
        ))}
        {isTyping && (
          <div className="inline-block w-2 h-4 bg-white/50 animate-pulse mt-1" />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// Step indicator component
function StepIndicator({ 
  steps, 
  currentStep, 
  onStepClick 
}: { 
  steps: DemoStep[]; 
  currentStep: number; 
  onStepClick: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;
        const Icon = step.icon;
        
        return (
          <button
            data-press
            key={step.id}
            onClick={() => onStepClick(index)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all min-w-fit min-h-[44px]",
              isActive 
                ? "bg-white/10 border-white/30" 
                : isComplete
                  ? "bg-white/5 border-white/10 hover:border-white/20"
                  : "bg-transparent border-white/5 hover:border-white/10"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded flex items-center justify-center flex-shrink-0",
              isActive ? "bg-white/20" : isComplete ? "bg-white/10" : "bg-white/5"
            )}>
              {isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <Icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-white" : "text-neutral-600"
                )} />
              )}
            </div>
            <span className={cn(
              "text-[11px] font-medium whitespace-nowrap hidden sm:inline",
              isActive ? "text-white" : isComplete ? "text-neutral-300" : "text-neutral-500"
            )}>
              {step.title}
            </span>
            <span className={cn(
              "text-[11px] font-medium whitespace-nowrap sm:hidden",
              isActive ? "text-white" : isComplete ? "text-neutral-300" : "text-neutral-500"
            )}>
              {index + 1}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="w-3 h-3 text-neutral-700 ml-1 flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Narrative card component
function NarrativeCard({ step }: { step: DemoStep }) {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
          <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-0.5 sm:mb-1">{step.title}</h3>
          <p className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase tracking-wider truncate">{step.subtitle}</p>
        </div>
      </div>
      
      <p className="text-sm text-neutral-400 leading-relaxed mb-3 sm:mb-4">
        {step.narrative}
      </p>
      
      <div className="space-y-1.5 sm:space-y-2">
        {step.highlights.map((highlight, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-white/70 mt-0.5 flex-shrink-0" />
            <span className="text-[11px] sm:text-[11px] text-neutral-400 leading-relaxed">{highlight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FullDemoExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  useGsapReveal(sectionRef, [currentStep]);
  useGsapHoverPress(sectionRef);
  useGsapTerminal(consoleRef, [currentStep, displayedLines.length]);

  const loadEntries = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await generateSampleLedger();
      setEntries(data);
    } catch {
      setLoadError("Unable to initialize deterministic ledger for the demo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load sample data
  useEffect(() => {
    void loadEntries();
  }, []);

  const currentStepData = DEMO_STEPS[currentStep];

  // Typewriter effect for console
  useEffect(() => {
    const lines = currentStepData.consoleOutput;
    setDisplayedLines([]);
    setIsTyping(true);
    
    let currentLine = 0;
    const typeInterval = setInterval(() => {
      if (currentLine < lines.length) {
        setDisplayedLines(prev => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [currentStep, currentStepData.consoleOutput]);

  // Auto-select entry based on step
  useEffect(() => {
    if (currentStepData.selectedSeq && entries.length > 0) {
      const entry = entries.find(e => e.seq === currentStepData.selectedSeq);
      if (entry) {
        setSelectedEntry(entry);
      }
    }
  }, [currentStep, entries, currentStepData.selectedSeq]);

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= DEMO_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const copySeed = () => {
    if (navigator?.clipboard?.writeText) {
      void navigator.clipboard.writeText("0xFA11");
      setCopiedSeed(true);
      setTimeout(() => setCopiedSeed(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neutral-600 font-mono text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-neutral-800 border-t-white rounded-full animate-spin" />
          Initializing TRADEOS Demo...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-neutral-800 bg-neutral-950 rounded-xl p-6 text-center">
          <div className="text-white text-sm font-medium mb-2">TradeOS Full Demo Initialization Failed</div>
          <div className="text-neutral-500 text-sm mb-5">{loadError}</div>
          <button
            onClick={() => { void loadEntries(); }}
            className="px-4 py-2 rounded bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      id="full-demo"
      className="min-h-screen bg-black py-8 lg:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6" data-reveal>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
                <Play className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">Interactive Demo</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight tracking-tight">
                TRADEOS Demo Experience
              </h2>
              <p className="text-neutral-500 mt-2 max-w-2xl">
                Walk through a complete manufacturing scenario—from material loss detection to audit-ready sealed claims.
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                data-press
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                data-press
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors min-h-[44px]"
              >
                {isPlaying ? (
                  <><Pause className="w-5 h-5 text-white" /><span className="text-sm text-white hidden sm:inline">Pause</span></>
                ) : (
                  <><Play className="w-5 h-5 text-white" /><span className="text-sm text-white hidden sm:inline">Play</span></>
                )}
              </button>
              <button
                data-press
                onClick={handleNext}
                disabled={currentStep === DEMO_STEPS.length - 1}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Next step"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              <button
                data-press
                onClick={() => {
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Reset Demo"
                aria-label="Reset demo"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Step Navigator */}
        <div className="mb-6" data-reveal>
          <StepIndicator 
            steps={DEMO_STEPS} 
            currentStep={currentStep} 
            onStepClick={setCurrentStep}
          />
        </div>

        {/* Main Demo Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6" data-reveal>
          {/* Left Column: Narrative + Console */}
          <div className="xl:col-span-4 space-y-4">
            <NarrativeCard step={currentStepData} />
            <div ref={consoleRef}>
              <DemoConsole lines={displayedLines} isTyping={isTyping} />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                <div className="text-xl font-mono font-bold text-white">{entries.length}</div>
                <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Events</div>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                <div className="text-xl font-mono font-bold text-white">8</div>
                <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Claims</div>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                <button
                  data-press
                  onClick={copySeed}
                  className="w-full text-center group"
                >
                  <div className="text-xl font-mono font-bold text-white flex items-center justify-center gap-1">
                    0xFA11
                    {copiedSeed ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-600 group-hover:text-white" />
                    )}
                  </div>
                  <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Seed</div>
                </button>
              </div>
            </div>
          </div>

          {/* Center/Right: Visual Components */}
          <div className="xl:col-span-8 space-y-4">
            {/* Show Event Tape */}
            {currentStepData.showEventTape && (
              <div className="h-[280px] sm:h-[320px] lg:h-[350px]">
                <EventTape 
                  entries={entries}
                  onSelect={setSelectedEntry}
                  selectedSeq={selectedEntry?.seq}
                />
              </div>
            )}

            {/* Show Lineage */}
            {currentStepData.showLineage && (
              <LineageGraph 
                entries={entries}
                onNodeSelect={(hash) => {
                  const entry = entries.find(e => e.eventHash === hash);
                  if (entry) setSelectedEntry(entry);
                }}
                selectedHash={selectedEntry?.eventHash}
              />
            )}

            {/* Show Merkle */}
            {currentStepData.showMerkle && (
              <div className="h-[280px] sm:h-[320px] lg:h-[350px]">
                <MerkleExplorer entries={entries} />
              </div>
            )}

            {/* Evidence Drawer - Compact version for demo */}
            {selectedEntry && (
              <div className="h-[250px] sm:h-[280px] lg:h-[300px]">
                <EvidenceDrawer entry={selectedEntry} />
              </div>
            )}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-xl" data-reveal>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Ready to explore more?</h4>
              <p className="text-[11px] text-neutral-500">Launch the full console with all features</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              data-press
              href="/#/console"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Full Console
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
