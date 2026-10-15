"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Locale } from "@/i18n";
import "./project-motion.css";

import {
  projectArtworkRegistry as artworkRegistry,
  isProjectArtworkSlug,
  loadProjectArtwork as loadArtwork,
  type ProjectArtworkComponent as ArtworkComponent,
  type ProjectArtworkSlug as ArtworkSlug,
} from "./project-artwork";
import { useApplicationActive } from "./application-context";
import { useStageVisibility } from "./use-stage-visibility";

const motionCopy = {
  en: {
    identity: "Project Identity",
    pause: "Pause Animation",
    play: "Play Animation",
    reduced: "Still",
    failed: "Artwork could not load.",
    retry: "Try Again",
  },
  fa: {
    identity: "هویت بصری پروژه",
    pause: "توقف پویانمایی",
    play: "اجرای پویانمایی",
    reduced: "ثابت",
    failed: "تصویر پروژه بارگیری نشد.",
    retry: "تلاش دوباره",
  },
  ar: {
    identity: "الهوية البصرية للمشروع",
    pause: "إيقاف الحركة",
    play: "تشغيل الحركة",
    reduced: "ثابتة",
    failed: "تعذّر تحميل الصورة.",
    retry: "إعادة المحاولة",
  },
  zh: {
    identity: "项目视觉标识",
    pause: "暂停动画",
    play: "播放动画",
    reduced: "静态",
    failed: "无法加载图像。",
    retry: "重试",
  },
  es: {
    identity: "Identidad del proyecto",
    pause: "Pausar animación",
    play: "Reproducir animación",
    reduced: "Estática",
    failed: "No se pudo cargar la imagen.",
    retry: "Reintentar",
  },
} satisfies Record<Locale, Record<string, string>>;

function motionSnapshot() {
  const reduced = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  return `${document.hidden ? "hidden" : "visible"}:${reduced ? "reduced" : "full"}`;
}

function subscribeToMotion(callback: () => void) {
  const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  preference?.addEventListener("change", callback);
  document.addEventListener("visibilitychange", callback);
  return () => {
    preference?.removeEventListener("change", callback);
    document.removeEventListener("visibilitychange", callback);
  };
}

function ArtworkPanel({ slug, locale }: { slug: ArtworkSlug; locale: Locale }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const appActive = useApplicationActive();
  // Sticky: once requested, the selected project's artwork stays mounted.
  const { nearby, visible } = useStageVisibility(stageRef, { sticky: true });
  const [paused, setPaused] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [artwork, setArtwork] = useState<{
    component: ArtworkComponent | null;
    failed: boolean;
  }>({
    component: null,
    failed: false,
  });
  const motion = useSyncExternalStore(
    subscribeToMotion,
    motionSnapshot,
    () => "visible:reduced",
  );
  const reduced = motion.endsWith("reduced");
  const playing =
    appActive && visible && !paused && !reduced && motion.startsWith("visible");
  const copy = motionCopy[locale];
  const Artwork = artwork.component;

  useEffect(() => {
    if (!nearby) return;
    let cancelled = false;
    loadArtwork(slug)
      .then((component) => {
        if (!cancelled) setArtwork({ component, failed: false });
      })
      .catch(() => {
        if (!cancelled) setArtwork({ component: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [nearby, slug, attempt]);

  return (
    <figure
      className="os-project-motion"
      data-project={slug}
      data-playing={playing}
      data-reduced-motion={reduced}
    >
      <div
        ref={stageRef}
        className="os-motion-stage"
        style={{ background: artworkRegistry[slug].background }}
        aria-hidden={artwork.failed ? undefined : true}
      >
        {Artwork ? (
          <Artwork active={playing} />
        ) : artwork.failed ? (
          <div className="os-motion-error" role="status">
            <p>{copy.failed}</p>
            <button
              type="button"
              onClick={() => {
                setArtwork({ component: null, failed: false });
                setAttempt((previous) => previous + 1);
              }}
            >
              <RotateCcw size={14} aria-hidden="true" />
              {copy.retry}
            </button>
          </div>
        ) : (
          <svg
            className="os-motion-placeholder"
            viewBox="0 0 160 160"
            fill="none"
          >
            <circle cx="80" cy="80" r="42" />
            <circle cx="80" cy="80" r="57" strokeDasharray="1 9" />
            <path d="M80 45 110 98H50L80 45Z M80 65v26" />
          </svg>
        )}
      </div>
      <figcaption>
        <span>{copy.identity}</span>
        {reduced ? (
          <span className="os-motion-preference">{copy.reduced}</span>
        ) : (
          <button
            type="button"
            onClick={() => setPaused((previous) => !previous)}
            aria-label={paused ? copy.play : copy.pause}
            title={paused ? copy.play : copy.pause}
          >
            {paused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
            <span className="os-motion-button-label">
              {paused ? copy.play : copy.pause}
            </span>
          </button>
        )}
      </figcaption>
    </figure>
  );
}

export function ProjectMotion({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  if (!isProjectArtworkSlug(slug)) return null;
  // Route changes reset controls and observers; cached modules are reused.
  return <ArtworkPanel key={slug} slug={slug} locale={locale} />;
}
