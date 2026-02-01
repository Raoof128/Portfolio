"use client";

import { useState, useEffect } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { Send, Lock, AlertTriangle } from "lucide-react";

export function SecureContactForm() {
  const [status, setStatus] = useState<"IDLE" | "TYPING" | "ENCRYPTING">("IDLE");
  const [traceId, setTraceId] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTraceId(Math.random().toString(36).substring(7).toUpperCase());
  }, []);

  const handleTyping = () => {
    setStatus("TYPING");
    const timeout = setTimeout(() => setStatus("ENCRYPTING"), 800);
    return () => clearTimeout(timeout);
  };

  return (
    <div className="max-w-xl mx-auto p-6 border border-zinc-800 bg-black/40 backdrop-blur-sm rounded-lg relative overflow-hidden">
      {/* Decorative 'Scanner' Bar */}
      <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-300 ${status === "TYPING" ? "bg-red-500 animate-pulse" : "bg-cyan-500/50"}`} />

      <div className="flex justify-between items-center mb-6 font-mono text-xs text-zinc-500">
        <span>SESSION_ID: <span className="text-zinc-300">{traceId}</span></span>
        <span className={`flex items-center gap-2 ${status === "TYPING" ? "text-red-400" : "text-green-400"}`}>
          {status === "TYPING" ? <AlertTriangle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {status === "TYPING" ? "KEYLOGGING_ACTIVE..." : "CHANNEL_SECURE"}
        </span>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-cyan-500">TARGET_ID (Name)</label>
            <input 
              type="text" 
              placeholder="ENTER_IDENTITY"
              onKeyDown={handleTyping}
              className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 p-2 text-sm focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-cyan-500">RETURN_PATH (Email)</label>
            <input 
              type="email" 
              placeholder="secure@gateway.io"
              onKeyDown={handleTyping}
              className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 p-2 text-sm focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-cyan-500">PAYLOAD (Message)</label>
          <textarea 
            rows={4}
            placeholder="TRANSMITTING_ENCRYPTED_PAYLOAD..."
            onKeyDown={handleTyping}
            className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 p-2 text-sm focus:border-red-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-zinc-600 font-mono">
            * Warning: Keystrokes are definitely not recorded. Trust me.
          </p>
          <NeonButton variant="primary" className="px-6">
            <Send className="w-3 h-3 mr-2" /> TRANSMIT
          </NeonButton>
        </div>
      </form>
    </div>
  );
}
