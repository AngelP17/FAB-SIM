import { useRef } from "react";
import { Terminal, Github, FileText, Shield } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { 
  HeroSection, 
  ProductStrip, 
  ProcessTimeline, 
  StatsStrip, 
  DemoSection,
  WhatIsSection,
  UseCasesSection,
  ProfessionalsSection,
  DesignPrinciplesSection,
  IntegrationSection,
  ClientDemoSection
} from "@/components/editorial";

// Footer Component
function Footer() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, []);
  
  return (
    <footer ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-neutral-300" />
            </div>
            <span className="font-mono text-lg font-bold text-neutral-200">
              TRUTHGRID
            </span>
          </div>
          
          <div className="flex flex-wrap gap-8">
            <a href="#what-is" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
              <FileText className="w-4 h-4" />
              Documentation
            </a>
            <a href="/#/console" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
              <Terminal className="w-4 h-4" />
              Console
            </a>
            <a href="#principles" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
              <Shield className="w-4 h-4" />
              Security
            </a>
            <a href="#" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[11px] font-mono text-neutral-600">
              © 2025 TruthGrid Systems. All rights reserved.
            </p>
            <p className="text-[11px] font-mono text-neutral-600">
              SIMULATED / DETERMINISTIC — Not connected to live factory systems
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Editorial Sections */}
      <HeroSection />
      <StatsStrip />
      <WhatIsSection />
      <ProductStrip />
      <UseCasesSection />
      <IntegrationSection />
      <ClientDemoSection />
      <ProfessionalsSection />
      <ProcessTimeline />
      <DesignPrinciplesSection />
      <DemoSection />
      <Footer />
    </div>
  );
}
