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
 * The clip is a wide 2.34:1 loop shown at its native aspect (the element is
 * aspect-locked, so it is never cropped or stretched). On viewports taller
 * than the clip that leaves bands above/below — those are filled by a CSS starfield
 * (twinkling star layers + a faint blue nebula halo) and the video's top and
 * bottom edges are mask-faded into it, so the whole hero reads as one
 * continuous space scene. Portrait phones fall back to `object-cover`
 * (contain would shrink the clip to a thin strip there).
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
      {/* Starfield — fills the bands above/below the 2.34:1 clip so the hero
          stays full-bleed without cropping or stretching the video. Two star
          tiles twinkle out of phase; the nebula halo continues the accretion
          disk's blue glow past the video edges. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 55% at 50% 50%, rgba(59,130,246,0.10), transparent 70%), " +
            "radial-gradient(70% 30% at 30% 12%, rgba(103,148,214,0.07), transparent 75%), " +
            "radial-gradient(70% 30% at 72% 88%, rgba(56,116,203,0.07), transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 25px 35px, rgba(255,255,255,0.8), transparent), " +
            "radial-gradient(1px 1px at 112px 152px, rgba(199,210,254,0.7), transparent), " +
            "radial-gradient(1px 1px at 190px 82px, rgba(255,255,255,0.55), transparent), " +
            "radial-gradient(1px 1px at 62px 214px, rgba(165,243,252,0.6), transparent), " +
            "radial-gradient(1px 1px at 232px 190px, rgba(255,255,255,0.45), transparent), " +
            "radial-gradient(1px 1px at 152px 246px, rgba(255,255,255,0.5), transparent)",
          backgroundSize: "260px 260px",
          animation: "star-twinkle 5.5s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 65px 45px, rgba(255,255,255,0.9), transparent), " +
            "radial-gradient(2px 2px at 270px 300px, rgba(186,230,253,0.8), transparent), " +
            "radial-gradient(1.5px 1.5px at 350px 130px, rgba(255,255,255,0.75), transparent), " +
            "radial-gradient(2.5px 2.5px at 160px 380px, rgba(199,210,254,0.55), transparent)",
          backgroundSize: "420px 420px",
          animation: "star-twinkle 8s ease-in-out 2.2s infinite",
        }}
      />

      {/* Video + its darkening gradient are mirrored together for RTL so the
          bright disk always sits opposite the text column. */}
      <div
        className="absolute inset-0"
        style={{ transform: isRTL ? "scaleX(-1)" : undefined }}
      >
        {/* In landscape the element is aspect-locked to the clip (1280×548)
            and vertically centered, so nothing is cropped or stretched and
            the mask fade lands exactly on the clip's edges. Portrait keeps
            the old full-bleed cover behaviour. */}
        <video
          ref={videoRef}
          className="absolute left-0 top-0 h-full w-full object-cover object-center [@media(orientation:landscape)]:top-1/2 [@media(orientation:landscape)]:h-auto [@media(orientation:landscape)]:-translate-y-1/2 [@media(orientation:landscape)]:aspect-[1280/548]"
          style={{
            // Melt the clip's top/bottom edges into the CSS starfield so the
            // band boundary never shows as a hard line.
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
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
