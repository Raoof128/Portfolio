import { AlertTriangle, Hammer } from "lucide-react";

export default function LabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl border border-dashed border-zinc-800 bg-black/50 p-12 text-center rounded-lg relative overflow-hidden">
        
        {/* Animated Background Strip */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scanline" />

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20 animate-pulse">
            <Hammer className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white font-mono mb-4">
          LAB_UNDER_CONSTRUCTION
        </h1>
        
        <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
          This sector is currently being retrofitted for <span className="text-cyan-400">eBPF</span> containment fields. 
          Hazardous experimental code compilation in progress.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-sm text-xs font-mono text-zinc-500">
          <AlertTriangle className="w-3 h-3 text-yellow-500" />
          <span>ESTIMATED_COMPLETION: T-MINUS_UNKNOWN</span>
        </div>
      </div>
    </div>
  );
}