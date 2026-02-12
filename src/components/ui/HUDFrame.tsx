"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

interface HUDFrameProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    corners?: boolean;
}

const cornerVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
        opacity: 1,
        transition: { delay: i * 0.1, duration: 0.3 },
    }),
};

export function HUDFrame({ children, className, title, corners = true, ...props }: HUDFrameProps) {
    return (
        <div className={cn("relative p-6 border border-white/5 glass", className)} {...props}>
            {/* Title Tag */}
            {title && (
                <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-mono text-cyan/70 tracking-widest uppercase border border-white/10">
                    {title}
                </div>
            )}

            {/* Animated Corners */}
            {corners && (
                <>
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={cornerVariants}
                        className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-cyan"
                    />
                    <motion.div
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={cornerVariants}
                        className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t border-r border-cyan"
                    />
                    <motion.div
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={cornerVariants}
                        className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b border-l border-cyan"
                    />
                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={cornerVariants}
                        className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-cyan"
                    />
                </>
            )}

            {children}
        </div>
    );
}
