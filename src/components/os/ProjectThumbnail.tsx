"use client";

import { useEffect, useRef, useState } from "react";
import {
  isProjectArtworkSlug,
  loadProjectArtwork,
  projectArtworkRegistry,
  type ProjectArtworkComponent,
  type ProjectArtworkSlug,
} from "./project-artwork";
import { useStageVisibility } from "./use-stage-visibility";
import "./project-thumbnails.css";

function ArtworkThumbnail({ slug }: { slug: ProjectArtworkSlug }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { nearby, visible } = useStageVisibility(stageRef);
  const [artwork, setArtwork] = useState<{
    component: ProjectArtworkComponent | null;
    failed: boolean;
  }>({ component: null, failed: false });
  const Artwork = artwork.component;

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

  // The artwork's own background paints only once the artwork has loaded. Before that
  // the frame is a neutral light surface, so the list does not open on black boxes.
  const artworkLoaded = Artwork !== null;

  return (
    <div
      ref={stageRef}
      className={`os-project-thumbnail${artworkLoaded ? "" : " os-project-thumbnail-pending"}`}
      data-project-art={slug}
      data-preview-state={
        artwork.failed ? "failed" : Artwork && visible ? "still" : "pending"
      }
      aria-hidden="true"
      style={
        artworkLoaded
          ? { background: projectArtworkRegistry[slug].background }
          : undefined
      }
    >
      {/* Until the artwork is ready the frame is the neutral surface alone: no folder glyph
          flashes in and out. The artwork fades in on mount (see project-thumbnails.css). */}
      {Artwork && visible ? (
        // Both CSS and canvas renderers retain a complete original still pose.
        // Offscreen unmounting also releases their resize/visibility observers.
        <Artwork active={false} preview />
      ) : null}
    </div>
  );
}

/** Decorative beside the real project heading; unknown slugs load no module. */
export function ProjectThumbnail({ slug }: { slug: string }) {
  if (!isProjectArtworkSlug(slug)) return null;
  return <ArtworkThumbnail key={slug} slug={slug} />;
}
