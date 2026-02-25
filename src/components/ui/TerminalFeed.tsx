"use client";

import { useEffect, useRef, useState } from "react";

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

interface LogEntry {
  id: number;
  msg: string;
  color: string;
  timestamp: string;
}

export function TerminalFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logCounterRef = useRef(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const entry: LogEntry = {
          ...BOOT_LOGS[index],
          id: ++logCounterRef.current,
          timestamp: new Date().toISOString().split("T")[1].slice(0, 8),
        };
        const newLogs = [...prev, entry];
        if (newLogs.length > 8) newLogs.shift();
        return newLogs;
      });

      index = (index + 1) % BOOT_LOGS.length;
    }, 800);

    return () => clearInterval(interval);
  }, []);

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
        {logs.map((log) => (
          <div key={log.id} className={`${log.color} animate-in fade-in slide-in-from-left-2 duration-300`}>
            <span className="opacity-50 mr-2">[{log.timestamp}]</span>
            {log.msg}
          </div>
        ))}
        {/* Blinking Cursor */}
        <div className="h-4 w-2 bg-cyan-500 animate-pulse mt-1 inline-block" />
      </div>
    </div>
  );
}
