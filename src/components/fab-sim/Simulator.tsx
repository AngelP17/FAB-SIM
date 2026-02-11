import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity, Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simple pseudo-random number generator for deterministic behavior
const mulberry32 = (a: number) => {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

interface LogEntry {
  tick: number;
  message: string;
  type: 'info' | 'warn' | 'error' | 'security';
}

export function Simulator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tick, setTick] = useState(0);
  const [seed, setSeed] = useState<string>("12345");
  const [speed, setSpeed] = useState([1]);
  const [dataPoints, setDataPoints] = useState<{tick: number, value: number, noise: number}[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset simulation
  const handleReset = () => {
    setIsPlaying(false);
    setTick(0);
    setDataPoints([]);
    setLogs([]);
  };

  // Step simulation
  const step = () => {
    const numericSeed = parseInt(seed) || 12345;
    // Current state depends on Seed + Tick (Deterministic)
    const rng = mulberry32(numericSeed + tick);
    
    // Generate some "sensor data"
    const baseSignal = Math.sin(tick * 0.1) * 50 + 50; // Sine wave
    const noise = (rng() - 0.5) * 20; // Deterministic noise
    const value = Math.max(0, Math.min(100, baseSignal + noise));
    
    // Update data points (keep last 50)
    setDataPoints(prev => {
      const next = [...prev, { tick, value, noise }];
      if (next.length > 50) next.shift();
      return next;
    });

    // Generate logs
    if (tick === 0) {
      addLog(tick, "Simulation initialized. Invariant Check: PASS", 'info');
    }
    if (rng() > 0.95) {
      addLog(tick, "Packet latency spike detected (simulated)", 'warn');
    }
    if (rng() < 0.02) {
      addLog(tick, "Security Handshake: PKI Validation OK", 'security');
    }

    setTick(t => t + 1);
  };

  const addLog = (tick: number, message: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev, { tick, message, type }]);
  };

  // Scroll to bottom of logs
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [logs]);

  // Game loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        step();
      }, 1000 / speed[0]);
    }
    return () => clearInterval(interval);
  }, [isPlaying, tick, seed, speed]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">HIL Simulator</h2>
          <p className="text-muted-foreground">Deterministic runtime environment for industrial validation.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">Tick: {tick.toString().padStart(6, '0')}</Badge>
          <Badge variant={isPlaying ? "default" : "secondary"} className="animate-pulse">
            {isPlaying ? "RUNNING" : "PAUSED"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1 border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-amber-500" />
              Runtime Config
            </CardTitle>
            <CardDescription>Inputs define the deterministic outcome.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="seed">Global Seed</Label>
              <div className="flex gap-2">
                <Input 
                  id="seed" 
                  value={seed} 
                  onChange={(e) => {
                    handleReset(); // Changing seed must reset to maintain determinism invariant
                    setSeed(e.target.value);
                  }}
                  className="font-mono bg-slate-950 border-slate-700"
                />
              </div>
              <p className="text-xs text-muted-foreground">Changing seed resets simulation state.</p>
            </div>

            <div className="space-y-4">
               <Label>Simulation Speed ({speed[0]}x)</Label>
               <Slider 
                value={speed} 
                onValueChange={setSpeed} 
                min={1} 
                max={20} 
                step={1}
                className="py-4" 
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant={isPlaying ? "destructive" : "default"} 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full"
              >
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? "Pause" : "Run"}
              </Button>
              <Button variant="outline" size="icon" onClick={() => step()} disabled={isPlaying}>
                <FastForward className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-500" />
              Telemetry Stream
            </CardTitle>
            <CardDescription>Real-time deterministic sensor data.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="tick" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickFormatter={(val) => val % 10 === 0 ? val : ''}
                />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#06b6d4" 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false} // Important for performance in high freq
                />
                <Line 
                  type="monotone" 
                  dataKey="noise" 
                  stroke="#64748b" 
                  strokeWidth={1} 
                  dot={false} 
                  opacity={0.5}
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Logs */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-500" />
            System Events
          </CardTitle>
          <CardDescription>Audit log of all system interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border border-slate-800 bg-slate-950 p-4" ref={scrollRef}>
            <div className="space-y-1 font-mono text-sm">
              {logs.length === 0 && <span className="text-muted-foreground">System ready. Waiting for start...</span>}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-slate-500 shrink-0">[{log.tick.toString().padStart(6, '0')}]</span>
                  <span className={
                    log.type === 'warn' ? 'text-amber-500' : 
                    log.type === 'error' ? 'text-red-500' : 
                    log.type === 'security' ? 'text-purple-400' : 
                    'text-slate-300'
                  }>
                    {log.type.toUpperCase().padEnd(5)} {log.message}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
