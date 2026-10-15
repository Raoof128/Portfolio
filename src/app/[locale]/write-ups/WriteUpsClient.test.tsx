import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nProvider } from "@/i18n/provider";
import { getDictionary, type Locale } from "@/i18n";
import { formatDate, formatNumber } from "@/i18n/format";
import { getLocalizedWriteups } from "@/lib/localized-writing";
import { getOSCopy } from "@/components/os/os-copy";
import { getPageSupportCopy } from "@/lib/page-support-copy";
import { WriteUpsClient } from "./WriteUpsClient";
import {
  getPublicationSourceLanguageNote,
  getPublicationSummaries,
} from "@/lib/publications";
import { projects } from "@/lib/data";
import { getLocalizedProject } from "@/lib/project-localization";

const supportedLocales: Locale[] = ["en", "fa", "ar", "zh", "es"];

async function library(locale: Locale) {
  const posts = getLocalizedWriteups(locale);
  const dictionary = await getDictionary(locale);
  const copy = getOSCopy(locale);
  const publications = getPublicationSummaries(locale);
  const element = (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <WriteUpsClient
        posts={posts}
        publications={publications}
        publicationSourceLanguageNote={getPublicationSourceLanguageNote(locale)}
      />
    </I18nProvider>
  );
  return { posts, dictionary, copy, publications, element };
}

describe("localized writing library", () => {
  for (const locale of supportedLocales) {
    it(`${locale}: renders and searches selected-locale titles with localized dates and counts`, async () => {
      const { posts, copy, element } = await library(locale);
      render(element);
      expect(
        screen.getByRole("heading", { name: posts[0].title }),
      ).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent(
        formatNumber(posts.length, locale),
      );
      expect(
        screen.getByText(formatDate(posts[0].date, locale)),
      ).toBeInTheDocument();
      fireEvent.change(
        screen.getByRole("searchbox", { name: copy.librarySearch }),
        { target: { value: posts[0].title } },
      );
      expect(
        within(screen.getByRole("region", { name: copy.writing })).getAllByRole(
          "article",
        ),
      ).toHaveLength(1);
      const prefix = locale === "en" ? "" : `/${locale}`;
      expect(
        screen.getByRole("link", { name: posts[0].title }),
      ).toHaveAttribute("href", `${prefix}/write-ups/${posts[0].slug}`);
      expect(screen.getByRole("status")).toHaveTextContent(
        formatNumber(1, locale),
      );
    });

    it(`${locale}: exposes all original publications and localized source-project links independently of article search`, async () => {
      const { publications, dictionary, copy, element } = await library(locale);
      render(element);
      const section = screen.getByRole("region", {
        name: dictionary.project_detail.research_papers,
      });
      expect(section).toHaveAttribute("id", "research-publications");
      expect(within(section).getAllByRole("article")).toHaveLength(5);
      expect(
        within(section).getByText(getPublicationSourceLanguageNote(locale)),
      ).toBeInTheDocument();
      for (const publication of publications) {
        const heading = within(section).getByRole("heading", {
          name: publication.title,
        });
        expect(heading).toHaveAttribute("lang", "en");
        expect(heading).toHaveAttribute("dir", "ltr");
        const card = heading.closest("article")!;
        const titleLink = within(card).getByRole("link", {
          name: publication.title,
        });
        expect(titleLink).toHaveAttribute("href", publication.href);
        expect(titleLink).toHaveAttribute("rel", "noopener noreferrer");
        // The new-tab cue is a description, so the accessible name stays the bare title.
        expect(titleLink).toHaveAccessibleDescription(
          getPageSupportCopy(locale).opensInNewTab,
        );
        expect(
          within(card).getByRole("link", {
            name: `${dictionary.common.case_study}: ${publication.projectTitle}`,
          }),
        ).toHaveAttribute("href", publication.projectHref);
        expect(
          within(card).getByRole("link", {
            name: `DOI: ${publication.doi}`,
          }),
        ).toHaveAttribute("href", `https://doi.org/${publication.doi}`);
        expect(
          within(card).getByText(publication.description!),
        ).toHaveAttribute("lang", locale);
      }
      fireEvent.change(
        screen.getByRole("searchbox", { name: copy.librarySearch }),
        {
          target: { value: "__no_existing_article__" },
        },
      );
      expect(
        within(
          screen.getByRole("region", { name: copy.writing }),
        ).queryAllByRole("article"),
      ).toHaveLength(0);
      expect(within(section).getAllByRole("article")).toHaveLength(5);
    });

    it(`${locale}: keeps article topic filtering separate from publications`, async () => {
      const { posts, dictionary, copy, element } = await library(locale);
      render(element);
      fireEvent.change(
        screen.getByRole("combobox", { name: copy.libraryTopic }),
        {
          target: { value: posts[0].tag },
        },
      );
      expect(
        within(screen.getByRole("region", { name: copy.writing })).getAllByRole(
          "article",
        ),
      ).toHaveLength(posts.filter((post) => post.tag === posts[0].tag).length);
      expect(
        within(
          screen.getByRole("region", {
            name: dictionary.project_detail.research_papers,
          }),
        ).getAllByRole("article"),
      ).toHaveLength(5);
    });
  }

  it("preserves every source paper identity while supplying only the active locale's verified description", () => {
    const original = Object.values(projects).flatMap((project) =>
      (project.papers ?? []).map((paper) => ({ project, paper })),
    );
    expect(original).toHaveLength(5);
    for (const locale of supportedLocales) {
      const summaries = getPublicationSummaries(locale);
      expect(new Set(summaries.map((summary) => summary.id)).size).toBe(5);
      for (const [index, { project, paper }] of original.entries()) {
        const summary = summaries[index];
        const localizedPaper = getLocalizedProject(
          project,
          locale,
        ).papers!.find((candidate) => candidate.href === paper.href)!;
        expect(summary).toMatchObject({
          title: paper.title,
          titleLocale: "en",
          href: paper.href,
          doi: paper.doi,
          venue: paper.venue,
          year: paper.year,
          kind: paper.kind,
          description: localizedPaper.description,
          descriptionLocale: locale,
          status: localizedPaper.status,
          label: localizedPaper.label,
        });
        expect(summary).not.toHaveProperty("fullDescription");
        expect(summary).not.toHaveProperty("build");
        expect(summary).not.toHaveProperty("secure");
      }
    }
  });

  it("server-renders ordinary publication/section links without requiring client search", async () => {
    for (const locale of supportedLocales) {
      const { element, publications } = await library(locale);
      const container = document.createElement("div");
      container.innerHTML = renderToStaticMarkup(element);
      expect(
        container.querySelector('a[href="#research-publications"]'),
      ).not.toBeNull();
      expect(
        container.querySelector('a[href="#technical-write-ups"]'),
      ).not.toBeNull();
      const section = container.querySelector("#research-publications")!;
      expect(section).not.toHaveAttribute("hidden");
      expect(section.querySelectorAll("article")).toHaveLength(5);
      for (const publication of publications) {
        expect(
          section.querySelector(`a[href="${publication.href}"]`),
        ).not.toBeNull();
        expect(
          section.querySelector(`a[href="${publication.projectHref}"]`),
        ).not.toBeNull();
        expect(
          section.querySelector(`a[href="https://doi.org/${publication.doi}"]`),
        ).not.toBeNull();
      }
    }
  });
});
