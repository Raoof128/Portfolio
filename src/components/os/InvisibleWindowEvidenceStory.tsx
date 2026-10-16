"use client";

import { useId, useState } from "react";
import type { Locale } from "@/i18n";
import type { InvisibleWindowStoryCopy } from "@/lib/project-content/evidence-story-copy";
import "./evidence-story-invisible.css";

const invisibleWindowRepository =
  "https://github.com/Raoof128/invisible-window-research";
const invisibleWindowPaper = "https://doi.org/10.5281/zenodo.20376495";

/** Paired schematic showing a display/capture discrepancy within stated test scope. */
export function InvisibleWindowEvidenceStory({
  locale,
  copy,
}: {
  locale: Locale;
  copy: InvisibleWindowStoryCopy;
}) {
  const id = useId();
  const [platform, setPlatform] = useState<"windows" | "macos">("windows");
  const api = platform === "windows" ? copy.windowsApi : copy.macApi;
  const [apiLabel, ...apiIdentifiers] = api.split(" · ");
  const scope = platform === "windows" ? copy.windowsScope : copy.macScope;

  return (
    <figure
      className="os-evidence-story os-invisible-window-story"
      lang={locale}
      dir={locale === "fa" || locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <header className="os-evidence-story-heading">
        <p className="os-evidence-story-eyebrow">{copy.eyebrow}</p>
        {/* h2: the story sits under the dossier's Overview; its sub-heads are h3. */}
        <h2 id={`${id}-title`}>{copy.title}</h2>
        <p id={`${id}-description`}>{copy.introduction}</p>
        <span className="os-evidence-story-note">{copy.illustrationLabel}</span>
      </header>

      <fieldset className="os-story-platform-picker">
        <legend>{copy.platformLabel}</legend>
        {/* The segments sit in their own row: a fieldset wraps its children in an anonymous box, so flex on the fieldset itself does not reach the buttons. */}
        <div className="os-story-platform-options">
          <button
            type="button"
            aria-pressed={platform === "windows"}
            onClick={() => setPlatform("windows")}
          >
            Windows 10/11
          </button>
          <button
            type="button"
            aria-pressed={platform === "macos"}
            onClick={() => setPlatform("macos")}
          >
            macOS 14–26
          </button>
        </div>
      </fieldset>

      {/* A three-step reading of the diagram: what the person sees, where capture
          stops, and what the capture holds. It repeats the panel headings, so it is
          hidden from assistive tech. The labels are existing copy keys. */}
      <ol className="os-capture-flow" aria-hidden="true">
        <li className="os-capture-step">{copy.physicalLabel}</li>
        <li className="os-capture-step">{copy.captureScopeLabel}</li>
        <li className="os-capture-step">{copy.captureLabel}</li>
      </ol>

      <div className="os-capture-observability">
        <section
          className="os-capture-panel"
          aria-labelledby={`${id}-physical`}
        >
          <h3 id={`${id}-physical`}>{copy.physicalLabel}</h3>
          <div
            className="os-capture-schematic os-capture-display"
            aria-hidden="true"
          >
            <div className="os-capture-window">
              <span className="os-capture-chip">
                {platform === "windows" ? "Windows 10/11" : "macOS 14–26"}
              </span>
            </div>
          </div>
          <p>{copy.physicalDetail}</p>
        </section>
        <section
          className="os-capture-panel"
          data-platform={platform}
          aria-labelledby={`${id}-capture`}
        >
          <h3 id={`${id}-capture`}>{copy.captureLabel}</h3>
          <span className="os-capture-platform-tag">
            {platform === "windows" ? copy.windowsPathLabel : copy.macPathLabel}
          </span>
          <p className="os-capture-scope-label">{copy.captureScopeLabel}</p>
          <div
            className="os-capture-schematic os-capture-frame"
            aria-hidden="true"
          >
            <div className="os-capture-window os-capture-window-omitted">
              <span className="os-capture-chip">
                <bdi dir="ltr">{apiIdentifiers.join(" · ")}</bdi>
              </span>
            </div>
          </div>
          <p className="os-capture-api" aria-live="polite">
            {apiLabel} · <bdi dir="ltr">{apiIdentifiers.join(" · ")}</bdi>
          </p>
          <p>{scope}</p>
        </section>
      </div>

      <section
        className="os-story-scope-ledger"
        aria-labelledby={`${id}-limits`}
      >
        <h3 id={`${id}-limits`}>{copy.limitationsTitle}</h3>
        <ul>
          <li>{copy.windowsLimits}</li>
          <li>{copy.macLimits}</li>
          {copy.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </section>

      <figcaption className="os-evidence-story-caption">
        <p>{copy.sourceNote}</p>
        <div className="os-evidence-story-links">
          <a
            href={invisibleWindowPaper}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.paperLink}
          </a>
          <a
            href={invisibleWindowRepository}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.repositoryLink}
          </a>
        </div>
      </figcaption>
    </figure>
  );
}
