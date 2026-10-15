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
