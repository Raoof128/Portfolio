"use client";

import { useContext, useLayoutEffect, useRef, type ReactNode } from "react";
import type { Locale } from "@/i18n";
import { getOSAppDescriptorForRoute } from "@/lib/os-app-schema";
import { ApplicationRegistrationContext } from "./application-context";

/** Keep SSR readable, then hand an immutable leaf app to the persistent workspace. */
export function OSApplicationBridge({
  locale,
  route,
  children,
}: {
  locale: Locale;
  route: string;
  children: ReactNode;
}) {
  const { ready, register } = useContext(ApplicationRegistrationContext);
  const initialDocument = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const descriptor = getOSAppDescriptorForRoute(route, locale);
    if (!descriptor) return;
    const element = initialDocument.current;
    const focused = document.activeElement;
    const field =
      focused instanceof HTMLInputElement ||
      focused instanceof HTMLTextAreaElement
        ? focused
        : null;
    const page = element?.closest<HTMLElement>(".os-page-content");
    const toolbar = page?.parentElement?.querySelector(".os-windowbar");
    const fields: Record<string, string> = {};
    // Browser autofill or typing before hydration must survive the initial handover.
    element
      ?.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement
      >("input[name], textarea[name]")
      .forEach((field) => {
        fields[field.name] = field.value.slice(0, 10000);
      });
    register({
      descriptor,
      view: children,
      initial: {
        fields,
        readingOffset:
          page && toolbar
            ? Math.max(
                0,
                toolbar.getBoundingClientRect().bottom -
                  page.getBoundingClientRect().top,
              )
            : 0,
        ...(field && element?.contains(field)
          ? {
              focusedField: field.closest(".os-explorer-search")
                ? "project-query"
                : field.name,
              selectionStart: field.selectionStart,
              selectionEnd: field.selectionEnd,
            }
          : {}),
        projectQuery: element?.querySelector<HTMLInputElement>(
          ".os-explorer-search input",
        )?.value,
        projectCategory: element?.querySelector<HTMLSelectElement>(
          ".os-explorer-controls select",
        )?.value,
      },
    });
  }, [route, locale, children, register]);
  return ready ? null : (
    <div ref={initialDocument} className="os-app-bridge">
      {children}
    </div>
  );
}
