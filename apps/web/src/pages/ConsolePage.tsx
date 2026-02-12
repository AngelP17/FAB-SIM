import { useState, useEffect } from "react";
import type { LedgerEntry } from "@truthgrid/types";
import { EventTape } from "@/components/EventTape";
import { MerkleExplorer } from "@/components/MerkleExplorer";
import { LineageGraph } from "@/components/LineageGraph";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { generateSampleLedger } from "@/lib/sampleData";
import { cn } from "@/lib/utils";
import { Terminal, Shield, Activity, Database, Menu, X, ArrowLeft, PanelRightClose, PanelBottomClose } from "lucide-react";

type PanelType = "tape" | "merkle" | "lineage";
type DrawerPosition = "right" | "bottom";

export default function ConsolePage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>("tape");
  const [drawerPosition, setDrawerPosition] = useState<DrawerPosition>("right");
  const [compactDrawer, setCompactDrawer] = useState(false);

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
    <div className="min-h-screen bg-black text-neutral-400 font-sans">
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
                <p className="text-[10px] text-neutral-600 font-mono">FAB-SIM + DutyOS // Evidence-First Audit Infrastructure</p>
              </div>
            </a>
          </div>

          {/* Desktop nav - Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-950 rounded-lg p-1 border border-neutral-900">
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

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setDrawerPosition((prev) => (prev === "right" ? "bottom" : "right"))}
              className="px-3 py-2 rounded-md text-[11px] font-mono text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-900 transition-colors flex items-center gap-2"
            >
              {drawerPosition === "right" ? <PanelBottomClose className="w-3.5 h-3.5" /> : <PanelRightClose className="w-3.5 h-3.5" />}
              {drawerPosition === "right" ? "Move Drawer Bottom" : "Move Drawer Right"}
            </button>
            <button
              onClick={() => setCompactDrawer((prev) => !prev)}
              className="px-3 py-2 rounded-md text-[11px] font-mono text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-900 transition-colors"
            >
              {compactDrawer ? "Comfortable Drawer" : "Compact Drawer"}
            </button>
          </div>

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
        <div className={cn(
          "grid grid-cols-1 gap-2 sm:gap-4 h-[calc(100vh-80px)]",
          drawerPosition === "right" ? (compactDrawer ? "lg:grid-cols-[minmax(0,1fr)_300px]" : "lg:grid-cols-[minmax(0,1fr)_420px]") : "lg:grid-cols-1"
        )}>
          {/* Main Panel - Shows active tab content */}
          <div className="flex flex-col gap-2 sm:gap-4 min-h-0">
            {renderMainPanel()}
          </div>

          {/* Evidence Drawer - Always visible on desktop, collapses on mobile */}
          <div className={cn("hidden lg:block", drawerPosition === "bottom" && "h-[260px]")}>
            <EvidenceDrawer entry={selectedEntry} compact={compactDrawer} />
          </div>
        </div>

        {/* Mobile Evidence Drawer */}
        <div className="lg:hidden mt-2 sm:mt-4">
          <EvidenceDrawer entry={selectedEntry} compact />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-4 py-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600">
          <div className="flex items-center gap-4">
            <span>Events: <span className="text-neutral-300">{entries.length}</span></span>
            <span>Last Seq: <span className="text-neutral-300">{entries.length > 0 ? String(entries[entries.length - 1].seq).padStart(6, "0") : "000000"}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>System Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
