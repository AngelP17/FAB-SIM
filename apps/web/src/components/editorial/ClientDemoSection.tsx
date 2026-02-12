import { useRef, useState, useEffect } from "react";
import { 
  Factory, 
  CheckCircle2, 
  Clock, 
  Shield, 
  Database,
  BarChart3,
  Terminal,
  Play,
  Pause,
  RotateCcw,
  ChevronDown
} from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { cn } from "@/lib/utils";

const DEMO_STEPS = [
  {
    id: "customs",
    title: "AI Customs Agent",
    duration: "Service 1/3",
    description: "Ingest declarations and convert packets into structured customs events",
    icon: Factory,
    events: [
      { time: "09:00", action: "Broker packet received", status: "complete" },
      { time: "09:02", action: "HS and duty class extraction", status: "complete" },
      { time: "09:04", action: "Entry normalized to schema", status: "complete" },
      { time: "09:05", action: "Customs event sealed", status: "complete" }
    ]
  },
  {
    id: "logistics",
    title: "Predictive Logistics",
    duration: "Service 2/3",
    description: "Forecast route and delay risks from customs-linked shipment events",
    icon: Database,
    events: [
      { time: "10:23", action: "Route inference: SHENZHEN -> VAN", status: "complete" },
      { time: "10:25", action: "ETA drift forecast: +19h", status: "complete" },
      { time: "10:27", action: "Port congestion risk: 0.82", status: "complete" },
      { time: "10:28", action: "Forecast event chained", status: "complete" }
    ]
  },
  {
    id: "factoring",
    title: "Invoice Factoring",
    duration: "Service 3/3",
    description: "Execute risk-adjusted factoring decisions from verified logistics evidence",
    icon: BarChart3,
    events: [
      { time: "11:00", action: "Invoice linked to customs + route events", status: "complete" },
      { time: "11:01", action: "Policy model score: LOW-RISK", status: "complete" },
      { time: "11:02", action: "Advance approved: 73% ($32,850)", status: "complete" },
      { time: "11:03", action: "Factoring execution sealed", status: "complete" }
    ]
  },
  {
    id: "audit",
    title: "Audit & Verify",
    duration: "On Demand",
    description: "Auditors verify with cryptographic proof",
    icon: Shield,
    events: [
      { time: "09:00", action: "Auditor accesses portal", status: "complete" },
      { time: "09:05", action: "Merkle root verification", status: "complete" },
      { time: "09:08", action: "Event replay from seed", status: "complete" },
      { time: "09:12", action: "Claim validated", status: "complete" }
    ]
  }
];

const CONSOLE_OUTPUTS: Record<string, string[]> = {
  customs: [
    "> AI Customs Agent intake started...",
    "> Packet source: broker_feed_03",
    "> Schema validation: PASSED",
    "> Fields extracted: 47",
    "> Entity confidence: 0.96",
    "> Event type: CUSTOMS_ENTRY_NORMALIZED"
  ],
  logistics: [
    "> Event: LOGISTICS_FORECAST",
    "  Lane: SHENZHEN -> VANCOUVER",
    "  ETA variance: +19h",
    "  Hash: 0x7a3f...e291",
    "",
    "> Event: EXCEPTION_RISK_SIGNAL",
    "  Risk class: PORT_CONGESTION",
    "",
    "> Event: ROUTE_REPLAN_PROPOSAL",
    "  Confidence: 82%",
    "  Source: predictive_engine_01",
    "  Hash: 0x9b4c...f847"
  ],
  factoring: [
    "> Invoice factoring decision",
    "  Invoice face: $45,000.00",
    "  Logistics risk: MODERATE",
    "  Policy: TOS-FACTOR-V2",
    "  Advance approved: $32,850.00",
    "",
    "> Merkle root computed",
    "  Root: 0x7d2a...9e4b1c",
    "  Leaves: 47",
    "",
    "> Event: INVOICE_EXECUTION_SEALED",
    "  Status: READY_FOR_PAYOUT"
  ],
  audit: [
    "> Auditor access granted",
    "  Firm: Deloitte",
    "  Scope: Q4 2024",
    "",
    "> Verifying claim #CLM-8847",
    "  Event hash: 0x7a3f...e291",
    "  Merkle proof: VALID",
    "",
    "> Deterministic replay",
    "  Seed: 0x7a3f",
    "  Events: 1,247",
    "  Match: 100%",
    "",
    "> AUDIT PASSED"
  ]
};

export function ClientDemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useGsapReveal(sectionRef, []);

  const currentStep = DEMO_STEPS[activeStep];
  const StepIcon = currentStep.icon;

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= DEMO_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Typewriter effect for console
  useEffect(() => {
    const lines = CONSOLE_OUTPUTS[currentStep.id];
    setConsoleLines([]);
    
    let currentLine = 0;
    const typeInterval = setInterval(() => {
      if (currentLine < lines.length) {
        setConsoleLines(prev => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(typeInterval);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [currentStep.id]);

  return (
    <section 
      ref={sectionRef}
      id="demo-experience"
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-reveal className="max-w-2xl mb-12">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-4 block">
            Live Demo
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight mb-4">
            See How It Works
          </h2>
          <p className="text-base lg:text-lg text-neutral-500 leading-relaxed">
            Walk through the in-platform services: AI customs agent, predictive logistics,
            and invoice factoring with deterministic auditability.
          </p>
        </div>

        {/* Mobile Step Selector */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <StepIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white text-sm">{currentStep.title}</p>
                <p className="text-[10px] text-neutral-500">{currentStep.duration}</p>
              </div>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-neutral-500 transition-transform", mobileMenuOpen && "rotate-180")} />
          </button>
          
          {mobileMenuOpen && (
            <div className="mt-2 p-2 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
              {DEMO_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setActiveStep(index);
                      setIsPlaying(false);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      isActive ? "bg-white/5" : "hover:bg-white/[0.02]"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral-600")} />
                    <span className={cn("text-sm", isActive ? "text-white" : "text-neutral-400")}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop Step Navigator */}
          <div data-reveal className="hidden lg:block space-y-2">
            {DEMO_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isComplete = index < activeStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(index);
                    setIsPlaying(false);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all",
                    isActive 
                      ? "bg-white/5 border-white/20" 
                      : "bg-transparent border-transparent hover:border-white/10"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      isActive ? "bg-white/10" : isComplete ? "bg-white/5" : "bg-white/[0.02]"
                    )}>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-neutral-600")} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-medium text-sm", isActive ? "text-white" : "text-neutral-400")}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-neutral-600 mb-1">{step.duration}</p>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Playback Controls */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-neutral-800">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
              >
                {isPlaying ? (
                  <span className="inline-flex items-center gap-2"><Pause className="w-4 h-4" />Pause</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><Play className="w-4 h-4" />Play Demo</span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveStep(0);
                  setIsPlaying(false);
                }}
                className="px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg hover:bg-neutral-900 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Main Demo Area */}
          <div data-reveal className="space-y-4">
            {/* Console Window */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="ml-2 text-[11px] font-mono text-neutral-500">tradeos-console</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-500">Live</span>
                </div>
              </div>

              <div className="p-4 font-mono text-[12px] h-56 overflow-auto">
                {consoleLines.map((line, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "py-0.5",
                      line.startsWith(">") ? "text-white" : "text-neutral-500 pl-4"
                    )}
                  >
                    {line}
                  </div>
                ))}
                <div className="inline-block w-2 h-4 bg-white/50 animate-pulse mt-1" />
              </div>
            </div>

            {/* Event Timeline */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-neutral-500" />
                Event Timeline
              </h4>

              <div className="space-y-2">
                {currentStep.events.map((event, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-4 p-3 bg-white/[0.02] rounded-lg"
                  >
                    <span className="text-[11px] font-mono text-neutral-500 w-10">{event.time}</span>
                    <p className="text-sm text-white flex-1">{event.action}</p>
                    <CheckCircle2 className="w-4 h-4 text-white/30" />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                <div className="text-xl font-mono font-bold text-white">
                  {activeStep === 0 ? "47" : activeStep === 1 ? "82%" : activeStep === 2 ? "$32.8k" : "100%"}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase">
                  {activeStep === 0 ? "Fields" : activeStep === 1 ? "Risk Score" : activeStep === 2 ? "Advance" : "Verified"}
                </div>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                <div className="text-xl font-mono font-bold text-white">
                  {activeStep === 0 ? "<1m" : activeStep === 1 ? "Live" : activeStep === 2 ? "Instant" : "<50ms"}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase">Time</div>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                <div className="text-xl font-mono font-bold text-white">
                  {activeStep === 2 ? "Policy" : "Merkle"}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase">Proof</div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden pt-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg"
              >
                {isPlaying ? <span className="inline-flex items-center gap-2"><Pause className="w-4 h-4" />Pause</span> : <span className="inline-flex items-center gap-2"><Play className="w-4 h-4" />Play</span>}
              </button>
              <button
                onClick={() => { setActiveStep(0); setIsPlaying(false); }}
                className="px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg"
              >
                <RotateCcw className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div data-reveal className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/#/demo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Full Demo Experience
            </a>
            <a 
              href="/#/console"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 border border-neutral-800 text-white text-sm font-medium rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <Terminal className="w-4 h-4" />
              Launch Console
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
