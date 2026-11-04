import { describe, it, expect } from "vitest";
import {
  projects,
  writeups,
  labExperiments,
  supportingResearch,
  type Project,
  type Writeup,
  type LabExperiment,
} from "./data";
import { SITE_LAST_MODIFIED } from "./constants";

function expectContentDate(value: string): void {
  expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  const date = new Date(value);
  expect(Number.isFinite(date.getTime())).toBe(true);
  // Date accepts some impossible days by rolling them into the next month.
  expect(date.toISOString().slice(0, 10)).toBe(value);
}

describe("Data Layer", () => {
  describe("Projects", () => {
    it("should have at least 3 projects", () => {
      expect(Object.keys(projects).length).toBeGreaterThanOrEqual(3);
    });

    it("each project should have required fields", () => {
      Object.values(projects).forEach((project: Project) => {
        expect(project.slug).toBeDefined();
        expect(project.title).toBeDefined();
        expect(project.category).toMatch(/^(OFFENSIVE|DEFENSIVE|ENGINEERING)$/);
        expect(project.year).toBeDefined();
        expect(project.description).toBeDefined();
        expect(project.tags).toBeInstanceOf(Array);
        expect(project.links).toBeDefined();
        expect(project.build).toBeDefined();
        expect(project.secure).toBeDefined();
      });
    });

    it("should have Mehr Guard as featured project", () => {
      expect(projects["mehr-guard"]).toBeDefined();
      expect(projects["mehr-guard"].slug).toBe("mehr-guard");
      expect(projects["mehr-guard"].category).toBe("DEFENSIVE");
    });

    it("should have GitSwitch project", () => {
      expect(projects["gitswitch"]).toBeDefined();
      expect(projects["gitswitch"].category).toBe("ENGINEERING");
    });

    it("should have ECRSM project", () => {
      expect(projects["ecrsm"]).toBeDefined();
      expect(projects["ecrsm"].category).toBe("DEFENSIVE");
    });

    it("should publish the Invisible Window preprint and paper", () => {
      expect(projects["invisible-window-research"]?.links.doi).toBeUndefined();
      expect(projects["invisible-window-research"]?.links.preprint).toBe(
        "https://zenodo.org/records/20376495",
      );
      expect(projects["invisible-window-research"]?.links.paper).toBe(
        "/Invisible_Window_Research_Preprint_V2.0.pdf",
      );
      expect(projects["invisible-window-research"]?.papers).toHaveLength(1);
      expect(projects["invisible-window-research"]?.papers?.[0]?.doi).toBe(
        "10.5281/zenodo.20376495",
      );
      expect(projects["invisible-window-research"]?.proof.join(" ")).toContain(
        "10.5281/zenodo.20376495",
      );
    });

    it("lists current Simurgh software first while retaining its earlier publications", () => {
      const projectKeys = Object.keys(projects);
      const invisibleWindowIndex = projectKeys.indexOf(
        "invisible-window-research",
      );

      expect(projectKeys[invisibleWindowIndex + 1]).toBe("project-simurgh");
      expect(projects["project-simurgh"]?.links.repo).toBe(
        "https://github.com/Raoof128/Project-Simurgh",
      );
      expect(projects["project-simurgh"]?.links.doi).toBe(
        "https://doi.org/10.5281/zenodo.21737792",
      );
      expect(projects["project-simurgh"]?.links.doiKind).toBe("software");
      expect(projects["project-simurgh"]?.links.preprint).toBeUndefined();
      expect(projects["project-simurgh"]?.links.paper).toBeUndefined();
      expect(projects["project-simurgh"]?.papers).toHaveLength(3);
      expect(projects["project-simurgh"]?.papers).toEqual([
        expect.objectContaining({
          title:
            "Project Simurgh: Privacy-Preserving Device Integrity Proofs for Capture-Resistant High-Stakes Sessions",
          href: "/Project_Simurgh_Preprint_v1.0.pdf",
          label: "Earlier device-integrity preprint",
          kind: "download",
          doi: "10.5281/zenodo.20374849",
        }),
        expect.objectContaining({
          title:
            "Privacy-Preserving Integrity Evidence for Student-Society Voting-Adjacent Workflows: A Phase C Pilot of Project Simurgh at Macquarie University",
          href: "/Project_Simurgh_Voting_Adjacent_Supplement_Phase_C_Preprint_v1.0.pdf",
          kind: "download",
          doi: "10.5281/zenodo.20549736",
        }),
        expect.objectContaining({
          title:
            "Banking Shield: Machine-Checked Absence Claims for Privacy-Sensitive AI Explanations",
          href: "/Banking_Shield_Machine_Checked_Absence_Claims_Preprint_v1.2.pdf",
          kind: "download",
          doi: "10.5281/zenodo.20675513",
        }),
      ]);
      expect(projects["project-simurgh"]?.citation).toBe(
        "Abedini, M. R. (2026). Project Simurgh: Privacy-Preserving Device Integrity Proofs for Capture-Resistant High-Stakes Sessions. Zenodo. https://doi.org/10.5281/zenodo.20374849",
      );
      expect(projects["project-simurgh"]?.description).toContain(
        "Inspectable authorisation and containment prototype",
      );
    });

    it("keeps current positive and null study results distinct from frozen evidence", () => {
      const simurgh = projects["project-simurgh"];
      expect(simurgh.description).toContain("Llama-3.2-3B");
      expect(simurgh.description).toContain("17/24 to 0/24");
      expect(simurgh.description).toContain("23/24");
      expect(simurgh.description).toContain("gpt-6-luna");
      expect(simurgh.description).toContain("no incremental protection");
      const evidence = simurgh.proof.join(" ");
      for (const token of [
        "288",
        "six states",
        "Wilson 95%",
        "43.6–97.0%",
        "0.0–39.0%",
        "by construction",
        "8/8",
        "2/3",
        "5/5",
        "one refusal still open",
        "39 Lean 4 proof files",
        "5,171",
        "19 October 2026",
        "92 published releases",
        "919",
        "141",
        "10.5281/zenodo.21737792",
      ])
        expect(evidence).toContain(token);
      expect(simurgh.proof[4]).toContain("Earlier frozen classifier stage");
      expect(simurgh.proof[4]).toContain("138/138");
      expect(simurgh.proof[5]).toContain("Earlier frozen AgentDojo stage");
      expect(simurgh.proof[5]).toContain("9/140 to 0/140");
      expect(simurgh.proof[5]).toContain(
        "benign utility fell from 7/10 to 6/10",
      );
      expect(simurgh.proof[5]).toContain("utility under attack 949/949");
      expect(simurgh.proof[5]).toContain("benign utility 97/97");
      expect(simurgh.papers?.[0].doi).toBe("10.5281/zenodo.20374849");
      expect(evidence).not.toContain("3,057");
    });

    it("describes passkeys as public-key authentication", () => {
      const passkeys = projects["syllabus-sync"].proof.join(" ");
      expect(passkeys).toContain("public-key credentials");
      expect(passkeys).not.toContain("shared secrets");
    });

    it("records sourced supporting work without inventing a repository or route", () => {
      expect(supportingResearch.sentinelssh.title).toBe("SentinelSSH");
      expect(supportingResearch.sentinelssh.typedTools).toBe(17);
      expect(supportingResearch.sentinelssh.description).toContain("read-only");
      expect(supportingResearch.sentinelssh.description).toContain("no shell");
      expect(supportingResearch.sentinelssh).not.toHaveProperty("repo");
      expect(projects).not.toHaveProperty("sentinelssh");
    });

    it("should list Project Zurvan directly after Project Simurgh", () => {
      const projectKeys = Object.keys(projects);
      const simurghIndex = projectKeys.indexOf("project-simurgh");
      expect(projectKeys[simurghIndex + 1]).toBe("project-zurvan");
      expect(projects["project-zurvan"]?.links.repo).toBe(
        "https://github.com/Raoof128/Project-Zurvan",
      );
      expect(projects["project-zurvan"]?.category).toBe("ENGINEERING");
      expect(projects["project-zurvan"]?.build.stack).toBeInstanceOf(Array);
    });

    it("should publish the Aion BibleQA preprint in the paper library", () => {
      expect(projects["aion"]?.links.repo).toBe(
        "https://github.com/Raoof128/Aion",
      );
      expect(projects["aion"]?.papers).toEqual([
        expect.objectContaining({
          title:
            "Aion-BibleQA: Evaluating Retrieval and Citation Faithfulness in Verse-Grounded Bible RAG Systems",
          href: "/aion-bibleqa-citation-faithfulness-bible-rag.pdf",
          kind: "download",
          doi: "10.5281/zenodo.20522874",
        }),
      ]);
    });

    it("should have Divan — Open Day as an ENGINEERING project with a repo link", () => {
      expect(projects["divan-open-day"]).toBeDefined();
      expect(projects["divan-open-day"].category).toBe("ENGINEERING");
      expect(projects["divan-open-day"].links.repo).toBe(
        "https://github.com/Raoof128/divan-open-day",
      );
      expect(projects["divan-open-day"].papers).toBeUndefined();
    });

    it("each project should have valid links structure", () => {
      Object.values(projects).forEach((project: Project) => {
        expect(project.links).toHaveProperty("repo");
      });
    });

    it("each project should have build and secure sections", () => {
      Object.values(projects).forEach((project: Project) => {
        expect(project.build.stack).toBeInstanceOf(Array);
        expect(project.build.features).toBeInstanceOf(Array);
        expect(project.secure.measures).toBeInstanceOf(Array);
        expect(project.secure.measures.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Writeups", () => {
    it("should have at least 3 writeups", () => {
      expect(writeups.length).toBeGreaterThanOrEqual(3);
    });

    it("each writeup should have required fields", () => {
      writeups.forEach((writeup: Writeup) => {
        expect(writeup.slug).toBeDefined();
        expect(writeup.title).toBeDefined();
        expect(writeup.date).toBeDefined();
        expect(writeup.tag).toBeDefined();
        expect(writeup.takeaway).toBeDefined();
        expect(writeup.content).toBeDefined();
      });
    });

    it("each writeup should have unique slug", () => {
      const slugs = writeups.map((w: Writeup) => w.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("writeup dates should be valid ISO format", () => {
      writeups.forEach((writeup: Writeup) => {
        expectContentDate(writeup.date);
        if (writeup.updatedAt) {
          expectContentDate(writeup.updatedAt);
          expect(Date.parse(writeup.updatedAt)).toBeGreaterThanOrEqual(
            Date.parse(writeup.date),
          );
        }
      });
    });
  });

  describe("Lab Experiments", () => {
    it("should have at least 3 experiments", () => {
      expect(labExperiments.length).toBeGreaterThanOrEqual(3);
    });

    it("each experiment should have required fields", () => {
      labExperiments.forEach((exp: LabExperiment) => {
        expect(exp.id).toBeDefined();
        expect(exp.title).toBeDefined();
        expect(exp.status).toMatch(/^(ACTIVE|ARCHIVED|CONCEPT)$/);
        expect(exp.description).toBeDefined();
        expect(exp.tech).toBeInstanceOf(Array);
        expect(exp.objective).toBeDefined();
        expect(exp.constraints).toBeDefined();
        expect(exp.codeSnippet).toBeDefined();
      });
    });

    it("each experiment should have unique ID", () => {
      const ids = labExperiments.map((e: LabExperiment) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have experiment with ID 001 (Keylogger)", () => {
      const keylogger = labExperiments.find(
        (e: LabExperiment) => e.id === "001",
      );
      expect(keylogger).toBeDefined();
      expect(keylogger?.title).toContain("Keylogger");
    });
  });

  it("keeps site and project revision dates valid for feed and sitemap generation", () => {
    expectContentDate(SITE_LAST_MODIFIED);
    for (const project of Object.values(projects)) {
      if (project.updatedAt) expectContentDate(project.updatedAt);
    }
  });
});
