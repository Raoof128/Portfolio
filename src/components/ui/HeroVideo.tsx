"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/provider";

/**
 * HeroVideo — "The Verification Horizon" hero background.
 *
 * Two independently composed cinematic loops (not one crop): a 16:9 landscape
 * asset with the singularity at ~72%/43% and a quiet left half for the text
 * column, and a native 9:16 portrait asset with the singularity in the upper
 * third and a quiet lower two-thirds. Orientation is watched via matchMedia so
 * exactly one <video> exists (one download, one decoder) and remounts cleanly
 * (key swap) when orientation flips.
 *
 * Poster-first paint: an <img> poster layer (AVIF→JPG) is always painted
 * beneath the video; the video fades in only after its first frame is actually
 * decoded (requestVideoFrameCallback, with a `playing` fallback) so there is
 * never a black flash. The poster is extracted from frame 0 of the encoded
 * loop, so the crossfade is invisible.
 *
 * Autoplay needs muted+playsInline (iOS/Safari). Playback pauses off-screen
 * (IntersectionObserver) and never starts under prefers-reduced-motion or
 * navigator.connection.saveData — those users keep the poster.
 *
 * The hero text column swaps sides for RTL locales (fa/ar) — video, poster and
 * scrim mirror together via scaleX(-1) so the bright structure always sits
 * away from the text. Assets contain no readable glyphs, so mirroring is safe.
 */

const ASSETS = {
  landscape: {
    webm: "/hero-verification-desktop.webm",
    mp4: "/hero-verification-desktop.mp4",
    posterAvif: "/hero-verification-desktop-poster.avif",
    posterJpg: "/hero-verification-desktop-poster.jpg",
  },
  portrait: {
    webm: "/hero-verification-mobile.webm",
    mp4: "/hero-verification-mobile.mp4",
    posterAvif: "/hero-verification-mobile-poster.avif",
    posterJpg: "/hero-verification-mobile-poster.jpg",
  },
} as const;

type Orientation = keyof typeof ASSETS;

/* Scrims are tuned per composition: landscape protects the left text column
   (singularity right of centre); portrait protects the lower two-thirds
   (singularity in the upper third). */
const SCRIM: Record<Orientation, string> = {
  landscape:
    "radial-gradient(circle at 72% 43%, transparent 0 16%, rgba(0,0,0,0.10) 42%, rgba(0,0,0,0.45) 95%), " +
    "linear-gradient(115deg, rgba(3,7,18,0.66) 0%, rgba(3,7,18,0.52) 34%, rgba(3,7,18,0.22) 54%, transparent 78%), " +
    "linear-gradient(0deg, rgba(3,7,18,0.5) 0%, transparent 32%)",
  portrait:
    "radial-gradient(circle at 62% 22%, transparent 0 14%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.4) 96%), " +
    "linear-gradient(0deg, rgba(3,7,18,0.72) 0%, rgba(3,7,18,0.45) 40%, rgba(3,7,18,0.12) 62%, transparent 80%)",
};

function getOrientation(): Orientation {
  if (typeof window === "undefined") return "landscape";
  return window.matchMedia("(orientation: portrait)").matches
    ? "portrait"
    : "landscape";
}

function prefersStill(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return true;
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return conn?.saveData === true;
}

export function HeroVideo() {
  const { locale } = useTranslation();
  const isRTL = locale === "fa" || locale === "ar";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [orientation, setOrientation] = useState<Orientation>(getOrientation);
  // Data-saver / reduced-motion users never mount the video at all.
  const [still, setStill] = useState(prefersStill);
  const [videoVisible, setVideoVisible] = useState(false);

  /* Track orientation; remount the <video> (via key) on change so the new
     source loads cleanly and the old decoder is released. */
  useEffect(() => {
    const omq = window.matchMedia("(orientation: portrait)");
    const onChange = () => {
      setOrientation(omq.matches ? "portrait" : "landscape");
      setVideoVisible(false);
    };
    omq.addEventListener?.("change", onChange);
    return () => omq.removeEventListener?.("change", onChange);
  }, []);

  /* Reduced-motion can flip at runtime. */
  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setStill(prefersStill());
    rmq.addEventListener?.("change", onChange);
    return () => rmq.removeEventListener?.("change", onChange);
  }, []);

  /* Playback control + first-decoded-frame reveal for the current video. */
  useEffect(() => {
    if (still) return;
    const video = videoRef.current;
    if (!video) return;

    let inView = true;
    let revealed = false;

    function reveal() {
      if (!revealed) {
        revealed = true;
        setVideoVisible(true);
      }
    }

    // Fade the video in only once a real frame is decoded — no black flash.
    if ("requestVideoFrameCallback" in video) {
      (
        video as HTMLVideoElement & {
          requestVideoFrameCallback: (cb: () => void) => void;
        }
      ).requestVideoFrameCallback(reveal);
    }
    const onPlaying = () => reveal();
    video.addEventListener("playing", onPlaying);

    function syncPlayback() {
      if (!video) return;
      if (!inView) {
        video.pause();
      } else {
        // play() rejects if the browser blocks autoplay — safe to ignore;
        // the poster simply stays up. (jsdom returns undefined, hence `?.`)
        const p = video.play() as Promise<void> | undefined;
        p?.catch(() => {});
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

    return () => {
      io.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.pause();
    };
  }, [orientation, still]);

  const asset = ASSETS[orientation];

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden bg-[#030712]"
      aria-hidden="true"
    >
      {/* Poster + video + scrim mirror together for RTL so the bright
          structure always sits opposite the text column. */}
      <div
        className="absolute inset-0"
        style={{ transform: isRTL ? "scaleX(-1)" : undefined }}
      >
        {/* Poster layer — always painted first; the video fades in above it. */}
        <picture>
          <source srcSet={asset.posterAvif} type="image/avif" />
          <img
            src={asset.posterJpg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="high"
          />
        </picture>

        {!still && (
          <video
            key={orientation}
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
            style={{ opacity: videoVisible ? 1 : 0 }}
            poster={asset.posterJpg}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={asset.webm} type="video/webm" />
            <source src={asset.mp4} type="video/mp4" />
          </video>
        )}

        {/* Scrim — per-composition; keeps copy readable without hiding the
            footage. Paired with the text-shadow on the hero copy (page.tsx). */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: SCRIM[orientation], zIndex: 1 }}
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
