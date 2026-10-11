import { describe, expect, it } from "vitest";
import { locales } from "@/i18n";
import { labExperiments, projects, writeups } from "./data";
import {
  getOSAppDescriptor,
  getOSAppDescriptorForRoute,
  isOSAppDescriptor,
  isOSAppLocale,
  osAppLocales,
  osAppRoutes,
  osExperimentIds,
  osWriteupSlugs,
  parseOSAppRoute,
} from "./os-app-schema";

describe("OS application route schema", () => {
  it("matches the complete server route and locale inventory", () => {
    expect([...osAppLocales].sort()).toEqual(Object.keys(locales).sort());
    expect(
      osAppRoutes.filter((route) => route.startsWith("/projects/")),
    ).toEqual(
      Object.values(projects).map((project) => `/projects/${project.slug}`),
    );
    expect([...osWriteupSlugs]).toEqual(writeups.map((post) => post.slug));
    expect([...osExperimentIds]).toEqual(
      labExperiments.map((experiment) => experiment.id),
    );
    expect(osAppRoutes).toHaveLength(31);
    expect(new Set(osAppRoutes).size).toBe(31);
  });

  it.each(osAppLocales)(
    "round-trips all 31 reading routes for %s",
    (locale) => {
      const ids = new Set<string>();
      for (const route of osAppRoutes) {
        const path = locale === "en" ? route : `/${locale}${route}`;
        const descriptor = getOSAppDescriptor(path, locale);
        expect(descriptor).toEqual({
          id: path,
          path,
          route,
          locale,
          kind: parseOSAppRoute(route)?.kind,
        });
        expect(getOSAppDescriptorForRoute(route, locale)).toEqual(descriptor);
        expect(isOSAppDescriptor(descriptor)).toBe(true);
        ids.add(descriptor!.id);
      }
      expect(ids.size).toBe(31);
    },
  );

  it("distinguishes index, project, article and experiment kinds", () => {
    expect(parseOSAppRoute("/projects")).toEqual({
      route: "/projects",
      kind: "projects",
    });
    expect(parseOSAppRoute("/projects/project-simurgh")).toEqual({
      route: "/projects/project-simurgh",
      kind: "project",
      slug: "project-simurgh",
    });
    expect(parseOSAppRoute("/write-ups/electron-security")).toEqual({
      route: "/write-ups/electron-security",
      kind: "write-up",
      slug: "electron-security",
    });
    expect(parseOSAppRoute("/lab/003")).toEqual({
      route: "/lab/003",
      kind: "experiment",
      experimentId: "003",
    });
  });

  it("uses one identity for a single trailing-slash alias", () => {
    expect(getOSAppDescriptor("/fa/projects/project-simurgh/", "fa")).toEqual(
      getOSAppDescriptor("/fa/projects/project-simurgh", "fa"),
    );
    expect(getOSAppDescriptorForRoute("/about/", "en")).toEqual(
      getOSAppDescriptorForRoute("/about", "en"),
    );
  });

  it.each([
    "/",
    "/fa",
    "/en/about",
    "/fa/about",
    "/projects/unknown",
    "/write-ups/unknown",
    "/lab/004",
    "/about/extra",
    "/projects//project-simurgh",
    "/about//",
    "/../about",
    "/%61bout",
    "/About",
    "/about?tab=1",
    "/about#bio",
    "https://example.com/about",
    "//example.com/about",
    "about",
    " /about",
    "/about ",
    "/about\\x",
    "/about\u0000",
    "/" + "a".repeat(201),
  ])("rejects non-reading or ambiguous route %s", (route) => {
    expect(parseOSAppRoute(route)).toBeNull();
    expect(getOSAppDescriptor(route, "en")).toBeNull();
  });

  it("never adopts another locale prefix or an English redirect alias", () => {
    for (const locale of osAppLocales) {
      expect(getOSAppDescriptor("/en/about", locale)).toBeNull();
      for (const otherLocale of osAppLocales.filter(
        (value) => value !== locale && value !== "en",
      )) {
        expect(getOSAppDescriptor(`/${otherLocale}/about`, locale)).toBeNull();
      }
      if (locale !== "en")
        expect(getOSAppDescriptor("/about", locale)).toBeNull();
    }
  });

  it.each([null, undefined, 1, {}, [], "fr", "EN", "", "fa/", "__proto__"])(
    "rejects unsupported locale %s",
    (locale) => {
      expect(isOSAppLocale(locale)).toBe(false);
      expect(getOSAppDescriptor("/about", locale)).toBeNull();
      expect(getOSAppDescriptorForRoute("/about", locale)).toBeNull();
    },
  );

  it("rejects mismatched, extra or malformed descriptor fields", () => {
    const descriptor = getOSAppDescriptor("/fa/about", "fa")!;
    expect(isOSAppDescriptor({ ...descriptor, id: "/about" })).toBe(false);
    expect(isOSAppDescriptor({ ...descriptor, path: "/fa/about/" })).toBe(
      false,
    );
    expect(isOSAppDescriptor({ ...descriptor, route: "/contact" })).toBe(false);
    expect(isOSAppDescriptor({ ...descriptor, kind: "project" })).toBe(false);
    expect(isOSAppDescriptor({ ...descriptor, locale: "ar" })).toBe(false);
    expect(isOSAppDescriptor({ ...descriptor, html: "<script>" })).toBe(false);
    expect(
      isOSAppDescriptor({ ...descriptor, [Symbol("extra")]: "extra" }),
    ).toBe(false);
    expect(isOSAppDescriptor(Object.create(descriptor))).toBe(false);
    expect(isOSAppDescriptor({ ...descriptor, route: "/about/" })).toBe(false);
    for (const value of [null, [], new Date(), "about", { path: "/about" }]) {
      expect(isOSAppDescriptor(value)).toBe(false);
    }
    expect(
      isOSAppDescriptor(Object.assign(Object.create(null), descriptor)),
    ).toBe(true);
  });

  it("contains malformed object access without throwing", () => {
    const descriptor = getOSAppDescriptor("/about", "en")!;
    const throwingGetter = {
      ...descriptor,
      get route(): string {
        throw new Error("invalid input");
      },
    };
    const throwingProxy = new Proxy(descriptor, {
      ownKeys() {
        throw new Error("invalid input");
      },
    });
    expect(isOSAppDescriptor(throwingGetter)).toBe(false);
    expect(isOSAppDescriptor(throwingProxy)).toBe(false);
  });
});
