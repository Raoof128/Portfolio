"use client";

import { useEffect, useState, useRef } from "react";

const BOOT_LOGS = [
  { msg: "KERNEL: Initializing eBPF subsystem...", color: "text-zinc-400" },
  { msg: "OK: Loaded module [security_mon.ko]", color: "text-green-400" },
  { msg: "NET: XDP hook attached on eth0", color: "text-cyan-400" },
  { msg: "RUST: Memory safety verification... PASS", color: "text-green-400" },
  { msg: "WARN: 3rd party cookie blocked", color: "text-yellow-400" },
  { msg: "SYS: Mounting virtual filesystem...", color: "text-zinc-500" },
  { msg: "AUTH: User 'Raouf' authenticated", color: "text-purple-400" },
  { msg: "SCAN: Port 443 active", color: "text-zinc-300" },
  { msg: "REACT: Hydration complete", color: "text-blue-400" },
  { msg: "INIT: Starting main process loop...", color: "text-white" },
];

export function TerminalFeed() {
  const [logs, setLogs] = useState<typeof BOOT_LOGS>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, BOOT_LOGS[index]];
        if (newLogs.length > 8) newLogs.shift(); // Keep only last 8 lines
        return newLogs;
      });
      
      index = (index + 1) % BOOT_LOGS.length;
    }, 800); // New line every 800ms

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="font-mono text-xs md:text-sm h-[200px] overflow-hidden flex flex-col justify-end p-4 bg-black/80 border-l-2 border-cyan-500/50 backdrop-blur-sm rounded-r-md">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
         <span className="text-zinc-500">SYS_LOGS // live</span>
         <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/20" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
         </div>
      </div>
      
      <div className="space-y-1 relative">
        {logs.map((log, i) => (
          <div key={i} className={`${log.color} animate-in fade-in slide-in-from-left-2 duration-300`}>
            <span className="opacity-50 mr-2">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
            {log.msg}
          </div>
        ))}
        {/* Blinking Cursor */}
        <div className="h-4 w-2 bg-cyan-500 animate-pulse mt-1 inline-block" />
      </div>
    </div>
  );
}
