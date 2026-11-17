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
    // The dossier carries the project's own revision date, not the site-wide one.
    expect(dossier.dateModified).toBe(projects["project-simurgh"].updatedAt);
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
    expect(invisible).toContain(
      "100% evasion in every tested lab configuration",
    );
    expect(invisible).not.toContain("every platform tested");
    expect(invisible).toContain(
      "no commercial proctoring product or Linux system was tested",
    );
    expect(invisible).toContain(
      "The full proof-of-concept code is withheld on dual-use grounds; a minimal macOS test fixture is public.",
    );
    expect(invisible).toContain("10.5281/zenodo.20376495");
  });

  it("states expected education and current public source access in the machine corpus", async () => {
    const corpus = await fullCorpus().text();
    expect(corpus).toMatch(
      /Bachelor of Cyber Security — Macquarie University, Sydney · Expected Jun 2027/,
    );
    expect(corpus).not.toContain("Bachelor of IT (Cyber Security)");
    expect(corpus).toContain(`Repo: ${projects["project-zurvan"].links.repo}`);
    expect(corpus).not.toContain(
      `Repo (private; contact the author to request access): ${projects["project-zurvan"].links.repo}`,
    );
    expect(corpus).toContain("decisions to agents over MCP (4,109 tests)");
    expect(corpus).toContain("1,399 tests across 167 files");
    expect(corpus).toContain("syllabus parsing is planned and not built");
    expect(corpus).toContain("append-only audit logging");
    expect(corpus).not.toMatch(/tamper-resistant|converts university syllabi/);
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
        "Jun 2027",
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

  it("keeps the corrected Mehr Guard, SentinelFlow and Banking Shield scope in both machine-readable summaries", async () => {
    const concise = readFileSync("public/llms.txt", "utf8");
    const corpus = await fullCorpus().text();
    for (const text of [concise, corpus]) {
      expect(text).not.toMatch(/500,000/);
      expect(text).toContain("146 tests");
      expect(text).toMatch(/packets\/sec/);
      expect(text).toContain("90.7% F1");
      expect(text).toMatch(/18-scenario\s+red-team\s+mode/);
      expect(text).not.toMatch(/87% F1|19-scenario|ensemble ML|under 5 ms/);
      expect(text).not.toMatch(/28\.4M|3,334|1,343/);
    }
  });
});
