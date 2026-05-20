"use client";

import { useEffect, useRef, useCallback } from "react";

const W = 400;
const H = 500;
const NUM_NODES = 20;
const HELIX_RADIUS = 70;
const ROTATION_SPEED = 0.025;

const CYAN = (op: number) => `rgba(0,243,255,${op})`;
const MAGENTA = (op: number) => `rgba(255,0,127,${op})`;

export function DnaHelixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    let lastTimestamp = 0;
    let rafId = 0;

    function loop(ts: number) {
      const gap = ts - lastTimestamp;
      lastTimestamp = ts;
      if (gap <= 100) angle += ROTATION_SPEED;

      ctx!.clearRect(0, 0, W, H);

      const nodes = Array.from({ length: NUM_NODES }, (_, i) => {
        const y = 50 + (i / (NUM_NODES - 1)) * (H - 100);
        const a = angle + i * 0.45;
        return {
          xA: W / 2 + Math.cos(a) * HELIX_RADIUS,
          yA: y,
          zA: Math.sin(a) * HELIX_RADIUS,
          xB: W / 2 + Math.cos(a + Math.PI) * HELIX_RADIUS,
          yB: y,
          zB: Math.sin(a + Math.PI) * HELIX_RADIUS,
        };
      });

      // base-pair rungs
      nodes.forEach(n => {
        const avgZ = (n.zA + n.zB) / 2;
        const op = 0.15 + ((avgZ + HELIX_RADIUS) / (2 * HELIX_RADIUS)) * 0.55;
        const grad = ctx!.createLinearGradient(n.xA, n.yA, n.xB, n.yB);
        grad.addColorStop(0, CYAN(op));
        grad.addColorStop(1, MAGENTA(op));
        ctx!.beginPath();
        ctx!.moveTo(n.xA, n.yA);
        ctx!.lineTo(n.xB, n.yB);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      });

      // backbone nodes
      nodes.forEach(n => {
        const rA = 3 + ((n.zA + HELIX_RADIUS) / (2 * HELIX_RADIUS)) * 5;
        const rB = 3 + ((n.zB + HELIX_RADIUS) / (2 * HELIX_RADIUS)) * 5;
        const opA = 0.3 + ((n.zA + HELIX_RADIUS) / (2 * HELIX_RADIUS)) * 0.7;
        const opB = 0.3 + ((n.zB + HELIX_RADIUS) / (2 * HELIX_RADIUS)) * 0.7;

        ctx!.beginPath();
        ctx!.arc(n.xA, n.yA, rA, 0, Math.PI * 2);
        ctx!.fillStyle = CYAN(opA);
        ctx!.shadowColor = CYAN(opA);
        ctx!.shadowBlur = rA * 1.5;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(n.xB, n.yB, rB, 0, Math.PI * 2);
        ctx!.fillStyle = MAGENTA(opB);
        ctx!.shadowColor = MAGENTA(opB);
        ctx!.shadowBlur = rB * 1.5;
        ctx!.fill();

        ctx!.shadowBlur = 0;
      });

      rafId = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(rafId);
      lastTimestamp = performance.now();
      rafId = requestAnimationFrame(loop);
    }

    start();

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else start();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    return animate();
  }, [animate]);

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#030308" }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
