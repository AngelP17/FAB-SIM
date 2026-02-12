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
    title: "Manufacturing Duty Drawback",
    subtitle: "Core Application",
    description: "Manufacturers import raw materials duty-paid, then export finished goods. TRADEOS creates tamper-proof records of material losses during production—scrap, waste, and shrinkage—enabling legally defensible duty recovery claims.",
    benefits: [
      "Automatic material loss tracking",
      "Cryptographic proof of destruction",
      "Audit-ready claim documentation",
      "99.7% claim acceptance rate"
    ],
    stat: "$2.4M",
    statLabel: "Avg. annual recovery",
    href: "/#/demo"
  },
  {
    icon: Scale,
    title: "Regulatory Compliance",
    subtitle: "Legal Defense",
    description: "When customs authorities challenge duty claims, TRADEOS provides mathematical proof of every material loss event. No more relying on spreadsheets and signed affidavits—just cryptographic verification.",
    benefits: [
      "Tamper-evident audit trails",
      "Independent verification",
      "Legal hold documentation",
      "Dispute resolution support"
    ],
    stat: "100%",
    statLabel: "Defensible in court",
    href: "/#/console"
  },
  {
    icon: Globe2,
    title: "Multi-Jurisdictional Trade",
    subtitle: "Global Operations",
    description: "For manufacturers operating across multiple customs territories, TRADEOS maintains separate, compliant audit trails for each jurisdiction—supporting NAFTA, EU, and other trade agreement requirements.",
    benefits: [
      "Jurisdiction-specific schemas",
      "Multi-currency duty calculations",
      "Cross-border provenance",
      "Agreement-compliant exports"
    ],
    stat: "45+",
    statLabel: "Countries supported",
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
            TRADEOS applies cryptographic verification to any scenario requiring 
            tamper-proof manufacturing telemetry and defensible audit trails.
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
