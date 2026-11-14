import { test, expect } from "@playwright/test";
import { projects, writeups } from "../../../src/lib/data";
import { getLocalizedProject } from "../../../src/lib/project-localization";
import { getLocalizedWriteup } from "../../../src/lib/localized-writing";
import type { Locale } from "../../../src/i18n";

const locales: Locale[] = ["en", "fa", "ar", "zh", "es"];
const pathFor = (locale: Locale, path: string) =>
  locale === "en" ? path : `/${locale}${path}`;

for (const mode of [
  {
    name: "desktop",
    width: 1440,
    height: 900,
    theme: "light",
    hasTouch: false,
  },
  { name: "phone", width: 320, height: 568, theme: "dark", hasTouch: true },
]) {
  test.describe(`reviewed project content on ${mode.name}`, () => {
    test.use({
      viewport: { width: mode.width, height: mode.height },
      hasTouch: mode.hasTouch,
    });

    for (const locale of locales) {
      test(`every dossier and article retains reviewed content: ${locale}`, async ({
        page,
      }, info) => {
        await page.addInitScript((theme) => {
          localStorage.clear();
          sessionStorage.clear();
          localStorage.setItem("researchos.appearance.v1", theme);
        }, mode.theme);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const observations = [];
        const active = () =>
          page.locator('[data-window-path][data-active="true"]:not([hidden])');
        const ready = async (path: string) => {
          const response = await page.goto(path, {
            waitUntil: "domcontentloaded",
          });
          expect(response?.status(), path).toBe(200);
          await expect(page.locator(".os-shell")).toHaveAttribute(
            "data-appearance",
            mode.theme,
          );
          await expect(active().locator("h1")).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
        };
        const geometry = async () => {
          const value = await active().evaluate((element) => {
            const content = element.querySelector(".os-page-content")!;
            return {
              viewport: innerWidth,
              documentWidth: document.documentElement.scrollWidth,
              contentWidth: content.clientWidth,
              contentScrollWidth: content.scrollWidth,
              brokenImages: [...element.querySelectorAll("img")].filter(
                (img) => img.complete && !img.naturalWidth,
              ).length,
            };
          });
          expect(value.documentWidth).toBeLessThanOrEqual(mode.width + 1);
          expect(value.contentScrollWidth).toBeLessThanOrEqual(
            value.contentWidth + 1,
          );
          expect(value.brokenImages).toBe(0);
          return value;
        };

        for (const [slug, source] of Object.entries(projects)) {
          const project = getLocalizedProject(source, locale);
          const path = pathFor(locale, `/projects/${slug}`);
          await ready(path);
          await expect(active().locator("h1")).toHaveText(project.title);
          await expect(
            page.locator('meta[name="description"]'),
          ).toHaveAttribute("content", project.description);
          const publicRepo = active().locator(`a[href="${project.links.repo}"]`);
          if (project.links.repoVisibility === "private") {
            // A private repository is never linked; the page offers a source request by
            // email and says the source is private (030e261).
            expect(await publicRepo.count()).toBe(0);
            expect(
              await active().locator('a[href^="mailto:"][href*="subject="]').count(),
            ).toBeGreaterThan(0);
          } else if (project.links.repo) {
            expect(await publicRepo.count()).toBeGreaterThan(0);
          }
          // A project without a repository (FORMA) links only its live demo.
          const schema = await page
            .locator('script[type="application/ld+json"]')
            .evaluateAll((nodes) =>
              nodes.flatMap(
                (node) => JSON.parse(node.textContent ?? "{}")["@graph"] ?? [],
              ),
            );
          const software = schema.find(
            (node) => node["@type"] === "SoftwareSourceCode",
          );
          expect(software?.codeRepository).toBe(project.links.repo);
          // Only a private repository declares access conditions in its schema.
          if (project.links.repoVisibility === "private")
            expect(typeof software?.conditionsOfAccess).toBe("string");
          else if (software)
            expect(software).not.toHaveProperty("conditionsOfAccess");
          if (project.links.doiKind === "software") {
            expect(software?.identifier?.value).toBe("10.5281/zenodo.21737792");
            expect(software?.sameAs).toBe(project.links.doi);
          }
          for (const section of ["overview", "evidence", "methods"] as const) {
            const panel = active().locator(
              `[data-dossier-section="${section}"]`,
            );
            const id = await panel.getAttribute("id");
            await active()
              .locator(`[role="tab"][aria-controls="${id}"]`)
              .click();
            await expect(panel).toBeVisible();
            if (section === "overview") {
              await expect(panel).toContainText(project.problem);
              await expect(
                panel.locator(".os-project-numbered-list > li"),
              ).toHaveText(project.solution);
            } else if (section === "evidence") {
              await expect(
                panel.locator(".os-project-evidence-list > li"),
              ).toHaveText(project.proof);
              for (const paper of project.papers ?? []) {
                await expect(panel).toContainText(paper.title);
                if (paper.description)
                  await expect(panel).toContainText(paper.description);
              }
            } else {
              await expect(
                panel.locator(".os-project-stack-list > li"),
              ).toHaveText(project.build.stack);
              await expect(
                panel.locator(".os-project-method-list").nth(0).locator("li"),
              ).toHaveText(project.build.features);
              await expect(
                panel.locator(".os-project-method-list").nth(1).locator("li"),
              ).toHaveText(project.secure.measures);
            }
            observations.push({
              locale,
              mode: mode.name,
              path,
              section,
              ...(await geometry()),
            });
          }
          if (["project-zurvan", "ecrsm"].includes(slug)) {
            await info.attach(`${mode.name}-${locale}-${slug}-methods`, {
              body: await page.screenshot({ animations: "disabled" }),
              contentType: "image/png",
            });
          }
        }

        for (const source of writeups) {
          const post = getLocalizedWriteup(source, locale);
          const path = pathFor(locale, `/write-ups/${source.slug}`);
          await ready(path);
          await expect(active().locator("h1")).toHaveText(post.title);
          await expect(active().locator("article")).toBeVisible();
          if (source.slug === "sentinelflow-deep-dive") {
            await expect(active().locator("pre code")).toContainText(
              'msg:"SSH connection attempt"; sid:1001;',
            );
            await expect(active().locator("pre code")).not.toContainText(
              "threshold:10,60",
            );
          }
          observations.push({
            locale,
            mode: mode.name,
            path,
            section: "article",
            ...(await geometry()),
          });
        }
        expect(errors).toEqual([]);
        await info.attach("reviewed-project-content-observations", {
          body: JSON.stringify(observations, null, 2),
          contentType: "application/json",
        });
      });
    }
  });
}
