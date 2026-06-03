"use client";

import { useEffect, useRef, useCallback } from "react";

const W = 600;
const H = 500;
const SCALE = 155;        // lemniscate amplitude
const PERSPECTIVE = 700;
const PARTICLE_COUNT = 200;
const SPEED = 0.006;
const TRAIL = 0.15;       // background fade alpha — lower = longer trails

// Palette anchored to #DAA520 (goldenrod)
const GOLD  = (op: number) => `rgba(218,165,32,${op})`;
const GOLDB = (op: number) => `rgba(255,215,0,${op})`;   // bright flash
const CRIM  = (op: number) => `rgba(220,20,60,${op})`;
const WHITE = (op: number) => `rgba(255,255,255,${op})`;

function project3D(
  x: number, y: number, z: number,
  rotX: number, rotY: number
): { px: number; py: number; scale: number; z: number } {
  const x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
  const z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
  const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
  const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
  const scale = PERSPECTIVE / (PERSPECTIVE + z2);
  return { px: x1 * scale, py: y2 * scale, scale, z: z2 };
}

// Lemniscate of Bernoulli parametric form
function lemniPoint(t: number, a: number = SCALE) {
  const d = 1 + Math.pow(Math.sin(t), 2);
  return {
    x: (a * Math.cos(t)) / d,
    y: (a * Math.sin(t) * Math.cos(t)) / d,
    z: a * Math.sin(t) * 0.35,
  };
}

// Pre-sample the lemniscate at build time (static, reused every frame)
const LEMN_STEPS = 320;
const LEMN_PATH = Array.from({ length: LEMN_STEPS }, (_, i) =>
  lemniPoint((i / LEMN_STEPS) * Math.PI * 2)
);

class Spark {
  t: number;
  faction: "Ahura" | "Ahriman";
  radius: number;
  angleOffset: number;
  speedMul: number;
  x = 0; y = 0; z = 0;

  constructor(faction: "Ahura" | "Ahriman") {
    this.faction = faction;
    this.t = Math.random() * Math.PI * 2;
    this.radius = 5 + Math.random() * 18;
    this.angleOffset = Math.random() * Math.PI * 2;
    this.speedMul = 0.75 + Math.random() * 0.5;
  }

  update() {
    this.t += SPEED * this.speedMul;
    if (this.t > Math.PI * 2) this.t -= Math.PI * 2;
    const base = lemniPoint(this.t);
    const phase = this.faction === "Ahura" ? 0 : Math.PI;
    const twist = 3.5;
    this.x = base.x + Math.cos(this.t * twist + phase + this.angleOffset) * this.radius;
    this.y = base.y + Math.sin(this.t * twist + phase + this.angleOffset) * this.radius;
    this.z = base.z + Math.cos(this.t * twist * 0.5 + phase) * this.radius;
  }
}

export function CosmicLoomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    // Alias as non-nullable — guard above ensures this is safe throughout
    const ctx: CanvasRenderingContext2D = ctxRaw;

    let frame = 0;
    let lastTs = 0;
    let rafId = 0;

    const particles = Array.from(
      { length: PARTICLE_COUNT },
      (_, i) => new Spark(i % 2 === 0 ? "Ahura" : "Ahriman")
    );

    function drawShamseh(rotX: number, rotY: number) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = GOLD(0.025);
      ctx.lineWidth = 0.7;
      // Rotate in screen space for the mandala feel
      ctx.rotate(frame * 0.0006 + rotY * 0.3);
      const rays = 12;
      const maxR = Math.min(W, H) * 0.38;
      for (let i = 0; i < rays; i++) {
        ctx.rotate((Math.PI * 2) / rays);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxR * 0.3,  maxR * 0.07);
        ctx.lineTo(maxR, 0);
        ctx.lineTo(maxR * 0.3, -maxR * 0.07);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawLemniscate(rotX: number, rotY: number) {
      ctx.globalCompositeOperation = "lighter";

      // Three glow passes: wide haze → medium → crisp core
      const passes: [number, number][] = [[10, 0.03], [4, 0.09], [1.2, 0.5]];
      for (const [lw, alpha] of passes) {
        ctx.beginPath();
        for (let i = 0; i <= LEMN_STEPS; i++) {
          const pt = LEMN_PATH[i % LEMN_STEPS];
          const p = project3D(pt.x, pt.y, pt.z, rotX, rotY);
          if (i === 0) ctx.moveTo(p.px, p.py);
          else         ctx.lineTo(p.px, p.py);
        }
        ctx.closePath();
        ctx.strokeStyle = lw > 3 ? GOLD(alpha) : GOLDB(alpha);
        ctx.lineWidth = lw;
        ctx.stroke();
      }
    }

    function loop(ts: number) {
      const gap = ts - lastTs;
      lastTs = ts;
      if (gap > 100) { rafId = requestAnimationFrame(loop); return; }

      // Gentle auto-oscillation — gives the lemniscate a living tilt
      const rotY =  Math.sin(frame * 0.008) * 0.35;
      const rotX =  Math.sin(frame * 0.005) * 0.22 + 0.14;

      // Trail fade
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(2,1,4,${TRAIL})`;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(W / 2, H / 2);

      drawShamseh(rotX, rotY);
      drawLemniscate(rotX, rotY);

      // Project + sort particles
      const projected = particles.map(p => {
        p.update();
        const proj = project3D(p.x, p.y, p.z, rotX, rotY);
        return { obj: p, proj };
      });
      projected.sort((a, b) => b.proj.z - a.proj.z);

      // Webbing between nearby same-faction particles
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        let conn = 0;
        for (let j = i + 1; j < projected.length && conn < 2; j++) {
          const p2 = projected[j];
          if (p1.obj.faction !== p2.obj.faction) continue;
          const dx = p1.proj.px - p2.proj.px;
          const dy = p1.proj.py - p2.proj.py;
          const dSq = dx * dx + dy * dy;
          if (dSq < 42 * 42) {
            const alpha = (1 - Math.sqrt(dSq) / 42) * 0.2;
            ctx.strokeStyle = p1.obj.faction === "Ahura" ? GOLD(alpha) : CRIM(alpha);
            ctx.lineWidth = 0.5 * p1.proj.scale;
            ctx.beginPath();
            ctx.moveTo(p1.proj.px, p1.proj.py);
            ctx.lineTo(p2.proj.px, p2.proj.py);
            ctx.stroke();
            conn++;
          }
        }
      }

      // Core singularity glow at the lemniscate crossing point (0,0,0)
      const core = project3D(0, 0, 0, rotX, rotY);
      const pulse = 1 + Math.sin(frame * 0.04) * 0.12;
      const cg = ctx.createRadialGradient(
        core.px, core.py, 0,
        core.px, core.py, 80 * core.scale * pulse
      );
      cg.addColorStop(0,    WHITE(0.9));
      cg.addColorStop(0.12, GOLDB(0.65));
      cg.addColorStop(0.4,  GOLD(0.18));
      cg.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(core.px, core.py, 100 * core.scale, 0, Math.PI * 2);
      ctx.fill();

      // Individual particles
      ctx.globalCompositeOperation = "lighter";
      projected.forEach(({ obj, proj }) => {
        if (proj.scale <= 0) return;
        const dist = Math.sqrt(obj.x * obj.x + obj.y * obj.y + obj.z * obj.z);
        const flash = Math.max(0, 1 - dist / 78);
        let color: string;
        if (obj.faction === "Ahura") {
          color = `hsla(${42 + flash * 18},100%,${55 + flash * 35}%,${0.35 + flash * 0.65})`;
        } else {
          color = `hsla(${345 + flash * 25},100%,${40 + flash * 35}%,${0.35 + flash * 0.65})`;
        }
        const size = Math.max(0.5, proj.scale * (1.5 + flash * 2.2));
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      frame++;
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(rafId);
      lastTs = performance.now();
      rafId = requestAnimationFrame(loop);
    }

    start();

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    return animate();
  }, [animate]);

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "#020103" }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
