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
        <h3 id={`${id}-title`}>{copy.title}</h3>
        <p id={`${id}-description`}>{copy.introduction}</p>
        <span className="os-evidence-story-note">{copy.illustrationLabel}</span>
      </header>

      <fieldset className="os-story-platform-picker">
        <legend>{copy.platformLabel}</legend>
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
      </fieldset>

      <div className="os-capture-observability" aria-live="polite">
        <section
          className="os-capture-panel"
          aria-labelledby={`${id}-physical`}
        >
          <h4 id={`${id}-physical`}>{copy.physicalLabel}</h4>
          <div
            className="os-capture-schematic os-capture-display"
            aria-hidden="true"
          >
            <span>{copy.physicalLabel}</span>
            <div className="os-capture-window">{copy.physicalDetail}</div>
          </div>
          <p>{copy.physicalDetail}</p>
        </section>
        <section
          className="os-capture-panel"
          data-platform={platform}
          aria-labelledby={`${id}-capture`}
        >
          <h4 id={`${id}-capture`}>{copy.captureLabel}</h4>
          <span className="os-capture-platform-tag">
            {platform === "windows" ? copy.windowsPathLabel : copy.macPathLabel}
          </span>
          <div
            className="os-capture-schematic os-capture-frame"
            aria-hidden="true"
          >
            <span>{copy.captureLabel}</span>
            <div className="os-capture-window os-capture-window-omitted">
              {copy.captureScopeLabel}
            </div>
          </div>
          <p className="os-capture-api">
            {apiLabel} · <bdi dir="ltr">{apiIdentifiers.join(" · ")}</bdi>
          </p>
          <p>{scope}</p>
        </section>
      </div>

      <section
        className="os-story-scope-ledger"
        aria-labelledby={`${id}-limits`}
      >
        <h4 id={`${id}-limits`}>{copy.limitationsTitle}</h4>
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
