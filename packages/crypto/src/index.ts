import type { Hex, MerkleNode } from "@truthgrid/types";

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): Hex {
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return `0x${hex}`;
}

export async function sha256Bytes(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", data.buffer as ArrayBuffer);
  return new Uint8Array(digest);
}

export async function sha256Hex(parts: Uint8Array[]): Promise<Hex> {
  const totalLen = parts.reduce((s, p) => s + p.length, 0);
  const buf = new Uint8Array(totalLen);
  let o = 0;
  for (const p of parts) {
    buf.set(p, o);
    o += p.length;
  }
  const digest = await sha256Bytes(buf);
  return bytesToHex(digest);
}

export function stableStringify(obj: unknown): string {
  const seen = new WeakSet();
  const sorter = (value: unknown): unknown => {
    if (value && typeof value === "object") {
      if (seen.has(value)) throw new Error("cycle");
      seen.add(value);

      if (Array.isArray(value)) return value.map(sorter);

      const out: Record<string, unknown> = {};
      for (const k of Object.keys(value).sort()) {
        out[k] = sorter((value as Record<string, unknown>)[k]);
      }
      return out;
    }
    return value;
  };
  return JSON.stringify(sorter(obj));
}

export function utf8(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

export async function merkleParent(left: Hex, right: Hex): Promise<Hex> {
  return sha256Hex([hexToBytes(left), hexToBytes(right)]);
}

export async function buildMerkleTree(leaves: Hex[]): Promise<MerkleNode> {
  if (leaves.length === 0) {
    const h = await sha256Hex([utf8("EMPTY_MERKLE_V1")]);
    return { id: "root", hash: h, level: 0 };
  }

  let nodes: MerkleNode[] = leaves.map((h, i) => ({
    id: `L${i}`,
    hash: h,
    level: 0,
  }));

  let level = 0;
  while (nodes.length > 1) {
    const next: MerkleNode[] = [];
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = nodes[i + 1] ?? nodes[i];
      const parentHash = await merkleParent(left.hash, right.hash);
      next.push({
        id: `N${level + 1}_${Math.floor(i / 2)}`,
        hash: parentHash,
        left,
        right,
        level: level + 1,
      });
    }
    nodes = next;
    level++;
  }
  return { ...nodes[0], id: "root" };
}
