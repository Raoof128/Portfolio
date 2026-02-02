import { describe, it, expect } from 'vitest';
import { projects, writeups, labExperiments, type Project, type Writeup, type LabExperiment } from './data';

describe('Data Layer', () => {
  describe('Projects', () => {
    it('should have at least 3 projects', () => {
      expect(Object.keys(projects).length).toBeGreaterThanOrEqual(3);
    });

    it('each project should have required fields', () => {
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

    it('should have Mehr Guard as featured project', () => {
      expect(projects['mehr-guard']).toBeDefined();
      expect(projects['mehr-guard'].slug).toBe('mehr-guard');
      expect(projects['mehr-guard'].category).toBe('DEFENSIVE');
    });

    it('should have GitSwitch project', () => {
      expect(projects['gitswitch']).toBeDefined();
      expect(projects['gitswitch'].category).toBe('ENGINEERING');
    });

    it('should have ECRSM project', () => {
      expect(projects['ecrsm']).toBeDefined();
      expect(projects['ecrsm'].category).toBe('OFFENSIVE');
    });

    it('each project should have valid links structure', () => {
      Object.values(projects).forEach((project: Project) => {
        expect(project.links).toHaveProperty('repo');
      });
    });

    it('each project should have build and secure sections', () => {
      Object.values(projects).forEach((project: Project) => {
        expect(project.build.stack).toBeInstanceOf(Array);
        expect(project.build.features).toBeInstanceOf(Array);
        expect(project.secure.measures).toBeInstanceOf(Array);
        expect(project.secure.measures.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Writeups', () => {
    it('should have at least 3 writeups', () => {
      expect(writeups.length).toBeGreaterThanOrEqual(3);
    });

    it('each writeup should have required fields', () => {
      writeups.forEach((writeup: Writeup) => {
        expect(writeup.slug).toBeDefined();
        expect(writeup.title).toBeDefined();
        expect(writeup.date).toBeDefined();
        expect(writeup.tag).toBeDefined();
        expect(writeup.takeaway).toBeDefined();
        expect(writeup.content).toBeDefined();
      });
    });

    it('each writeup should have unique slug', () => {
      const slugs = writeups.map((w: Writeup) => w.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('writeup dates should be valid ISO format', () => {
      writeups.forEach((writeup: Writeup) => {
        expect(() => new Date(writeup.date)).not.toThrow();
      });
    });
  });

  describe('Lab Experiments', () => {
    it('should have at least 3 experiments', () => {
      expect(labExperiments.length).toBeGreaterThanOrEqual(3);
    });

    it('each experiment should have required fields', () => {
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

    it('each experiment should have unique ID', () => {
      const ids = labExperiments.map((e: LabExperiment) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have experiment with ID 001 (Keylogger)', () => {
      const keylogger = labExperiments.find((e: LabExperiment) => e.id === '001');
      expect(keylogger).toBeDefined();
      expect(keylogger?.title).toContain('Keylogger');
    });
  });
});
