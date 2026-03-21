"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* ─── Reduced-motion detection ──────────────────────────────────────── */

const rmq = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(rmq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
function getSnap() { return window.matchMedia(rmq).matches; }
function getServer() { return false; }

/* ─── Log data ──────────────────────────────────────────────────────── */

interface RawLog {
  prompt?: string;      // e.g. "$ sudo" — rendered as a typed command
  msg: string;
  color: string;
  delay?: number;       // ms before this line starts typing
  typeSpeed?: number;   // ms per character (0 = instant block output)
}

const BOOT_SEQUENCE: RawLog[] = [
  { prompt: "~", msg: "neofetch --short", color: "text-cyan", delay: 400, typeSpeed: 28 },
  { msg: "  OS      Arch Linux x86_64", color: "text-zinc-500", typeSpeed: 0 },
  { msg: "  Host    raouf@castle-hill", color: "text-zinc-500", typeSpeed: 0 },
  { msg: "  Uptime  3y 127d", color: "text-zinc-500", typeSpeed: 0 },
  { prompt: "~", msg: "systemctl status security.target", color: "text-cyan", delay: 600, typeSpeed: 22 },
  { msg: "● security.target - Security Stack", color: "text-green-400", typeSpeed: 0 },
  { msg: "  Loaded: active (running)", color: "text-green-400", typeSpeed: 0 },
  { prompt: "#", msg: "bpftool prog list | head -3", color: "text-amber", delay: 500, typeSpeed: 24 },
  { msg: "  42: tracepoint  tag 9ef3..  execve_monitor", color: "text-zinc-400", typeSpeed: 0 },
  { msg: "  43: tracepoint  tag a1f7..  connect_guard", color: "text-zinc-400", typeSpeed: 0 },
  { msg: "  44: xdp         tag d82c..  packet_filter", color: "text-zinc-400", typeSpeed: 0 },
  { prompt: "~", msg: "cargo test --release 2>&1 | tail -1", color: "text-cyan", delay: 500, typeSpeed: 20 },
  { msg: "  test result: ok. 87 passed; 0 failed", color: "text-green-400", typeSpeed: 0 },
  { prompt: "~", msg: "kubectl get pods -n monitor", color: "text-cyan", delay: 600, typeSpeed: 22 },
  { msg: "  ecrsm-agent    1/1  Running  0  12d", color: "text-zinc-400", typeSpeed: 0 },
  { msg: "  ecrsm-dash     1/1  Running  0  12d", color: "text-zinc-400", typeSpeed: 0 },
];

const AMBIENT_LOGS: RawLog[] = [
  { msg: "NET    eth0  TLS 1.3 handshake ✓", color: "text-green-400" },
  { msg: "SCAN   443   certificate valid 247d", color: "text-zinc-400" },
  { msg: "EBPF   execve_monitor  pid=3847  /usr/bin/node", color: "text-zinc-500" },
  { msg: "AUTH   session refresh  user=raouf  ✓", color: "text-purple-400" },
  { msg: "WARN   blocked  origin=unknown  → 403", color: "text-amber" },
  { msg: "NET    dns query  raoufabedini.dev  → CF", color: "text-zinc-400" },
  { msg: "EBPF   connect_guard  pid=4102  → 10.0.0.1:443", color: "text-zinc-500" },
  { msg: "OK     health check  /healthz  200  4ms", color: "text-green-400" },
  { msg: "SCAN   port sweep detected  src=192.168.1.x  dropped", color: "text-amber" },
  { msg: "AUTH   passkey verify  credential_id=a7f2..  ✓", color: "text-purple-400" },
  { msg: "EBPF   xdp_filter  dropped 12 malformed packets", color: "text-zinc-500" },
  { msg: "NET    wss://  upgrade  dashboard client  ✓", color: "text-green-400" },
];

/* ─── Typing engine ─────────────────────────────────────────────────── */

interface DisplayLine {
  id: number;
  prompt?: string;
  text: string;
  color: string;
  done: boolean;
}

export function TerminalFeed() {
  const reducedMotion = useSyncExternalStore(subscribe, getSnap, getServer);
  const [lines, setLines] = useState<DisplayLine[]>([]);
  const [phase, setPhase] = useState<"boot" | "ready" | "ambient">("boot");
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cursor blink
  useEffect(() => {
    if (reducedMotion) return;
    const i = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(i);
  }, [reducedMotion]);

  // Auto-scroll
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Clear timeouts on unmount
  useEffect(() => {
    const t = timeoutsRef.current;
    return () => t.forEach(clearTimeout);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (reducedMotion) {
      // Show all boot lines instantly
      const all = BOOT_SEQUENCE.map((log, i) => ({
        id: i,
        prompt: log.prompt,
        text: log.msg,
        color: log.color,
        done: true,
      }));
      idRef.current = all.length;
      setLines(all);
      setPhase("ready");
      return;
    }

    let elapsed = 0;

    BOOT_SEQUENCE.forEach((log) => {
      const startDelay = elapsed + (log.delay ?? 80);
      const lineId = ++idRef.current;
      const speed = log.typeSpeed ?? 0;

      if (speed > 0 && log.prompt) {
        // Typed command: appear char by char
        const t1 = setTimeout(() => {
          setLines(prev => [...prev, { id: lineId, prompt: log.prompt, text: "", color: log.color, done: false }]);
        }, startDelay);
        timeoutsRef.current.push(t1);

        for (let ci = 0; ci < log.msg.length; ci++) {
          const t2 = setTimeout(() => {
            setLines(prev =>
              prev.map(l => l.id === lineId ? { ...l, text: log.msg.slice(0, ci + 1) } : l)
            );
          }, startDelay + speed * (ci + 1));
          timeoutsRef.current.push(t2);
        }

        const totalType = speed * log.msg.length;
        const t3 = setTimeout(() => {
          setLines(prev =>
            prev.map(l => l.id === lineId ? { ...l, done: true } : l)
          );
        }, startDelay + totalType);
        timeoutsRef.current.push(t3);

        elapsed = startDelay + totalType + 100;
      } else {
        // Instant output block
        const t = setTimeout(() => {
          setLines(prev => [...prev, { id: lineId, prompt: log.prompt, text: log.msg, color: log.color, done: true }]);
        }, startDelay);
        timeoutsRef.current.push(t);
        elapsed = startDelay + 60;
      }
    });

    // Transition to ready
    const t = setTimeout(() => setPhase("ready"), elapsed + 400);
    timeoutsRef.current.push(t);
  }, [reducedMotion]);

  // Ready message
  useEffect(() => {
    if (phase !== "ready") return;
    const lineId = ++idRef.current;
    const readyMsg = "  ▸ all systems nominal — portfolio online";

    if (reducedMotion) {
      setLines(prev => [...prev, { id: lineId, prompt: undefined, text: readyMsg, color: "text-green-400", done: true }]);
      setPhase("ambient");
      return;
    }

    const t1 = setTimeout(() => {
      setLines(prev => [...prev, { id: lineId, prompt: undefined, text: "", color: "text-green-400", done: false }]);
    }, 200);
    timeoutsRef.current.push(t1);

    for (let ci = 0; ci < readyMsg.length; ci++) {
      const t = setTimeout(() => {
        setLines(prev =>
          prev.map(l => l.id === lineId ? { ...l, text: readyMsg.slice(0, ci + 1) } : l)
        );
      }, 200 + 18 * (ci + 1));
      timeoutsRef.current.push(t);
    }

    const t2 = setTimeout(() => {
      setLines(prev => prev.map(l => l.id === lineId ? { ...l, done: true } : l));
      setPhase("ambient");
    }, 200 + 18 * readyMsg.length + 200);
    timeoutsRef.current.push(t2);
  }, [phase, reducedMotion]);

  // Ambient monitoring loop
  useEffect(() => {
    if (phase !== "ambient") return;
    let ambientIdx = 0;

    const interval = setInterval(() => {
      const log = AMBIENT_LOGS[ambientIdx % AMBIENT_LOGS.length];
      const lineId = ++idRef.current;
      const ts = new Date().toISOString().split("T")[1].slice(0, 8);

      setLines(prev => {
        const next = [...prev, {
          id: lineId,
          text: `[${ts}] ${log.msg}`,
          color: log.color,
          done: true,
        }];
        // Keep last 14 lines
        return next.length > 14 ? next.slice(-14) : next;
      });
      ambientIdx++;
    }, reducedMotion ? 2000 : 2400);

    return () => clearInterval(interval);
  }, [phase, reducedMotion]);

  /* ─── Prompt symbol styling ───────────────────────────────────────── */
  function promptSymbol(p?: string) {
    if (!p) return null;
    const color = p === "#" ? "text-amber" : "text-cyan";
    return <span className={`${color} mr-1.5 select-none`}>{p === "~" ? "❯" : "#"}</span>;
  }

  return (
    <div
      className="relative font-mono text-[11px] leading-[1.6] h-[320px] bg-[#0a0a0c] border border-white/[0.06] overflow-hidden select-none"
      role="img"
      aria-label="Animated terminal showing system boot sequence and security monitoring"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        aria-hidden="true"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
        }}
      />

      {/* Top chrome bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]/70" />
            <div className="w-[9px] h-[9px] rounded-full bg-[#febc2e]/70" />
            <div className="w-[9px] h-[9px] rounded-full bg-[#28c840]/70" />
          </div>
          <span className="text-zinc-600 text-[10px] ml-3 tracking-wider">raouf@castle-hill</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${phase === "ambient" ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" : "bg-amber animate-pulse"}`} />
          <span className="text-zinc-600 text-[10px] tracking-wider uppercase">
            {phase === "boot" ? "booting" : phase === "ready" ? "ready" : "monitoring"}
          </span>
        </div>
      </div>

      {/* Log area */}
      <div ref={containerRef} className="relative z-10 px-4 py-3 h-[calc(100%-36px)] overflow-y-auto scrollbar-none">
        {lines.map((line) => (
          <div key={line.id} className={`${line.color} whitespace-pre`}>
            {promptSymbol(line.prompt)}
            {line.text}
            {/* Inline cursor on the currently typing line */}
            {!line.done && !reducedMotion && (
              <span
                className="inline-block w-[7px] h-[13px] ml-px translate-y-[2px] bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                style={{ opacity: cursorVisible ? 1 : 0 }}
              />
            )}
          </div>
        ))}

        {/* Resting cursor after all lines are done */}
        {phase === "ambient" && lines.length > 0 && lines[lines.length - 1]?.done && !reducedMotion && (
          <div className="mt-0.5">
            <span className="text-cyan mr-1.5">❯</span>
            <span
              className="inline-block w-[7px] h-[13px] translate-y-[2px] bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              style={{ opacity: cursorVisible ? 1 : 0 }}
            />
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0a0c] to-transparent z-10 pointer-events-none" />
    </div>
  );
}
