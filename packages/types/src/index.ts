export type Hex = `0x${string}`;

export type EventType =
  | "CONFIG_COMMIT"
  | "MATERIAL_LOSS"
  | "DUTY_CALCULATED"
  | "DUTY_SEALED";

export interface BaseRecord {
  schemaVersion: number;
  domain: string;
  occurredAt: string;
  committedAt: string;
  eventId: string;
  sourceId: string;
}

export interface MaterialLossEvent extends BaseRecord {
  type: "MATERIAL_LOSS";
  materialId: string;
  quantity: string;
  reason: "CrackThermal" | "MechanicalFailure" | "ProcessExcursion" | "QualityReject" | "Contamination";
}

export interface DutyCalculated extends BaseRecord {
  type: "DUTY_CALCULATED";
  sourceEventHash: Hex;
  materialValue: string;
  dutyRate: string;
  roundingPolicy: "HalfUp" | "HalfEven";
  calculatedDuty: string;
}

export interface DutySealed extends BaseRecord {
  type: "DUTY_SEALED";
  calculationHash: Hex;
  sealedBy: string;
}

export type LedgerRecord =
  | MaterialLossEvent
  | DutyCalculated
  | DutySealed
  | (BaseRecord & { type: "CONFIG_COMMIT" });

export interface LedgerEntry {
  seq: number;
  prevHash: Hex | null;
  record: LedgerRecord;
  eventHash: Hex;
  ledgerHash: Hex;
}

export interface MerkleNode {
  id: string;
  hash: Hex;
  left?: MerkleNode;
  right?: MerkleNode;
  level: number;
}

export interface LineageNode {
  id: string;
  kind: "EVENT" | "CALC" | "SEALED";
  label: string;
  hash: Hex;
  seq: number;
}

export interface LineageEdge {
  from: string;
  to: string;
  label: string;
}
