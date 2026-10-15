"use client";

import { useEffect, useState, type RefObject } from "react";

export type StageVisibility = {
  /** Within the load window (160px ahead of the stage), so artwork may load. */
  nearby: boolean;
  /** On screen inside the scrolling reading pane, so artwork may animate. */
  visible: boolean;
};

/**
 * One visibility source for decorative artwork stages (index thumbnails and the
 * dossier motion panel). With `sticky`, `nearby` latches true once reached, so a
 * stage that has loaded its artwork keeps it while the user scrolls away.
 *
 * Browsers without IntersectionObserver fall back to measuring the stage against
 * the reading pane's clip on scroll, resize and layout changes. Observers are
 * created in a fixed order (load first, then visibility) because tests and
 * callers depend on it.
 */
export function useStageVisibility(
  stageRef: RefObject<HTMLElement | null>,
  { sticky = false }: { sticky?: boolean } = {},
): StageVisibility {
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const rememberNearby = (value: boolean) =>
      setNearby((previous) => (sticky ? previous || value : value));

    if (typeof IntersectionObserver === "undefined") {
      // Older browsers still respect the reading pane's clip when loading art.
      // Scroll events from retained reading panes also reach this capture listener.
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
        rememberNearby(
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
      ([entry]) => {
        const inside = Boolean(entry?.isIntersecting);
        if (!sticky) {
          setNearby(inside);
        } else if (inside) {
          // Once requested, the artwork stays loaded; stop watching for loads.
          setNearby(true);
          loadObserver.disconnect();
        }
      },
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
  }, [stageRef, sticky]);

  return { nearby, visible };
}
