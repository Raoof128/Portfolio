"use client";

import Link from "next/link";
import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
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
  kind?: "boundary" | "evidence";
  /** Baseline of the label relative to the node. Defaults to below the node. */
  labelY?: number;
};
type AtlasEdge = { id: string; from: string; to: string; kind?: "evidence" };
type AtlasMap = { nodes: AtlasNode[]; edges: AtlasEdge[] };

const maps: Record<AtlasProject, AtlasMap> = {
  "project-simurgh": {
    nodes: [
      { id: "agent", label: "Agent", x: 38, y: 123 },
      { id: "input", label: "Input firewall", x: 145, y: 75, kind: "boundary" },
      {
        id: "context",
        label: "Context guard",
        x: 276,
        y: 54,
        kind: "boundary",
      },
      {
        id: "tool",
        label: "Tool gate",
        x: 407,
        y: 75,
        kind: "boundary",
        // Above the plate: below it, the longer Spanish label runs under the Output plate at x 500.
        labelY: -36,
      },
      {
        id: "output",
        label: "Output firewall",
        x: 500,
        y: 123,
        kind: "boundary",
      },
      {
        id: "input-proof",
        label: "Signed receipt",
        x: 145,
        y: 194,
        kind: "evidence",
      },
      {
        id: "context-proof",
        label: "Signed receipt",
        x: 276,
        y: 194,
        kind: "evidence",
      },
      {
        id: "tool-proof",
        label: "Signed receipt",
        x: 407,
        y: 194,
        kind: "evidence",
      },
      {
        id: "output-proof",
        label: "Signed receipt",
        x: 500,
        y: 194,
        kind: "evidence",
      },
    ],
    edges: [
      { id: "agent-input", from: "agent", to: "input" },
      { id: "input-context", from: "input", to: "context" },
      { id: "context-tool", from: "context", to: "tool" },
      { id: "tool-output", from: "tool", to: "output" },
      { id: "input-proof", from: "input", to: "input-proof", kind: "evidence" },
      {
        id: "context-proof",
        from: "context",
        to: "context-proof",
        kind: "evidence",
      },
      { id: "tool-proof", from: "tool", to: "tool-proof", kind: "evidence" },
      {
        id: "output-proof",
        from: "output",
        to: "output-proof",
        kind: "evidence",
      },
    ],
  },
  "invisible-window-research": {
    nodes: [
      { id: "screen", label: "Physical display", x: 139, y: 102 },
      { id: "visible", label: "Visible window", x: 139, y: 139 },
      { id: "capture", label: "Capture path", x: 413, y: 102 },
      {
        id: "frame",
        label: "Captured frame",
        x: 413,
        y: 139,
        kind: "evidence",
      },
    ],
    edges: [
      { id: "screen-visible", from: "screen", to: "visible" },
      { id: "capture-frame", from: "capture", to: "frame", kind: "evidence" },
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
    ],
  },
};

const projectOrder: AtlasProject[] = [
  "project-simurgh",
  "invisible-window-research",
  "project-zurvan",
];

const boundaryGlyphs: Record<string, string> = {
  input:
    "M -17 -10 H -6 M -17 0 H -6 M -17 10 H -6 M -2 -16 V 16 M 3 -10 H 16 M 3 0 H 16 M 3 10 H 16",
  context:
    "M -11 -15 H 3 L 11 -7 V 15 H -11 Z M 3 -15 V -7 H 11 M -5 -1 H 5 M -5 5 H 5 M -5 10 H 2",
  tool: "M -13 14 V -5 A 13 13 0 0 1 13 -5 V 14 M -6 14 V 1 H 6 V 14 M 0 -2 V 1",
  output:
    "M 0 -16 L 13 -10 V 1 C 13 9 0 16 0 16 C 0 16 -13 9 -13 1 V -10 Z M -6 0 L -2 4 L 6 -5",
};

export function ProofAtlas({
  locale,
  interactive,
  decorative = false,
  className = "",
}: {
  locale: Locale;
  /** False for desktops rendered behind the welcome screen or a reading window. */
  interactive?: boolean;
  /** Use a silent static drawing when the nearby HTML already supplies its meaning. */
  decorative?: boolean;
  className?: string;
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
    >
      <div className="proof-atlas-heading">
        <p className="proof-atlas-eyebrow">{copy.eyebrow}</p>
        <h2 id={titleId}>{copy.heading}</h2>
      </div>
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
            <desc id={descriptionId}>{copy.diagramDescription[selected]}</desc>
          </>
        )}
        <g
          className={`proof-atlas-lines${selected === "invisible-window-research" ? " proof-atlas-lines--comparison" : ""}`}
          aria-hidden="true"
        >
          {atlas.edges.map((edge) => {
            const from = positions.get(edge.from)!;
            const to = positions.get(edge.to)!;
            const midpoint = (from.x + to.x) / 2;
            return (
              <path
                key={`${selected}-${edge.id}`}
                className={`proof-atlas-edge${edge.kind ? " proof-atlas-edge--evidence" : ""}`}
                d={`M ${from.x} ${from.y} C ${midpoint} ${from.y - 18}, ${midpoint} ${to.y - 18}, ${to.x} ${to.y}`}
                pathLength="1"
              />
            );
          })}
        </g>
        {selected === "project-simurgh" && (
          <g className="proof-atlas-evidence-collection" aria-hidden="true">
            <path d="M 145 214 V 250 M 276 214 V 250 M 407 214 V 250 M 500 214 V 250 M 145 250 H 500 M 276 250 V 270" />
            <rect x="245" y="270" width="62" height="36" rx="4" />
            <path d="M 255 279 H 287 M 255 285 H 287 M 255 291 H 279" />
          </g>
        )}
        {selected === "invisible-window-research" && (
          <g className="proof-atlas-capture" aria-hidden="true">
            <rect
              className="proof-atlas-plane"
              x="24"
              y="30"
              width="230"
              height="230"
              rx="5"
            />
            <rect
              className="proof-atlas-plane"
              x="298"
              y="30"
              width="230"
              height="230"
              rx="5"
            />
            <path
              className="proof-atlas-plane-grid"
              d="M 40 57 H 238 M 40 238 H 238 M 314 57 H 512 M 314 238 H 512"
            />
            <rect
              className="proof-atlas-visible-window"
              x="79"
              y="76"
              width="120"
              height="70"
              rx="3"
            />
            <path
              className="proof-atlas-window-light"
              d="M 92 90 H 186 M 92 132 H 186"
            />
            <rect
              className="proof-atlas-excluded-window"
              x="353"
              y="76"
              width="120"
              height="70"
              rx="3"
            />
            <path className="proof-atlas-absence" d="M 378 111 H 448" />
            <path
              className="proof-atlas-comparison-arrow"
              d="M 258 111 H 291 M 283 104 L 291 111 L 283 118"
            />
            <text
              className="proof-atlas-plane-label"
              x="139"
              y="285"
              textAnchor="middle"
            >
              {copy.nodeLabels.screen}
            </text>
            <text
              className="proof-atlas-plane-label"
              x="413"
              y="285"
              textAnchor="middle"
            >
              {copy.nodeLabels.capture}
            </text>
          </g>
        )}
        {selected !== "invisible-window-research" &&
          atlas.nodes.map((node, index) => (
            <g
              key={index}
              className={`proof-atlas-node${node.kind === "evidence" ? " proof-atlas-node--evidence" : ""}${node.kind === "boundary" ? " proof-atlas-node--boundary" : ""}`}
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
                  <text
                    x="0"
                    y={node.labelY ?? 43}
                    textAnchor="middle"
                    direction={
                      locale === "fa" || locale === "ar" ? "rtl" : "ltr"
                    }
                    unicodeBidi="plaintext"
                  >
                    {copy.nodeLabels[node.id] ?? node.label}
                  </text>
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
                  {!node.id.endsWith("-proof") && (
                    <text
                      x="0"
                      y="32"
                      textAnchor="middle"
                      direction={
                        locale === "fa" || locale === "ar" ? "rtl" : "ltr"
                      }
                      unicodeBidi="plaintext"
                    >
                      {copy.nodeLabels[node.id] ?? node.label}
                    </text>
                  )}
                </>
              ) : (
                <>
                  <circle className="proof-atlas-node-halo" r="16" />
                  <circle className="proof-atlas-node-core" r="3.5" />
                  <text
                    x="0"
                    y="32"
                    textAnchor="middle"
                    direction={
                      locale === "fa" || locale === "ar" ? "rtl" : "ltr"
                    }
                    unicodeBidi="plaintext"
                  >
                    {copy.nodeLabels[node.id] ?? node.label}
                  </text>
                </>
              )}
              {index === 0 && (
                <circle className="proof-atlas-node-ring" r="27" />
              )}
            </g>
          ))}
        <path className="proof-atlas-axis" d="M 28 311 H 524" />
      </svg>
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
                className="proof-atlas-option"
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
            <span className="proof-atlas-link-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      ) : (
        <p className="proof-atlas-caption">{copy.welcomeCaption}</p>
      )}
    </section>
  );
}
