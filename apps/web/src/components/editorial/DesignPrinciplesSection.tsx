import { useRef } from "react";
import { 
  Fingerprint, 
  Scale, 
  Lock, 
  Eye, 
  Zap, 
  GitBranch,
  ChevronRight
} from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const PRINCIPLES = [
  {
    number: "01",
    icon: Fingerprint,
    title: "Determinism",
    subtitle: "Same input, same output, always",
    description: "Every operation in TRUTHGRID is deterministic. Given the same seed and parameters, the system produces identical events, calculations, and proofs—every time, on any machine.",
    details: [
      "Seed-based event generation",
      "Reproducible Merkle trees",
      "Cross-platform consistency",
      "Audit replay capability"
    ]
  },
  {
    number: "02",
    icon: Lock,
    title: "Immutability",
    subtitle: "Write once, verify forever",
    description: "Once an event is hashed and chained, it cannot be altered without invalidating the entire sequence. The blockchain-inspired linked hash structure creates tamper-evident audit trails.",
    details: [
      "Cryptographic hash chaining",
      "Tamper detection via root mismatch",
      "Append-only ledger design",
      "Immutable claim sealing"
    ]
  },
  {
    number: "03",
    icon: Eye,
    title: "Transparency",
    subtitle: "Verify without trusting",
    description: "No black boxes. Every calculation, hash, and proof is inspectable. Auditors can independently verify any claim using standard cryptographic tools, without access to proprietary systems.",
    details: [
      "Open verification algorithms",
      "Standard SHA-256 hashing",
      "Published Merkle proofs",
      "No vendor lock-in"
    ]
  },
  {
    number: "04",
    icon: Scale,
    title: "Verifiability",
    subtitle: "Mathematical proof, not promises",
    description: "Claims are backed by cryptographic proofs, not assertions. A Merkle proof provides mathematical certainty that an event was included in a specific batch at a specific time.",
    details: [
      "Merkle inclusion proofs",
      "Root hash publication",
      "Independent validation",
      "Zero-knowledge capable"
    ]
  },
  {
    number: "05",
    icon: Zap,
    title: "Efficiency",
    subtitle: "Verify millions with one hash",
    description: "Merkle tree batching enables efficient verification of massive datasets. Prove any event's inclusion with just log₂(n) hashes, regardless of dataset size.",
    details: [
      "O(log n) proof size",
      "Batch processing",
      "Minimal storage overhead",
      "Sub-second verification"
    ]
  },
  {
    number: "06",
    icon: GitBranch,
    title: "Provenance",
    subtitle: "Complete lineage, end to end",
    description: "Trace any claim back through its entire history—from raw material receipt through production losses to finished goods export. Complete visibility, complete accountability.",
    details: [
      "Event-to-claim lineage",
      "Transformation tracking",
      "Source material linking",
      "Audit trail reconstruction"
    ]
  }
];

const TECH_SPECS = [
  { label: "Hash Algorithm", value: "SHA-256", desc: "NIST FIPS 180-4 compliant" },
  { label: "Tree Structure", value: "Binary Merkle", desc: "Keccak-inspired padding" },
  { label: "Serialization", value: "Canonical JSON", desc: "Deterministic key ordering" },
  { label: "Precision", value: "Decimal128", desc: "34 decimal digits, no float error" },
  { label: "Verification", value: "< 50ms", desc: "Browser-side proof validation" },
  { label: "Throughput", value: "10K+ evt/s", desc: "Single-core batch processing" },
];

export function DesignPrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, []);

  return (
    <section 
      ref={sectionRef}
      id="principles"
      className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 1800px' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-reveal className="max-w-3xl mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Architecture</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] tracking-tight mb-6">
            Design<br />
            <span className="text-neutral-500">Principles</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">
            TRUTHGRID is built on six foundational principles that ensure 
            audit-grade reliability, cryptographic security, and mathematical verifiability.
          </p>
        </div>

        {/* Principles List */}
        <div className="space-y-6 mb-24">
          {PRINCIPLES.map((principle, i) => (
            <div 
              key={i}
              data-reveal
              className="group relative p-8 lg:p-10 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Number & Icon */}
                <div className="lg:col-span-2 flex items-center gap-4 lg:block">
                  <span className="text-4xl font-mono font-bold text-white/10 group-hover:text-white/20 transition-colors">
                    {principle.number}
                  </span>
                  <div className="lg:mt-4 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center lg:mx-0">
                    <principle.icon className="w-6 h-6 text-white/60" />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-6">
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                    {principle.subtitle}
                  </p>
                  <h3 className="font-display text-3xl lg:text-4xl text-white mb-4">
                    {principle.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {principle.description}
                  </p>
                </div>

                {/* Details */}
                <div className="lg:col-span-4">
                  <ul className="space-y-2">
                    {principle.details.map((detail, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-neutral-500">
                        <ChevronRight className="w-4 h-4 text-neutral-700" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specifications */}
        <div data-reveal>
          <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-8">
            Technical Specifications
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_SPECS.map((spec, i) => (
              <div 
                key={i}
                className="p-5 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-wider mb-2">
                  {spec.label}
                </p>
                <p className="text-xl font-mono font-bold text-white mb-1">
                  {spec.value}
                </p>
                <p className="text-xs text-neutral-500">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy Statement */}
        <div data-reveal className="mt-20 p-8 lg:p-12 border border-white/10 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="max-w-3xl">
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-4">
              Core Philosophy
            </p>
            <p className="font-display text-2xl lg:text-3xl xl:text-4xl text-white leading-snug mb-6">
              "Don't trust. Verify."
            </p>
            <p className="text-neutral-400 leading-relaxed">
              TRUTHGRID eliminates trust assumptions from manufacturing audit trails. 
              Every claim is backed by mathematical proof. Every event is cryptographically 
              bound to its predecessors. Every calculation is reproducible and verifiable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
