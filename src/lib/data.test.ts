import { describe, it, expect } from "vitest";
import {
  projects,
  writeups,
  labExperiments,
  type Project,
  type Writeup,
  type LabExperiment,
} from "./data";

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
      expect(projects["ecrsm"].category).toBe("OFFENSIVE");
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

    it("should list Project Simurgh directly after Invisible Window with its preprint, papers, and citation", () => {
      const projectKeys = Object.keys(projects);
      const invisibleWindowIndex = projectKeys.indexOf(
        "invisible-window-research",
      );

      expect(projectKeys[invisibleWindowIndex + 1]).toBe("project-simurgh");
      expect(projects["project-simurgh"]?.links.repo).toBe(
        "https://github.com/Raoof128/Project-Simurgh",
      );
      expect(projects["project-simurgh"]?.links.doi).toBeUndefined();
      expect(projects["project-simurgh"]?.links.preprint).toBe(
        "https://zenodo.org/records/20374849",
      );
      expect(projects["project-simurgh"]?.links.paper).toBe(
        "/Project_Simurgh_Preprint_v1.0.pdf",
      );
      expect(projects["project-simurgh"]?.papers).toHaveLength(3);
      expect(projects["project-simurgh"]?.papers).toEqual([
        expect.objectContaining({
          title:
            "Project Simurgh: Privacy-Preserving Device Integrity Proofs for Capture-Resistant High-Stakes Sessions",
          href: "/Project_Simurgh_Preprint_v1.0.pdf",
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
        "verifiable containment-attestation framework for agentic AI",
      );
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
        expect(() => new Date(writeup.date)).not.toThrow();
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
});
