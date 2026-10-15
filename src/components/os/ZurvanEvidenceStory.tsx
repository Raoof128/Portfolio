"use client";

import { useId, useState } from "react";
import type { Locale } from "@/i18n";
import type { ZurvanEvidenceStoryCopy } from "@/lib/project-content/evidence-story-copy";
import "./evidence-story-zurvan.css";

/** Generic typed-node graph; it deliberately contains no private-corpus records. */
export function ZurvanEvidenceStory({
  locale,
  copy,
}: {
  locale: Locale;
  copy: ZurvanEvidenceStoryCopy;
}) {
  const id = useId();
  const [selectedType, setSelectedType] = useState(0);
  return (
    <figure
      className="os-evidence-story os-zurvan-story"
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

      <div
        className="os-zurvan-graph"
        role="group"
        aria-label={copy.relationshipsLabel}
      >
        <div className="os-zurvan-graph-node os-zurvan-source">
          <strong>{copy.sourceNode}</strong>
          <small>{copy.sourceDetail}</small>
        </div>
        <p className="os-zurvan-edge os-zurvan-edge-source">
          {copy.sourceRelationship}
        </p>
        <div
          className="os-zurvan-type-branches"
          role="group"
          aria-label={copy.nodeTypesLabel}
        >
          {copy.nodeTypes.map((node, index) => (
            <button
              className="os-zurvan-graph-node os-zurvan-typed"
              type="button"
              aria-pressed={selectedType === index}
              aria-describedby={`${id}-type-${index}`}
              data-selected={selectedType === index}
              onClick={() => setSelectedType(index)}
              key={node.name}
            >
              <strong>{node.name}</strong>
            </button>
          ))}
        </div>
        <p
          className="os-zurvan-edge os-zurvan-edge-retrieval"
          data-selected-type={selectedType}
          aria-live="polite"
        >
          <bdi>{copy.nodeTypes[selectedType].name}</bdi>:{" "}
          {copy.retrievalRelationship}
        </p>
        <div className="os-zurvan-graph-node os-zurvan-retrieval">
          <strong>{copy.retrievalNode}</strong>
          <small>{copy.retrievalDetail}</small>
        </div>
        <div className="os-zurvan-graph-node os-zurvan-consumer">
          <strong>{copy.consumerNode}</strong>
          <small>{copy.consumerDetail}</small>
        </div>
      </div>

      <section
        className="os-zurvan-type-ledger-section"
        aria-labelledby={`${id}-types`}
      >
        <h3 id={`${id}-types`}>{copy.detailsTitle}</h3>
        <ol className="os-zurvan-type-ledger">
          {copy.nodeTypes.map((node, index) => (
            <li
              id={`${id}-type-${index}`}
              data-selected={selectedType === index}
              aria-current={selectedType === index ? "step" : undefined}
              key={node.name}
            >
              <strong>{node.name}</strong>
              <p>{node.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <figcaption className="os-evidence-story-caption">
        <p>{copy.limitations}</p>
        <p>{copy.repositoryNote}</p>
      </figcaption>
    </figure>
  );
}
