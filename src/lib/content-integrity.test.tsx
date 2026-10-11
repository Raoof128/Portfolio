import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectPage from "@/app/[locale]/projects/[slug]/page";
import { GET as fullCorpus } from "@/app/llms-full.txt/route";
import { SITE_LAST_MODIFIED } from "@/lib/constants";
import { projects } from "@/lib/data";

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

  it("states expected education and private source access in the machine corpus", async () => {
    const corpus = await fullCorpus().text();
    expect(corpus).toContain(
      "Bachelor of Cyber Security, Macquarie University, Sydney — expected November 2026",
    );
    expect(corpus).not.toContain("Bachelor of IT (Cyber Security)");
    expect(corpus).toContain(
      `Repo (private; contact the author to request access): ${projects["project-zurvan"].links.repo}`,
    );
    expect(corpus).toContain("218");
  });
});
