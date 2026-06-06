"use client";

import { useEffect, useRef, useCallback } from "react";

const PALETTE = {
  cyan: "#00F5FF", // singularity event-horizon ring
  violet: "#8B5CF6", // outer accretion disk
  amber: "#F6C85F", // gold sparks
  white: "#ffffff",
} as const;

const CFG = {
  perspective: 980,
  diskRadius: 365,
  horizonRadius: 42,
  rotX: 0.48,
  rotY: -0.12,
  targetFrameMs: 1000 / 60,
  maxFrameStep: 2,
  pausedFrameGapMs: 100,
} as const;

interface Star {
  x: number;
  y: number;
  r: number;
  twinkle: number;
  speed: number;
}

interface TrailPoint {
  r: number;
  a: number;
  y: number;
}

interface Particle {
  radius: number;
  angle: number;
  speed: number;
  yOsc: number;
  size: number;
  trail: TrailPoint[];
  trailClock: number;
  tint: string;
}

interface Projected {
  x: number;
  y: number;
  z: number;
  scale: number;
}

export function SingularityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const run = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctxMaybe = canvas.getContext("2d", { alpha: true });
    if (!ctxMaybe) return;
    const ctx = ctxMaybe as CanvasRenderingContext2D;

    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let rafId: number | null = null;
    let lastTimestamp = 0;
    let stars: Star[] = [];
    let particles: Particle[] = [];

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    function clamp(v: number, lo: number, hi: number) {
      return Math.max(lo, Math.min(hi, v));
    }

    function particleCount() {
      if (rmq.matches) return 70;
      if (width < 640) return 170;
      if (width < 980) return 260;
      return 430;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
      initParticles();
    }

    function initStars() {
      const count = rmq.matches ? 40 : clamp(Math.floor(width / 10), 64, 160);
      if (stars.length === 0) {
        stars = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.35,
          twinkle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.002 + 0.0008,
        }));
      } else if (stars.length < count) {
        const diff = count - stars.length;
        for (let i = 0; i < diff; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.5 + 0.35,
            twinkle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.002 + 0.0008,
          });
        }
      } else if (stars.length > count) {
        stars.length = count;
      }
      for (const s of stars) {
        if (s.x > width) s.x = Math.random() * width;
        if (s.y > height) s.y = Math.random() * height;
      }
    }

    function makeParticle(initial = false): Particle {
      const bias = Math.random();
      const radius = initial
        ? CFG.horizonRadius + 28 + Math.pow(bias, 1.75) * CFG.diskRadius
        : CFG.diskRadius + Math.random() * 80;
      return {
        radius,
        angle: Math.random() * Math.PI * 2,
        speed: (110 / radius) * (rmq.matches ? 0.018 : 0.042),
        yOsc: (Math.random() - 0.5) * 11,
        size: 0.45 + Math.random() * 1.55,
        trail: [],
        trailClock: 0,
        tint:
          Math.random() > 0.72
            ? PALETTE.amber
            : Math.random() > 0.5
              ? PALETTE.cyan
              : PALETTE.violet,
      };
    }

    function initParticles() {
      const targetCount = particleCount();
      if (particles.length === 0) {
        particles = Array.from({ length: targetCount }, () => makeParticle(true));
      } else if (particles.length < targetCount) {
        const diff = targetCount - particles.length;
        for (let i = 0; i < diff; i++) {
          particles.push(makeParticle(true));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    }

    function project(x: number, y: number, z: number): Projected {
      const rotX = CFG.rotX + mouseY * 0.12;
      const rotY = CFG.rotY + Math.sin(frame * 0.002) * 0.028 + mouseX * 0.12;
      const x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
      const z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
      const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
      const scale = CFG.perspective / (CFG.perspective + z2);
      return { x: x1 * scale, y: y2 * scale, z: z2, scale };
    }

    function orbitalPoint(
      radius: number,
      angle: number,
      yOffset: number,
    ): Projected {
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const gravity = -3150 / (radius * radius + 130);
      return project(x, yOffset + gravity, z);
    }

    function updateParticle(p: Particle, step: number) {
      p.angle += p.speed * step;
      p.radius -= 0.38 * step;
      p.yOsc += Math.sin(frame * 0.006 + p.angle) * 0.003 * step;
      if (p.radius < CFG.horizonRadius + 3) {
        const fresh = makeParticle(false);
        p.radius = fresh.radius;
        p.angle = fresh.angle;
        p.speed = fresh.speed;
        p.yOsc = fresh.yOsc;
        p.size = fresh.size;
        p.trail = [];
        p.trailClock = 0;
        p.tint = fresh.tint;
        return;
      }
      p.trailClock += step;
      if (p.trailClock >= 1) {
        p.trailClock %= 1;
        p.trail.push({ r: p.radius, a: p.angle, y: p.yOsc });
        const maxTrail = width < 700 ? 3 : 6;
        if (p.trail.length > maxTrail) p.trail.shift();
      }
    }

    function drawParticle(p: Particle, ox: number, oy: number) {
      const head = orbitalPoint(p.radius, p.angle, p.yOsc);
      if (head.scale <= 0) return;
      const proximity = clamp(
        (p.radius - CFG.horizonRadius) / CFG.diskRadius,
        0,
        1,
      );
      const alpha = 0.34 + (1 - proximity) * 0.62;
      const dotSize = Math.max(0.1, p.size * head.scale * (1.15 - proximity * 0.25));
      if (p.trail.length > 1 && proximity < 0.72 && !rmq.matches) {
        ctx.beginPath();
        ctx.moveTo(ox + head.x, oy + head.y);
        for (let i = p.trail.length - 1; i >= 0; i--) {
          const t = p.trail[i];
          const pt = orbitalPoint(t.r, t.a, t.y);
          ctx.lineTo(ox + pt.x, oy + pt.y);
        }
        ctx.strokeStyle = proximity < 0.18 ? "rgba(255,255,255,0.36)" : p.tint;
        ctx.globalAlpha = alpha * 0.34;
        ctx.lineWidth = Math.max(0.3, dotSize * 0.72);
        ctx.stroke();
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = proximity < 0.11 ? PALETTE.white : p.tint;
      ctx.beginPath();
      ctx.arc(ox + head.x, oy + head.y, dotSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawStars() {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const s of stars) {
        const t = rmq.matches
          ? 0.32
          : 0.24 + Math.sin(frame * s.speed + s.twinkle) * 0.18;
        ctx.globalAlpha = Math.max(0.08, t);
        ctx.fillStyle = s.r > 1.3 ? PALETTE.cyan : "#dce6ff";
        ctx.beginPath();
        const starParallaxX = mouseX * s.r * 15;
        const starParallaxY = mouseY * s.r * 15;
        ctx.arc(s.x + starParallaxX, s.y + starParallaxY, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function drawGrid(ox: number, oy: number) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.globalCompositeOperation = "screen";
      for (let radius = CFG.horizonRadius + 22; radius < 520; radius += 38) {
        ctx.beginPath();
        const opacity = Math.max(0, 1 - radius / 520) * 0.13;
        for (let a = 0; a <= Math.PI * 2 + 0.08; a += 0.08) {
          const x = Math.cos(a) * radius;
          const z = Math.sin(a) * radius;
          const gravity = -42000 / (radius * radius + 180);
          const p = project(x, gravity + 54, z);
          if (a === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = radius < 180 ? PALETTE.violet : PALETTE.cyan;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
      for (let spoke = 0; spoke < 20; spoke++) {
        const a = (spoke / 20) * Math.PI * 2 + frame * 0.0015;
        ctx.beginPath();
        for (let r = CFG.horizonRadius + 30; r < 490; r += 20) {
          const x = Math.cos(a) * r;
          const z = Math.sin(a) * r;
          const gravity = -26000 / (r * r + 200);
          const p = project(x, gravity + 52, z);
          if (r === CFG.horizonRadius + 30) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.globalAlpha = 0.026;
        ctx.strokeStyle = PALETTE.cyan;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function drawFeatherArcs(ox: number, oy: number) {
      if (rmq.matches) return;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";
      for (let i = 0; i < 5; i++) {
        const radius = 245 + i * 34;
        const spin = frame * (0.0022 + i * 0.0004);
        const start = spin + i * 0.58;
        const end = start + Math.PI * (0.34 + i * 0.018);
        ctx.beginPath();
        for (let j = 0; j <= 34; j++) {
          const t = j / 34;
          const theta = start + (end - start) * t;
          const x = Math.cos(theta) * radius;
          const z = Math.sin(theta) * radius;
          const p = project(x, 10 - i * 2, z);
          if (j === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        const strokeColor = i % 2 ? PALETTE.violet : PALETTE.cyan;
        const baseAlpha = 0.11 - i * 0.012;

        if (!rmq.matches) {
          ctx.save();
          ctx.strokeStyle = strokeColor;
          ctx.globalAlpha = baseAlpha * 0.45;
          ctx.lineWidth = 4.5;
          ctx.stroke();
          ctx.restore();
        }

        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = baseAlpha;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function drawJets(ox: number, oy: number) {
      if (width < 620) return;
      const centre = project(0, 0, 0);
      const length = Math.min(width, height) * 0.52 * centre.scale;
      const beamWidth = 10 * centre.scale;
      ctx.save();
      ctx.translate(ox + centre.x, oy + centre.y);
      ctx.globalCompositeOperation = "screen";
      for (const dir of [-1, 1] as const) {
        const gradient = ctx.createLinearGradient(0, 0, 0, length * dir);
        gradient.addColorStop(0, "rgba(255,255,255,0.42)");
        gradient.addColorStop(0.16, "rgba(0,245,255,0.24)");
        gradient.addColorStop(0.62, "rgba(111,253,242,0.08)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-beamWidth * 0.45, 0);
        ctx.lineTo(beamWidth * 0.45, 0);
        ctx.lineTo(beamWidth * 3.1, length * dir);
        ctx.lineTo(-beamWidth * 3.1, length * dir);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function drawHudRing(
      ox: number,
      oy: number,
      radius: number,
      speed: number,
      colour: string,
      alpha: number,
    ) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      const segments = 10;
      const rotation = frame * speed;
      const segLen = (Math.PI * 2) / segments;
      for (let i = 0; i < segments; i++) {
        const start = i * segLen + rotation;
        const end = start + segLen * 0.55;
        for (let j = 0; j <= 12; j++) {
          const theta = start + (end - start) * (j / 12);
          const p = project(
            Math.cos(theta) * radius,
            0,
            Math.sin(theta) * radius,
          );
          if (j === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }

      if (!rmq.matches) {
        ctx.save();
        ctx.strokeStyle = colour;
        ctx.globalAlpha = alpha * 0.5;
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = colour;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function drawHorizon(ox: number, oy: number) {
      const p = project(0, 0, 0);
      const r = CFG.horizonRadius * p.scale;
      const x = ox + p.x;
      const y = oy + p.y;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const halo = ctx.createRadialGradient(x, y, r * 0.85, x, y, r * 5.3);
      halo.addColorStop(0, "rgba(255,255,255,0.42)");
      halo.addColorStop(0.13, "rgba(0,245,255,0.28)");
      halo.addColorStop(0.38, "rgba(111,253,242,0.13)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, r * 5.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      const voidG = ctx.createRadialGradient(
        x - r * 0.2,
        y - r * 0.25,
        r * 0.1,
        x,
        y,
        r * 1.08,
      );
      voidG.addColorStop(0, "#030712");
      voidG.addColorStop(0.76, "#000000");
      voidG.addColorStop(1, "rgba(0,0,0,0.82)");
      ctx.fillStyle = voidG;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "screen";

      if (!rmq.matches) {
        ctx.save();
        ctx.lineWidth = 7.5;
        ctx.strokeStyle = PALETTE.cyan;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(x, y, r * 1.04, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "rgba(255,255,255,0.88)";
      ctx.beginPath();
      ctx.arc(x, y, r * 1.04, 0, Math.PI * 2);
      ctx.stroke();

      if (!rmq.matches) {
        ctx.save();
        ctx.lineWidth = 5.5;
        ctx.strokeStyle = PALETTE.amber;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          r * 1.34 + Math.sin(frame * 0.02) * 1.6,
          0.25,
          Math.PI * 1.38,
        );
        ctx.stroke();
        ctx.restore();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(246,211,101,0.55)";
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        r * 1.34 + Math.sin(frame * 0.02) * 1.6,
        0.25,
        Math.PI * 1.38,
      );
      ctx.stroke();
      ctx.restore();
    }

    function draw(timestamp: number) {
      const elapsedMs =
        lastTimestamp > 0 ? timestamp - lastTimestamp : CFG.targetFrameMs;
      lastTimestamp = timestamp;
      const step =
        elapsedMs > CFG.pausedFrameGapMs
          ? 0
          : clamp(elapsedMs / CFG.targetFrameMs, 0, CFG.maxFrameStep);
      const physicsStep = rmq.matches ? 0 : step;

      if (!rmq.matches && step > 0) {
        const lerpFactor = clamp(0.04 * step, 0, 1);
        mouseX += (targetMouseX - mouseX) * lerpFactor;
        mouseY += (targetMouseY - mouseY) * lerpFactor;
      } else {
        mouseX = 0;
        mouseY = 0;
      }

      ctx.clearRect(0, 0, width, height);
      drawStars();
      const ox = width * 0.5;
      const oy = height * 0.5;
      const scale = clamp(Math.min(width, height) / 850, 0.62, 1.08);
      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(scale, scale);
      ctx.translate(-ox, -oy);
      drawGrid(ox, oy);
      drawFeatherArcs(ox, oy);
      drawHudRing(ox, oy, 420, 0.004, PALETTE.cyan, 0.18);
      drawHudRing(ox, oy, 350, -0.006, PALETTE.violet, 0.14);
      drawJets(ox, oy);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const p of particles) {
        if (physicsStep > 0) updateParticle(p, physicsStep);
        drawParticle(p, ox, oy);
      }
      ctx.restore();
      drawHorizon(ox, oy);
      ctx.restore();
      frame += physicsStep;
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
    const onRmqChange = () => {
      resize();
      frame = 0;
      lastTimestamp = 0;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (rmq.matches) return;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rmq.addEventListener?.("change", onRmqChange);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      rmq.removeEventListener?.("change", onRmqChange);
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
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(0,245,255,0.06), transparent 24%), " +
          "radial-gradient(circle at 34% 22%, rgba(139,92,246,0.10), transparent 28%), " +
          "radial-gradient(circle at 68% 78%, rgba(246,200,95,0.05), transparent 22%), " +
          "linear-gradient(135deg, #030712 0%, #07111F 50%, #030712 100%)",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Aurora */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-18%",
          background:
            "conic-gradient(from 120deg at 50% 50%, transparent 0 18%, rgba(0,245,255,0.10), transparent 35% 58%, rgba(139,92,246,0.10), transparent 80% 100%)",
          filter: "blur(60px) saturate(1.15)",
          opacity: 0.85,
          animation: "singularity-aurora 18s ease-in-out infinite alternate",
          zIndex: 1,
        }}
      />

      {/* Grain grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.09,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 78%)",
          zIndex: 2,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0 28%, rgba(0,0,0,0.22) 62%, rgba(0,0,0,0.78) 100%)",
          zIndex: 3,
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 1px, transparent 2px, transparent 7px)",
          mixBlendMode: "screen",
          zIndex: 4,
        }}
      />

      <style>{`
        @keyframes singularity-aurora {
          from { transform: translate3d(-1.5%, -1%, 0) rotate(-2deg) scale(1); }
          to   { transform: translate3d(1.8%, 1.2%, 0) rotate(3deg) scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="singularity-aurora"] { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
    </div>
  );
}
