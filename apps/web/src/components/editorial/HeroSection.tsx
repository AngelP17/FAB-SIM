import { useRef } from "react";
import { ArrowRight, Terminal, ChevronDown, Play } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { useGsapHoverPress } from "@/hooks/useGsapHoverPress";
import { ConsolePreview } from "./ConsolePreview";
import { cn } from "@/lib/utils";

// Animated arrow component
function AnimatedArrow({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={cn("w-8 h-8 lg:w-12 lg:h-12", className)}
    >
      <path 
        d="M5 12h14M12 5l7 7-7 7" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="arrow-path"
      />
    </svg>
  );
}

// Main Hero Section
export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useGsapReveal(heroRef, []);
  useGsapHoverPress(contentRef);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neutral-500/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-mono text-sm font-bold text-white tracking-wider">
              TRADEOS
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#what-is" className="text-sm text-white/60 hover:text-white transition-colors">What is it</a>
            <a href="#use-cases" className="text-sm text-white/60 hover:text-white transition-colors">Use Cases</a>
            <a href="#principles" className="text-sm text-white/60 hover:text-white transition-colors">Principles</a>
            <a href="/#/console" className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1">
              Console
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div 
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Editorial Typography */}
          <div className="space-y-8">
            {/* Badge */}
            <div data-reveal className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-mono text-white/70 tracking-widest uppercase">Deterministic Audit Infrastructure</span>
            </div>
            
            {/* Massive Headline - Single h1 with spans */}
            <h1 data-reveal className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-white leading-[0.9] tracking-tight">
              <span className="block">Deterministic</span>
              <span className="block">manufacturing</span>
              <span className="block">telemetry</span>
              <span className="flex items-center gap-4 mt-2">
                <AnimatedArrow className="text-white/60 flex-shrink-0" />
                <span className="text-neutral-500">
                  audit-grade duty recovery
                </span>
              </span>
            </h1>
            
            {/* Subhead */}
            <p data-reveal className="text-base lg:text-lg text-neutral-400 max-w-lg leading-relaxed">
              FAB-SIM generates reproducible factory events. DutyOS reconciles them into provable, sealed claims.
            </p>
            
            {/* CTAs */}
            <div data-reveal className="flex flex-wrap gap-4 pt-4">
              <a 
                href="/#/demo"
                data-press
                className="group inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-neutral-200 text-black text-sm font-medium rounded-lg transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                Start Demo Experience
              </a>
              <a 
                href="/#/console"
                data-press
                className="group inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-all duration-200 border border-white/10"
              >
                <Terminal className="w-4 h-4" />
                Launch Console
              </a>
            </div>
          </div>
          
          {/* Right: Console Preview */}
          <div data-reveal className="lg:pl-8">
            <ConsolePreview />
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-600">
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
