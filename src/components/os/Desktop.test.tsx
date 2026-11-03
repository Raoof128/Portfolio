import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Desktop } from "./Desktop";
import { getAtlasCopy } from "./atlas-copy";
import { getOSCopy } from "./os-copy";

describe("desktop window caption controls", () => {
  it("names both caption groups by their window and preserves hide/restore focus", async () => {
    render(<Desktop locale="en" role="Independent researcher" />);
    const title = getOSCopy("en").independentResearch;
    const atlas = getAtlasCopy("en").heading;
    for (const windowTitle of [title, atlas]) {
      for (const action of ["Minimise", "Full Size", "Close"]) {
        expect(
          await screen.findByRole("button", { name: `${action}: ${windowTitle}` }),
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
});
