import { useRef, useState } from "react";
import { 
  Factory, 
  Scale, 
  Globe2, 
  Building2, 
  Package,
  FileCheck,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  ChevronRight
} from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
  {
    id: "manufacturing",
    icon: Factory,
    title: "Manufacturing",
    subtitle: "ERP & Shop Floor",
    description: "Connect TRADEOS to your existing manufacturing infrastructure with drop-in agents",
    steps: [
      {
        title: "Install FAB-SIM Agent",
        description: "Deploy lightweight agent on shop floor systems",
        code: "npm install @truthgrid/fabsim-agent"
      },
      {
        title: "Configure Event Sources",
        description: "Connect to PLCs, scales, and vision systems",
        code: `{
  "sources": [
    "plc://192.168.1.100",
    "scale://COM3", 
    "vision://camera-01"
  ]
}`
      },
      {
        title: "Schema Binding",
        description: "Map your material types to duty categories",
        code: `{
  "copper_wire": {
    "hsCode": "7408.19.00",
    "dutyRate": 0.025
  }
}`
      }
    ],
    apiEndpoint: "POST /v1/events/material-loss",
    features: ["Real-time streaming", "Deterministic replay", "Merkle batching"]
  },
  {
    id: "compliance",
    icon: Scale,
    title: "Compliance",
    subtitle: "Legal & Audit",
    description: "Export cryptographically sealed evidence for legal proceedings",
    steps: [
      {
        title: "Evidence Export",
        description: "Generate court-ready documentation bundles",
        code: `POST /v1/evidence/export
{
  "claimId": "claim-2024-001",
  "format": "legal-bundle",
  "includeProofs": true
}`
      },
      {
        title: "Grant Auditor Access",
        description: "Read-only access to sealed events",
        code: `{
  "grantee": "auditor@deloitte.com",
  "scope": ["claim-2024-*"],
  "expires": "2025-12-31"
}`
      },
      {
        title: "Legal Hold",
        description: "Freeze evidence for litigation",
        code: `PUT /v1/evidence/legal-hold
{
  "caseId": "C-2024-8847",
  "preserve": true
}`
      }
    ],
    apiEndpoint: "GET /v1/evidence/verify",
    features: ["Cryptographic proofs", "Third-party verify", "Immutable timestamps"]
  },
  {
    id: "global-trade",
    icon: Globe2,
    title: "Global Trade",
    subtitle: "Multi-Jurisdictional",
    description: "Configure jurisdiction-specific compliance rules for international operations",
    steps: [
      {
        title: "Jurisdiction Profile",
        description: "Set up country-specific duty rules",
        code: `{
  "jurisdiction": "EU",
  "currency": "EUR",
  "schema": "eu-duty-2024-v2"
}`
      },
      {
        title: "Cross-Border Sync",
        description: "Sync events across regional instances",
        code: `{
  "sync": {
    "us": "https://us.tradeos.io",
    "eu": "https://eu.tradeos.io"
  }
}`
      },
      {
        title: "Trade Agreement",
        description: "Apply USMCA, EU MRA, or other agreements",
        code: `{
  "agreement": "USMCA",
  "origin": "US",
  "destination": "MX"
}`
      }
    ],
    apiEndpoint: "POST /v1/trade/calculate-duty",
    features: ["45+ countries", "Multi-currency", "Agreement compliance"]
  },
  {
    id: "enterprise",
    icon: Building2,
    title: "Enterprise",
    subtitle: "Big Four Ready",
    description: "Self-service audit capabilities for accounting firms",
    steps: [
      {
        title: "Auditor Portal",
        description: "Provision read-only auditor accounts",
        code: `POST /v1/access/auditor
{
  "firm": "Deloitte",
  "contact": "auditor@deloitte.com"
}`
      },
      {
        title: "Deterministic Replay",
        description: "Regenerate claims from original seed",
        code: `GET /v1/replay?seed=0x7a3f
→ Reproduces identical events`
      },
      {
        title: "Export to Audit Software",
        description: "Direct integration with workpapers",
        code: `{
  "export": {
    "format": "excel",
    "template": "big-four"
  }
}`
      }
    ],
    apiEndpoint: "GET /v1/audit/replay",
    features: ["Self-service verify", "Deterministic replay", "Standard exports"]
  },
  {
    id: "supply-chain",
    icon: Package,
    title: "Supply Chain",
    subtitle: "Vendor Integration",
    description: "Integrate vendor events into unified audit trail",
    steps: [
      {
        title: "Vendor Onboarding",
        description: "Invite subcontractors to submit events",
        code: `POST /v1/vendors/invite
{
  "name": "SubCo Manufacturing",
  "tier": 1
}`
      },
      {
        title: "Event Submission",
        description: "Vendors submit verified loss events",
        code: `{
  "vendorId": "subco-001",
  "eventType": "material-loss",
  "quantity": 500
}`
      },
      {
        title: "Chain Verification",
        description: "Verify complete chain of custody",
        code: `GET /v1/chain/verify
→ Returns Merkle proof`
      }
    ],
    apiEndpoint: "POST /v1/vendors/events",
    features: ["Vendor verify", "Chain-of-custody", "Zero-trust"]
  },
  {
    id: "insurance",
    icon: FileCheck,
    title: "Insurance",
    subtitle: "Claims & Risk",
    description: "Submit cryptographic evidence for insurance claims",
    steps: [
      {
        title: "Incident Documentation",
        description: "Cryptographically seal incident details",
        code: `{
  "incidentType": "contamination",
  "materialValue": 125000,
  "evidence": ["photo-001"]
}`
      },
      {
        title: "Claim Submission",
        description: "Submit tamper-proof claim",
        code: `POST /v1/insurance/submit
{
  "policyId": "POL-8847",
  "claim": claimHash
}`
      },
      {
        title: "Real-Time Verification",
        description: "Instant claim verification",
        code: `GET /v1/verify/{claimHash}
→ Result < 50ms`
      }
    ],
    apiEndpoint: "POST /v1/insurance/claim",
    features: ["Fraud prevention", "Instant verify", "Crypto evidence"]
  }
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={copy}
          className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg overflow-x-auto">
        <code className="text-[12px] font-mono text-neutral-300 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

export function IntegrationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(INTEGRATIONS[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useGsapReveal(sectionRef, []);

  const activeIntegration = INTEGRATIONS.find(i => i.id === activeTab)!;
  const ActiveIcon = activeIntegration.icon;

  return (
    <section 
      ref={sectionRef}
      id="integration"
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-reveal className="max-w-2xl mb-12">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-4 block">
            Integration Guide
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight mb-4">
            How to Integrate
          </h2>
          <p className="text-base lg:text-lg text-neutral-500 leading-relaxed">
            Connect TRADEOS to your existing systems in minutes. Each integration 
            follows the same pattern: configure, connect, verify.
          </p>
        </div>

        {/* Mobile Dropdown */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <ActiveIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white text-sm">{activeIntegration.title}</p>
                <p className="text-[10px] text-neutral-500">{activeIntegration.subtitle}</p>
              </div>
            </div>
            <ChevronRight className={cn("w-5 h-5 text-neutral-500 transition-transform", mobileMenuOpen && "rotate-90")} />
          </button>
          
          {mobileMenuOpen && (
            <div className="mt-2 p-2 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
              {INTEGRATIONS.map((integration) => {
                const Icon = integration.icon;
                const isActive = activeTab === integration.id;
                return (
                  <button
                    key={integration.id}
                    onClick={() => {
                      setActiveTab(integration.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      isActive ? "bg-white/5" : "hover:bg-white/[0.02]"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral-600")} />
                    <span className={cn("text-sm", isActive ? "text-white" : "text-neutral-400")}>
                      {integration.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Desktop Navigation */}
          <div data-reveal className="hidden lg:block space-y-1">
            {INTEGRATIONS.map((integration) => {
              const Icon = integration.icon;
              const isActive = activeTab === integration.id;
              
              return (
                <button
                  key={integration.id}
                  onClick={() => setActiveTab(integration.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                    isActive 
                      ? "bg-white/5 border border-white/10" 
                      : "hover:bg-white/[0.02] border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    isActive ? "bg-white/10" : "bg-white/5"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-neutral-500"
                    )} />
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      isActive ? "text-white" : "text-neutral-400"
                    )}>
                      {integration.title}
                    </p>
                    <p className="text-[10px] text-neutral-600">{integration.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div data-reveal className="space-y-6">
            {/* Header */}
            <div className="pb-6 border-b border-neutral-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-medium text-white mb-2">
                    {activeIntegration.title}
                  </h3>
                  <p className="text-neutral-400 text-sm lg:text-base">
                    {activeIntegration.description}
                  </p>
                </div>
                <code className="hidden sm:block px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-[11px] font-mono text-neutral-400 whitespace-nowrap">
                  {activeIntegration.apiEndpoint}
                </code>
              </div>
            </div>

            {/* Integration Steps */}
            <div className="space-y-6">
              {activeIntegration.steps.map((step, i) => (
                <div key={i} className="grid sm:grid-cols-[180px_1fr] gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono text-neutral-400">
                        {i + 1}
                      </span>
                      <h4 className="font-medium text-white text-sm">{step.title}</h4>
                    </div>
                    <p className="text-[11px] text-neutral-500 pl-7">{step.description}</p>
                  </div>
                  <CodeBlock code={step.code} />
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 pt-4">
              {activeIntegration.features.map((feature, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-full text-[11px] text-neutral-400"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-6 border-t border-neutral-800">
              <a 
                href="/#/console"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Try in Console
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
