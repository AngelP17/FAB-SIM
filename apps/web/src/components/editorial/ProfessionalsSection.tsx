import { useRef } from "react";
import { 
  Briefcase, 
  ClipboardCheck, 
  HardHat, 
  Gavel,
  LineChart,
  Shield,
  Building,
  Users
} from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const PROFESSIONAL_GROUPS = [
  {
    icon: ClipboardCheck,
    title: "Supply Chain Auditors",
    description: "Verify manufacturing claims with cryptographic certainty. Replay any event stream from its seed to validate calculations.",
    painPoints: [
      "Reconciling disparate data sources",
      "Proving claim validity to regulators",
      "Documenting chain of custody"
    ],
    value: "Self-service verification with mathematical proof"
  },
  {
    icon: Gavel,
    title: "Customs & Trade Attorneys",
    description: "Defend duty drawback claims with tamper-proof evidence. TRADEOS's Merkle proofs hold up in legal proceedings.",
    painPoints: [
      "Incomplete documentation",
      "Disputed material losses",
      "Regulatory uncertainty"
    ],
    value: "Legally defensible claim documentation"
  },
  {
    icon: HardHat,
    title: "Plant Operations Managers",
    description: "Track material losses in real-time. Automated event capture eliminates manual data entry and reduces errors.",
    painPoints: [
      "Manual data collection",
      "Unrecorded material losses",
      "End-of-month reconciliation"
    ],
    value: "Automated, real-time loss tracking"
  },
  {
    icon: LineChart,
    title: "Trade Compliance Officers",
    description: "Ensure adherence to complex customs regulations. Schema enforcement prevents non-compliant data from entering the system.",
    painPoints: [
      "Evolving regulatory requirements",
      "Multi-jurisdictional complexity",
      "Audit preparation"
    ],
    value: "Regulatory-compliant by design"
  },
  {
    icon: Shield,
    title: "Risk Management Directors",
    description: "Mitigate financial and legal risks with immutable audit trails. Insurance claims backed by cryptographic proof.",
    painPoints: [
      "Unverifiable loss claims",
      "Fraud vulnerability",
      "Documentation gaps"
    ],
    value: "Zero-trust verification eliminates risk"
  },
  {
    icon: Building,
    title: "CFOs & Finance Teams",
    description: "Maximize duty recovery with complete visibility. Project cash flows from recoverable duties with confidence.",
    painPoints: [
      "Uncertain recovery amounts",
      "Delayed claim processing",
      "Rejected claims"
    ],
    value: "Predictable, maximized duty recovery"
  }
];

const STAKEHOLDERS = [
  { icon: Users, label: "Big Four Auditors", desc: "EY, Deloitte, PwC, KPMG" },
  { icon: Building, label: "Manufacturers", desc: "Fortune 500 industrials" },
  { icon: Gavel, label: "Trade Advisors", desc: "Customs brokers & consultants" },
  { icon: Shield, label: "Regulators", desc: "CBP, HMRC, EU customs" },
];

export function ProfessionalsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, []);

  return (
    <section 
      ref={sectionRef}
      id="professionals"
      className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 1200px' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-reveal className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Who Uses TRADEOS</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] tracking-tight mb-6">
            Built for<br />
            <span className="text-neutral-500">Professionals</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">
            TRADEOS serves the diverse stakeholders involved in manufacturing 
            duty recovery—from plant floor operators to C-suite executives.
          </p>
        </div>

        {/* Stakeholder Pills */}
        <div data-reveal className="flex flex-wrap gap-3 mb-16">
          {STAKEHOLDERS.map((stakeholder, i) => (
            <div 
              key={i}
              className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/10 rounded-full"
            >
              <stakeholder.icon className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-white font-medium">{stakeholder.label}</span>
              <span className="text-xs text-neutral-600">{stakeholder.desc}</span>
            </div>
          ))}
        </div>

        {/* Professional Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {PROFESSIONAL_GROUPS.map((group, i) => (
            <div 
              key={i}
              data-reveal
              className="group p-6 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-white/10 transition-colors">
                <group.icon className="w-5 h-5 text-white/70" />
              </div>
              
              <h3 className="text-white font-medium text-lg mb-3">{group.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-5">
                {group.description}
              </p>
              
              <div className="space-y-2 mb-5">
                {group.painPoints.map((pain, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-neutral-600">
                    <span className="w-1 h-1 rounded-full bg-neutral-700" />
                    {pain}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-neutral-400">
                  <span className="text-white/60">Value: </span>
                  {group.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote / Testimonial */}
        <div data-reveal className="relative p-8 lg:p-12 bg-white/[0.02] border border-white/10 rounded-2xl">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <blockquote className="font-display text-2xl lg:text-3xl xl:text-4xl text-white leading-snug mb-8">
              "In 20 years of auditing manufacturing claims, I've never seen 
              documentation this bulletproof. The cryptographic verification 
              eliminates every ambiguity."
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white/60" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Senior Trade Compliance Partner</p>
                <p className="text-sm text-neutral-500">Big Four Accounting Firm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
