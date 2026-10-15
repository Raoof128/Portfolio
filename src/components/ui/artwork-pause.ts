import { useEffect, type RefObject } from "react";
import "./ui-surfaces.css";

/** Props every project artwork accepts. `preview` marks a thumbnail render. */
export interface ArtworkProps {
  active?: boolean;
  preview?: boolean;
}

/**
 * One shared visibility hook for CSS and SVG artwork. Artwork pauses its
 * animations while it is inactive or scrolled out of view, using the
 * `data-art-paused` attribute that ui-surfaces.css reads. Reduced motion is
 * handled by each artwork, which then renders its still frame.
 */
export function useArtworkPause(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = true;
    const sync = () => {
      if (active && visible) element.removeAttribute("data-art-paused");
      else element.setAttribute("data-art-paused", "true");
    };
    sync();
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, active]);
}
