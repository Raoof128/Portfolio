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
        <div className={cn("relative p-6 border border-cyan/10 glass", className)} {...props}>
            {/* Title Tag */}
            {title && (
                <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-mono text-cyan/70 tracking-widest uppercase border border-cyan/15">
                    {title}
                </div>
            )}

            {/* Animated Corners — larger with vertex dots */}
            {corners && (
                <>
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={cornerVariants}
                        className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t border-l border-cyan"
                    >
                        <span className="absolute -top-[2px] -left-[2px] w-1 h-1 bg-cyan shadow-[0_0_6px_rgba(124,77,189,0.8)]" />
                    </motion.div>
                    <motion.div
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={cornerVariants}
                        className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t border-r border-cyan"
                    >
                        <span className="absolute -top-[2px] -right-[2px] w-1 h-1 bg-cyan shadow-[0_0_6px_rgba(124,77,189,0.8)]" />
                    </motion.div>
                    <motion.div
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={cornerVariants}
                        className="absolute -bottom-[1px] -left-[1px] w-5 h-5 border-b border-l border-cyan"
                    >
                        <span className="absolute -bottom-[2px] -left-[2px] w-1 h-1 bg-cyan shadow-[0_0_6px_rgba(124,77,189,0.8)]" />
                    </motion.div>
                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={cornerVariants}
                        className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b border-r border-cyan"
                    >
                        <span className="absolute -bottom-[2px] -right-[2px] w-1 h-1 bg-cyan shadow-[0_0_6px_rgba(124,77,189,0.8)]" />
                    </motion.div>
                </>
            )}

            {children}
        </div>
    );
}
