import { useRef } from "react";
import { 
  Factory, 
  Scale, 
  FileCheck, 
  Building2, 
  Globe2, 
  Package,
  ArrowUpRight
} from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const USE_CASES = [
  {
    icon: Factory,
    title: "AI Customs Agent",
    subtitle: "Platform Service",
    description: "TradeOS continuously ingests customs declarations, invoices, packing lists, and broker packets. The AI Customs Agent converts unstructured trade documents into schema-bound events ready for compliance and financial decisions.",
    benefits: [
      "Automated document-to-entry conversion",
      "HS code and duty class normalization",
      "Confidence-scored extraction output",
      "Immediate chain-of-custody evidence"
    ],
    stat: "96%",
    statLabel: "Field confidence",
    href: "/#/ai"
  },
  {
    icon: Scale,
    title: "Predictive Logistics",
    subtitle: "Platform Service",
    description: "Using customs-verified events, TradeOS predicts route delays, congestion exposure, and landed-cost variance. Planners receive deterministic, replayable risk signals before disruptions hit margin.",
    benefits: [
      "Lane-level ETA and exception forecasting",
      "Risk event generation for operations teams",
      "Reproducible model outputs",
      "Cross-border movement visibility"
    ],
    stat: "82%",
    statLabel: "Forecast precision",
    href: "/#/console"
  },
  {
    icon: Globe2,
    title: "Invoice Factoring",
    subtitle: "Platform Service",
    description: "TradeOS combines customs truth and logistics forecasts to produce factoring decisions with explicit policy logic, risk scoring, and cryptographic proof of every input used in approval.",
    benefits: [
      "Risk-adjusted advance-rate calculations",
      "Evidence-linked financing packets",
      "Policy-versioned underwriting",
      "Audit-ready payout execution trail"
    ],
    stat: "73%",
    statLabel: "Typical advance",
    href: "/#/console"
  },
  {
    icon: Building2,
    title: "Enterprise Audit",
    subtitle: "Big Four Integration",
    description: "Major accounting firms use TRADEOS to verify manufacturing claims for their clients. The platform's deterministic replay capability allows auditors to regenerate any claim from its original seed.",
    benefits: [
      "Auditor self-service verification",
      "Deterministic replay",
      "Reduced audit time",
      "Standardized documentation"
    ],
    stat: "80%",
    statLabel: "Faster audits",
    href: "/#/demo"
  },
  {
    icon: Package,
    title: "Supply Chain Transparency",
    subtitle: "Vendor Management",
    description: "Track material losses across your entire supply chain. When subcontractors process your materials, their loss events flow into your unified audit trail with cryptographic verification.",
    benefits: [
      "Vendor event integration",
      "Chain-of-custody tracking",
      "Subcontractor verification",
      "Unified audit trail"
    ],
    stat: "Zero",
    statLabel: "Trust required",
    href: "/#/ai"
  },
  {
    icon: FileCheck,
    title: "Insurance Claims",
    subtitle: "Risk Management",
    description: "Material losses from accidents, contamination, or quality failures can be documented with cryptographic certainty. Insurance providers receive tamper-proof evidence supporting claim validity.",
    benefits: [
      "Incident timestamping",
      "Cryptographic evidence",
      "Fraud prevention",
      "Expedited processing"
    ],
    stat: "3x",
    statLabel: "Faster processing",
    href: "/#/console"
  }
];

export function UseCasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, []);

  return (
    <section 
      ref={sectionRef}
      id="use-cases"
      className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 1500px' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-reveal className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Applications</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] tracking-tight mb-6">
            Use Cases
          </h2>
          
          <p className="text-lg lg:text-xl text-neutral-500 leading-relaxed max-w-2xl">
            TRADEOS applies cryptographic verification across customs automation,
            predictive logistics, and invoice factoring workflows.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {USE_CASES.map((useCase, i) => (
            <div 
              key={i}
              data-reveal
              className="group relative p-8 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <useCase.icon className="w-6 h-6 text-white/70" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                      {useCase.subtitle}
                    </p>
                    <h3 className="text-xl font-medium text-white">{useCase.title}</h3>
                  </div>
                </div>
                <a
                  href={useCase.href}
                  className="p-1 rounded text-neutral-600 group-hover:text-white/70 hover:bg-white/5 transition-colors"
                  aria-label={`Open ${useCase.title}`}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>

              {/* Description */}
              <p className="text-neutral-400 leading-relaxed mb-6">
                {useCase.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2 mb-8">
                {useCase.benefits.map((benefit, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-neutral-500">
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Stat */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-white">{useCase.stat}</span>
                  <span className="text-sm text-neutral-500">{useCase.statLabel}</span>
                </div>
                <a
                  href={useCase.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                >
                  Explore use case
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
