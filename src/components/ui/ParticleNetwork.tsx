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
const PARTICLE_COUNT = 90;
const CONNECTION_DIST = 130;
const MOUSE_RADIUS = 200;
const MOUSE_STRENGTH = 0.025;
const DRIFT_SPEED = 0.35;
const PULSE_INTERVAL = 800;        // Much more frequent pulses
const PULSE_TRAVEL_SPEED = 5;
const SHOOTING_STAR_INTERVAL = 1200; // New shooting star every 1.2s
const TRAIL_LENGTH = 12;            // Frames of trail history

/* ─── Colors ────────────────────────────────────────────────────────── */
const VIOLET = { r: 167, g: 139, b: 250 };
const EMERALD = { r: 16, g: 185, b: 129 };
const WHITE = { r: 220, g: 220, b: 255 };

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseAlpha: number;
  trail: { x: number; y: number }[];
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  x: number;
  y: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;      // 0→1 (dies at 1)
  speed: number;
  length: number;
  color: typeof VIOLET | typeof EMERALD | typeof WHITE;
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
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
        trail: [],
      });
    }
    particlesRef.current = particles;
  }, []);

  /* ─── Spawn shooting star ───────────────────────────────────────── */
  const spawnShootingStar = useCallback(() => {
    const { w, h } = sizeRef.current;
    if (w === 0) return;

    // Random direction — mostly diagonal
    const angle = (Math.random() * 0.8 + 0.2) * Math.PI; // 36°–180° range
    const speed = Math.random() * 4 + 3;
    const colors = [VIOLET, EMERALD, WHITE];

    shootingStarsRef.current.push({
      x: Math.random() * w * 1.2 - w * 0.1,
      y: -10,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.abs(Math.sin(angle)) * speed + 1.5,
      life: 0,
      speed,
      length: Math.random() * 60 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }, []);

  /* ─── Main loop ─────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width ?? window.innerWidth;
      const h = rect?.height ?? window.innerHeight;
      sizeRef.current = { w, h };
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

    /* Pulse spawner — fires multiple pulses per interval */
    const pulseTimer = setInterval(() => {
      const particles = particlesRef.current;
      if (particles.length < 2) return;

      // Spawn 1-3 pulses at once
      const count = Math.floor(Math.random() * 3) + 1;
      for (let n = 0; n < count; n++) {
        const fromIdx = Math.floor(Math.random() * particles.length);
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
        if (toIdx === -1) continue;

        pulsesRef.current.push({
          fromIdx,
          toIdx,
          progress: 0,
          x: particles[fromIdx].x,
          y: particles[fromIdx].y,
        });
        particles[fromIdx].pulseAlpha = 1;
      }
    }, PULSE_INTERVAL);

    /* Shooting star spawner */
    const starTimer = setInterval(() => {
      spawnShootingStar();
    }, SHOOTING_STAR_INTERVAL);

    /* Reduced motion: static frame */
    if (reducedMotion) {
      const particles = particlesRef.current;
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
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
        clearInterval(starTimer);
      };
    }

    /* ─── Animate ─────────────────────────────────────────────────── */
    const draw = () => {
      const particles = particlesRef.current;
      const pulses = pulsesRef.current;
      const stars = shootingStarsRef.current;
      const mouse = mouseRef.current;
      const { w, h } = sizeRef.current;

      ctx.clearRect(0, 0, w, h);

      /* ── Update particles ──────────────────────────────────────── */
      for (const p of particles) {
        // Store trail position
        p.trail.unshift({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LENGTH) p.trail.pop();

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

        // Wrap edges
        const margin = 20;
        if (p.x < -margin) { p.x = w + margin; p.trail = []; }
        if (p.x > w + margin) { p.x = -margin; p.trail = []; }
        if (p.y < -margin) { p.y = h + margin; p.trail = []; }
        if (p.y > h + margin) { p.y = -margin; p.trail = []; }

        // Decay pulse
        if (p.pulseAlpha > 0) p.pulseAlpha *= 0.93;
      }

      /* ── Draw connections ──────────────────────────────────────── */
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

      /* ── Mouse glow ────────────────────────────────────────────── */
      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS);
        grad.addColorStop(0, `rgba(${VIOLET.r},${VIOLET.g},${VIOLET.b},0.06)`);
        grad.addColorStop(1, `rgba(${VIOLET.r},${VIOLET.g},${VIOLET.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── Draw particle trails + dots ───────────────────────────── */
      for (const p of particles) {
        const alpha = Math.min(p.baseAlpha + p.pulseAlpha * 0.6, 1);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        // Comet trail (only when moving fast enough)
        if (speed > 0.15 && p.trail.length > 2) {
          const trailCol = p.pulseAlpha > 0.1 ? EMERALD : VIOLET;
          for (let t = 1; t < p.trail.length; t++) {
            const tailAlpha = (1 - t / p.trail.length) * alpha * 0.4 * (speed / (DRIFT_SPEED * 3));
            if (tailAlpha < 0.01) continue;
            ctx.strokeStyle = `rgba(${trailCol.r},${trailCol.g},${trailCol.b},${tailAlpha})`;
            ctx.lineWidth = p.radius * (1 - t / p.trail.length * 0.7);
            ctx.beginPath();
            ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
            ctx.stroke();
          }
        }

        // Pulse glow
        if (p.pulseAlpha > 0.05) {
          const glowR = p.radius + p.pulseAlpha * 8;
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

      /* ── Update & draw pulses ──────────────────────────────────── */
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const from = particles[pulse.fromIdx];
        const to = particles[pulse.toIdx];

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) { pulses.splice(i, 1); continue; }

        pulse.progress += PULSE_TRAVEL_SPEED / dist;
        pulse.x = from.x + dx * pulse.progress;
        pulse.y = from.y + dy * pulse.progress;

        if (pulse.progress >= 1) {
          to.pulseAlpha = 1;
          pulses.splice(i, 1);
          continue;
        }

        // Pulse dot with glow
        const pulseAlpha = 1 - pulse.progress * 0.4;
        const grad = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, 5);
        grad.addColorStop(0, `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},${pulseAlpha})`);
        grad.addColorStop(1, `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pulse trail line
        ctx.strokeStyle = `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},${pulseAlpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(pulse.x, pulse.y);
        ctx.stroke();
      }

      /* ── Shooting stars ────────────────────────────────────────── */
      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];

        // Update position
        star.x += star.vx;
        star.y += star.vy;
        star.life += 0.012;

        // Remove dead stars
        if (star.life >= 1 || star.x < -100 || star.x > w + 100 || star.y > h + 100) {
          stars.splice(i, 1);
          continue;
        }

        // Brightness curve: fade in fast, hold, fade out
        const brightness = star.life < 0.1
          ? star.life / 0.1
          : star.life > 0.7
            ? (1 - star.life) / 0.3
            : 1;

        const c = star.color;

        // Draw the tail (gradient line)
        const tailX = star.x - (star.vx / star.speed) * star.length;
        const tailY = star.y - (star.vy / star.speed) * star.length;

        const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0)`);
        grad.addColorStop(0.6, `rgba(${c.r},${c.g},${c.b},${brightness * 0.3})`);
        grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},${brightness * 0.8})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        // Head glow
        const headGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 3);
        headGrad.addColorStop(0, `rgba(255,255,255,${brightness * 0.9})`);
        headGrad.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},${brightness * 0.5})`);
        headGrad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineCap = "butt"; // Reset
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      clearInterval(pulseTimer);
      clearInterval(starTimer);
    };
  }, [initParticles, spawnShootingStar, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto z-0"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
