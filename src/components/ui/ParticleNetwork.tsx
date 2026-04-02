"use client";

import { useEffect, useRef, useCallback, useSyncExternalStore } from "react";

/* ─── Reduced-motion detection ──────────────────────────────────────── */
const rmq = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(rmq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
function getSnap() { return window.matchMedia(rmq).matches; }
function getServer() { return false; }

/* ─── Config ────────────────────────────────────────────────────────── */
const PARTICLE_COUNT = 80;
const CONNECTION_DIST = 120;
const MOUSE_RADIUS = 180;
const MOUSE_STRENGTH = 0.02;
const DRIFT_SPEED = 0.3;
const PULSE_INTERVAL = 3000;
const PULSE_TRAVEL_SPEED = 4;

/* ─── Colors ────────────────────────────────────────────────────────── */
const VIOLET = { r: 167, g: 139, b: 250 };   // #a78bfa
const EMERALD = { r: 16, g: 185, b: 129 };   // #10b981

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseAlpha: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  progress: number;     // 0→1
  x: number;
  y: number;
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const reducedMotion = useSyncExternalStore(subscribe, getSnap, getServer);

  /* ─── Init particles ────────────────────────────────────────────── */
  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * DRIFT_SPEED * 2,
        vy: (Math.random() - 0.5) * DRIFT_SPEED * 2,
        radius: Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.4 + 0.15,
        pulseAlpha: 0,
      });
    }
    particlesRef.current = particles;
  }, []);

  /* ─── Main loop ─────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width ?? window.innerWidth;
      h = rect?.height ?? window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    /* Mouse tracking */
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onMouseLeave);

    /* Pulse spawner */
    const pulseTimer = setInterval(() => {
      const particles = particlesRef.current;
      if (particles.length < 2) return;

      const fromIdx = Math.floor(Math.random() * particles.length);
      // Find a connected neighbour
      let toIdx = -1;
      let minDist = Infinity;
      for (let j = 0; j < particles.length; j++) {
        if (j === fromIdx) continue;
        const dx = particles[fromIdx].x - particles[j].x;
        const dy = particles[fromIdx].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST && dist < minDist) {
          minDist = dist;
          toIdx = j;
        }
      }
      if (toIdx === -1) return;

      pulsesRef.current.push({
        fromIdx,
        toIdx,
        progress: 0,
        x: particles[fromIdx].x,
        y: particles[fromIdx].y,
      });

      // Highlight source node
      particles[fromIdx].pulseAlpha = 1;
    }, PULSE_INTERVAL);

    /* Reduced motion: draw static frame */
    if (reducedMotion) {
      const particles = particlesRef.current;
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.strokeStyle = `rgba(${VIOLET.r},${VIOLET.g},${VIOLET.b},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.fillStyle = `rgba(${VIOLET.r},${VIOLET.g},${VIOLET.b},${p.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      return () => {
        window.removeEventListener("resize", resize);
        canvas.removeEventListener("mousemove", onMouse);
        canvas.removeEventListener("mouseleave", onMouseLeave);
        clearInterval(pulseTimer);
      };
    }

    /* ─── Animate ─────────────────────────────────────────────────── */
    const draw = () => {
      const particles = particlesRef.current;
      const pulses = pulsesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      /* Update particle positions */
      for (const p of particles) {
        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Mouse attraction
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS && mDist > 1) {
          p.vx += (mdx / mDist) * MOUSE_STRENGTH;
          p.vy += (mdy / mDist) * MOUSE_STRENGTH;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > DRIFT_SPEED * 3) {
          p.vx = (p.vx / speed) * DRIFT_SPEED * 3;
          p.vy = (p.vy / speed) * DRIFT_SPEED * 3;
        }

        // Wrap edges (soft teleport with margin)
        const margin = 20;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        // Decay pulse glow
        if (p.pulseAlpha > 0) p.pulseAlpha *= 0.95;
      }

      /* Draw connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.strokeStyle = `rgba(${VIOLET.r},${VIOLET.g},${VIOLET.b},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      /* Mouse glow radius */
      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS);
        grad.addColorStop(0, `rgba(${VIOLET.r},${VIOLET.g},${VIOLET.b},0.06)`);
        grad.addColorStop(1, `rgba(${VIOLET.r},${VIOLET.g},${VIOLET.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Draw particles */
      for (const p of particles) {
        const alpha = Math.min(p.baseAlpha + p.pulseAlpha * 0.6, 1);
        const glowR = p.radius + p.pulseAlpha * 6;

        // Outer glow (only when pulsing)
        if (p.pulseAlpha > 0.05) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          grad.addColorStop(0, `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},${p.pulseAlpha * 0.5})`);
          grad.addColorStop(1, `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core dot
        const col = p.pulseAlpha > 0.1 ? EMERALD : VIOLET;
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Update & draw pulses */
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const from = particles[pulse.fromIdx];
        const to = particles[pulse.toIdx];

        // Advance pulse
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) { pulses.splice(i, 1); continue; }

        pulse.progress += PULSE_TRAVEL_SPEED / dist;
        pulse.x = from.x + dx * pulse.progress;
        pulse.y = from.y + dy * pulse.progress;

        if (pulse.progress >= 1) {
          // Arrived — trigger pulse on target
          to.pulseAlpha = 1;
          pulses.splice(i, 1);
          continue;
        }

        // Draw pulse dot
        const pulseAlpha = 1 - pulse.progress * 0.5;
        const grad = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, 4);
        grad.addColorStop(0, `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},${pulseAlpha})`);
        grad.addColorStop(1, `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw pulse trail on the connection line
        ctx.strokeStyle = `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},${pulseAlpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(pulse.x, pulse.y);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      clearInterval(pulseTimer);
    };
  }, [initParticles, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto z-0"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
