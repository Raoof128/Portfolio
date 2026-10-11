import type { ComponentType } from "react";

export type ProjectArtworkComponent = ComponentType<{
  active?: boolean;
  preview?: boolean;
}>;

/** The existing dossier identities, shared by previews without project data. */
export const projectArtworkRegistry = {
  "invisible-window-research": {
    background: "#05020a",
    load: () =>
      import("@/components/ui/RoyalAbyssCanvas").then(
        (module) => module.RoyalAbyssCanvas,
      ),
  },
  "project-simurgh": {
    background: "#010101",
    load: () =>
      import("@/components/ui/FireShieldCanvas").then(
        (module) => module.FireShieldCanvas,
      ),
  },
  "project-zurvan": {
    background: "#020103",
    load: () =>
      import("@/components/ui/CosmicLoomCanvas").then(
        (module) => module.CosmicLoomCanvas,
      ),
  },
  gitswitch: {
    background: "#110a0c",
    load: () =>
      import("@/components/ui/DandelionSpinner").then(
        (module) => module.DandelionSpinner,
      ),
  },
  "mehr-guard": {
    background: "#030308",
    load: () =>
      import("@/components/ui/DnaHelixCanvas").then(
        (module) => module.DnaHelixCanvas,
      ),
  },
  "syllabus-sync": {
    background: "#141007",
    load: () =>
      import("@/components/ui/KineticLotus").then(
        (module) => module.KineticLotus,
      ),
  },
  "divan-open-day": {
    background: "#0b1026",
    load: () =>
      import("@/components/ui/BlueButterfly").then(
        (module) => module.BlueButterfly,
      ),
  },
  "nexus-archive": {
    background: "#030714",
    load: () =>
      import("@/components/ui/KineticAstrolabe").then(
        (module) => module.KineticAstrolabe,
      ),
  },
  nanomatch: {
    background: "#161115",
    load: () =>
      import("@/components/ui/CelestialCatcher").then(
        (module) => module.CelestialCatcher,
      ),
  },
  sentinelflow: {
    background: "#11150c",
    load: () =>
      import("@/components/ui/CosmicOracleEye").then(
        (module) => module.CosmicOracleEye,
      ),
  },
  ecrsm: {
    background: "#07030e",
    load: () =>
      import("@/components/ui/ConstellationOwl").then(
        (module) => module.ConstellationOwl,
      ),
  },
  simurghforge: {
    background: "#ecf6fd",
    load: () =>
      import("@/components/ui/KoiPond").then((module) => module.KoiPond),
  },
  aion: {
    background: "#06050a",
    load: () =>
      import("@/components/ui/WheelsOfEzekiel").then(
        (module) => module.WheelsOfEzekiel,
      ),
  },
} satisfies Record<
  string,
  { background: string; load: () => Promise<ProjectArtworkComponent> }
>;

export type ProjectArtworkSlug = keyof typeof projectArtworkRegistry;
const modules = new Map<ProjectArtworkSlug, Promise<ProjectArtworkComponent>>();

export function isProjectArtworkSlug(slug: string): slug is ProjectArtworkSlug {
  return Object.hasOwn(projectArtworkRegistry, slug);
}

export function loadProjectArtwork(slug: ProjectArtworkSlug) {
  const cached = modules.get(slug);
  if (cached) return cached;
  const request = projectArtworkRegistry[slug]
    .load()
    .catch((error: unknown) => {
      // A rejected chunk must not poison later dossier/thumbnail requests.
      modules.delete(slug);
      throw error;
    });
  modules.set(slug, request);
  return request;
}
