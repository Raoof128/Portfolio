"use client";

import { useEffect, useRef, useCallback } from "react";
import { createCanvasPlayback, type CanvasPlayback } from "./canvas-playback";

/* ── palette ── */
const C = {
  blueStrong: "#0067A5",
  blueVividPale: "#BCD4E6",
  blueVivid: "#1C39BB",
  blueVividPurplish: "#32127A",
  greenBrilliant: "#00A693",
  greenModerate: "#317873",
  orangeVivid: "#F38400",
  redVividPurplish: "#FE28A2",
  pinkDeep: "#F77FBE",
  redVivid: "#CC3333",
} as const;

const CFG = {
  scale: 55,
  perspective: 600,
  tentacleCount: 16,
  tentacleLength: 20,
  tentacleSpacing: 7,
  pulseSpeed: 0.025,
  swimSpeed: 0.02,
  particleCount: 80,
} as const;

interface Seg {
  x: number;
  y: number;
  z: number;
}
type ProjectFn = (
  p: Seg,
  rx: number,
  ry: number,
) => { x: number; y: number; scale: number };

/* ── module-level Tentacle factory (avoids inline class in hook) ── */
interface TentacleData {
  angleOffset: number;
  radius: number;
  type: "inner" | "outer";
  segments: Seg[];
}

function makeTentacle(
  angleOffset: number,
  radius: number,
  type: "inner" | "outer",
): TentacleData {
  const len = type === "inner" ? 12 : CFG.tentacleLength;
  return {
    angleOffset,
    radius,
    type,
    // Start in a complete resting pose, including when reduced motion is set.
    segments: Array.from({ length: len }, (_, index) => ({
      x: Math.cos(angleOffset) * radius,
      y:
        (type === "inner" ? 40 : 20) +
        index * (type === "inner" ? 5 : CFG.tentacleSpacing),
      z: Math.sin(angleOffset) * radius,
    })),
  };
}

function followSeg(seg: Seg, tx: number, ty: number, tz: number, step: number) {
  const follow = 1 - Math.pow(1 - 0.15, step);
  seg.x += (tx - seg.x) * follow;
  seg.y += (ty - seg.y) * follow;
  seg.z += (tz - seg.z) * follow;
}

function updateTentacle(
  t: TentacleData,
  headX: number,
  headY: number,
  headZ: number,
  pulse: number,
  frame: number,
  step: number,
) {
  const r = t.radius * (1 + pulse * (t.type === "inner" ? 0.05 : 0.2));
  followSeg(
    t.segments[0],
    headX + Math.cos(t.angleOffset) * r,
    headY + (t.type === "inner" ? 40 : 20),
    headZ + Math.sin(t.angleOffset) * r,
    step,
  );
  const spacing = t.type === "inner" ? 5 : CFG.tentacleSpacing;
  for (let i = 1; i < t.segments.length; i++) {
    const prev = t.segments[i - 1];
    followSeg(t.segments[i], prev.x, prev.y + spacing, prev.z, step);
  }
  const tip = t.segments[t.segments.length - 1];
  const ds = t.type === "inner" ? 0.1 : 0.05;
  const dm = t.type === "inner" ? 2 : 0.5;
  tip.x += Math.sin(frame * ds + t.angleOffset) * dm * step;
  tip.z += Math.cos(frame * ds + t.angleOffset) * dm * step;
}

function drawTentacle(
  t: TentacleData,
  ctx: CanvasRenderingContext2D,
  project: ProjectFn,
  rx: number,
  ry: number,
  step: number,
) {
  ctx.beginPath();
  let first = true;
  for (const s of t.segments) {
    const p = project(s, rx, ry);
    if (first) {
      ctx.moveTo(p.x, p.y);
      first = false;
    } else ctx.lineTo(p.x, p.y);
  }
  ctx.lineWidth = t.type === "inner" ? 3 : 1.5;
  ctx.globalAlpha = t.type === "inner" ? 0.8 : 0.5;
  ctx.strokeStyle = t.type === "inner" ? C.blueStrong : C.greenModerate;
  ctx.shadowBlur = 0;
  if (Math.random() > Math.pow(0.995, step)) {
    ctx.shadowColor = C.redVividPurplish;
    ctx.shadowBlur = 25;
    ctx.strokeStyle = C.pinkDeep;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1;
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

/* ── particles ── */
interface Par {
  x: number;
  y: number;
  z: number;
  vy: number;
  life: number;
}

function makeParticle(): Par {
  return {
    x: (Math.random() - 0.5) * 600,
    y: 300 + Math.random() * 300,
    z: (Math.random() - 0.5) * 600,
    vy: -(Math.random() * 0.8 + 0.1),
    life: Math.random(),
  };
}

/* ── component ── */
export function RoyalAbyssCanvas({
  active = true,
  preview = false,
}: {
  active?: boolean;
  preview?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playbackRef = useRef<CanvasPlayback | null>(null);

  const run = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;
    const ctx = ctxMaybe as CanvasRenderingContext2D;

    let width = 0,
      height = 0,
      frame = 0;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function noise(x: number, y: number, z: number) {
      return Math.sin(x * 10.5 + y * 12.3 + z) * Math.cos(x * 5.2 + z * 2.1);
    }

    function resize() {
      const d = dpr();
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = Math.floor(width * d);
      canvas.height = Math.floor(height * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }

    function project(p: Seg, rx: number, ry: number) {
      const x1 = p.x * Math.cos(ry) - p.z * Math.sin(ry);
      const z1 = p.x * Math.sin(ry) + p.z * Math.cos(ry);
      const y2 = p.y * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = p.y * Math.sin(rx) + z1 * Math.cos(rx);
      const s = CFG.perspective / (CFG.perspective + z2);
      return { x: x1 * s, y: y2 * s, scale: s };
    }

    /* build tentacles */
    const tentacles: TentacleData[] = [];
    for (let i = 0; i < CFG.tentacleCount; i++)
      tentacles.push(
        makeTentacle((i / CFG.tentacleCount) * Math.PI * 2, 45, "outer"),
      );
    for (let i = 0; i < 6; i++)
      tentacles.push(makeTentacle((i / 6) * Math.PI * 2, 15, "inner"));

    /* build particles */
    const particles: Par[] = Array.from(
      { length: CFG.particleCount },
      makeParticle,
    );

    /* god rays */
    function drawGodRays(cx: number, cy: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(frame * 0.002);
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, C.blueVividPurplish + "15");
        grad.addColorStop(1, "#00000000");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(20, 0);
        ctx.lineTo(100 + Math.sin(frame * 0.01) * 50, height * 1.5);
        ctx.lineTo(-100 - Math.sin(frame * 0.01) * 50, height * 1.5);
        ctx.fill();
      }
      ctx.restore();
    }

    /* main draw */
    function draw(_timestamp: number, step: number) {
      const rotX = Math.sin(frame * 0.007) * 0.12;
      const rotY = Math.sin(frame * 0.004) * 0.3;

      ctx.globalCompositeOperation = "source-over";
      const trailAlpha = step > 0 ? 1 - Math.pow(0.8, step) : 1;
      ctx.fillStyle = `rgba(5,2,10,${trailAlpha})`;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";
      drawGodRays(width / 2, -100);
      ctx.globalCompositeOperation = "source-over";

      ctx.save();
      if (preview) {
        // Fit the whole resting silhouette, including its long tentacles.
        ctx.translate(width / 2, height * 0.36);
        const scale = Math.min(width / 240, height / 300);
        ctx.scale(scale, scale);
      } else ctx.translate(width / 2, height / 2 - 40);

      const pulse = Math.sin(frame * CFG.pulseSpeed);
      const headY = Math.sin(frame * CFG.swimSpeed) * 25;
      const expn = pulse * 0.2;

      if (step > 0)
        tentacles.forEach((t) =>
          updateTentacle(t, 0, headY, 0, pulse, frame, step),
        );

      tentacles.forEach((t) => {
        if (Math.cos(t.angleOffset + rotY) < 0)
          drawTentacle(t, ctx, project, rotX, rotY, step);
      });

      /* core */
      const coreP = project({ x: 0, y: headY + 20, z: 0 }, rotX, rotY);
      const coreG = ctx.createRadialGradient(
        coreP.x,
        coreP.y,
        0,
        coreP.x,
        coreP.y,
        40 * coreP.scale,
      );
      coreG.addColorStop(0, C.orangeVivid);
      coreG.addColorStop(0.5, C.redVivid);
      coreG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coreG;
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.arc(
        coreP.x,
        coreP.y,
        60 * coreP.scale * (1 + pulse * 0.3),
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      /* body mesh */
      for (let i = 0; i < 18; i++) {
        const lat = (i / 18) * (Math.PI / 2);
        ctx.beginPath();
        for (let j = 0; j <= 30; j++) {
          const lon = (j / 30) * Math.PI * 2;
          let r = CFG.scale * (1.6 + expn);
          r += noise(Math.cos(lon) * 2, Math.sin(lat) * 2, frame * 0.05) * 4;
          r += Math.sin(lon * 10) * Math.sin(lat * 10) * 2;
          if (lat < 0.2) r *= 0.85;
          const pp = project(
            {
              x: r * Math.cos(lat) * Math.sin(lon),
              y: headY - r * Math.sin(lat),
              z: r * Math.cos(lat) * Math.cos(lon),
            },
            rotX,
            rotY,
          );
          if (j === 0) ctx.moveTo(pp.x, pp.y);
          else ctx.lineTo(pp.x, pp.y);
        }
        ctx.closePath();
        const gf = i / 18;
        ctx.fillStyle = gf > 0.5 ? C.greenBrilliant : C.blueVivid;
        ctx.globalAlpha = 0.15 + gf * 0.3;
        ctx.strokeStyle = C.greenModerate;
        ctx.globalCompositeOperation = "lighter";
        ctx.fill();
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = "source-over";
      tentacles.forEach((t) => {
        if (Math.cos(t.angleOffset + rotY) >= 0)
          drawTentacle(t, ctx, project, rotX, rotY, step);
      });

      particles.forEach((p) => {
        if (step > 0) {
          p.y += p.vy * step;
          p.life -= 0.003 * step;
          if (p.life <= 0) Object.assign(p, makeParticle());
        }
        const pp = project(p, rotX, rotY);
        if (pp.scale > 0) {
          ctx.fillStyle = C.blueVividPale;
          ctx.globalAlpha = p.life * 0.6;
          ctx.fillRect(pp.x, pp.y, 2 * pp.scale, 2 * pp.scale);
          ctx.globalAlpha = 1;
        }
      });

      ctx.restore();
      frame += step;
    }

    return createCanvasPlayback(canvas, draw, resize);
  }, [preview]);

  useEffect(() => {
    const playback = run();
    playbackRef.current = playback ?? null;
    return () => {
      playback?.dispose();
      playbackRef.current = null;
    };
  }, [run]);

  useEffect(() => playbackRef.current?.setActive(active), [active]);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ background: "#05020a" }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, #000 90%)",
          zIndex: 2,
        }}
      />
    </div>
  );
}
