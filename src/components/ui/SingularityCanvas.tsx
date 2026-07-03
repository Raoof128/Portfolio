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
  flare: number;
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
    let inView = true;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    const pulses: { age: number }[] = [];
    let nextFlare = 360;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Per-frame rotation cache — project() runs thousands of times a frame,
    // so the shared sin/cos pairs are computed once in draw().
    let cosRX = 1;
    let sinRX = 0;
    let cosRY = 1;
    let sinRY = 0;
    // Screen-space centre + radius of the event-horizon shadow, per frame.
    let cX = 0;
    let cY = 0;
    let hR = CFG.horizonRadius;

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
        flare: 0,
      };
    }

    function initParticles() {
      const targetCount = particleCount();
      if (particles.length === 0) {
        particles = Array.from({ length: targetCount }, () =>
          makeParticle(true),
        );
      } else if (particles.length < targetCount) {
        const diff = targetCount - particles.length;
        for (let i = 0; i < diff; i++) {
          particles.push(makeParticle(true));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    }

    function updateRotation() {
      const rotX = CFG.rotX + mouseY * 0.12;
      const rotY = CFG.rotY + Math.sin(frame * 0.002) * 0.028 + mouseX * 0.12;
      cosRX = Math.cos(rotX);
      sinRX = Math.sin(rotX);
      cosRY = Math.cos(rotY);
      sinRY = Math.sin(rotY);
    }

    function project(x: number, y: number, z: number): Projected {
      const x1 = x * cosRY - z * sinRY;
      const z1 = x * sinRY + z * cosRY;
      const y2 = y * cosRX - z1 * sinRX;
      const z2 = y * sinRX + z1 * cosRX;
      const scale = CFG.perspective / (CFG.perspective + z2);
      return { x: x1 * scale, y: y2 * scale, z: z2, scale };
    }

    /**
     * Screen-space gravitational lensing around the shadow.
     * Light from behind the hole cannot cross the shadow disk: it wraps
     * around the photon ring instead (Einstein-rim pile-up). Light in
     * front is only weakly deflected outward.
     */
    function lens(px: number, py: number, z: number): { x: number; y: number } {
      const dx = px - cX;
      const dy = py - cY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 0.5 || d > hR * 3.6) return { x: px, y: py };
      const behind = z > 4;
      if (behind && d < hR * 1.55) {
        const t = d / (hR * 1.55);
        const wrapped = hR * (1.06 + t * t * 0.85);
        const f = wrapped / d;
        return { x: cX + dx * f, y: cY + dy * f };
      }
      const bend = clamp(
        ((hR * hR) / (d * d)) * (behind ? 0.5 : 0.06),
        0,
        behind ? 0.9 : 0.25,
      );
      return { x: cX + dx * (1 + bend), y: cY + dy * (1 + bend) };
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
      // Time dilation: infall slows and orbit whips faster near the horizon,
      // so particles appear to freeze at the edge instead of popping out.
      const over = p.radius - CFG.horizonRadius;
      const dilation = clamp(over / (CFG.horizonRadius * 1.1), 0.05, 1);
      p.angle += p.speed * step * (1 + (1 - dilation) * 2.2);
      p.radius -=
        0.38 * step * (0.25 + dilation * 0.75) * (p.flare > 0 ? 5.5 : 1);
      p.yOsc += Math.sin(frame * 0.006 + p.angle) * 0.003 * step;
      if (p.radius < CFG.horizonRadius + 1.5) {
        if (p.flare > 0 && pulses.length < 4) pulses.push({ age: 0 });
        const fresh = makeParticle(false);
        p.radius = fresh.radius;
        p.angle = fresh.angle;
        p.speed = fresh.speed;
        p.yOsc = fresh.yOsc;
        p.size = fresh.size;
        p.trail = [];
        p.trailClock = 0;
        p.tint = fresh.tint;
        p.flare = 0;
        return;
      }
      p.trailClock += step;
      if (p.trailClock >= 1) {
        p.trailClock %= 1;
        p.trail.push({ r: p.radius, a: p.angle, y: p.yOsc });
        const maxTrail = p.flare > 0 ? 10 : width < 700 ? 3 : 6;
        if (p.trail.length > maxTrail) p.trail.shift();
      }
    }

    function drawParticle(p: Particle, ox: number, oy: number) {
      const head = orbitalPoint(p.radius, p.angle, p.yOsc);
      if (head.scale <= 0) return;
      const lensedHead = lens(head.x, head.y, head.z);
      const proximity = clamp(
        (p.radius - CFG.horizonRadius) / CFG.diskRadius,
        0,
        1,
      );
      // Gravitational redshift: light dims to nothing at the horizon.
      const fade = clamp(
        (p.radius - CFG.horizonRadius) / (CFG.horizonRadius * 0.75),
        0,
        1,
      );
      // Relativistic Doppler beaming: the approaching side of the disk
      // (cos(angle) < 0, left of screen) is boosted, the receding side dims.
      const beam = clamp(1 - 0.85 * Math.cos(p.angle), 0.18, 1.85);
      const flaring = p.flare > 0;
      const alpha =
        (0.34 + (1 - proximity) * 0.62) *
        clamp(beam * 0.75, 0.3, 1.3) *
        fade *
        (flaring ? 1.4 : 1);
      const dotSize =
        Math.max(0.1, p.size * head.scale * (1.15 - proximity * 0.25)) *
        (0.85 + beam * 0.18) *
        (flaring ? 1.9 : 1);
      let colour = p.tint;
      if (flaring || (beam > 1.45 && proximity < 0.55)) colour = PALETTE.white;
      else if (beam < 0.5 || fade < 0.5) colour = PALETTE.violet;
      if (p.trail.length > 1 && proximity < 0.72 && !rmq.matches) {
        ctx.beginPath();
        ctx.moveTo(ox + lensedHead.x, oy + lensedHead.y);
        for (let i = p.trail.length - 1; i >= 0; i--) {
          const t = p.trail[i];
          const pt = orbitalPoint(t.r, t.a, t.y);
          const lp = lens(pt.x, pt.y, pt.z);
          ctx.lineTo(ox + lp.x, oy + lp.y);
        }
        ctx.strokeStyle = flaring
          ? PALETTE.amber
          : proximity < 0.18
            ? "rgba(255,255,255,0.36)"
            : colour;
        ctx.globalAlpha = clamp(alpha * (flaring ? 0.55 : 0.34), 0, 1);
        ctx.lineWidth = Math.max(0.3, dotSize * 0.72);
        ctx.stroke();
      }
      if (flaring) {
        ctx.globalAlpha = clamp(alpha * 0.28, 0, 1);
        ctx.fillStyle = PALETTE.amber;
        ctx.beginPath();
        ctx.arc(
          ox + lensedHead.x,
          oy + lensedHead.y,
          dotSize * 3.1,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(ox + lensedHead.x, oy + lensedHead.y, dotSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawStars(
      centreScreenX: number,
      centreScreenY: number,
      shadowR: number,
    ) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const s of stars) {
        const t = rmq.matches
          ? 0.32
          : 0.24 + Math.sin(frame * s.speed + s.twinkle) * 0.18;
        let sx = s.x + mouseX * s.r * 15;
        let sy = s.y + mouseY * s.r * 15;
        // Background stars lens around the shadow — or vanish behind it.
        const dx = sx - centreScreenX;
        const dy = sy - centreScreenY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < shadowR * 1.15) continue;
        if (d < shadowR * 6) {
          const bend = clamp(((shadowR * shadowR) / (d * d)) * 0.55, 0, 0.8);
          sx = centreScreenX + dx * (1 + bend);
          sy = centreScreenY + dy * (1 + bend);
        }
        ctx.globalAlpha = Math.max(0.08, t);
        ctx.fillStyle = s.r > 1.3 ? PALETTE.cyan : "#dce6ff";
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
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

    /**
     * The lensed image of the disk's far side — light bent over and under
     * the shadow (the Gargantua arch). Doppler gradient: the approaching
     * (left) limb burns white-cyan, the receding limb cools to violet.
     */
    function drawLensedArcs(x: number, y: number, r: number) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";
      const shimmer = rmq.matches ? 0 : Math.sin(frame * 0.013) * 1.4;
      const gradient = ctx.createLinearGradient(x - r * 1.7, y, x + r * 1.7, y);
      gradient.addColorStop(0, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.3, "rgba(0,245,255,0.75)");
      gradient.addColorStop(0.68, "rgba(246,200,95,0.35)");
      gradient.addColorStop(1, "rgba(139,92,246,0.12)");
      ctx.strokeStyle = gradient;
      // Upper arch — far disk bent over the top of the shadow.
      const arcs: [number, number, number, number][] = [
        // [radiusX factor, radiusY factor, startAngle, endAngle]
        [1.5, 1.3, Math.PI * 1.04, Math.PI * 1.96],
        [1.26, 1.06, Math.PI * 0.1, Math.PI * 0.9],
      ];
      for (const [rx, ry, a0, a1] of arcs) {
        for (const [w, a] of [
          [7, 0.07],
          [2.6, 0.16],
          [1, 0.38],
        ] as const) {
          ctx.beginPath();
          ctx.ellipse(x, y, r * rx + shimmer, r * ry + shimmer, 0, a0, a1);
          ctx.globalAlpha = a;
          ctx.lineWidth = w;
          ctx.stroke();
        }
      }
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

      drawLensedArcs(x, y, r);

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

      // Photon ring — crisp primary image at the shadow edge…
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "rgba(255,255,255,0.88)";
      ctx.beginPath();
      ctx.arc(x, y, r * 1.04, 0, Math.PI * 2);
      ctx.stroke();
      // …and the thin higher-order image just inside it.
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(0,245,255,0.55)";
      ctx.beginPath();
      ctx.arc(x, y, r * 0.955, 0, Math.PI * 2);
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

      // Light echoes — flares that crossed the horizon ring outward.
      for (const pulse of pulses) {
        const pr = r * (1.06 + pulse.age * 1.1);
        const pa = Math.pow(1 - pulse.age, 2) * 0.55;
        ctx.lineWidth = Math.max(0.4, (1 - pulse.age) * 3);
        ctx.strokeStyle = PALETTE.white;
        ctx.globalAlpha = pa;
        ctx.beginPath();
        ctx.arc(x, y, pr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.cyan;
        ctx.globalAlpha = pa * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, pr * 1.06, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
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

      updateRotation();
      const centre = project(0, 0, 0);
      cX = centre.x;
      cY = centre.y;
      hR = CFG.horizonRadius * centre.scale;

      ctx.clearRect(0, 0, width, height);
      const ox = width * 0.5;
      const oy = height * 0.5;
      const scale = clamp(Math.min(width, height) / 850, 0.62, 1.08);
      drawStars(ox + cX * scale, oy + cY * scale, hR * scale);
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

      if (physicsStep > 0) {
        if (frame >= nextFlare) {
          const candidate =
            particles[Math.floor(Math.random() * particles.length)];
          if (candidate && candidate.radius > CFG.diskRadius * 0.45) {
            candidate.flare = 1;
            candidate.trail = [];
          }
          nextFlare = frame + 260 + Math.random() * 320;
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          pulses[i].age += 0.016 * physicsStep;
          if (pulses[i].age >= 1) pulses.splice(i, 1);
        }
      }

      frame += physicsStep;
      rafId = requestAnimationFrame(draw);
    }

    function stop() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      lastTimestamp = 0;
    }

    function start() {
      if (document.hidden || !inView) return;
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

    // Pause the whole render loop once the hero scrolls out of view.
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) start();
        else stop();
      },
      { threshold: 0.02 },
    );
    io.observe(canvas);

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rmq.addEventListener?.("change", onRmqChange);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      stop();
      io.disconnect();
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
