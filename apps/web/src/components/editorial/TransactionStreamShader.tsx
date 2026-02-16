import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type StreamMode = "default" | "lowLatency" | "reconciliation" | "riskControls";

type StreamConfig = {
  density: number;
  speed: number;
  mergeProbability: number;
  deviation: number;
};

const MODE_CONFIG: Record<StreamMode, StreamConfig> = {
  default: {
    density: 1,
    speed: 0.18,
    mergeProbability: 0.13,
    deviation: 0.12,
  },
  lowLatency: {
    density: 1.25,
    speed: 0.24,
    mergeProbability: 0.2,
    deviation: 0.15,
  },
  reconciliation: {
    density: 1.08,
    speed: 0.19,
    mergeProbability: 0.06,
    deviation: 0.04,
  },
  riskControls: {
    density: 0.94,
    speed: 0.17,
    mergeProbability: 0.04,
    deviation: 0.02,
  },
};

type Pulse = {
  id: number;
  x: number;
  lane: number;
  laneFloat: number;
  targetLane: number | null;
  speedScale: number;
  width: number;
  phase: number;
  splitDone: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(min: number, max: number, value: number) {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width * 0.5, height * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getCappedDpr() {
  const isMobile = window.matchMedia?.("(max-width: 768px)")?.matches ?? false;
  const dprCap = isMobile ? 1.35 : 1.9;
  return Math.min(window.devicePixelRatio || 1, dprCap);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

type TransactionStreamShaderProps = {
  mode: StreamMode;
  className?: string;
};

export function TransactionStreamShader({ mode, className }: TransactionStreamShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetConfigRef = useRef<StreamConfig>(MODE_CONFIG.default);
  const currentConfigRef = useRef<StreamConfig>(MODE_CONFIG.default);

  useEffect(() => {
    targetConfigRef.current = MODE_CONFIG[mode];
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = prefersReducedMotion();
    let rafId = 0;
    let destroyed = false;
    let lastTime = performance.now();
    let nextPulseId = 0;
    let spawnAccumulator = 0;
    let width = 0;
    let height = 0;
    let laneCount = 8;
    let laneGap = 42;
    let padX = 48;
    let padY = 42;
    const pulses: Pulse[] = [];

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = getCappedDpr();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      padX = clamp(width * 0.05, 28, 84);
      padY = clamp(height * 0.12, 26, 72);
      laneCount = clamp(Math.round((height / 56) * 1.1), 5, 14);
      laneGap = laneCount > 1 ? (height - padY * 2) / (laneCount - 1) : height - padY * 2;
    };

    const observer = new ResizeObserver(() => resize());
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    resize();

    const spawnPulse = (cfg: StreamConfig) => {
      const lane = Math.floor(Math.random() * laneCount);
      let targetLane: number | null = null;
      if (Math.random() < cfg.mergeProbability) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const laneCandidate = clamp(lane + direction, 0, laneCount - 1);
        if (laneCandidate !== lane) {
          targetLane = laneCandidate;
        }
      }

      pulses.push({
        id: nextPulseId++,
        x: -0.18 - Math.random() * 0.32,
        lane,
        laneFloat: lane,
        targetLane,
        speedScale: 0.82 + Math.random() * 0.42,
        width: 22 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        splitDone: false,
      });
    };

    const drawStatic = () => {
      context.clearRect(0, 0, width, height);

      const laneGradient = context.createLinearGradient(0, 0, width, 0);
      laneGradient.addColorStop(0, "rgba(56, 189, 248, 0.02)");
      laneGradient.addColorStop(0.5, "rgba(125, 211, 252, 0.08)");
      laneGradient.addColorStop(1, "rgba(16, 185, 129, 0.02)");

      for (let i = 0; i < laneCount; i += 1) {
        const y = padY + laneGap * i;
        context.strokeStyle = laneGradient;
        context.lineWidth = i % 3 === 0 ? 1.2 : 1;
        context.beginPath();
        context.moveTo(padX, y);
        context.lineTo(width - padX, y);
        context.stroke();
      }
    };

    const frame = (time: number) => {
      if (destroyed) return;
      const dt = clamp((time - lastTime) / 1000, 0, 0.05);
      lastTime = time;

      const target = targetConfigRef.current;
      currentConfigRef.current = {
        density: lerp(currentConfigRef.current.density, target.density, 0.08),
        speed: lerp(currentConfigRef.current.speed, target.speed, 0.08),
        mergeProbability: lerp(
          currentConfigRef.current.mergeProbability,
          target.mergeProbability,
          0.08
        ),
        deviation: lerp(currentConfigRef.current.deviation, target.deviation, 0.08),
      };
      const cfg = currentConfigRef.current;

      context.fillStyle = "rgba(5, 8, 12, 0.22)";
      context.fillRect(0, 0, width, height);

      const laneGradient = context.createLinearGradient(0, 0, width, 0);
      laneGradient.addColorStop(0, "rgba(56, 189, 248, 0.04)");
      laneGradient.addColorStop(0.35, "rgba(148, 163, 184, 0.14)");
      laneGradient.addColorStop(0.68, "rgba(16, 185, 129, 0.1)");
      laneGradient.addColorStop(1, "rgba(30, 41, 59, 0.04)");

      for (let i = 0; i < laneCount; i += 1) {
        const y = padY + laneGap * i;
        context.strokeStyle = laneGradient;
        context.lineWidth = i % 3 === 0 ? 1.15 : 1;
        context.beginPath();
        context.moveTo(padX, y);
        context.lineTo(width - padX, y);
        context.stroke();
      }

      spawnAccumulator += dt * (7 + laneCount * 0.36 * cfg.density);
      while (spawnAccumulator >= 1) {
        spawnAccumulator -= 1;
        spawnPulse(cfg);
      }

      const livePulses: Pulse[] = [];
      const trackWidth = width - padX * 2;

      for (let i = 0; i < pulses.length; i += 1) {
        const pulse = pulses[i];
        pulse.x += dt * cfg.speed * pulse.speedScale;

        if (pulse.targetLane !== null) {
          const mergeWindow = smoothstep(0.18, 0.74, pulse.x);
          pulse.laneFloat = lerp(pulse.lane, pulse.targetLane, mergeWindow);
        } else {
          pulse.laneFloat =
            pulse.lane + Math.sin(time * 0.0018 + pulse.phase) * cfg.deviation * 0.25;
        }

        if (!pulse.splitDone && pulse.x > 0.45 && pulse.x < 0.63 && Math.random() < cfg.mergeProbability * 0.02) {
          pulse.splitDone = true;
          const splitDirection = Math.random() > 0.5 ? 1 : -1;
          const splitLane = clamp(pulse.lane + splitDirection, 0, laneCount - 1);
          if (splitLane !== pulse.lane) {
            pulses.push({
              ...pulse,
              id: nextPulseId++,
              lane: splitLane,
              laneFloat: splitLane,
              targetLane: null,
              x: pulse.x - 0.05,
              width: pulse.width * 0.86,
              speedScale: pulse.speedScale * 0.96,
              splitDone: true,
            });
          }
        }

        if (pulse.x > 1.2) continue;
        livePulses.push(pulse);

        const pulseX = padX + pulse.x * trackWidth;
        const pulseY = padY + pulse.laneFloat * laneGap;
        const pulseHeight = clamp(laneGap * 0.32, 5, 11);
        const pulseWidth = pulse.width;

        const tail = context.createLinearGradient(
          pulseX - pulseWidth * 4,
          pulseY,
          pulseX + pulseWidth,
          pulseY
        );
        tail.addColorStop(0, "rgba(56, 189, 248, 0)");
        tail.addColorStop(0.55, "rgba(56, 189, 248, 0.2)");
        tail.addColorStop(1, "rgba(255, 255, 255, 0.55)");

        context.strokeStyle = tail;
        context.lineWidth = Math.max(1.2, pulseHeight * 0.25);
        context.beginPath();
        context.moveTo(pulseX - pulseWidth * 3.8, pulseY);
        context.lineTo(pulseX + pulseWidth * 0.7, pulseY);
        context.stroke();

        context.fillStyle = "rgba(226, 232, 240, 0.9)";
        drawRoundedRect(
          context,
          pulseX - pulseWidth * 0.5,
          pulseY - pulseHeight * 0.5,
          pulseWidth,
          pulseHeight,
          pulseHeight * 0.45
        );
        context.fill();

        context.fillStyle = "rgba(125, 211, 252, 0.8)";
        drawRoundedRect(
          context,
          pulseX - pulseWidth * 0.15,
          pulseY - pulseHeight * 0.23,
          pulseWidth * 0.35,
          pulseHeight * 0.46,
          pulseHeight * 0.2
        );
        context.fill();
      }

      pulses.length = 0;
      pulses.push(...livePulses.slice(-220));
      rafId = window.requestAnimationFrame(frame);
    };

    if (reducedMotion) {
      drawStatic();
      return () => {
        observer.disconnect();
      };
    }

    context.fillStyle = "rgba(5, 8, 12, 1)";
    context.fillRect(0, 0, width, height);
    rafId = window.requestAnimationFrame(frame);

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full opacity-[0.88]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,7,8,0.15),rgba(6,7,8,0.75)_72%,rgba(6,7,8,0.96))]" />
    </div>
  );
}
