"use client";

import { useId, useState } from "react";
import type { Locale } from "@/i18n";
import type { SimurghEvidenceStoryCopy } from "@/lib/project-content/evidence-story-copy";
import { formatNumber } from "@/i18n/format";
import "./evidence-story-simurgh.css";
import { TerminalCommand } from "./TerminalCommand";

const simurghRepository = "https://github.com/Raoof128/Project-Simurgh";
const simurghReproduction =
  "https://github.com/Raoof128/Project-Simurgh/blob/main/scripts/reproduce-vca-chain.sh";

/** A selectable architecture illustration; it does not synthesize a run trace. */
export function SimurghEvidenceStory({
  locale,
  copy,
}: {
  locale: Locale;
  copy: SimurghEvidenceStoryCopy;
}) {
  const id = useId();
  const [selectedBoundary, setSelectedBoundary] = useState(0);

  return (
    <figure
      className="os-evidence-story os-simurgh-story"
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

      <div className="os-simurgh-instrument">
        <p className="os-evidence-story-section-label">
          {copy.boundariesLabel}
        </p>
        <ol
          className="os-simurgh-instrument-chain"
          aria-label={copy.proofPathLabel}
        >
          {copy.boundaries.map((boundary, index) => (
            <li
              className="os-simurgh-instrument-station"
              data-selected={selectedBoundary === index}
              data-path-active={index >= selectedBoundary}
              key={boundary.title}
            >
              <button
                type="button"
                className="os-simurgh-instrument-control"
                aria-pressed={selectedBoundary === index}
                aria-describedby={`${id}-detail-${index}`}
                onClick={() => setSelectedBoundary(index)}
              >
                <span
                  className="os-simurgh-instrument-point"
                  aria-hidden="true"
                >
                  {formatNumber(index + 1, locale, {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                  })}
                </span>
                <strong>{boundary.title}</strong>
              </button>
            </li>
          ))}
          <li
            className="os-simurgh-instrument-station os-simurgh-instrument-output"
            data-path-active="true"
          >
            <span className="os-simurgh-instrument-point" aria-hidden="true">
              {formatNumber(5, locale, {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}
            </span>
            <strong>{copy.signedPack}</strong>
            <small>{copy.signedPackDetail}</small>
          </li>
          <li
            className="os-simurgh-instrument-station os-simurgh-instrument-output"
            data-path-active="true"
          >
            <span className="os-simurgh-instrument-point" aria-hidden="true">
              {formatNumber(6, locale, {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}
            </span>
            <strong>{copy.verifier}</strong>
            <small>{copy.verifierDetail}</small>
          </li>
        </ol>
      </div>

      <section
        className="os-simurgh-explanations"
        aria-labelledby={`${id}-details-title`}
      >
        <h4 id={`${id}-details-title`}>{copy.detailsTitle}</h4>
        <ol>
          {copy.boundaries.map((boundary, index) => (
            <li
              id={`${id}-detail-${index}`}
              data-selected={selectedBoundary === index}
              aria-current={selectedBoundary === index ? "step" : undefined}
              key={boundary.title}
            >
              <span className="os-simurgh-explanation-index" aria-hidden="true">
                {formatNumber(index + 1, locale, {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </span>
              <p>{boundary.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <figcaption className="os-evidence-story-caption">
        <p>{copy.sourceNote}</p>
        <div className="os-evidence-story-links">
          <a href={simurghRepository} target="_blank" rel="noopener noreferrer">
            {copy.repositoryLink}
          </a>
          <a
            href={simurghReproduction}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.reproduceLink}
          </a>
        </div>
        {/* Run from the repository root with every release tag present, as the script requires. */}
        <TerminalCommand
          locale={locale}
          commands={[
            `git clone ${simurghRepository}`,
            "cd Project-Simurgh && git fetch --tags",
            "bash scripts/reproduce-vca-chain.sh",
          ]}
        />
      </figcaption>
    </figure>
  );
}
