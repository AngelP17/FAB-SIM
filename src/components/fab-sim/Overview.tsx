import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Box, CircuitBoard, Lock, Repeat, Server } from "lucide-react";

export function Overview({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <section className="space-y-6 pt-10 pb-10 border-b border-slate-800">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-500">
            v2.4.0-stable
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Deterministic Industrial <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Systems Testbed
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            A cross-functional Hardware-in-the-Loop (HIL) emulator designed to validate control systems under failure, latency, and security constraints—without physical hardware.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button size="lg" onClick={onStart} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
            Launch Simulator <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            Read Documentation
          </Button>
        </div>
      </section>

      {/* Value Props Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 hover:border-amber-500/50 transition-colors">
          <CardHeader>
            <Repeat className="h-8 w-8 text-cyan-500 mb-2" />
            <CardTitle>Bit-Perfect Replay</CardTitle>
            <CardDescription>
              Replay production incidents with 100% determinism. If it happened once, we can make it happen again.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 hover:border-amber-500/50 transition-colors">
          <CardHeader>
            <Lock className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle>Security First</CardTitle>
            <CardDescription>
              Enforce PKI and RBAC in OT environments. Validate secure interfaces before they touch real hardware.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 hover:border-amber-500/50 transition-colors">
          <CardHeader>
            <CircuitBoard className="h-8 w-8 text-emerald-500 mb-2" />
            <CardTitle>Virtual Hardware</CardTitle>
            <CardDescription>
              Validate HIL behavior without physical PLCs. Save costs and iterate faster on control logic.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* User Personas */}
      <section className="space-y-6 pt-8">
        <h2 className="text-2xl font-bold tracking-tight">Built for Cross-Functional Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { role: "SREs", desc: "Replay production incidents deterministically." },
            { role: "Platform Engineers", desc: "Validate secure, identity-driven interfaces." },
            { role: "Data Engineers", desc: "Generate schema-correct, analytics-ready telemetry." },
            { role: "Security Engineers", desc: "Enforce PKI and RBAC in OT environments." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-slate-800 bg-slate-950">
              <div className="mt-1 bg-slate-800 p-1 rounded">
                <Box className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">{item.role}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
