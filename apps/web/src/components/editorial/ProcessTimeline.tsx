import { useRef, useState, useEffect } from "react";
import { Camera, Filter, Shield, CheckCircle, ArrowRight, Pause, Play } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { cn } from "@/lib/utils";

interface Step {
  number: string;
  title: string;
  description: string;
  details: string[];
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Ingest",
    description: "Vision-to-hash pipeline",
    details: [
      "Computer vision extracts material events",
      "Raw data canonicalized to schema",
      "Initial hash computed (SHA-256)"
    ],
    icon: Camera
  },
  {
    number: "02",
    title: "Normalize",
    description: "Schema + deduplication",
    details: [
      "Validate against versioned schema",
      "Deduplicate identical events",
      "Apply domain transforms"
    ],
    icon: Filter
  },
  {
    number: "03",
    title: "Prove",
    description: "Hash + Merkle root",
    details: [
      "Build Merkle tree from event hashes",
      "Compute batch root",
      "Generate inclusion proofs"
    ],
    icon: Shield
  },
  {
    number: "04",
    title: "Execute",
    description: "DutyOS claim + seal",
    details: [
      "Calculate duty with decimal precision",
      "Create sealed claim snapshot",
      "Append to immutable ledger"
    ],
    icon: CheckCircle
  }
];

const STEP_DURATION = 2000; // 2 seconds per step

function TimelineStep({ 
  step, 
  index, 
  isActive,
  isPast,
  onClick
}: { 
  step: Step; 
  index: number;
  isActive: boolean;
  isPast: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon;
  
  return (
    <button 
      onClick={onClick}
      className="w-full text-left group"
    >
      <div className={cn(
        "relative flex gap-4 lg:gap-6 transition-all duration-300",
        isActive ? 'opacity-100' : 'opacity-60 hover:opacity-80'
      )}>
        {/* Timeline dot and line */}
        <div className="flex flex-col items-center">
          <div 
            className={cn(
              "relative z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center",
              "border-2 transition-all duration-300 flex-shrink-0",
              isActive ? 'bg-white border-white shadow-lg shadow-white/10' : '',
              isPast ? 'bg-white/20 border-white/50' : 'bg-neutral-900 border-neutral-700'
            )}
          >
            <Icon className={cn(
              "w-4 h-4 lg:w-5 lg:h-5 transition-colors",
              isActive ? 'text-black' : isPast ? 'text-white' : 'text-neutral-500'
            )} />
          </div>
          {index < STEPS.length - 1 && (
            <div className="w-px flex-1 bg-neutral-800 my-2 relative overflow-hidden min-h-[40px]">
              <div 
                className={cn(
                  "absolute top-0 left-0 w-full bg-white transition-all duration-500",
                  isPast ? 'h-full' : 'h-0'
                )}
              />
            </div>
          )}
        </div>
        
        {/* Content card */}
        <div className={cn(
          "flex-1 pb-8 lg:pb-12 transition-all duration-300",
          isActive ? 'translate-x-0' : '-translate-x-1'
        )}>
          <div className={cn(
            "p-4 lg:p-6 rounded-xl border transition-all duration-300",
            isActive 
              ? 'bg-neutral-900/80 border-white/20 shadow-lg' 
              : 'bg-neutral-900/20 border-neutral-800'
          )}>
            <div className="flex items-center gap-3 mb-2">
              <span className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded",
                isActive ? 'bg-white/10 text-white' : 'bg-neutral-800 text-neutral-500'
              )}>
                STEP {step.number}
              </span>
              {isActive && (
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Active
                </span>
              )}
            </div>
            
            <h3 className="text-lg lg:text-xl font-semibold text-white mb-1">{step.title}</h3>
            <p className="text-sm text-neutral-400 mb-3">{step.description}</p>
            
            <ul className="space-y-1.5">
              {step.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-xs lg:text-sm text-neutral-500">
                  <span className="w-1 h-1 rounded-full bg-neutral-600 mt-1.5 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </button>
  );
}

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  useGsapReveal(sectionRef, []);

  // Auto-advance with progress bar
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / STEP_DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (elapsed >= STEP_DURATION) {
        setActiveStep(prev => (prev + 1) % STEPS.length);
      }
    };

    const interval = setInterval(updateProgress, 50);
    return () => clearInterval(interval);
  }, [isPlaying, activeStep]);

  const goToStep = (index: number) => {
    setActiveStep(index);
    setIsPlaying(false);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setProgress(0);
  };

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div data-reveal className="text-center mb-12">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-4 block">
            The Pipeline
          </span>
          <h2 className="font-display text-3xl lg:text-5xl text-white mb-4">
            How It Works
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm lg:text-base">
            From factory floor event to cryptographically sealed claim. 
            Every step reproducible, verifiable, immutable.
          </p>
        </div>
        
        {/* Controls */}
        <div data-reveal className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isPlaying ? (
              <><Pause className="w-4 h-4 text-white" /><span className="text-sm text-white">Pause</span></>
            ) : (
              <><Play className="w-4 h-4 text-white" /><span className="text-sm text-white">Play</span></>
            )}
          </button>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={cn(
                  "w-8 h-1 rounded-full transition-all",
                  i === activeStep 
                    ? 'bg-white' 
                    : i < activeStep ? 'bg-white/50' : 'bg-neutral-800'
                )}
                style={i === activeStep && isPlaying ? { 
                  background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)` 
                } : {}}
              />
            ))}
          </div>
        </div>
        
        {/* Timeline */}
        <div data-reveal className="relative">
          {STEPS.map((step, index) => (
            <TimelineStep
              key={step.number}
              step={step}
              index={index}
              isActive={index === activeStep}
              isPast={index < activeStep}
              onClick={() => goToStep(index)}
            />
          ))}
        </div>
        
        {/* Final CTA */}
        <div data-reveal className="mt-8 text-center">
          <a 
            href="/#/console"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            See it in the console
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
