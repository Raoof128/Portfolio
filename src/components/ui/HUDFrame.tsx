import { cn } from "@/lib/utils";
import React from "react";

interface HUDFrameProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    corners?: boolean;
}

export function HUDFrame({ children, className, title, corners = true, ...props }: HUDFrameProps) {
    return (
        <div className={cn("relative p-6 border border-white/5 bg-background/50", className)} {...props}>
            {/* Title Tag */}
            {title && (
                <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-mono text-cyan/70 tracking-widest uppercase border border-white/10">
                    {title}
                </div>
            )}

            {/* Corners */}
            {corners && (
                <>
                    {/* Top Left */}
                    <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-cyan" />
                    {/* Top Right */}
                    <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t border-r border-cyan" />
                    {/* Bottom Left */}
                    <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b border-l border-cyan" />
                    {/* Bottom Right */}
                    <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-cyan" />
                </>
            )}

            {children}
        </div>
    );
}
