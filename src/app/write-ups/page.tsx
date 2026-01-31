import { FileText, Lock } from "lucide-react";

export default function WriteUpsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center relative">
        
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
           <Lock className="w-12 h-12 text-zinc-700" />
        </div>

        <h1 className="text-3xl font-bold text-zinc-600 font-mono mb-2">
          CLASSIFIED_ARCHIVE
        </h1>
        
        <p className="text-zinc-500 mb-8">
          You do not have the required clearance level to access these records yet.
          <br />
          (Content migration in progress...)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto opacity-50 pointer-events-none select-none">
           {[1, 2, 3].map((i) => (
             <div key={i} className="p-3 border border-zinc-800 bg-black/20 rounded flex items-center gap-3">
               <FileText className="w-4 h-4 text-zinc-700" />
               <div className="h-2 w-24 bg-zinc-800 rounded animate-pulse" />
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}