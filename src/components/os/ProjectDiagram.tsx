import type { ReactNode } from "react";
import { ArrowRight, FileText, GitBranch, ShieldCheck } from "lucide-react";
import type { Project } from "@/lib/data";
import type { Locale } from "@/i18n";
import { formatNumber } from "@/i18n/format";
import type { ProjectDiagramCopy } from "@/lib/project-content/types";

/** A schematic screen with a browser window; its bars are decorative. */
function DisplayMock({
  desktop,
  children,
}: {
  desktop: string;
  children: ReactNode;
}) {
  return (
    <div className="os-diagram-screen">
      <div className="os-diagram-browser">
        <span>{desktop}</span>
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

/** These diagrams explain documented components; they are not measured traces. */
export function ProjectDiagram({
  project,
  slug,
  copy,
  locale,
}: {
  project: Project;
  slug: string;
  copy: ProjectDiagramCopy;
  locale: Locale;
}) {
  const direction = locale === "fa" || locale === "ar" ? "rtl" : "ltr";
  if (slug === "project-simurgh") {
    const boundaries = copy.boundaries;
    return (
      <figure
        className="os-project-diagram os-containment-diagram"
        lang={locale}
        dir={direction}
      >
        <figcaption>
          <ShieldCheck size={17} aria-hidden="true" />
          {copy.boundariesTitle}
        </figcaption>
        <div className="os-diagram-boundaries">
          {boundaries.map(([title, detail], index) => (
            <div className="os-diagram-node" key={title}>
              <span className="os-diagram-node-number">
                {formatNumber(index + 1, locale, {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </span>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
          ))}
        </div>
        <div className="os-diagram-evidence-path">
          <span>{copy.signedPack}</span>
          <ArrowRight size={18} aria-hidden="true" />
          <span>{copy.verifier}</span>
        </div>
        <p>{copy.containmentNote}</p>
      </figure>
    );
  }
  if (slug === "invisible-window-research") {
    return (
      <figure
        className="os-project-diagram os-capture-diagram"
        lang={locale}
        dir={direction}
      >
        <figcaption>
          <FileText size={17} aria-hidden="true" />
          {copy.captureTitle}
        </figcaption>
        <div className="os-diagram-displays">
          <div>
            <DisplayMock desktop={copy.desktop}>
              <div className="os-diagram-excluded-window">
                {copy.excludedWindow}
                <br />
                <small>{copy.visibleToPerson}</small>
              </div>
            </DisplayMock>
            <strong>{copy.physicalDisplay}</strong>
          </div>
          <ArrowRight
            className="os-diagram-display-arrow"
            size={22}
            aria-hidden="true"
          />
          <div>
            <DisplayMock desktop={copy.desktop}>
              <div className="os-diagram-omitted-window">
                {copy.omittedWindow}
                <br />
                <small>{copy.capturePipeline}</small>
              </div>
            </DisplayMock>
            <strong>{copy.capturedFrame}</strong>
          </div>
        </div>
        <p>{copy.captureNote}</p>
      </figure>
    );
  }
  if (slug === "project-zurvan") {
    const stages = copy.stages;
    return (
      <figure
        className="os-project-diagram os-provenance-diagram"
        lang={locale}
        dir={direction}
      >
        <figcaption>
          <GitBranch size={17} aria-hidden="true" />
          {copy.provenanceTitle}
        </figcaption>
        <ol className="os-diagram-flow">
          {stages.map(([title, detail], index) => (
            <li key={title}>
              <span className="os-diagram-node-number">
                {formatNumber(index + 1, locale, {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </span>
              <strong>{title}</strong>
              <small>{detail}</small>
              {index < stages.length - 1 && (
                <ArrowRight size={15} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
        <p>{copy.provenanceNote}</p>
      </figure>
    );
  }
  return (
    <figure
      className="os-project-diagram os-stack-diagram"
      lang={locale}
      dir={direction}
    >
      <figcaption>
        <GitBranch size={17} aria-hidden="true" />
        {copy.stackTitle}
      </figcaption>
      <ul className="os-diagram-stack">
        {project.build.stack.map((technology, index) => (
          <li key={technology}>
            <span className="os-diagram-node-number">
              {formatNumber(index + 1, locale, {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}
            </span>
            <strong>
              <bdi>{technology}</bdi>
            </strong>
          </li>
        ))}
      </ul>
    </figure>
  );
}
