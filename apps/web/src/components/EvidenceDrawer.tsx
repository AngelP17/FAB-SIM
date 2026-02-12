import { useState, useEffect, useCallback } from "react";
import type { LedgerEntry } from "@truthgrid/types";
import { stableStringify, sha256Hex, utf8, hexToBytes } from "@truthgrid/crypto";
import { cn } from "@/lib/utils";
import { Check, X, Copy, RefreshCw } from "lucide-react";

interface VerificationResult {
  eventHashValid: boolean | null;
  ledgerHashValid: boolean | null;
  computedEventHash: string;
  computedLedgerHash: string;
}

interface EvidenceDrawerProps {
  entry: LedgerEntry | null;
  onClose?: () => void;
  compact?: boolean;
}

function shortHex(h: string, len = 16) {
  if (!h) return "";
  const x = h.startsWith("0x") ? h.slice(2) : h;
  return `0x${x.slice(0, len)}…${x.slice(-8)}`;
}

export function EvidenceDrawer({ entry, onClose, compact = false }: EvidenceDrawerProps) {
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const verifyHashes = useCallback(async () => {
    if (!entry) return;
    setIsVerifying(true);

    try {
      // Compute event hash from record
      const recordCanonical = stableStringify(entry.record);
      const computedEventHash = await sha256Hex([
        utf8(String(entry.record.schemaVersion)),
        utf8(entry.record.domain),
        utf8(recordCanonical),
      ]);

      // Compute ledger hash from prevHash + eventHash
      const prevHashBytes = entry.prevHash ? hexToBytes(entry.prevHash) : new Uint8Array(0);
      const eventHashBytes = hexToBytes(entry.eventHash);
      const computedLedgerHash = await sha256Hex([prevHashBytes, eventHashBytes]);

      setVerification({
        eventHashValid: computedEventHash === entry.eventHash,
        ledgerHashValid: computedLedgerHash === entry.ledgerHash,
        computedEventHash,
        computedLedgerHash,
      });
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [entry]);

  useEffect(() => {
    if (entry) {
      verifyHashes();
    } else {
      setVerification(null);
    }
  }, [entry, verifyHashes]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  if (!entry) {
    return (
      <div className="border border-neutral-800 rounded-md overflow-hidden bg-[#0a0a0a] h-full flex flex-col">
        <div className="px-3 py-2.5 bg-[#111111] border-b border-neutral-800 font-mono text-[11px] text-neutral-400 tracking-widest uppercase font-semibold">
          Evidence Drawer
        </div>
        <div className="flex-1 flex items-center justify-center text-neutral-500 font-mono text-[11px]">
          Select an event to view evidence
        </div>
      </div>
    );
  }

  const t = entry.record.type;

  return (
    <div className="border border-neutral-800 rounded-md overflow-hidden bg-[#0a0a0a] h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#111111] border-b border-neutral-800">
        <div className="font-mono text-[11px] text-neutral-400 tracking-widest uppercase font-semibold">
          Evidence Drawer
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={verifyHashes}
            disabled={isVerifying}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isVerifying && "animate-spin")} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className={cn("flex-1 overflow-auto space-y-4", compact ? "p-3" : "p-4")}>
        {/* Header info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold",
              t === "MATERIAL_LOSS" ? "bg-neutral-400/10 text-neutral-300 border border-neutral-400/30" :
              t === "DUTY_CALCULATED" ? "bg-neutral-300/10 text-neutral-200 border border-neutral-300/30" :
              t === "DUTY_SEALED" ? "bg-neutral-500/10 text-neutral-400 border border-neutral-500/30" :
              "bg-neutral-500/10 text-neutral-400 border border-neutral-500/30"
            )}>
              {t}
            </span>
            <span className="text-neutral-500 font-mono text-xs">
              SEQ {String(entry.seq).padStart(6, "0")}
            </span>
          </div>
        </div>

        {/* Hash verification */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Hash Verification</div>
          
          {/* Event Hash */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-300">Event Hash</span>
              {verification && (
                <span className={cn(
                  "text-[11px] font-mono flex items-center gap-1",
                  verification.eventHashValid ? "text-white" : "text-neutral-500"
                )}>
                  {verification.eventHashValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {verification.eventHashValid ? "VALID" : "MISMATCH"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded px-2 py-1.5 text-[11px] font-mono text-neutral-300 break-all">
                {shortHex(entry.eventHash, 24)}
              </code>
              <button
                onClick={() => copyToClipboard(entry.eventHash, "eventHash")}
                className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                {copied === "eventHash" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Ledger Hash */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-300">Ledger Hash</span>
              {verification && (
                <span className={cn(
                  "text-[11px] font-mono flex items-center gap-1",
                  verification.ledgerHashValid ? "text-white" : "text-neutral-500"
                )}>
                  {verification.ledgerHashValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {verification.ledgerHashValid ? "VALID" : "MISMATCH"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded px-2 py-1.5 text-[11px] font-mono text-neutral-300 break-all">
                {shortHex(entry.ledgerHash, 24)}
              </code>
              <button
                onClick={() => copyToClipboard(entry.ledgerHash, "ledgerHash")}
                className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                {copied === "ledgerHash" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Previous Hash */}
          <div className="space-y-1">
            <span className="text-xs font-mono text-neutral-300">Previous Hash</span>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded px-2 py-1.5 text-[11px] font-mono text-neutral-400 break-all">
                {entry.prevHash ? shortHex(entry.prevHash, 24) : "null (genesis)"}
              </code>
              {entry.prevHash && (
                <button
                  onClick={() => copyToClipboard(entry.prevHash!, "prevHash")}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  {copied === "prevHash" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Record details */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Record Details</div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <span className="text-neutral-500">Event ID</span>
              <span className="text-neutral-300">{entry.record.eventId}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <span className="text-neutral-500">Source</span>
              <span className="text-neutral-300">{entry.record.sourceId}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <span className="text-neutral-500">Domain</span>
              <span className="text-neutral-300">{entry.record.domain}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <span className="text-neutral-500">Occurred At</span>
              <span className="text-neutral-300">{new Date(entry.record.occurredAt).toISOString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <span className="text-neutral-500">Committed At</span>
              <span className="text-neutral-300">{new Date(entry.record.committedAt).toISOString()}</span>
            </div>

            {/* Type-specific fields */}
            {t === "MATERIAL_LOSS" && (
              <>
                <div className="border-t border-neutral-800 my-2" />
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <span className="text-neutral-500">Material ID</span>
                  <span className="text-neutral-300">{(entry.record as { materialId: string }).materialId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <span className="text-neutral-500">Quantity</span>
                  <span className="text-neutral-300">{(entry.record as { quantity: string }).quantity}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <span className="text-neutral-500">Reason</span>
                  <span className="text-neutral-300">{(entry.record as { reason: string }).reason}</span>
                </div>
              </>
            )}

            {t === "DUTY_CALCULATED" && (
              <>
                <div className="border-t border-neutral-800 my-2" />
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <span className="text-neutral-500">Source Event</span>
                  <span className="text-neutral-400 break-all">
                    {shortHex((entry.record as { sourceEventHash: string }).sourceEventHash, 16)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <span className="text-neutral-500">Material Value</span>
                  <span className="text-neutral-300">${(entry.record as { materialValue: string }).materialValue}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <span className="text-neutral-500">Duty Rate</span>
                  <span className="text-neutral-300">{(entry.record as { dutyRate: string }).dutyRate}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <span className="text-neutral-500">Calculated Duty</span>
                  <span className="text-neutral-200">${(entry.record as { calculatedDuty: string }).calculatedDuty}</span>
                </div>
              </>
            )}

            {t === "DUTY_SEALED" && (
              <>
                <div className="border-t border-neutral-800 my-2" />
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <span className="text-neutral-500">Calculation Hash</span>
                  <span className="text-neutral-400 break-all">
                    {shortHex((entry.record as { calculationHash: string }).calculationHash, 16)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <span className="text-neutral-500">Sealed By</span>
                  <span className="text-neutral-300">{(entry.record as { sealedBy: string }).sealedBy}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Raw JSON */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">Raw Record</div>
          <pre className={cn(
            "bg-neutral-900/50 border border-neutral-800 rounded p-3 text-[11px] font-mono text-neutral-300 overflow-auto",
            compact ? "max-h-40" : "max-h-56"
          )}>
            {JSON.stringify(entry.record, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
