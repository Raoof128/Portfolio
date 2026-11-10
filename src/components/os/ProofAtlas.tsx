"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n";
import { getAtlasCopy, type AtlasProject } from "./atlas-copy";
import { ProofAtlasVisibilityContext } from "./proof-atlas-context";
import "./proof-atlas.css";

function supportsAtlasMotion() {
  if (typeof window.matchMedia !== "function") return false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia(
    "(any-hover: hover) and (any-pointer: fine)",
  );
  const device = navigator as Navigator & { deviceMemory?: number };
  const lowPower =
    (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) ||
    (device.deviceMemory !== undefined && device.deviceMemory <= 4);
  return !reducedMotion.matches && finePointer.matches && !lowPower;
}

function subscribeAtlasMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia(
    "(any-hover: hover) and (any-pointer: fine)",
  );
  reducedMotion.addEventListener("change", onChange);
  finePointer.addEventListener("change", onChange);
  return () => {
    reducedMotion.removeEventListener("change", onChange);
    finePointer.removeEventListener("change", onChange);
  };
}

type Point = { x: number; y: number };
type AtlasNode = Point & {
  id: string;
  label: string;
  /**
   * boundary: a plate with a glyph. evidence: a signed record. stop: a refused action.
   * window: the flagged window. archive: the replayable pack. note: a label on its own.
   * plane: an output surface drawn by the project's own group; the node anchors its edge.
   */
  kind?:
    "boundary" | "evidence" | "stop" | "window" | "archive" | "note" | "plane";
  /** Baseline of the label relative to the node. Defaults to below the node. */
  labelY?: number;
};
type AtlasEdge = {
  id: string;
  from: string;
  to: string;
  kind?: "evidence" | "blocked";
};
type AtlasMap = { nodes: AtlasNode[]; edges: AtlasEdge[] };

const maps: Record<AtlasProject, AtlasMap> = {
  // The control boundary the repository documents today: a proposal and host-held state
  // meet at the composed gate; decisions and receiver snapshots feed the offline replay.
  "project-simurgh": {
    nodes: [
      { id: "proposal", label: "Proposal", x: 60, y: 190 },
      { id: "host", label: "Host state", x: 60, y: 70, kind: "boundary" },
      {
        id: "gate",
        label: "Composed gate",
        x: 220,
        y: 128,
        kind: "boundary",
        // Above the plate: the decision record drops from the gate's lower edge.
        labelY: -36,
      },
      {
        id: "receiver",
        label: "Receiver",
        x: 400,
        y: 128,
        kind: "boundary",
        labelY: -36,
      },
      { id: "blocked", label: "Blocked", x: 310, y: 206, kind: "stop" },
      { id: "decision", label: "Decision", x: 220, y: 206, kind: "evidence" },
      { id: "snapshot", label: "Snapshot", x: 400, y: 206, kind: "evidence" },
      {
        id: "replay",
        label: "Offline replay",
        x: 310,
        y: 290,
        kind: "archive",
      },
    ],
    edges: [
      { id: "proposal-gate", from: "proposal", to: "gate" },
      { id: "host-gate", from: "host", to: "gate" },
      { id: "gate-receiver", from: "gate", to: "receiver" },
      { id: "gate-blocked", from: "gate", to: "blocked", kind: "blocked" },
      { id: "gate-decision", from: "gate", to: "decision", kind: "evidence" },
      {
        id: "receiver-snapshot",
        from: "receiver",
        to: "snapshot",
        kind: "evidence",
      },
    ],
  },
  // One flagged window, one compositor, two outputs that disagree.
  "invisible-window-research": {
    nodes: [
      { id: "window", label: "Flagged window", x: 64, y: 150, kind: "window" },
      {
        id: "compositor",
        label: "Compositor",
        x: 176,
        y: 150,
        kind: "boundary",
        // Above the plate, clear of the flagged window's name beside it.
        labelY: -36,
      },
      { id: "screen", label: "Physical display", x: 280, y: 82, kind: "plane" },
      { id: "capture", label: "Capture path", x: 280, y: 232, kind: "plane" },
    ],
    edges: [
      { id: "window-compositor", from: "window", to: "compositor" },
      { id: "compositor-screen", from: "compositor", to: "screen" },
      {
        id: "compositor-capture",
        from: "compositor",
        to: "capture",
        kind: "evidence",
      },
    ],
  },
  "project-zurvan": {
    nodes: [
      { id: "documents", label: "Documents", x: 37, y: 125 },
      { id: "claim", label: "Claim", x: 154, y: 48 },
      { id: "concept", label: "Concept", x: 154, y: 98 },
      { id: "entity", label: "Entity", x: 154, y: 148 },
      { id: "decision", label: "Decision", x: 154, y: 198 },
      { id: "vault", label: "Local vault", x: 288, y: 125 },
      { id: "search", label: "Hybrid search", x: 407, y: 82 },
      { id: "neighbors", label: "Graph neighbours", x: 407, y: 168 },
      { id: "mcp", label: "MCP tools", x: 516, y: 125, kind: "evidence" },
      // The dashed return path from MCP tools to the store carries this name.
      { id: "write", label: "Opt-in write", x: 402, y: 24, kind: "note" },
      { id: "trace", label: "Audit trace", x: 407, y: 250, kind: "evidence" },
    ],
    edges: [
      { id: "documents-claim", from: "documents", to: "claim" },
      { id: "documents-concept", from: "documents", to: "concept" },
      { id: "documents-entity", from: "documents", to: "entity" },
      { id: "documents-decision", from: "documents", to: "decision" },
      { id: "claim-vault", from: "claim", to: "vault" },
      { id: "concept-vault", from: "concept", to: "vault" },
      { id: "entity-vault", from: "entity", to: "vault" },
      { id: "decision-vault", from: "decision", to: "vault" },
      { id: "vault-search", from: "vault", to: "search" },
      { id: "vault-neighbors", from: "vault", to: "neighbors" },
      { id: "search-mcp", from: "search", to: "mcp", kind: "evidence" },
      { id: "neighbors-mcp", from: "neighbors", to: "mcp", kind: "evidence" },
      {
        id: "neighbors-trace",
        from: "neighbors",
        to: "trace",
        kind: "evidence",
      },
    ],
  },
};

const projectOrder: AtlasProject[] = [
  "project-simurgh",
  "invisible-window-research",
  "project-zurvan",
];

const boundaryGlyphs: Record<string, string> = {
  // Host state: three checked lifecycle rows (delegation, stop, lease).
  host: "M -14 -9 L -11 -6 L -6 -12 M -1 -9 H 14 M -14 1 L -11 4 L -6 -2 M -1 1 H 14 M -14 11 L -11 14 L -6 8 M -1 11 H 14",
  gate: "M -13 14 V -5 A 13 13 0 0 1 13 -5 V 14 M -6 14 V 1 H 6 V 14 M 0 -2 V 1",
  // Receiver: an action arriving in an owned tray.
  receiver:
    "M -14 3 V 13 H 14 V 3 M -14 3 H -6 L -3 7 H 3 L 6 3 H 14 M 0 -15 V -3 M -5 -8 L 0 -3 L 5 -8",
  // Compositor: stacked layers.
  compositor:
    "M 0 -14 L 15 -6 L 0 2 L -15 -6 Z M -15 1 L 0 9 L 15 1 M -15 8 L 0 16 L 15 8",
};

export function ProofAtlas({
  locale,
  interactive,
  decorative = false,
  className = "",
  controls,
  hidden = false,
}: {
  locale: Locale;
  /** False for desktops rendered behind the welcome screen or a reading window. */
  interactive?: boolean;
  /** Use a silent static drawing when the nearby HTML already supplies its meaning. */
  decorative?: boolean;
  className?: string;
  /** Caption buttons for the desktop window, placed at the end of its title bar. */
  controls?: ReactNode;
  /** The desktop window is minimised or closed. The atlas stays mounted. */
  hidden?: boolean;
}) {
  const copy = getAtlasCopy(locale);
  const inheritedInteractive = useContext(ProofAtlasVisibilityContext);
  const isInteractive = !decorative && (interactive ?? inheritedInteractive);
  const [selected, setSelected] = useState<AtlasProject>("project-simurgh");
  const subscribeMotion = useCallback(
    (onChange: () => void) =>
      isInteractive ? subscribeAtlasMotion(onChange) : () => {},
    [isInteractive],
  );
  const readMotion = useCallback(
    () => isInteractive && supportsAtlasMotion(),
    [isInteractive],
  );
  const motionEnabled = useSyncExternalStore(
    subscribeMotion,
    readMotion,
    () => false,
  );
  const titleId = useId();
  const svgTitleId = useId();
  const descriptionId = useId();
  const frameRef = useRef<SVGSVGElement>(null);
  const frameRequest = useRef<number | null>(null);
  const atlas = maps[selected];
  const positions = new Map(atlas.nodes.map((node) => [node.id, node]));
  const selectedCopy = copy.projects[selected];
  const href = `${locale === "en" ? "" : `/${locale}`}/projects/${selected}`;
  const rtl = locale === "fa" || locale === "ar";
  // The names the figure draws, in order. Phones hide the figure's text and list these
  // beneath it.
  const figureLabels = atlas.nodes.map(
    (node) => copy.nodeLabels[node.id] ?? node.label,
  );

  function moveWithPointer(event: PointerEvent<SVGSVGElement>) {
    // motionEnabled already reflects reduced motion and pointer capability.
    if (
      !isInteractive ||
      !motionEnabled ||
      event.pointerType !== "mouse" ||
      frameRequest.current !== null
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const clientX = event.clientX;
    const clientY = event.clientY;
    frameRequest.current = window.requestAnimationFrame(() => {
      frameRequest.current = null;
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(
        -1,
        Math.min(1, ((clientX - bounds.left) / bounds.width - 0.5) * 2),
      );
      const y = Math.max(
        -1,
        Math.min(1, ((clientY - bounds.top) / bounds.height - 0.5) * 2),
      );
      frameRef.current?.style.setProperty("--atlas-pointer-x", `${x * 3}px`);
      frameRef.current?.style.setProperty("--atlas-pointer-y", `${y * 3}px`);
    });
  }

  const resetPointer = useCallback(() => {
    if (frameRequest.current !== null) {
      window.cancelAnimationFrame(frameRequest.current);
      frameRequest.current = null;
    }
    frameRef.current?.style.setProperty("--atlas-pointer-x", "0px");
    frameRef.current?.style.setProperty("--atlas-pointer-y", "0px");
  }, []);

  useEffect(() => {
    if (!isInteractive || !motionEnabled) resetPointer();
    return resetPointer;
  }, [isInteractive, motionEnabled, resetPointer]);

  const isDecorative = decorative || !isInteractive;
  // A desktop window carries the `window` class; its heading becomes the 7.css title bar.
  const isWindow = className.split(/\s+/).includes("window");

  return (
    <section
      className={`proof-atlas ${className}`.trim()}
      lang={locale}
      dir={locale === "fa" || locale === "ar" ? "rtl" : "ltr"}
      data-project={selected}
      data-interactive={isInteractive ? "true" : "false"}
      data-motion-enabled={motionEnabled ? "true" : "false"}
      aria-labelledby={isDecorative ? undefined : titleId}
      aria-hidden={decorative || undefined}
      hidden={hidden || undefined}
    >
      <div className={`proof-atlas-heading${isWindow ? " title-bar" : ""}`}>
        {/* Outside the window the eyebrow and the heading are two spans, split by a 1px
            divider. On the desktop window the title bar carries the heading alone, and the
            eyebrow moves into the body as a kicker, so the title never truncates. */}
        {!isWindow && (
          <>
            <span className="proof-atlas-eyebrow title-bar-text">
              {copy.eyebrow}
            </span>
            <span className="proof-atlas-divider" aria-hidden="true" />
          </>
        )}
        <h2
          id={titleId}
          className={isWindow ? "title-bar-text" : undefined}
          tabIndex={isWindow ? -1 : undefined}
        >
          {copy.heading}
        </h2>
        {controls}
      </div>
      {/* White window body. The figure and its controls share one surface. */}
      <div className={`proof-atlas-body${isWindow ? " window-body" : ""}`}>
        {isWindow && (
          <p className="proof-atlas-eyebrow proof-atlas-kicker">
            {copy.eyebrow}
          </p>
        )}
        <svg
          ref={frameRef}
          className="proof-atlas-figure"
          viewBox="0 0 552 320"
          direction="ltr"
          role={isDecorative ? undefined : "img"}
          aria-labelledby={isDecorative ? undefined : svgTitleId}
          aria-describedby={isDecorative ? undefined : descriptionId}
          aria-hidden={isDecorative || undefined}
          onPointerMove={isInteractive ? moveWithPointer : undefined}
          onPointerLeave={isInteractive ? resetPointer : undefined}
        >
          {!isDecorative && (
            <>
              <title id={svgTitleId}>{copy.heading}</title>
              <desc id={descriptionId}>
                {copy.diagramDescription[selected]}
              </desc>
            </>
          )}
          <g className="proof-atlas-lines" aria-hidden="true">
            {atlas.edges.map((edge) => {
              const from = positions.get(edge.from)!;
              const to = positions.get(edge.to)!;
              const midpoint = (from.x + to.x) / 2;
              return (
                <path
                  key={`${selected}-${edge.id}`}
                  className={`proof-atlas-edge${edge.kind ? ` proof-atlas-edge--${edge.kind}` : ""}`}
                  d={`M ${from.x} ${from.y} C ${midpoint} ${from.y - 18}, ${midpoint} ${to.y - 18}, ${to.x} ${to.y}`}
                  pathLength="1"
                />
              );
            })}
          </g>
          {selected === "project-simurgh" && (
            // Both records drop to one bus that feeds the replayable archive.
            <g className="proof-atlas-evidence-collection" aria-hidden="true">
              <path d="M 220 221 V 262 M 400 221 V 262 M 220 262 H 400 M 310 262 V 274" />
            </g>
          )}
          {selected === "project-zurvan" && (
            // Opt-in write mode: MCP tools back to the local store.
            <g className="proof-atlas-return" aria-hidden="true">
              <path d="M 516 108 C 516 12, 288 12, 288 106" />
              <path d="M 282 98 L 288 106 L 294 98" />
            </g>
          )}
          {selected === "invisible-window-research" && (
            <g className="proof-atlas-capture" aria-hidden="true">
              <rect
                className="proof-atlas-plane"
                x="280"
                y="22"
                width="240"
                height="120"
                rx="5"
              />
              <rect
                className="proof-atlas-plane"
                x="280"
                y="172"
                width="240"
                height="120"
                rx="5"
              />
              <path
                className="proof-atlas-plane-grid"
                d="M 294 40 H 506 M 294 128 H 506 M 294 190 H 506 M 294 278 H 506"
              />
              <rect
                className="proof-atlas-visible-window"
                x="340"
                y="51"
                width="120"
                height="66"
                rx="3"
              />
              <path
                className="proof-atlas-window-light"
                d="M 353 65 H 447 M 353 103 H 447"
              />
              <rect
                className="proof-atlas-excluded-window"
                x="340"
                y="201"
                width="120"
                height="66"
                rx="3"
              />
              <path className="proof-atlas-absence" d="M 370 234 H 430" />
              <text
                className="proof-atlas-plane-label"
                x="400"
                y="161"
                textAnchor="middle"
              >
                {copy.nodeLabels.screen}
              </text>
              <text
                className="proof-atlas-plane-label"
                x="400"
                y="311"
                textAnchor="middle"
              >
                {copy.nodeLabels.capture}
              </text>
            </g>
          )}
          {atlas.nodes.map((node, index) => {
            if (node.kind === "plane") return null;
            const name = copy.nodeLabels[node.id] ?? node.label;
            const label = (y: number) => (
              <text
                x="0"
                y={y}
                textAnchor="middle"
                direction={rtl ? "rtl" : "ltr"}
                unicodeBidi="plaintext"
              >
                {name}
              </text>
            );
            return (
              <g
                key={index}
                className={`proof-atlas-node${node.kind ? ` proof-atlas-node--${node.kind}` : ""}`}
                transform={`translate(${node.x} ${node.y})`}
              >
                {node.kind === "boundary" ? (
                  <>
                    <rect
                      className="proof-atlas-boundary-plate"
                      x="-31"
                      y="-27"
                      width="62"
                      height="54"
                      rx="8"
                    />
                    <path
                      className="proof-atlas-boundary-glyph"
                      d={boundaryGlyphs[node.id]}
                    />
                    {label(node.labelY ?? 43)}
                  </>
                ) : node.kind === "evidence" ? (
                  <>
                    <path
                      className="proof-atlas-receipt"
                      d="M -14 -15 H 8 L 15 -8 V 15 H -14 Z M 8 -15 V -8 H 15 M -7 -3 H 7 M -7 2 H 7 M -7 7 H 3"
                    />
                    <circle
                      className="proof-atlas-receipt-seal"
                      cx="10"
                      cy="10"
                      r="2.3"
                    />
                    {label(32)}
                  </>
                ) : node.kind === "stop" ? (
                  <>
                    <circle className="proof-atlas-stop" r="11" />
                    <path className="proof-atlas-stop-bar" d="M -7 7 L 7 -7" />
                    {label(32)}
                  </>
                ) : node.kind === "window" ? (
                  <>
                    <rect
                      className="proof-atlas-flagged-window"
                      x="-20"
                      y="-15"
                      width="40"
                      height="30"
                      rx="3"
                    />
                    <path
                      className="proof-atlas-flagged-window-bar"
                      d="M -20 -7 H 20"
                    />
                    <circle
                      className="proof-atlas-flag"
                      cx="20"
                      cy="-15"
                      r="4.5"
                    />
                    {label(42)}
                  </>
                ) : node.kind === "archive" ? (
                  <>
                    <rect
                      className="proof-atlas-archive"
                      x="-31"
                      y="-16"
                      width="62"
                      height="32"
                      rx="4"
                    />
                    <path
                      className="proof-atlas-archive-lines"
                      d="M -21 -6 H 11 M -21 0 H 11 M -21 6 H 3"
                    />
                    {/* Beside the pack, where the figure has room. In a right-to-left
                        run `end` is the left edge, so the name still starts at x 40. */}
                    <text
                      x="40"
                      y="5"
                      textAnchor={rtl ? "end" : "start"}
                      direction={rtl ? "rtl" : "ltr"}
                      unicodeBidi="plaintext"
                    >
                      {name}
                    </text>
                  </>
                ) : node.kind === "note" ? (
                  label(0)
                ) : (
                  <>
                    <circle className="proof-atlas-node-halo" r="16" />
                    <circle className="proof-atlas-node-core" r="3.5" />
                    {label(32)}
                  </>
                )}
                {index === 0 && (
                  <circle className="proof-atlas-node-ring" r="27" />
                )}
              </g>
            );
          })}
          <path className="proof-atlas-axis" d="M 28 311 H 524" />
        </svg>
        {isInteractive && (
          <ul className="proof-atlas-node-labels">
            {figureLabels.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </ul>
        )}
        {isInteractive ? (
          <div className="proof-atlas-controls">
            <div
              className="proof-atlas-options"
              role="group"
              aria-label={copy.selectProject}
            >
              {projectOrder.map((project) => (
                <button
                  key={project}
                  type="button"
                  className={
                    selected === project
                      ? "proof-atlas-option active"
                      : "proof-atlas-option"
                  }
                  aria-pressed={selected === project}
                  onClick={() => setSelected(project)}
                >
                  {copy.projects[project].title}
                </button>
              ))}
            </div>
            <div className="proof-atlas-copy" aria-live="polite">
              <p className="proof-atlas-summary">{selectedCopy.summary}</p>
              {copy.qualifier[selected] && (
                <p className="proof-atlas-qualifier">
                  {copy.qualifier[selected]}
                </p>
              )}
            </div>
            <Link className="proof-atlas-link" href={href}>
              {copy.openEvidence}
              <ArrowUpRight
                className="proof-atlas-link-arrow"
                size={16}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : (
          <p className="proof-atlas-caption">
            {copy.qualifier[selected] ?? copy.welcomeCaption}
          </p>
        )}
      </div>
    </section>
  );
}
