import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Desktop } from "./Desktop";
import { getAtlasCopy } from "./atlas-copy";
import { getOSCopy } from "./os-copy";
import { getReviewerCopy } from "./reviewer-copy";

describe("desktop window caption controls", () => {
  it.each([
    { ctrlKey: true },
    { metaKey: true },
    { altKey: true },
    { shiftKey: true },
    { isComposing: true },
  ])(
    "preserves native or composing Home input %j on desktop app links",
    (keys) => {
      const { container } = render(<Desktop locale="en" role="Researcher" />);
      const links = container.querySelectorAll<HTMLAnchorElement>(".os-app");
      const last = links[links.length - 1];
      act(() => last.focus());
      const event = new KeyboardEvent("keydown", {
        key: "Home",
        bubbles: true,
        cancelable: true,
        ...keys,
      });
      fireEvent(last, event);
      expect(event.defaultPrevented).toBe(false);
      expect(last).toHaveFocus();
    },
  );

  it("names both caption groups by their window and preserves hide/restore focus", async () => {
    render(<Desktop locale="en" role="Independent researcher" />);
    const title = getReviewerCopy("en").highlights;
    const atlas = getAtlasCopy("en").heading;
    for (const windowTitle of [title, atlas]) {
      for (const action of ["Minimise", "Full Size", "Close"]) {
        expect(
          await screen.findByRole("button", {
            name: `${action}: ${windowTitle}`,
          }),
        ).toBeVisible();
      }
    }
    fireEvent.click(screen.getByRole("button", { name: `Minimise: ${title}` }));
    const restore = screen.getByRole("button", {
      name: "Restore Window: Show intro",
    });
    expect(restore).toHaveFocus();
    fireEvent.click(restore);
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  });

  it.each(["en", "fa", "ar", "es", "zh"] as const)(
    "%s: exposes the reviewer actions as direct links without a welcome gate",
    (locale) => {
      render(<Desktop locale={locale} role="Independent researcher" />);
      const prefix = locale === "en" ? "" : `/${locale}`;
      expect(
        screen.getByRole("link", { name: getReviewerCopy(locale).explore }),
      ).toHaveAttribute("href", `${prefix}/projects`);
      expect(
        screen.getByRole("link", { name: getOSCopy(locale).viewResume }),
      ).toHaveAttribute("href", "/Mohammad_Raouf_Abedini_Resume.pdf");
      expect(
        screen.getByRole("link", { name: getOSCopy(locale).contact }),
      ).toHaveAttribute("href", `${prefix}/contact`);
    },
  );
});
