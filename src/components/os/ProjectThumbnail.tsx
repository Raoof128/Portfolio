"use client";

import { useEffect, useRef, useState } from "react";
import { Folder } from "lucide-react";
import {
  isProjectArtworkSlug,
  loadProjectArtwork,
  projectArtworkRegistry,
  type ProjectArtworkComponent,
  type ProjectArtworkSlug,
} from "./project-artwork";
import "./project-thumbnails.css";

function ArtworkThumbnail({ slug }: { slug: ProjectArtworkSlug }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);
  const [artwork, setArtwork] = useState<{
    component: ProjectArtworkComponent | null;
    failed: boolean;
  }>({ component: null, failed: false });
  const Artwork = artwork.component;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (typeof IntersectionObserver === "undefined") {
      // Older browsers still respect the reading pane's clip when loading art.
      const reading = stage.closest<HTMLElement>(".os-page-content");
      let frame: number | null = null;
      const check = () => {
        frame = null;
        const bounds = stage.getBoundingClientRect();
        const clip = reading?.getBoundingClientRect();
        const top = Math.max(0, clip?.top ?? 0);
        const bottom = Math.min(
          window.innerHeight,
          clip?.bottom ?? window.innerHeight,
        );
        const left = Math.max(0, clip?.left ?? 0);
        const right = Math.min(
          window.innerWidth,
          clip?.right ?? window.innerWidth,
        );
        const hasArea =
          bounds.width > 0 && bounds.height > 0 && bottom > top && right > left;
        const horizontal = bounds.right > left && bounds.left < right;
        const intersectsClip = hasArea && horizontal;
        setNearby(
          intersectsClip &&
            bounds.bottom > top - 160 &&
            bounds.top < bottom + 160,
        );
        setVisible(
          intersectsClip && bounds.bottom > top && bounds.top < bottom,
        );
      };
      const schedule = () => {
        if (frame === null) frame = requestAnimationFrame(check);
      };
      const resize =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(schedule);
      resize?.observe(stage);
      if (reading) resize?.observe(reading);
      schedule();
      window.addEventListener("scroll", schedule, {
        passive: true,
        capture: true,
      });
      window.addEventListener("resize", schedule, { passive: true });
      return () => {
        if (frame !== null) cancelAnimationFrame(frame);
        resize?.disconnect();
        window.removeEventListener("scroll", schedule, true);
        window.removeEventListener("resize", schedule);
      };
    }
    const loadObserver = new IntersectionObserver(
      ([entry]) => setNearby(Boolean(entry?.isIntersecting)),
      { rootMargin: "160px 0px", threshold: 0 },
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0 },
    );
    loadObserver.observe(stage);
    visibilityObserver.observe(stage);
    return () => {
      loadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!nearby || Artwork) return;
    let cancelled = false;
    loadProjectArtwork(slug)
      .then((component) => {
        if (!cancelled) setArtwork({ component, failed: false });
      })
      .catch(() => {
        // Decoration failing never removes the real project text or links.
        if (!cancelled) setArtwork({ component: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [nearby, slug, Artwork]);

  return (
    <div
      ref={stageRef}
      className="os-project-thumbnail"
      data-project-art={slug}
      data-preview-state={
        artwork.failed ? "failed" : Artwork && visible ? "still" : "pending"
      }
      aria-hidden="true"
      style={{ background: projectArtworkRegistry[slug].background }}
    >
      {Artwork && visible ? (
        // Both CSS and canvas renderers retain a complete original still pose.
        // Offscreen unmounting also releases their resize/visibility observers.
        <Artwork active={false} preview />
      ) : (
        <Folder
          className="os-project-thumbnail-placeholder"
          size={30}
          strokeWidth={1}
        />
      )}
    </div>
  );
}

/** Decorative beside the real project heading; unknown slugs load no module. */
export function ProjectThumbnail({ slug }: { slug: string }) {
  if (!isProjectArtworkSlug(slug)) return null;
  return <ArtworkThumbnail key={slug} slug={slug} />;
}
