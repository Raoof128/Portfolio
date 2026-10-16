"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n";
import { projects, type Project } from "@/lib/data";
import { getAtlasCopy } from "./atlas-copy";
import { getOSCopy } from "./os-copy";
import { OSIcon, type PortfolioApp } from "./OSIcon";
import { getWindowCopy } from "./window-copy";

const ProofAtlas = dynamic(
  () => import("./ProofAtlas").then((module) => module.ProofAtlas),
  { ssr: true },
);

const apps: PortfolioApp[] = [
  "projects",
  "research",
  "about",
  "resume",
  "contact",
];
const appPaths = {
  projects: "/projects",
  research: "/write-ups",
  about: "/about",
  resume: "/resume",
  contact: "/contact",
};

// Build-time stat callout for the Projects tile: the count per category.
const projectList = Object.values(projects);
const projectCounts = projectList.reduce<Record<Project["category"], number>>(
  (counts, project) => ({
    ...counts,
    [project.category]: counts[project.category] + 1,
  }),
  { OFFENSIVE: 0, DEFENSIVE: 0, ENGINEERING: 0 },
);

type WindowId = "intro" | "atlas";
type HiddenWindow = "minimized" | "closed";

/** The 7.css caption group, in Win7 order: Minimise, Maximise (or Restore), Close. */
function WindowCaption({
  expanded,
  labels,
  onMinimize,
  onToggleSize,
  onClose,
}: {
  expanded: boolean;
  labels: { minimize: string; fullSize: string; close: string };
  onMinimize: () => void;
  onToggleSize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="os-window-actions title-bar-controls">
      <button
        type="button"
        className="os-control is-minimize"
        onClick={onMinimize}
        aria-label={labels.minimize}
      />
      <button
        type="button"
        className={`os-control os-expand ${expanded ? "is-restore" : "is-maximize"}`}
        onClick={onToggleSize}
        // The name is constant; aria-pressed carries the expanded state.
        aria-label={labels.fullSize}
        aria-pressed={expanded}
      />
      <button
        type="button"
        className="os-control os-window-close is-close"
        onClick={onClose}
        aria-label={labels.close}
      />
    </div>
  );
}

export function Desktop({
  locale,
  role,
  interactive,
}: {
  locale: Locale;
  role: string;
  interactive?: boolean;
}) {
  const copy = getOSCopy(locale);
  const windowCopy = getWindowCopy(locale);
  const atlasCopy = getAtlasCopy(locale);
  const path = (value: string) =>
    locale === "en" ? value : `/${locale}${value}`;
  const hints = {
    projects: copy.appProjects,
    research: copy.appResearch,
    about: copy.appAbout,
    resume: copy.appResume,
    contact: copy.appContact,
  };
  const introTitle = copy.independentResearch;
  const atlasTitle = atlasCopy.eyebrow;
  const windowTitles: Record<WindowId, string> = {
    intro: introTitle,
    atlas: atlasTitle,
  };

  // The Getting Started and Proof Atlas windows are not in the window manager, so their
  // caption controls are local: minimise and close hide the window and leave a restore
  // button in the footer row; maximise widens the window across the desktop row.
  const [hidden, setHidden] = useState<Partial<Record<WindowId, HiddenWindow>>>(
    {},
  );
  const [expanded, setExpanded] = useState<Partial<Record<WindowId, boolean>>>(
    {},
  );
  const [selectedApp, setSelectedApp] = useState<PortfolioApp | null>(null);
  const appLinks = useRef<(HTMLAnchorElement | null)[]>([]);
  const identityRef = useRef<HTMLDivElement>(null);
  const restoreButtons = useRef<
    Partial<Record<WindowId, HTMLButtonElement | null>>
  >({});
  const pendingFocus = useRef<{ id: WindowId; restored: boolean } | null>(null);

  // Focus follows the control that replaces the one that just disappeared: the restore
  // button after a hide, and the window's own heading after a restore.
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;
    if (pending.restored) {
      identityRef.current
        ?.querySelector<HTMLElement>(
          pending.id === "intro" ? ".os-intro h1" : ".proof-atlas-heading h2",
        )
        ?.focus();
    } else {
      restoreButtons.current[pending.id]?.focus();
    }
  }, [hidden]);

  function hideWindow(id: WindowId, state: HiddenWindow) {
    pendingFocus.current = { id, restored: false };
    setHidden((current) => ({ ...current, [id]: state }));
  }

  function restoreWindow(id: WindowId) {
    pendingFocus.current = { id, restored: true };
    setHidden((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function toggleExpanded(id: WindowId) {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  }

  const captionLabels = {
    minimize: windowCopy.minimize,
    fullSize: windowCopy.fullSize,
    close: copy.close,
  };
  const hiddenIds = (Object.keys(hidden) as WindowId[]).filter(
    (id) => hidden[id] !== undefined,
  );

  // Arrow keys move to the nearest icon in the pressed direction, measured on screen, so
  // they follow the column flow from 1024px and the row flow on phones alike. Left and
  // right follow the screen, so they mirror on their own in RTL. Home and End go to the
  // first and last icon. Focus and selection move together.
  function moveAppFocus(event: KeyboardEvent<HTMLDivElement>) {
    const index = appLinks.current.indexOf(event.target as HTMLAnchorElement);
    if (index < 0) return;
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = apps.length - 1;
    else next = nearestAppIndex(index, event.key);
    if (next < 0) return;
    event.preventDefault();
    appLinks.current[next]?.focus();
    setSelectedApp(apps[next]);
  }

  // The icon nearest to `from` in the arrow's direction, or -1 when none lies that way.
  // Icons off the same line count less than icons on it, so a column walks straight down.
  function nearestAppIndex(from: number, key: string): number {
    const origin = appLinks.current[from]?.getBoundingClientRect();
    if (!origin) return -1;
    const originX = origin.left + origin.width / 2;
    const originY = origin.top + origin.height / 2;
    let best = -1;
    let bestScore = Infinity;
    appLinks.current.forEach((node, index) => {
      if (!node || index === from) return;
      const rect = node.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - originX;
      const dy = rect.top + rect.height / 2 - originY;
      let along: number;
      let across: number;
      switch (key) {
        case "ArrowDown":
          along = dy;
          across = dx;
          break;
        case "ArrowUp":
          along = -dy;
          across = dx;
          break;
        case "ArrowRight":
          along = dx;
          across = dy;
          break;
        case "ArrowLeft":
          along = -dx;
          across = dy;
          break;
        default:
          return;
      }
      if (along <= 1) return;
      const score = along + Math.abs(across) * 2;
      if (score < bestScore) {
        bestScore = score;
        best = index;
      }
    });
    return best;
  }

  return (
    <div
      className="os-desktop"
      data-spotlight-field=""
      onClick={(event) => {
        // A click on the bare wallpaper clears the icon selection.
        if (event.target === event.currentTarget) setSelectedApp(null);
      }}
    >
      <div
        ref={identityRef}
        className="os-desktop-identity os-desktop-identity--atlas"
      >
        {/* Getting Started window: the eyebrow is the title bar, the rest is the body. */}
        <section
          className={`os-intro window glass active${expanded.intro ? " is-expanded" : ""}`}
          hidden={hidden.intro !== undefined}
        >
          <div className="title-bar">
            <p className="os-eyebrow title-bar-text">{introTitle}</p>
            <WindowCaption
              expanded={Boolean(expanded.intro)}
              labels={captionLabels}
              onMinimize={() => hideWindow("intro", "minimized")}
              onToggleSize={() => toggleExpanded("intro")}
              onClose={() => hideWindow("intro", "closed")}
            />
          </div>
          <div className="window-body has-space">
            <h1
              tabIndex={-1}
              lang={copy.nameLocale}
              dir={copy.nameLocale === "en" ? "ltr" : "rtl"}
            >
              {copy.givenName} <span>{copy.familyName}.</span>
            </h1>
            <p className="os-role">{role}</p>
            <p className="os-desktop-summary">{copy.summary}</p>
            <div className="os-direct-links">
              <Link className="os-button" href={path("/projects")}>
                {copy.explore}
                <ArrowRight aria-hidden="true" />
              </Link>
              <a
                className="os-button os-button--secondary"
                href="/Mohammad_Raouf_Abedini_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.viewResume}
                <ExternalLink className="os-external-icon" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <ProofAtlas
          locale={locale}
          interactive={interactive}
          hidden={hidden.atlas !== undefined}
          className={`proof-atlas--desktop window glass active${expanded.atlas ? " is-expanded" : ""}`}
          controls={
            <WindowCaption
              expanded={Boolean(expanded.atlas)}
              labels={captionLabels}
              onMinimize={() => hideWindow("atlas", "minimized")}
              onToggleSize={() => toggleExpanded("atlas")}
              onClose={() => hideWindow("atlas", "closed")}
            />
          }
        />
      </div>
      <section className="os-apps" aria-label={copy.appNavigation}>
        <p className="os-section-label">
          {copy.workspaceHint}
          {/* One caption line with the count per category, after the hint. */}
          <span className="os-app-stat">
            {`${copy.categoryOffensive} ${projectCounts.OFFENSIVE} · ${copy.categoryDefensive} ${projectCounts.DEFENSIVE} · ${copy.categoryEngineering} ${projectCounts.ENGINEERING}`}
          </span>
        </p>
        <div className="os-app-grid" onKeyDown={moveAppFocus}>
          {apps.map((app, index) => (
            <Link
              ref={(node) => {
                appLinks.current[index] = node;
              }}
              className="os-app os-rim"
              key={app}
              data-app={app}
              data-selected={selectedApp === app ? "true" : undefined}
              data-spotlight=""
              href={path(appPaths[app])}
              onFocus={() => setSelectedApp(app)}
            >
              <OSIcon app={app} tile />
              <strong>{copy[app]}</strong>
              <small>{hints[app]}</small>
            </Link>
          ))}
        </div>
      </section>
      <nav className="os-desktop-footer" aria-label={copy.navigation}>
        <Link href={path("/lab")}>
          {copy.experiments}
          <ArrowRight aria-hidden="true" />
        </Link>
        {hiddenIds.length > 0 && (
          <div
            className="os-desktop-restore"
            role="group"
            aria-label={windowCopy.restoreWindow}
          >
            {hiddenIds.map((id) => (
              <button
                key={id}
                type="button"
                ref={(node) => {
                  restoreButtons.current[id] = node;
                }}
                className="os-desktop-restore-button"
                aria-label={`${windowCopy.restoreWindow}: ${windowTitles[id]}`}
                onClick={() => restoreWindow(id)}
              >
                {windowTitles[id]}
              </button>
            ))}
          </div>
        )}
        <div>
          <Link href={path("/security-policy")}>{copy.securityPolicy}</Link>
          <Link href={path("/hall-of-fame")}>{copy.hallOfFame}</Link>
        </div>
      </nav>
    </div>
  );
}
