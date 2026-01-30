import { cn } from "@/lib/utils"

interface ProofItem {
  label: string
  value: string
}

interface HudProofPanelProps {
  items: ProofItem[]
  className?: string
}

export function HudProofPanel({ items, className }: HudProofPanelProps) {
  return (
    <div className={cn("border border-cyan/30 bg-black/40 p-6 font-mono text-xs relative", className)}>
      {/* Decorative corners */}
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-cyan" />
      <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-cyan" />
      <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-cyan" />
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-cyan" />
      
      <div className="absolute -top-2 left-4 bg-background px-2 text-[10px] text-cyan uppercase tracking-widest border border-cyan/20">
        System Status
      </div>

      <div className="space-y-3 mt-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
            <span className="text-gray-500 uppercase tracking-wider">{item.label}</span>
            <span className="text-cyan font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
