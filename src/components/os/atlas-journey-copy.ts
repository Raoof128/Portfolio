import type { Locale } from "@/i18n";
import { getAtlasCopy } from "./atlas-copy";

/** Journey buttons read the Atlas copy so each string lives in one place. */
export function getAtlasJourneyCopy(locale: Locale) {
  const { journeyExplore, journeyReview } = getAtlasCopy(locale);
  return { explore: journeyExplore, review: journeyReview };
}
