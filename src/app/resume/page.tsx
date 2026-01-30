import { NeonButton } from "@/components/ui/NeonButton";
import { Download, FileText } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-cyan font-mono mr-3">/</span>Resume
        </h1>
        <NeonButton variant="primary">
          <Download className="w-4 h-4 mr-2" /> DOWNLOAD_PDF
        </NeonButton>
      </div>

      <div className="aspect-[1/1.4] w-full bg-zinc-900 border border-white/10 flex flex-col items-center justify-center p-12 text-zinc-500">
        <FileText className="w-16 h-16 mb-4 opacity-50" />
        <p>PDF Preview Mechanism</p>
        <p className="text-sm mt-2">Resume file not found.</p>
      </div>
    </div>
  );
}
