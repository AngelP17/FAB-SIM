import { useRef } from "react";
import { ArrowRight, Terminal, ChevronDown, Play, ShieldCheck, Hash, Activity } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { useGsapHoverPress } from "@/hooks/useGsapHoverPress";
import { ConsolePreview } from "./ConsolePreview";

const SIGNALS = [
  { label: "Service 1", value: "AI Customs Agent", icon: Hash },
  { label: "Service 2", value: "Predictive Logistics", icon: Activity },
  { label: "Service 3", value: "Invoice Factoring", icon: ShieldCheck },
];

// Main Hero Section
export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useGsapReveal(heroRef, []);
  useGsapHoverPress(contentRef);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#060708]"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(251,146,60,0.14),transparent_32%),radial-gradient(circle_at_56%_86%,rgba(45,212,191,0.12),transparent_38%)]" />
        <div className="absolute inset-0 opacity-20 [background-size:42px_42px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,7,8,0.2),rgba(6,7,8,0.92)_64%,#060708)]" />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/20 flex items-center justify-center">
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
            <a href="/#/console" className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15 transition-colors">
              Console
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div 
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 lg:pt-32 lg:pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left: Headline + Proof System */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div data-reveal className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] font-mono text-white/75 tracking-widest uppercase">Signal-grade manufacturing intelligence</span>
            </div>
            
            {/* Headline */}
            <h1 data-reveal className="leading-[0.9] tracking-tight">
              <span className="block font-display text-6xl sm:text-7xl xl:text-8xl text-white">Factory telemetry,</span>
              <span className="mt-2 block text-4xl sm:text-5xl xl:text-6xl font-semibold text-white">sealed into</span>
              <span className="mt-2 block text-4xl sm:text-5xl xl:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-emerald-200">
                audit-ready claims
              </span>
            </h1>
            
            {/* Subhead */}
            <p data-reveal className="max-w-xl text-base lg:text-lg text-neutral-300 leading-relaxed">
              A single platform service chain: AI customs agent to predictive logistics to invoice factoring, sealed with deterministic replay and cryptographic proofs.
            </p>
            
            {/* CTAs */}
            <div data-reveal className="flex flex-wrap gap-3 pt-2">
              <a 
                href="/#/demo"
                data-press
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-neutral-100 text-black text-sm font-semibold rounded-lg transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                Start Interactive Demo
              </a>
              <a 
                href="/#/console"
                data-press
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white/[0.06] hover:bg-white/[0.12] text-white text-sm font-medium rounded-lg transition-all duration-200 border border-white/20"
              >
                <Terminal className="w-4 h-4" />
                Launch Console
              </a>
            </div>

            {/* Signal chips */}
            <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {SIGNALS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/15 bg-black/45 backdrop-blur-sm px-4 py-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <item.icon className="w-3.5 h-3.5 text-cyan-200/90" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{item.label}</span>
                  </div>
                  <div className="text-sm font-mono text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Console Preview */}
          <div data-reveal className="lg:col-span-5 lg:pl-6">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent" />
              <div className="absolute -inset-8 bg-cyan-500/10 blur-3xl rounded-full" />
              <div className="relative">
                <ConsolePreview />
              </div>
              <div className="absolute -top-5 right-2 px-3 py-1.5 rounded-full border border-amber-200/30 bg-amber-300/15 text-[10px] font-mono uppercase tracking-widest text-amber-100">
                Merkle root valid
              </div>
              <div className="absolute -bottom-5 left-4 px-3 py-1.5 rounded-full border border-emerald-200/30 bg-emerald-300/15 text-[10px] font-mono uppercase tracking-widest text-emerald-100">
                8 claims sealed
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-neutral-500">
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
