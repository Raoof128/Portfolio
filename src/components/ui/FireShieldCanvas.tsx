"use client";

import { useEffect, useRef, useCallback } from "react";

const CFG = {
  scaleFactor: 0.35, // shield = 35% of min(width, height)
  perspective: 600,
  width: 1.2,
  curvature: 0.6,
  noiseSpeed: 0.08,
  sparkCount: 100,
} as const;

const BASE_SCALE = 160; // reference for velocity / radius ratios

interface Seg3 {
  x: number;
  y: number;
  z: number;
}
type ProjectFn = (
  p: Seg3,
  rx: number,
  ry: number,
) => { x: number; y: number; scale: number };

/* ── module-level helpers ── */

function noise(x: number, y: number, z: number) {
  return Math.sin(x * 10.5 + y * 12.3 + z) * Math.cos(x * 5.2 + z * 2.1);
}

function getShieldPoint(
  u: number,
  v: number,
  frame: number,
  scale: number,
): Seg3 {
  let wFactor = Math.cos((v - 0.1) * 1.7);
  if (v < 0.1) wFactor = 1.0;
  if (wFactor < 0) wFactor = 0;

  let x = u * scale * CFG.width * wFactor;
  let y = (v - 0.4) * scale * 2.2;
  let z = -Math.cos((u * Math.PI) / 2.2) * scale * CFG.curvature * wFactor;
  z -= Math.sin(v * Math.PI) * ((20 * scale) / BASE_SCALE);

  const n = noise(u * 2, v * 3, frame * CFG.noiseSpeed);
  const ns = scale / BASE_SCALE;
  z += n * 5 * ns;
  y -= n * 5 * ns * v;
  x += n * 2 * ns;

  return { x, y, z };
}

interface Spark {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  decay: number;
}

function makeSpark(frame: number, scale: number): Spark {
  const u = (Math.random() - 0.5) * 2;
  const v = Math.random();
  const p = getShieldPoint(u, v, frame, scale);
  const vs = scale / BASE_SCALE;
  return {
    x: p.x,
    y: p.y,
    z: p.z,
    vx: (u * 2 + (Math.random() - 0.5)) * vs,
    vy: (-Math.random() * 4 - 1) * vs,
    vz: (-2 + (Math.random() - 0.5)) * vs,
    life: 1.0,
    decay: 0.02 + Math.random() * 0.03,
  };
}

function updateSpark(s: Spark, frame: number, scale: number) {
  s.x += s.vx;
  s.y += s.vy;
  s.z += s.vz;
  s.life -= s.decay;
  if (s.life <= 0) Object.assign(s, makeSpark(frame, scale));
}

function drawSpark(
  s: Spark,
  ctx: CanvasRenderingContext2D,
  project: ProjectFn,
  rx: number,
  ry: number,
) {
  const p = project(s, rx, ry);
  if (p.scale <= 0) return;
  ctx.fillStyle = `rgba(255, 200, 50, ${s.life})`;
  ctx.fillRect(p.x, p.y, 2 * p.scale, 2 * p.scale);
}

/* ── component ── */
export function FireShieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const run = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;
    const ctx = ctxMaybe as CanvasRenderingContext2D;

    let width = 0,
      height = 0,
      frame = 0,
      currentScale = BASE_SCALE;
    let rafId: number | null = null;
    let lastTimestamp = 0;

    const sparks: Spark[] = Array.from({ length: CFG.sparkCount }, () =>
      makeSpark(0, BASE_SCALE),
    );

    function computeScale() {
      return Math.max(60, Math.min(width, height) * CFG.scaleFactor);
    }

    function resize() {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = Math.floor(width * d);
      canvas.height = Math.floor(height * d);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(d, 0, 0, d, 0, 0);
      // reinit sparks when scale changes significantly
      const newScale = computeScale();
      if (Math.abs(newScale - currentScale) > 10) {
        currentScale = newScale;
        sparks.forEach((s, i) => {
          sparks[i] = makeSpark(frame, currentScale);
        });
      }
    }

    function project(p: Seg3, rx: number, ry: number) {
      const x1 = p.x * Math.cos(ry) - p.z * Math.sin(ry);
      const z1 = p.x * Math.sin(ry) + p.z * Math.cos(ry);
      const y2 = p.y * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = p.y * Math.sin(rx) + z1 * Math.cos(rx);
      const s = CFG.perspective / (CFG.perspective + z2);
      return { x: x1 * s, y: y2 * s, scale: s };
    }

    function draw(timestamp: number) {
      const skipPhysics = lastTimestamp > 0 && timestamp - lastTimestamp > 100;
      lastTimestamp = timestamp;

      currentScale = computeScale();
      const ss = currentScale / BASE_SCALE; // size ratio vs. reference

      const rotX = Math.sin(frame * 0.006) * 0.1;
      const rotY = Math.sin(frame * 0.004) * 0.25;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(1, 1, 1, 0.25)";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);

      /* shield mesh */
      const uSteps = 16,
        vSteps = 20;
      ctx.lineWidth = Math.max(0.5, 2 * ss);

      for (let j = 0; j < vSteps; j++) {
        const v = j / vSteps;
        const vNext = (j + 1) / vSteps;

        ctx.beginPath();
        for (let i = 0; i <= uSteps; i++) {
          const u = (i / uSteps) * 2 - 1;
          const pp = project(
            getShieldPoint(u, v, frame, currentScale),
            rotX,
            rotY,
          );
          if (i === 0) ctx.moveTo(pp.x, pp.y);
          else ctx.lineTo(pp.x, pp.y);
        }
        for (let i = uSteps; i >= 0; i--) {
          const u = (i / uSteps) * 2 - 1;
          const pp = project(
            getShieldPoint(u, vNext, frame, currentScale),
            rotX,
            rotY,
          );
          ctx.lineTo(pp.x, pp.y);
        }
        ctx.closePath();

        const pulse = Math.sin(frame * 0.1 + j * 0.5) * 0.5 + 0.5;
        const hue = v * 40;
        const sat = 80 + pulse * 20;
        const light = 40 + v * 20 + pulse * 10;
        const alpha = 0.4 + v * 0.4;

        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
        ctx.globalCompositeOperation = "lighter";
        ctx.fill();
        ctx.stroke();
      }

      /* core emblem — scaled with shield */
      const coreP = project({ x: 0, y: -30 * ss, z: -60 * ss }, rotX, rotY);
      const corePulse = 1 + Math.sin(frame * 0.2) * 0.2;
      const coreR = 60 * ss * coreP.scale * corePulse;
      const grad = ctx.createRadialGradient(
        coreP.x,
        coreP.y,
        0,
        coreP.x,
        coreP.y,
        coreR,
      );
      grad.addColorStop(0, "#fff");
      grad.addColorStop(0.3, "rgba(255,100,0,0.8)");
      grad.addColorStop(1, "rgba(255,0,0,0)");
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.arc(coreP.x, coreP.y, 80 * ss * coreP.scale, 0, Math.PI * 2);
      ctx.fill();

      /* sparks */
      for (const s of sparks) {
        if (!skipPhysics) updateSpark(s, frame, currentScale);
        drawSpark(s, ctx, project, rotX, rotY);
      }

      ctx.restore();
      if (!skipPhysics) frame += 1;
      rafId = requestAnimationFrame(draw);
    }

    function stop() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      lastTimestamp = 0;
    }
    function start() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(draw);
    }

    const onResize = () => resize();
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    start();

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const cleanup = run();
    return cleanup;
  }, [run]);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ background: "#010101" }}
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
            "radial-gradient(circle at center, transparent 30%, #000 100%)",
          zIndex: 2,
        }}
      />
    </div>
  );
}
