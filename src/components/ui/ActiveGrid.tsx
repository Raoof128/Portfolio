"use client";

import { useEffect, useState } from "react";

export function ActiveGrid() {
  const [activeCells, setActiveCells] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly activate 2-4 cells every cycle
      const count = Math.floor(Math.random() * 3) + 2;
      const newCells = Array.from({ length: count }, () =>
        Math.floor(Math.random() * 100)
      );
      setActiveCells(newCells);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
      <div 
        className="w-full h-full grid grid-cols-6 md:grid-cols-12 gap-1 opacity-20"
        style={{ 
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          perspective: "500px" 
        }}
      >
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className={`
              relative transition-all duration-1000 ease-in-out border border-cyan-500/10 rounded-sm
              ${activeCells.includes(i) ? "bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)] border-cyan-500/50" : "bg-transparent"}
            `}
          >
             {/* The "Data Packet" Pulse */}
             {activeCells.includes(i) && (
                <div className="absolute inset-0 bg-cyan-400/30 animate-ping" />
             )}
          </div>
        ))}
      </div>
    </div>
  );
}
