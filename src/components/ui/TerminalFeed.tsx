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
  { msg: "  OS      Arch Linux x86_64", color: "text-text-body", typeSpeed: 0 },
  { msg: "  Host    raouf@castle-hill", color: "text-text-body", typeSpeed: 0 },
  { msg: "  Role    AI Security Researcher", color: "text-purple-400", typeSpeed: 0 },
  { prompt: "~", msg: "python3 invisible_window.py --verify --platforms all", color: "text-cyan", delay: 600, typeSpeed: 22 },
  { msg: "  ▸ Win32 SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)", color: "text-text-body", typeSpeed: 0 },
  { msg: "  ▸ macOS NSWindow.SharingType.none", color: "text-text-body", typeSpeed: 0 },
  { msg: "  ✓ 100% evasion · 10,000+ frames · 0 artefacts", color: "text-green-400", typeSpeed: 0 },
  { prompt: "~", msg: "python3 llm_eval.py --model claude --suite safety", color: "text-cyan", delay: 500, typeSpeed: 22 },
  { msg: "  ▸ Benchmarking code quality, security, reliability...", color: "text-text-body", typeSpeed: 0 },
  { msg: "  ✓ Anthropic evaluation: 847/847 passed", color: "text-green-400", typeSpeed: 0 },
  { prompt: "~", msg: "sentinelflow --live eth0 --rules ids.rules", color: "text-cyan", delay: 500, typeSpeed: 24 },
  { msg: "  ▸ Parsing 500K+ pkt/sec across 7 protocols", color: "text-text-body", typeSpeed: 0 },
  { msg: "  ✓ IDS engine active — 0 threats detected", color: "text-green-400", typeSpeed: 0 },
  { prompt: "~", msg: "nanomatch --bench | tail -1", color: "text-cyan", delay: 600, typeSpeed: 22 },
  { msg: "  Throughput: 1M+ ops/sec · sub-μs latency", color: "text-green-400", typeSpeed: 0 },
];

const AMBIENT_LOGS: RawLog[] = [
  { msg: "VULN   display_affinity  win32/macOS  evasion=100%  ✓", color: "text-green-400" },
  { msg: "IDS    SentinelFlow  tcp/443  signature match  clean", color: "text-text-body" },
  { msg: "DISC   coordinated disclosure  3 vendors  90-day  ✓", color: "text-purple-400" },
  { msg: "AI     capability_uplift  model=opus  measured  ✓", color: "text-purple-400" },
  { msg: "WARN   safety_boundary  intent-vs-artefact  flagged", color: "text-amber" },
  { msg: "NET    dns query  raoufabedini.dev  → CF", color: "text-text-body" },
  { msg: "LLM    eval batch #247  safety_score=0.98  ✓", color: "text-green-400" },
  { msg: "OK     research_pipeline  /healthz  200  4ms", color: "text-green-400" },
  { msg: "IDS    port sweep detected  src=192.168.1.x  dropped", color: "text-amber" },
  { msg: "VULN   ScreenCaptureKit  macOS_26.3.1  bypass confirmed", color: "text-purple-400" },
  { msg: "AI     dual_use_risk  assessment_complete  low  ✓", color: "text-text-body" },
  { msg: "LLM    prompt_injection_test  isolation  ✓", color: "text-green-400" },
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
      className="relative font-mono text-[11px] leading-[1.6] h-[320px] bg-[#0a0a0c] border border-cyan/10 overflow-hidden select-none"
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
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 border-b border-cyan/10 bg-cyan/[0.03]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]/70" />
            <div className="w-[9px] h-[9px] rounded-full bg-[#febc2e]/70" />
            <div className="w-[9px] h-[9px] rounded-full bg-[#28c840]/70" />
          </div>
          <span className="text-text-meta text-[10px] ml-3 tracking-wider">raouf@castle-hill</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${phase === "ambient" ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" : "bg-amber animate-pulse"}`} />
          <span className="text-text-meta text-[10px] tracking-wider uppercase">
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
