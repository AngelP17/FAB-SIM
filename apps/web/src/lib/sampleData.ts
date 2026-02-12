import type { LedgerEntry, MaterialLossEvent, DutyCalculated, DutySealed } from "@truthgrid/types";
import { sha256Hex, utf8, stableStringify } from "@truthgrid/crypto";

// Generate deterministic sample data for the TradeOS Console

async function generateEventHash(record: unknown, schemaVersion: number, domain: string): Promise<`0x${string}`> {
  const recordCanonical = stableStringify(record);
  return sha256Hex([
    utf8(String(schemaVersion)),
    utf8(domain),
    utf8(recordCanonical),
  ]);
}

async function generateLedgerHash(prevHash: string | null, eventHash: string): Promise<`0x${string}`> {
  // Convert hex strings to bytes
  const prevBytes = prevHash ? 
    new Uint8Array(prevHash.slice(2).match(/.{2}/g)!.map(b => parseInt(b, 16))) : 
    new Uint8Array(0);
  const eventBytes = new Uint8Array(eventHash.slice(2).match(/.{2}/g)!.map(b => parseInt(b, 16)));
  
  return sha256Hex([prevBytes, eventBytes]);
}

export async function generateSampleLedger(): Promise<LedgerEntry[]> {
  const entries: LedgerEntry[] = [];
  let prevHash: `0x${string}` | null = null;
  let seq = 1;

  const now = new Date();
  const baseTime = now.getTime();

  // Helper to create timestamp
  const ts = (offsetMs: number) => new Date(baseTime + offsetMs).toISOString();

  // Material loss events with their corresponding calculations and seals
  const events: Array<{ materialId: string; quantity: string; reason: MaterialLossEvent["reason"]; value: string; rate: string }> = [
    { materialId: "MAT-2024-001", quantity: "4.0000", reason: "CrackThermal", value: "45000.00", rate: "0.034" },
    { materialId: "MAT-2024-002", quantity: "2.5000", reason: "MechanicalFailure", value: "28000.00", rate: "0.041" },
    { materialId: "MAT-2024-003", quantity: "1.8000", reason: "ProcessExcursion", value: "15600.00", rate: "0.038" },
    { materialId: "MAT-2024-004", quantity: "3.2000", reason: "QualityReject", value: "32400.00", rate: "0.045" },
    { materialId: "MAT-2024-005", quantity: "0.9500", reason: "Contamination", value: "8750.00", rate: "0.052" },
    { materialId: "MAT-2024-006", quantity: "5.5000", reason: "CrackThermal", value: "68750.00", rate: "0.034" },
    { materialId: "MAT-2024-007", quantity: "1.2000", reason: "MechanicalFailure", value: "14200.00", rate: "0.041" },
    { materialId: "MAT-2024-008", quantity: "2.8000", reason: "ProcessExcursion", value: "23800.00", rate: "0.038" },
  ];

  for (const evt of events) {
    // Create MATERIAL_LOSS event
    const materialLoss: MaterialLossEvent = {
      schemaVersion: 1,
      domain: "DUTYOS:MATERIAL_LOSS:V1",
      occurredAt: ts(seq * 1000),
      committedAt: ts(seq * 1000 + 100),
      eventId: `evt-${String(seq).padStart(4, "0")}`,
      sourceId: "litho_bay_4",
      type: "MATERIAL_LOSS",
      materialId: evt.materialId,
      quantity: evt.quantity,
      reason: evt.reason,
    };

    const eventHash1 = await generateEventHash(materialLoss, 1, "DUTYOS:MATERIAL_LOSS:V1");
    const ledgerHash1 = await generateLedgerHash(prevHash, eventHash1);

    const entry1: LedgerEntry = {
      seq: seq++,
      prevHash,
      record: materialLoss,
      eventHash: eventHash1,
      ledgerHash: ledgerHash1,
    };

    entries.push(entry1);
    prevHash = ledgerHash1;

    // Create DUTY_CALCULATED event
    const calculatedDuty = (parseFloat(evt.value) * parseFloat(evt.rate)).toFixed(2);
    const dutyCalculated: DutyCalculated = {
      schemaVersion: 1,
      domain: "DUTYOS:DUTY_CALCULATED:V1",
      occurredAt: ts(seq * 1000),
      committedAt: ts(seq * 1000 + 100),
      eventId: `evt-${String(seq).padStart(4, "0")}`,
      sourceId: "CMP-03",
      type: "DUTY_CALCULATED",
      sourceEventHash: eventHash1,
      materialValue: evt.value,
      dutyRate: evt.rate,
      roundingPolicy: "HalfUp",
      calculatedDuty,
    };

    const eventHash2 = await generateEventHash(dutyCalculated, 1, "DUTYOS:DUTY_CALCULATED:V1");
    const ledgerHash2 = await generateLedgerHash(prevHash, eventHash2);

    const entry2: LedgerEntry = {
      seq: seq++,
      prevHash,
      record: dutyCalculated,
      eventHash: eventHash2,
      ledgerHash: ledgerHash2,
    };

    entries.push(entry2);
    prevHash = ledgerHash2;

    // Create DUTY_SEALED event
    const dutySealed: DutySealed = {
      schemaVersion: 1,
      domain: "DUTYOS:DUTY_SEALED:V1",
      occurredAt: ts(seq * 1000),
      committedAt: ts(seq * 1000 + 100),
      eventId: `evt-${String(seq).padStart(4, "0")}`,
      sourceId: "sealer_01",
      type: "DUTY_SEALED",
      calculationHash: eventHash2,
      sealedBy: `operator_${String((seq % 10) + 1).padStart(2, "0")}`,
    };

    const eventHash3 = await generateEventHash(dutySealed, 1, "DUTYOS:DUTY_SEALED:V1");
    const ledgerHash3 = await generateLedgerHash(prevHash, eventHash3);

    const entry3: LedgerEntry = {
      seq: seq++,
      prevHash,
      record: dutySealed,
      eventHash: eventHash3,
      ledgerHash: ledgerHash3,
    };

    entries.push(entry3);
    prevHash = ledgerHash3;
  }

  return entries;
}
