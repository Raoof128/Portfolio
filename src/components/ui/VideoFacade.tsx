"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface VideoFacadeProps {
    videoId: string
    title?: string
}

export function VideoFacade({ videoId, title = "System Demo" }: VideoFacadeProps) {
    const [isPlaying, setIsPlaying] = useState(false)

    if (isPlaying) {
        return (
            <div className="relative w-full aspect-video bg-black border border-cyan/30 rounded-sm overflow-hidden animate-in fade-in duration-500">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        )
    }

    return (
        <button
            onClick={() => setIsPlaying(true)}
            className="group relative w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden flex items-center justify-center hover:border-cyan/50 transition-colors"
            aria-label={`Play ${title}`}
        >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Thumbnail Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play Button */}
            <div className="relative z-10 w-16 h-16 rounded-full bg-cyan/10 border border-cyan/50 flex items-center justify-center text-cyan group-hover:scale-110 group-hover:bg-cyan/20 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
                <Play fill="currentColor" className="w-6 h-6 ml-1" />
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="font-mono text-xs text-cyan/70 bg-black/50 px-2 py-1 border border-cyan/20 uppercase">
                    CLICK_TO_INITIALIZE_FEED
                </div>
                <div className="hidden md:block font-mono text-xs text-zinc-500">
                    SECURE_CONNECTION
                </div>
            </div>

            {/* Scanning Line Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="w-full h-[2px] bg-cyan shadow-[0_0_10px_#06b6d4] animate-scanline" />
            </div>
        </button>
    )
}
