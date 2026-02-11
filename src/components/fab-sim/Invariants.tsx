import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Clock, Binary, LockKeyhole } from "lucide-react";

export function Invariants() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Design Invariants</h2>
        <p className="text-slate-400">
          FAB-SIM is governed by the following engineering invariants. These are not features—they are laws.
        </p>
      </div>

      <div className="space-y-6">
        {/* Invariant 1 */}
        <Card className="border-l-4 border-l-amber-500 bg-slate-900/40 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-amber-500 text-amber-500">Invariant 1</Badge>
            </div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Binary className="h-5 w-5 text-slate-400" />
              Determinism Is Absolute
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Given the same seed and configuration, FAB-SIM must produce <strong>bit-for-bit identical outcomes</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-400 pl-4">
              <li>All randomness is seeded</li>
              <li>All chaos is replayable</li>
              <li>All failures are reproducible</li>
            </ul>
            <Alert variant="destructive" className="bg-red-950/20 border-red-900 text-red-200">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Defect Policy</AlertTitle>
              <AlertDescription>
                If a failure cannot be replayed, it is treated as a defect in the simulator.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Invariant 2 */}
        <Card className="border-l-4 border-l-cyan-500 bg-slate-900/40 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-cyan-500 text-cyan-500">Invariant 2</Badge>
            </div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              Time Is a First-Class Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Time is never implicit. FAB-SIM allows engineers to debug <strong>time behavior</strong>, not just application logic.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-400 pl-4">
              <li>Simulation ticks are explicit</li>
              <li>Latency is modeled and injected deterministically</li>
              <li>Ordering and timing are observable</li>
            </ul>
          </CardContent>
        </Card>

        {/* Invariant 3 */}
        <Card className="border-l-4 border-l-emerald-500 bg-slate-900/40 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-emerald-500 text-emerald-500">Invariant 3</Badge>
            </div>
            <CardTitle className="text-xl flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-slate-400" />
              Interfaces Are Contracts, Not Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              All external interfaces are versioned, authenticated, and schema-bound.
            </p>
            <Alert className="bg-amber-950/20 border-amber-900 text-amber-200">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>System Violation</AlertTitle>
              <AlertDescription>
                Breaking a contract is considered a system violation, not a warning.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Invariant 4 */}
        <Card className="border-l-4 border-l-purple-500 bg-slate-900/40 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-purple-500 text-purple-500">Invariant 4</Badge>
            </div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-slate-400" />
              Security Is a Property, Not a Feature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              There are no insecure defaults and no "development-only" bypasses.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-400 pl-4">
              <li>Enforceable</li>
              <li>Testable</li>
              <li>Fail-closed</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
