import type { Locale } from "@/i18n";
import { projectSlugs, type ProjectSlug } from "./project-content/types";

export const osAppLocales = Object.freeze([
  "en",
  "fa",
  "ar",
  "zh",
  "es",
] as const);

const indexRoutes = {
  "/projects": "projects",
  "/write-ups": "write-ups",
  "/lab": "lab",
  "/about": "about",
  "/resume": "resume",
  "/contact": "contact",
  "/security-policy": "security-policy",
  "/hall-of-fame": "hall-of-fame",
} as const;

// These small identifiers are safe to import in the shell. Parity tests compare
// them with the server datasets without shipping article or experiment content.
export const osWriteupSlugs = Object.freeze([
  "project-simurgh-containment",
  "invisible-window-research",
  "nanomatch-deep-dive",
  "sentinelflow-deep-dive",
  "ecrsm-deep-dive",
  "kmp-security",
  "electron-security",
] as const);
export const osExperimentIds = Object.freeze(["001", "002", "003"] as const);

type IndexRoute = keyof typeof indexRoutes;
type WriteupSlug = (typeof osWriteupSlugs)[number];
type ExperimentId = (typeof osExperimentIds)[number];

export type OSAppRoute =
  | IndexRoute
  | `/projects/${ProjectSlug}`
  | `/write-ups/${WriteupSlug}`
  | `/lab/${ExperimentId}`;

export type OSAppRouteInfo =
  | {
      readonly route: IndexRoute;
      readonly kind: (typeof indexRoutes)[IndexRoute];
    }
  | {
      readonly route: `/projects/${ProjectSlug}`;
      readonly kind: "project";
      readonly slug: ProjectSlug;
    }
  | {
      readonly route: `/write-ups/${WriteupSlug}`;
      readonly kind: "write-up";
      readonly slug: WriteupSlug;
    }
  | {
      readonly route: `/lab/${ExperimentId}`;
      readonly kind: "experiment";
      readonly experimentId: ExperimentId;
    };

export type OSAppKind = OSAppRouteInfo["kind"];

export interface OSAppDescriptor {
  readonly id: string;
  readonly path: string;
  readonly route: OSAppRoute;
  readonly locale: Locale;
  readonly kind: OSAppKind;
}

export const osAppRoutes: readonly OSAppRoute[] = Object.freeze([
  ...(Object.keys(indexRoutes) as IndexRoute[]),
  ...projectSlugs.map((slug): OSAppRoute => `/projects/${slug}`),
  ...osWriteupSlugs.map((slug): OSAppRoute => `/write-ups/${slug}`),
  ...osExperimentIds.map((id): OSAppRoute => `/lab/${id}`),
]);

const projectSlugSet: ReadonlySet<string> = new Set(projectSlugs);
const writeupSlugSet: ReadonlySet<string> = new Set(osWriteupSlugs);
const experimentIdSet: ReadonlySet<string> = new Set(osExperimentIds);

export function isOSAppLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && osAppLocales.some((locale) => locale === value)
  );
}

function canonicalPath(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    value.length > 200 ||
    value.includes("//") ||
    !/^\/[a-z0-9/-]+$/.test(value)
  ) {
    return null;
  }
  // A single trailing slash is a public-route alias, never a separate window.
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function parseOSAppRoute(value: unknown): OSAppRouteInfo | null {
  const route = canonicalPath(value);
  if (!route) return null;
  if (Object.hasOwn(indexRoutes, route)) {
    const indexRoute = route as IndexRoute;
    return { route: indexRoute, kind: indexRoutes[indexRoute] };
  }

  const parts = route.split("/");
  if (parts.length !== 3) return null;
  const [, section, identifier] = parts;
  if (section === "projects" && projectSlugSet.has(identifier)) {
    const slug = identifier as ProjectSlug;
    return { route: `/projects/${slug}`, kind: "project", slug };
  }
  if (section === "write-ups" && writeupSlugSet.has(identifier)) {
    const slug = identifier as WriteupSlug;
    return { route: `/write-ups/${slug}`, kind: "write-up", slug };
  }
  if (section === "lab" && experimentIdSet.has(identifier)) {
    const experimentId = identifier as ExperimentId;
    return { route: `/lab/${experimentId}`, kind: "experiment", experimentId };
  }
  return null;
}

export function getOSAppDescriptorForRoute(
  route: unknown,
  locale: unknown,
): OSAppDescriptor | null {
  if (!isOSAppLocale(locale)) return null;
  const info = parseOSAppRoute(route);
  if (!info) return null;
  const path = locale === "en" ? info.route : `/${locale}${info.route}`;
  return { id: path, path, route: info.route, locale, kind: info.kind };
}

export function getOSAppDescriptor(
  pathname: unknown,
  locale: unknown,
): OSAppDescriptor | null {
  if (!isOSAppLocale(locale)) return null;
  const path = canonicalPath(pathname);
  if (!path) return null;
  if (locale === "en") return getOSAppDescriptorForRoute(path, locale);
  const prefix = `/${locale}/`;
  if (!path.startsWith(prefix)) return null;
  return getOSAppDescriptorForRoute(path.slice(prefix.length - 1), locale);
}

export function isOSAppDescriptor(value: unknown): value is OSAppDescriptor {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  try {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return false;
    const keys = Reflect.ownKeys(value);
    const expectedKeys = ["id", "path", "route", "locale", "kind"];
    if (
      keys.length !== expectedKeys.length ||
      keys.some((key) => typeof key !== "string" || !expectedKeys.includes(key))
    ) {
      return false;
    }
    const candidate = value as Record<string, unknown>;
    const expected = getOSAppDescriptorForRoute(
      candidate.route,
      candidate.locale,
    );
    return (
      !!expected &&
      expectedKeys.every(
        (key) => candidate[key] === expected[key as keyof OSAppDescriptor],
      )
    );
  } catch {
    // A malformed object (including a hostile Proxy) must not break the shell.
    return false;
  }
}
