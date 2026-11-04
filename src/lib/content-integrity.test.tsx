import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectPage from "@/app/[locale]/projects/[slug]/page";
import { GET as fullCorpus } from "@/app/llms-full.txt/route";
import { SITE_LAST_MODIFIED } from "@/lib/constants";
import { projects, writeups } from "@/lib/data";

vi.mock("@/app/[locale]/projects/[slug]/ProjectDetailClient", () => ({
  ProjectDetailClient: () => null,
}));

describe("research and qualification integrity", () => {
  it("does not stamp a site revision onto unchanged original DOI publications", async () => {
    const content = await ProjectPage({
      params: Promise.resolve({ locale: "fa", slug: "project-simurgh" }),
    });
    const html = renderToStaticMarkup(content);
    const schema = JSON.parse(
      html.match(/<script[^>]*>([\s\S]*?)<\/script>/)![1],
    );
    const papers = schema["@graph"].filter(
      (node: Record<string, unknown>) => node["@type"] === "ScholarlyArticle",
    );
    expect(papers).toHaveLength(projects["project-simurgh"].papers!.length);
    for (const paper of papers) {
      expect(paper).not.toHaveProperty("dateModified");
      expect(paper.inLanguage).toBe("en");
    }
    const dossier = schema["@graph"].find(
      (node: Record<string, unknown>) => node["@type"] === "SoftwareSourceCode",
    );
    expect(dossier.dateModified).toBe(SITE_LAST_MODIFIED);
    expect(dossier.sameAs).toBe(projects["project-simurgh"].links.doi);
    expect(dossier.identifier).toEqual({
      "@type": "PropertyValue",
      propertyID: "DOI",
      value: "10.5281/zenodo.21737792",
    });
  });

  it("keeps concise machine scope and revision aligned with the supported research", () => {
    const concise = readFileSync("public/llms.txt", "utf8");
    expect(concise).toContain(`Last updated: ${SITE_LAST_MODIFIED}`);
    const invisible = concise
      .split("2. The Invisible Window:")[1]
      .split("\n")[0];
    expect(invisible).toContain("100%");
    expect(invisible).toContain("laboratory configurations");
    expect(invisible).toContain(
      "commercial proctoring products and Linux were not tested",
    );
    expect(invisible).toContain(
      "native capture tools rather than browser getDisplayMedia()",
    );
    expect(invisible).toContain("March 2026");
    expect(invisible).toContain("10.5281/zenodo.20376495");
  });

  it("states expected education and current public source access in the machine corpus", async () => {
    const corpus = await fullCorpus().text();
    expect(corpus).toMatch(
      /Bachelor of Cyber Security, Macquarie University, Sydney[;—] expected June 2027/,
    );
    expect(corpus).not.toContain("Bachelor of IT (Cyber Security)");
    expect(corpus).toContain(`Repo: ${projects["project-zurvan"].links.repo}`);
    expect(corpus).not.toContain(
      `Repo (private; contact the author to request access): ${projects["project-zurvan"].links.repo}`,
    );
    expect(corpus).toContain("3,334 passed, 1 failed, 8 skipped");
    for (const writeup of writeups.filter((entry) => entry.updatedAt)) {
      expect(corpus).toContain(
        `Published: ${writeup.date} · Updated: ${writeup.updatedAt}`,
      );
    }
  });

  it("keeps the latest transfer-study benefit, null result and publication identities together", async () => {
    const concise = readFileSync("public/llms.txt", "utf8");
    const corpus = await fullCorpus().text();
    for (const text of [concise, corpus]) {
      for (const fact of [
        "17/24",
        "23/24",
        "gpt-6-luna",
        "288",
        "39 Lean",
        "5,171",
        "19 Oct 2026",
        "21737792",
        "20374849",
        "December 2026",
        "June 2027",
        "SentinelSSH",
        "17 typed tools",
      ]) {
        expect(text).toContain(fact);
      }
      expect(text).toMatch(/no incremental protection/);
      expect(text).not.toContain("expected November 2026");
      expect(text).not.toContain("ready to relocate now");
    }
  });

  it("retains the synthetic parsing scope in both machine-readable summaries", async () => {
    const concise = readFileSync("public/llms.txt", "utf8");
    const corpus = await fullCorpus().text();
    for (const text of [concise, corpus]) {
      expect(text).toMatch(
        /single-thread synthetic\s+SYN-ACK packet-header parsing benchmark/,
      );
      expect(text).not.toContain("real-time intrusion detection at 500K+");
    }
  });
});
