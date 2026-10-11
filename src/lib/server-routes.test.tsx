import { describe, expect, it, vi } from "vitest";
import ProjectPage, {
  generateMetadata as projectMetadata,
} from "@/app/[locale]/projects/[slug]/page";
import { generateMetadata as articleMetadata } from "@/app/[locale]/write-ups/[slug]/page";
import { generateMetadata as labMetadata } from "@/app/[locale]/lab/[id]/page";
import { getDictionary } from "@/i18n";
import { writeups, labExperiments } from "@/lib/data";

// Exercise Next's real 404 signal rather than the client-navigation setup mock.
vi.mock("next/navigation", async (importOriginal) => importOriginal());

vi.mock("@/app/[locale]/projects/[slug]/ProjectDetailClient", () => ({
  ProjectDetailClient: () => null,
}));
vi.mock("@/app/[locale]/write-ups/[slug]/WriteupDetailClient", () => ({
  WriteupDetailClient: () => null,
}));
vi.mock("@/app/[locale]/lab/[id]/LabDetailClient", () => ({
  LabDetailClient: () => null,
}));

describe("server route input boundaries", () => {
  for (const slug of [
    "constructor",
    "__proto__",
    "toString",
    "missing-project",
  ]) {
    it(`rejects unpublished project ${slug} as a 404`, async () => {
      await expect(
        ProjectPage({ params: Promise.resolve({ locale: "en", slug }) }),
      ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
      const metadata = await projectMetadata({
        params: Promise.resolve({ locale: "en", slug }),
      });
      expect(metadata.title).toBe(
        (await getDictionary("en")).seo.project_not_found_title,
      );
    });
  }

  for (const locale of ["constructor", "__proto__", "unknown"]) {
    it(`normalizes ${locale} before localizing detail metadata`, async () => {
      for (const [generate, detail] of [
        [projectMetadata, { slug: "project-simurgh" }],
        [articleMetadata, { slug: writeups[0].slug }],
        [labMetadata, { id: labExperiments[0].id }],
      ] as const) {
        const params = { locale, ...detail } as {
          locale: string;
          slug: string;
          id: string;
        };
        expect(await generate({ params: Promise.resolve(params) })).toEqual(
          await generate({
            params: Promise.resolve({ ...params, locale: "en" }),
          }),
        );
      }
    });
  }
});
