import { AlertTriangle, Home, Terminal } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-lg">
        {/* Glitchy 404 */}
        <div className="relative">
          <h1 className="text-9xl font-bold font-mono text-zinc-900 absolute top-0 left-1/2 -translate-x-1/2 select-none blur-sm">404</h1>
          <h1 className="text-9xl font-bold font-mono text-white relative z-10">404</h1>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-cyan-500/50 animate-scanline" />
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs rounded-sm">
            <AlertTriangle className="w-3 h-3" />
            <span>ERROR_CODE: PAGE_NOT_FOUND</span>
          </div>

          <p className="text-zinc-400 text-lg">
            The requested signal path could not be resolved. <br />
            The resource may have been moved, deleted, or classified.
          </p>

          <div className="font-mono text-xs text-zinc-600 bg-black/50 p-4 rounded border border-zinc-800 text-left space-y-1">
            <p><span className="text-purple-400">root@portfolio:~$</span> ping target_url</p>
            <p>ping: unknown host</p>
            <p><span className="text-purple-400">root@portfolio:~$</span> trace route</p>
            <p className="text-red-400">Trace failed. Destination unreachable.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <NeonButton href="/" variant="primary">
            <Home className="w-4 h-4 mr-2" /> RETURN_HOME
          </NeonButton>
          <NeonButton href="/projects" variant="outline">
            <Terminal className="w-4 h-4 mr-2" /> BROWSE_PROJECTS
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
