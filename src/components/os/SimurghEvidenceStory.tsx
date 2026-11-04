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
  const [selectedStep, setSelectedStep] = useState(0);
  const steps = [
    ...copy.boundaries,
    { title: copy.signedPack, detail: copy.signedPackDetail },
    { title: copy.verifier, detail: copy.verifierDetail },
  ];

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
        {/* h2: the story sits under the dossier's Overview; its sub-heads are h3. */}
        <h2 id={`${id}-title`}>{copy.title}</h2>
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
          {steps.map((step, index) => (
            <li
              className="os-simurgh-instrument-station"
              data-selected={selectedStep === index}
              data-path-active={index >= selectedStep}
              key={step.title}
            >
              <button
                type="button"
                className="os-simurgh-instrument-control"
                aria-pressed={selectedStep === index}
                aria-describedby={`${id}-detail-${index}`}
                onClick={() => setSelectedStep(index)}
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
                <strong>{step.title}</strong>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <section
        className="os-simurgh-explanations"
        aria-labelledby={`${id}-details-title`}
      >
        <h3 id={`${id}-details-title`}>{copy.detailsTitle}</h3>
        <ol>
          {steps.map((step, index) => (
            <li
              id={`${id}-detail-${index}`}
              data-selected={selectedStep === index}
              aria-current={selectedStep === index ? "step" : undefined}
              key={step.title}
            >
              <span className="os-simurgh-explanation-index" aria-hidden="true">
                {formatNumber(index + 1, locale, {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </span>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="os-evidence-story-reproduce">
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
      </div>

      {/* figcaption must be the figure's first or last child; it closes the story. */}
      <figcaption className="os-evidence-story-caption">
        <p>{copy.sourceNote}</p>
      </figcaption>
    </figure>
  );
}
