import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
}

export function Card({ className, children, hoverEffect = true, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-white/5 border border-white/10 p-6 overflow-hidden relative",
        hoverEffect && "transition-all duration-300 hover:border-cyan/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.1)]",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}
