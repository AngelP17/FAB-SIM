import { useState, useEffect, type ElementType } from "react";
import type { LedgerEntry } from "@truthgrid/types";
import { EventTape } from "@/components/EventTape";
import { MerkleExplorer } from "@/components/MerkleExplorer";
import { LineageGraph } from "@/components/LineageGraph";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { generateSampleLedger } from "@/lib/sampleData";
import { cn } from "@/lib/utils";
import { Terminal, Shield, Activity, Database, Menu, X, ArrowLeft, Cpu, Globe2, FileCheck } from "lucide-react";

type PanelType = "workspaces" | "tape" | "merkle" | "lineage";
type ServiceWorkspaceId = "customs" | "logistics" | "factoring";

type WorkspaceItem = {
  id: ServiceWorkspaceId;
  title: string;
  subtitle: string;
  icon: ElementType;
  inputQueue: string[];
  inputPayload: Record<string, unknown>;
  actionLabel: string;
  stages: string[];
  processingLog: string[];
  emittedEvents: string[];
  outputSnapshots: Array<{ label: string; value: string }[]>;
  payloadSnapshots: Record<string, unknown>[];
};

const WORKSPACES: WorkspaceItem[] = [
  {
    id: "customs",
    title: "AI Customs Agent",
    subtitle: "Document to customs entry normalization",
    icon: Cpu,
    inputQueue: [
      "commercial_invoice_INV-7782.pdf",
      "bill_of_lading_BL-SZX-221.pdf",
      "packing_list_PK-0931.csv",
      "broker_addendum_BA-17.txt"
    ],
    inputPayload: {
      packetId: "PKT-2026-00182",
      importer: "Northline Components",
      jurisdiction: "CBSA",
      lane: "CN-CA",
      mode: "ocean",
      replaySeed: "0xFA11"
    },
    actionLabel: "Run Intake",
    stages: [
      "Packet Parsed",
      "Classification Scored",
      "Canonical Entry Sealed"
    ],
    processingLog: [
      "> Parsing packet PKT-2026-00182...",
      "> OCR + entity extraction complete",
      "> HS candidate scoring complete (top confidence: 0.96)",
      "> Duty class mapped: MFN-3.4",
      "> Canonical customs entry emitted"
    ],
    emittedEvents: [
      "CUSTOMS_ENTRY_NORMALIZED",
      "DUTY_CLASS_ASSIGNED",
      "ENTRY_CHAIN_SEALED"
    ],
    outputSnapshots: [
      [
        { label: "Entry ID", value: "ENT-000884" },
        { label: "Extraction Confidence", value: "91%" },
        { label: "Duty Class", value: "Pending Review" }
      ],
      [
        { label: "Entry ID", value: "ENT-000884" },
        { label: "Extraction Confidence", value: "96%" },
        { label: "Duty Class", value: "MFN-3.4" }
      ],
      [
        { label: "Entry ID", value: "ENT-000884" },
        { label: "Extraction Confidence", value: "96%" },
        { label: "Duty Class", value: "MFN-3.4 (Sealed)" }
      ]
    ],
    payloadSnapshots: [
      {
        entryId: "ENT-000884",
        stage: "Packet Parsed",
        extractionConfidence: 0.91
      },
      {
        entryId: "ENT-000884",
        hsCode: "8542.31",
        dutyClass: "MFN-3.4",
        confidence: 0.96,
        stage: "Classification Scored"
      },
      {
        entryId: "ENT-000884",
        hsCode: "8542.31",
        dutyClass: "MFN-3.4",
        confidence: 0.96,
        eventHash: "0x7a3f...e291",
        stage: "Canonical Entry Sealed"
      }
    ]
  },
  {
    id: "logistics",
    title: "Predictive Logistics",
    subtitle: "Route and delay risk forecasting",
    icon: Globe2,
    inputQueue: [
      "customs_entry_ENT-000884",
      "vessel_schedule_VSL-7721",
      "port_congestion_feed_PCF-08",
      "carrier_performance_CP-44"
    ],
    inputPayload: {
      forecastId: "LFX-00912",
      origin: "Shenzhen",
      destination: "Vancouver",
      vessel: "PACIFIC-STAR-17",
      baselineEtaHours: 168,
      replaySeed: "0xFA11"
    },
    actionLabel: "Recompute Forecast",
    stages: [
      "Lane Profiled",
      "Risk Model Scored",
      "Replan Event Emitted"
    ],
    processingLog: [
      "> Loading customs-linked shipment context...",
      "> Running congestion and lane variance models",
      "> Delay probability spike detected",
      "> Re-routing recommendation generated",
      "> Forecast event chain committed"
    ],
    emittedEvents: [
      "LOGISTICS_FORECAST_CREATED",
      "EXCEPTION_RISK_SIGNALLED",
      "ROUTE_REPLAN_PROPOSED"
    ],
    outputSnapshots: [
      [
        { label: "ETA Variance", value: "+7h" },
        { label: "Risk Score", value: "0.49" },
        { label: "Recommendation", value: "Monitor lane" }
      ],
      [
        { label: "ETA Variance", value: "+19h" },
        { label: "Risk Score", value: "0.82" },
        { label: "Recommendation", value: "Shift to rail" }
      ],
      [
        { label: "ETA Variance", value: "+19h" },
        { label: "Risk Score", value: "0.82 (Sealed)" },
        { label: "Recommendation", value: "Replan published" }
      ]
    ],
    payloadSnapshots: [
      {
        forecastId: "LFX-00912",
        laneState: "Profiled",
        etaVarianceHours: 7
      },
      {
        forecastId: "LFX-00912",
        etaVarianceHours: 19,
        riskScore: 0.82,
        recommendation: "Shift final leg to rail",
        stage: "Risk Model Scored"
      },
      {
        forecastId: "LFX-00912",
        etaVarianceHours: 19,
        riskScore: 0.82,
        recommendation: "Shift final leg to rail",
        eventHash: "0x9b4c...f847",
        stage: "Replan Event Emitted"
      }
    ]
  },
  {
    id: "factoring",
    title: "Invoice Factoring",
    subtitle: "Risk-scored financing execution",
    icon: FileCheck,
    inputQueue: [
      "invoice_INV-7782",
      "customs_hash_0x7a3f...e291",
      "logistics_hash_0x9b4c...f847",
      "policy_TOS-FACTOR-V2"
    ],
    inputPayload: {
      factorCaseId: "FCT-00271",
      invoiceFaceValue: 45000,
      currency: "USD",
      requestedAdvancePct: 0.75,
      covenantProfile: "LOW_RISK",
      replaySeed: "0xFA11"
    },
    actionLabel: "Issue Advance",
    stages: [
      "Underwriting Prepared",
      "Advance Approved",
      "Execution Sealed"
    ],
    processingLog: [
      "> Linking invoice to customs + logistics proofs...",
      "> Underwriting policy TOS-FACTOR-V2 loaded",
      "> Advance-rate model execution complete",
      "> Counterparty exposure check: PASS",
      "> Sealed execution packet generated"
    ],
    emittedEvents: [
      "FACTORING_SCORE_COMPUTED",
      "INVOICE_FACTORED",
      "INVOICE_EXECUTION_SEALED"
    ],
    outputSnapshots: [
      [
        { label: "Approved Advance", value: "$0.00" },
        { label: "Advance Rate", value: "Pending" },
        { label: "Execution Status", value: "Underwriting" }
      ],
      [
        { label: "Approved Advance", value: "$32,850.00" },
        { label: "Advance Rate", value: "73%" },
        { label: "Execution Status", value: "Approved" }
      ],
      [
        { label: "Approved Advance", value: "$32,850.00" },
        { label: "Advance Rate", value: "73%" },
        { label: "Execution Status", value: "Ready for payout" }
      ]
    ],
    payloadSnapshots: [
      {
        factorCaseId: "FCT-00271",
        underwritingStatus: "PREPARED",
        requestedAdvancePct: 0.75
      },
      {
        factorCaseId: "FCT-00271",
        approvedAdvancePct: 0.73,
        approvedAdvanceUsd: 32850,
        feeBps: 180,
        executionStatus: "APPROVED"
      },
      {
        factorCaseId: "FCT-00271",
        approvedAdvancePct: 0.73,
        approvedAdvanceUsd: 32850,
        feeBps: 180,
        executionStatus: "READY_FOR_PAYOUT",
        eventHash: "0x2d8e...a5c9"
      }
    ]
  }
];

function WorkspacesPanel({
  workspaceId,
  workspaceProgress,
  onWorkspaceChange,
  onAdvanceWorkspace,
  onResetWorkspace,
  onRunFullChain
}: {
  workspaceId: ServiceWorkspaceId;
  workspaceProgress: Record<ServiceWorkspaceId, number>;
  onWorkspaceChange: (id: ServiceWorkspaceId) => void;
  onAdvanceWorkspace: (id: ServiceWorkspaceId) => void;
  onResetWorkspace: (id: ServiceWorkspaceId) => void;
  onRunFullChain: () => void;
}) {
  const workspace = WORKSPACES.find((item) => item.id === workspaceId) ?? WORKSPACES[0];
  const currentStep = workspaceProgress[workspace.id] ?? 0;
  const maxSteps = workspace.stages.length;
  const isComplete = currentStep >= maxSteps;
  const nextStage = workspace.stages[Math.min(currentStep, maxSteps - 1)] ?? "Completed";

  const finalOutputShape = workspace.outputSnapshots[workspace.outputSnapshots.length - 1] ?? [];
  const outputs =
    currentStep === 0
      ? finalOutputShape.map((item) => ({ ...item, value: "--" }))
      : workspace.outputSnapshots[Math.min(currentStep - 1, workspace.outputSnapshots.length - 1)] ?? finalOutputShape;

  const outputPayload =
    currentStep === 0
      ? {
          status: "PENDING",
          nextAction: workspace.actionLabel
        }
      : workspace.payloadSnapshots[Math.min(currentStep - 1, workspace.payloadSnapshots.length - 1)];

  const processingLog =
    currentStep === 0
      ? []
      : workspace.processingLog.slice(0, Math.min(currentStep + 2, workspace.processingLog.length));
  const emittedEvents = workspace.emittedEvents.slice(0, Math.min(currentStep, workspace.emittedEvents.length));
  const statusLabel = currentStep === 0 ? "READY" : isComplete ? "COMPLETE" : "RUNNING";

  return (
    <div className="h-full border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/95 backdrop-blur-sm flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/70">
        <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">Platform Workspaces</div>
        <div className="mt-1 text-sm text-white">Operational flow: AI Customs Agent | Predictive Logistics | Invoice Factoring</div>
      </div>

      <div className="px-2 py-2 border-b border-neutral-800 bg-neutral-950/70 flex gap-2 overflow-x-auto">
        {WORKSPACES.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === workspace.id;
          return (
            <button
              key={item.id}
              onClick={() => onWorkspaceChange(item.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap",
                isActive
                  ? "bg-cyan-300/10 border-cyan-200/30 text-white"
                  : "bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] font-mono">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div className="px-4 py-3 border-b border-neutral-800 bg-black/45">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="text-sm text-white font-medium">{workspace.title}</div>
            <div className="text-[11px] text-neutral-500">{workspace.subtitle}</div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Step {currentStep}/{maxSteps} | Status: {statusLabel}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAdvanceWorkspace(workspace.id)}
              disabled={isComplete}
              className={cn(
                "px-3 py-2 rounded-md text-[11px] font-mono border transition-colors",
                isComplete
                  ? "bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed"
                  : "bg-cyan-300/15 text-cyan-100 border-cyan-200/30 hover:bg-cyan-300/20"
              )}
            >
              {isComplete ? "Completed" : currentStep === 0 ? workspace.actionLabel : `Advance: ${nextStage}`}
            </button>
            <button
              onClick={() => onResetWorkspace(workspace.id)}
              disabled={currentStep === 0}
              className={cn(
                "px-3 py-2 rounded-md text-[11px] font-mono border transition-colors",
                currentStep === 0
                  ? "bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed"
                  : "bg-black/40 text-neutral-300 border-neutral-700 hover:text-white hover:border-neutral-500"
              )}
            >
              Reset Workspace
            </button>
            <button
              onClick={onRunFullChain}
              className="px-3 py-2 rounded-md text-[11px] font-mono border bg-emerald-300/15 text-emerald-100 border-emerald-200/30 hover:bg-emerald-300/20 transition-colors"
            >
              Run Full Chain
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 border border-neutral-800 rounded-lg bg-black/35 p-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Input Queue</div>
            <div className="space-y-1.5 mb-3">
              {workspace.inputQueue.map((inputName) => (
                <div key={inputName} className="text-[11px] font-mono text-neutral-300 px-2 py-1 rounded bg-neutral-900/70 border border-neutral-800">
                  {inputName}
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Mock Input Payload</div>
            <pre className="text-[10px] font-mono text-neutral-400 bg-black/50 border border-neutral-800 rounded p-2 overflow-auto">
              {JSON.stringify(workspace.inputPayload, null, 2)}
            </pre>
          </div>

          <div className="lg:col-span-4 border border-neutral-800 rounded-lg bg-black/35 p-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Processing Log</div>
            <div className="font-mono text-[11px] space-y-1.5">
              {processingLog.map((line) => (
                <div key={line} className="text-neutral-300">
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 rounded border border-emerald-200/30 bg-emerald-300/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-100 uppercase tracking-widest">Simulation Snapshot Complete</span>
            </div>
          </div>

          <div className="lg:col-span-4 border border-neutral-800 rounded-lg bg-black/35 p-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Operational Output</div>
            <div className="space-y-2 mb-3">
              {outputs.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2 text-[11px] font-mono border border-neutral-800 rounded px-2 py-1.5 bg-neutral-900/70">
                  <span className="text-neutral-500">{item.label}</span>
                  <span className="text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Mock Output Payload</div>
            <pre className="text-[10px] font-mono text-neutral-400 bg-black/50 border border-neutral-800 rounded p-2 overflow-auto">
              {JSON.stringify(outputPayload, null, 2)}
            </pre>
          </div>
        </div>

        <div className="border border-neutral-800 rounded-lg bg-black/35 p-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Emitted Ledger Events</div>
          <div className="flex flex-wrap gap-2">
            {emittedEvents.map((eventName) => (
              <span
                key={eventName}
                className="px-2 py-1 rounded border border-cyan-200/25 bg-cyan-300/10 text-[10px] font-mono text-cyan-100"
              >
                {eventName}
              </span>
            ))}
            {emittedEvents.length === 0 && (
              <span className="text-[10px] font-mono text-neutral-600">No events emitted yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsolePage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>("workspaces");
  const [activeWorkspace, setActiveWorkspace] = useState<ServiceWorkspaceId>("customs");
  const [workspaceProgress, setWorkspaceProgress] = useState<Record<ServiceWorkspaceId, number>>({
    customs: 0,
    logistics: 0,
    factoring: 0
  });

  const loadEntries = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await generateSampleLedger();
      setEntries(data);
    } catch {
      setLoadError("Unable to initialize deterministic ledger. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEntries();
  }, []);

  const handleSelectEntry = (entry: LedgerEntry) => {
    setSelectedEntry(entry);
  };

  const handleNodeSelect = (hash: string) => {
    const entry = entries.find(e => e.eventHash === hash);
    if (entry) {
      setSelectedEntry(entry);
    }
  };

  const handleAdvanceWorkspace = (workspaceId: ServiceWorkspaceId) => {
    const target = WORKSPACES.find((item) => item.id === workspaceId);
    if (!target) return;
    setWorkspaceProgress((prev) => ({
      ...prev,
      [workspaceId]: Math.min(prev[workspaceId] + 1, target.stages.length)
    }));
  };

  const handleResetWorkspace = (workspaceId: ServiceWorkspaceId) => {
    setWorkspaceProgress((prev) => ({ ...prev, [workspaceId]: 0 }));
  };

  const handleRunFullChain = () => {
    const complete = WORKSPACES.reduce<Record<ServiceWorkspaceId, number>>((acc, workspace) => {
      acc[workspace.id] = workspace.stages.length;
      return acc;
    }, { customs: 0, logistics: 0, factoring: 0 });
    setWorkspaceProgress(complete);
    setActiveWorkspace("factoring");
  };

  const workspaceCompletionPct = Math.round(
    (WORKSPACES.reduce((sum, workspace) => sum + Math.min(workspaceProgress[workspace.id], workspace.stages.length), 0) /
      WORKSPACES.reduce((sum, workspace) => sum + workspace.stages.length, 0)) * 100
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neutral-600 font-mono text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          Initializing TradeOS Console...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-neutral-800 bg-neutral-950 rounded-xl p-6 text-center">
          <div className="text-white text-sm font-medium mb-2">TradeOS Console Initialization Failed</div>
          <div className="text-neutral-500 text-sm mb-5">{loadError}</div>
          <button
            onClick={() => { void loadEntries(); }}
            className="px-4 py-2 rounded bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderMainPanel = () => {
    switch (activePanel) {
      case "workspaces":
        return (
          <WorkspacesPanel
            workspaceId={activeWorkspace}
            workspaceProgress={workspaceProgress}
            onWorkspaceChange={setActiveWorkspace}
            onAdvanceWorkspace={handleAdvanceWorkspace}
            onResetWorkspace={handleResetWorkspace}
            onRunFullChain={handleRunFullChain}
          />
        );
      case "tape":
        return (
          <EventTape 
            entries={entries} 
            onSelect={handleSelectEntry}
            selectedSeq={selectedEntry?.seq}
          />
        );
      case "merkle":
        return <MerkleExplorer entries={entries} />;
      case "lineage":
        return (
          <LineageGraph 
            entries={entries} 
            onNodeSelect={handleNodeSelect}
            selectedHash={selectedEntry?.eventHash}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen tradeos-atmo text-neutral-400 font-sans">
      <div className="pointer-events-none absolute inset-0 tradeos-atmo-grid opacity-15" />
      <div className="relative z-10">
      {/* Header */}
      <header className="border-b border-neutral-900">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/#/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-mono text-sm font-bold text-white tracking-wide">
                  TRADEOS<span className="text-neutral-500">::</span>CONSOLE
                </h1>
                <p className="text-[10px] text-neutral-600 font-mono">AI Customs | Predictive Logistics | Invoice Factoring</p>
              </div>
            </a>
          </div>

          {/* Desktop nav - Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-950 rounded-lg p-1 border border-neutral-900">
            <button
              onClick={() => setActivePanel("workspaces")}
              className={cn(
                "px-4 py-2 rounded-md text-[11px] font-mono transition-all flex items-center gap-2",
                activePanel === "workspaces"
                  ? "bg-neutral-800 text-white border border-neutral-700"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
              )}
            >
              <Cpu className="w-3.5 h-3.5" />
              Workspaces
            </button>
            <button
              onClick={() => setActivePanel("tape")}
              className={cn(
                "px-4 py-2 rounded-md text-[11px] font-mono transition-all flex items-center gap-2",
                activePanel === "tape" 
                  ? "bg-neutral-800 text-white border border-neutral-700" 
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
              )}
            >
              <Database className="w-3.5 h-3.5" />
              Event Tape
            </button>
            <button
              onClick={() => setActivePanel("merkle")}
              className={cn(
                "px-4 py-2 rounded-md text-[11px] font-mono transition-all flex items-center gap-2",
                activePanel === "merkle" 
                  ? "bg-neutral-800 text-white border border-neutral-700" 
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              Merkle
            </button>
            <button
              onClick={() => setActivePanel("lineage")}
              className={cn(
                "px-4 py-2 rounded-md text-[11px] font-mono transition-all flex items-center gap-2",
                activePanel === "lineage" 
                  ? "bg-neutral-800 text-white border border-neutral-700" 
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              Lineage
            </button>
          </nav>

          {/* Back button - touch friendly */}
          <a 
            href="/#/"
            className="hidden md:flex px-3 py-2.5 rounded-md text-[11px] font-mono text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors items-center gap-2 border border-neutral-900 min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </a>

          {/* Mobile menu button - larger touch target */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded hover:bg-neutral-900 text-neutral-400 border border-neutral-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-neutral-900 px-4 py-2 space-y-1 bg-neutral-950">
            <button
              onClick={() => { setActivePanel("workspaces"); setMobileMenuOpen(false); }}
              className={cn(
                "w-full px-3 py-3 rounded text-[11px] font-mono transition-colors flex items-center gap-2 min-h-[44px]",
                activePanel === "workspaces" ? "bg-neutral-800 text-white" : "text-neutral-500"
              )}
            >
              <Cpu className="w-3.5 h-3.5" />
              Workspaces
            </button>
            <button
              onClick={() => { setActivePanel("tape"); setMobileMenuOpen(false); }}
              className={cn(
                "w-full px-3 py-3 rounded text-[11px] font-mono transition-colors flex items-center gap-2 min-h-[44px]",
                activePanel === "tape" ? "bg-neutral-800 text-white" : "text-neutral-500"
              )}
            >
              <Database className="w-3.5 h-3.5" />
              Event Tape
            </button>
            <button
              onClick={() => { setActivePanel("merkle"); setMobileMenuOpen(false); }}
              className={cn(
                "w-full px-3 py-3 rounded text-[11px] font-mono transition-colors flex items-center gap-2 min-h-[44px]",
                activePanel === "merkle" ? "bg-neutral-800 text-white" : "text-neutral-500"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              Merkle Explorer
            </button>
            <button
              onClick={() => { setActivePanel("lineage"); setMobileMenuOpen(false); }}
              className={cn(
                "w-full px-3 py-3 rounded text-[11px] font-mono transition-colors flex items-center gap-2 min-h-[44px]",
                activePanel === "lineage" ? "bg-neutral-800 text-white" : "text-neutral-500"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              Lineage Graph
            </button>
            <a
              href="/#/"
              className="w-full px-3 py-3 rounded text-[11px] font-mono text-neutral-500 flex items-center gap-2 min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Landing
            </a>
          </nav>
        )}
      </header>

      {/* Main content - All screens use tabbed layout */}
      <main className="p-2 sm:p-4">
        {(() => {
          const showDrawer = activePanel !== "workspaces";
          return (
        <div className={cn(
          "grid grid-cols-1 gap-2 sm:gap-4 h-[calc(100vh-80px)]",
          showDrawer ? "lg:grid-cols-[minmax(0,1fr)_420px]" : "lg:grid-cols-1"
        )}>
          {/* Main Panel - Shows active tab content */}
          <div className="flex flex-col gap-2 sm:gap-4 min-h-0">
            {renderMainPanel()}
          </div>

          {/* Evidence Drawer - Always visible on desktop, collapses on mobile */}
          {showDrawer && (
            <div className="hidden lg:block">
              <EvidenceDrawer entry={selectedEntry} compact={false} />
            </div>
          )}
        </div>
          );
        })()}

        {/* Mobile Evidence Drawer */}
        {activePanel !== "workspaces" && (
          <div className="lg:hidden mt-2 sm:mt-4">
            <EvidenceDrawer entry={selectedEntry} compact />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-4 py-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600">
          <div className="flex items-center gap-4">
            <span>Events: <span className="text-neutral-300">{entries.length}</span></span>
            <span>Last Seq: <span className="text-neutral-300">{entries.length > 0 ? String(entries[entries.length - 1].seq).padStart(6, "0") : "000000"}</span></span>
            {activePanel === "workspaces" && (
              <span className="contents">
                <span>Workspace: <span className="text-neutral-300">{WORKSPACES.find((w) => w.id === activeWorkspace)?.title ?? "AI Customs Agent"}</span></span>
                <span>Chain completion: <span className="text-neutral-300">{workspaceCompletionPct}%</span></span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>System Operational</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
