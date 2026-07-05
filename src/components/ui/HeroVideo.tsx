"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/provider";

/**
 * HeroVideo — the hero background: a pre-rendered cinematic black-hole loop.
 *
 * Autoplay video needs muted+playsInline for iOS/Safari, pauses itself when
 * scrolled out of view (IntersectionObserver) and never autoplays under
 * prefers-reduced-motion (shows the poster frame only). WebM is listed first
 * so browsers that support it use the smaller file; MP4 is the universal
 * fallback.
 *
 * The clip is a wide 2.34:1 loop and the hero is full-height. To fill the
 * whole hero edge-to-edge with no letterbox band, the video is stretched
 * (`object-fill`) on landscape viewports — where the aspect gap is small so
 * the stretch stays subtle — and falls back to `object-cover` on portrait
 * phones, where a full stretch would smear the black hole into a tall streak.
 *
 * The hero text column swaps sides for RTL locales (fa/ar) — the video and
 * its darkening gradient are mirrored together via scaleX(-1) so the bright
 * disk always sits away from the text, never behind it, in either direction.
 */
export function HeroVideo() {
  const { locale } = useTranslation();
  const isRTL = locale === "fa" || locale === "ar";
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true;

    function syncPlayback() {
      if (!video) return;
      if (rmq.matches || !inView) {
        video.pause();
      } else {
        // play() returns a promise that rejects if the browser blocks
        // autoplay (e.g. before any user interaction) — safe to ignore.
        void video.play().catch(() => {});
      }
    }

    syncPlayback();

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        syncPlayback();
      },
      { threshold: 0.02 },
    );
    io.observe(video);

    const onRmqChange = () => syncPlayback();
    rmq.addEventListener?.("change", onRmqChange);

    return () => {
      io.disconnect();
      rmq.removeEventListener?.("change", onRmqChange);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden bg-[#030712]"
      aria-hidden="true"
    >
      {/* Video + its darkening gradient are mirrored together for RTL so the
          bright disk always sits opposite the text column. */}
      <div
        className="absolute inset-0"
        style={{ transform: isRTL ? "scaleX(-1)" : undefined }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-center object-fill [@media(orientation:portrait)]:object-cover"
          poster="/hero-singularity-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/hero-singularity.webm" type="video/webm" />
          <source src="/hero-singularity.mp4" type="video/mp4" />
        </video>

        {/* Light scrim — just enough to keep copy readable over the bright
            disk without hiding the footage. Paired with a text-shadow on the
            hero copy (see page.tsx) so the heavy lifting isn't done here. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 72% 40%, transparent 0 18%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.5) 95%), " +
              "linear-gradient(115deg, rgba(3,7,18,0.62) 0%, rgba(3,7,18,0.5) 34%, rgba(3,7,18,0.24) 54%, transparent 78%), " +
              "linear-gradient(0deg, rgba(3,7,18,0.5) 0%, transparent 34%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* Scanlines — matches the site's HUD texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 1px, transparent 2px, transparent 7px)",
          mixBlendMode: "screen",
          zIndex: 2,
        }}
      />
    </div>
  );
}
