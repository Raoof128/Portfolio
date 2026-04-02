"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";

/* ─── Reduced-motion detection ──────────────────────────────────────── */
const rmq = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(rmq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
function getSnap() { return window.matchMedia(rmq).matches; }
function getServer() { return false; }

/* ─── Static network topology (no randomness on render) ─────────────── */
const NODES = [
  { id: 0, x: 45, y: 22, label: "FIREWALL" },
  { id: 1, x: 78, y: 15, label: "IDS" },
  { id: 2, x: 25, y: 48, label: "ENDPOINT" },
  { id: 3, x: 62, y: 42, label: "API_GW" },
  { id: 4, x: 88, y: 55, label: "DB" },
  { id: 5, x: 15, y: 75, label: "CLIENT" },
  { id: 6, x: 50, y: 70, label: "LLM_EVAL" },
  { id: 7, x: 80, y: 80, label: "MONITOR" },
];

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3],
  [1, 3], [1, 4],
  [2, 5], [2, 6],
  [3, 4], [3, 6],
  [6, 7], [4, 7],
  [5, 6],
];

export function TelemetryViz() {
  const reducedMotion = useSyncExternalStore(subscribe, getSnap, getServer);
  const [activeEdge, setActiveEdge] = useState(-1);
  const [activeNode, setActiveNode] = useState(-1);

  useEffect(() => {
    if (reducedMotion) return;

    let edgeIdx = 0;
    const interval = setInterval(() => {
      const edge = EDGES[edgeIdx % EDGES.length];
      setActiveEdge(edgeIdx % EDGES.length);
      setActiveNode(edge[1]);

      setTimeout(() => {
        setActiveNode(-1);
      }, 600);

      edgeIdx++;
    }, 2000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.5 }}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="node-glow">
            <stop offset="0%" stopColor="rgba(167,139,250,0.4)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0)" />
          </radialGradient>
          <filter id="blur-sm">
            <feGaussianBlur stdDeviation="0.3" />
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map(([from, to], i) => {
          const a = NODES[from];
          const b = NODES[to];
          const isActive = i === activeEdge;
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke={isActive ? "rgba(167,139,250,0.5)" : "rgba(167,139,250,0.08)"}
              strokeWidth={isActive ? 0.4 : 0.15}
              className="transition-all duration-500"
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const isActive = node.id === activeNode;
          return (
            <g key={node.id}>
              {/* Glow circle (always visible, subtle) */}
              <circle
                cx={node.x} cy={node.y} r={isActive ? 2.5 : 1.2}
                fill="url(#node-glow)"
                className="transition-all duration-500"
              />
              {/* Core dot */}
              <circle
                cx={node.x} cy={node.y}
                r={isActive ? 0.8 : 0.4}
                fill={isActive ? "#a78bfa" : "rgba(167,139,250,0.35)"}
                className="transition-all duration-300"
              />
              {/* Label */}
              <text
                x={node.x} y={node.y - 2}
                textAnchor="middle"
                className="transition-all duration-300"
                fill={isActive ? "rgba(167,139,250,0.7)" : "rgba(167,139,250,0.12)"}
                fontSize="1.4"
                fontFamily="var(--font-mono)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
