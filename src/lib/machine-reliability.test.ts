import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import sitemap from "@/app/sitemap";
import { buildAlternates } from "@/lib/seo";
import { projects, writeups, labExperiments } from "@/lib/data";
import { SITE_LAST_MODIFIED } from "@/lib/constants";

const ORIGIN = "https://raoufabedini.dev";
const entries = sitemap();
const urls = entries.map((e) => e.url);

describe("sitemap completeness", () => {
  it("covers every canonical route across 5 locales", () => {
    const perLocale =
      9 +
      Object.keys(projects).length +
      writeups.length +
      labExperiments.length;
    expect(entries.length).toBe(perLocale * 5);
  });

  it("includes security-policy, hall-of-fame and lab detail pages (all locales)", () => {
    for (const prefix of ["", "/fa", "/ar", "/zh", "/es"]) {
      expect(urls).toContain(
        prefix === "" ? `${ORIGIN}/` : `${ORIGIN}${prefix}`,
      );
      expect(urls).toContain(`${ORIGIN}${prefix}/security-policy`);
      expect(urls).toContain(`${ORIGIN}${prefix}/hall-of-fame`);
      expect(urls).toContain(`${ORIGIN}${prefix}/lab/${labExperiments[0].id}`);
    }
  });

  it("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("advertises x-default (clean English) on canonical English entries", () => {
    const home = entries.find((e) => e.url === `${ORIGIN}/`);
    expect(home?.alternates?.languages?.["x-default"]).toBe(`${ORIGIN}/`);
    const proj = entries.find(
      (e) => e.url === `${ORIGIN}/projects/${Object.keys(projects)[0]}`,
    );
    expect(proj?.alternates?.languages?.["x-default"]).toBe(proj?.url);
  });

  it("uses controlled content dates, not build time", () => {
    // Home/static pages must carry the site revision date, not `new Date()`.
    const home = entries.find((e) => e.url === `${ORIGIN}/`);
    expect((home!.lastModified as Date).toISOString()).toBe(
      new Date(SITE_LAST_MODIFIED).toISOString(),
    );
    // Write-ups carry their latest substantive revision date when available.
    const wu = entries.find(
      (e) => e.url === `${ORIGIN}/write-ups/${writeups[0].slug}`,
    );
    expect((wu!.lastModified as Date).toISOString()).toBe(
      new Date(writeups[0].updatedAt ?? writeups[0].date).toISOString(),
    );
  });
});

describe("buildAlternates hreflang", () => {
  it("adds x-default pointing to the clean English path", () => {
    const a = buildAlternates("/about", "fa");
    expect(a?.canonical).toBe("/fa/about");
    expect(a?.languages?.["x-default"]).toBe("/about");
    expect(a?.languages?.en).toBe("/about");
  });

  it("x-default resolves home to /", () => {
    const a = buildAlternates("", "en");
    expect(a?.languages?.["x-default"]).toBe("/");
  });
});

describe("security.txt (RFC 9116)", () => {
  for (const p of ["public/security.txt", "public/.well-known/security.txt"]) {
    it(`${p} has valid, non-expired fields`, () => {
      const s = readFileSync(p, "utf8");
      expect(s).toMatch(/^Contact:\s*mailto:\S+@\S+/m);
      expect(s).toMatch(/^Acknowledgments:\s*https:\/\//m);
      // Must NOT use the invalid short field name.
      expect(s).not.toMatch(/^Ack:/m);
      expect(s).toMatch(/^Preferred-Languages:\s*en,\s*fa/m);
      expect(s).toMatch(
        /^Canonical:\s*https:\/\/raoufabedini\.dev\/\.well-known\/security\.txt/m,
      );
      const exp = s.match(/^Expires:\s*(\S+)/m)?.[1];
      expect(exp).toBeTruthy();
      expect(new Date(exp!).getTime()).toBeGreaterThan(Date.now());
    });
  }
});
