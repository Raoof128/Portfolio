import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  resetWelcomeLoader,
  WELCOME_LOADER_MS,
  WelcomeEnter,
} from "./WelcomeEnter";

function stage() {
  return render(
    <WelcomeEnter>
      <button type="button">Explore the lab</button>
    </WelcomeEnter>,
  ).container.querySelector<HTMLElement>(".os-enter-stage")!;
}

describe("WelcomeEnter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetWelcomeLoader();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("plays the loader for three seconds, then reveals the button", () => {
    const element = stage();
    expect(element).toHaveAttribute("data-loading");
    act(() => vi.advanceTimersByTime(WELCOME_LOADER_MS - 1));
    expect(element).toHaveAttribute("data-loading");
    act(() => vi.advanceTimersByTime(1));
    expect(element).not.toHaveAttribute("data-loading");
  });

  it("keeps the button reachable while the loader plays", () => {
    stage();
    expect(
      screen.getByRole("button", { name: "Explore the lab" }),
    ).toBeEnabled();
    expect(document.querySelector(".os-welcome-loader")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("plays once per page load", () => {
    stage();
    act(() => vi.advanceTimersByTime(WELCOME_LOADER_MS));
    cleanup();
    expect(stage()).not.toHaveAttribute("data-loading");
  });

  it("gives each loader its own mask", () => {
    stage();
    stage();
    const masks = Array.from(document.querySelectorAll("mask")).map(
      (mask) => mask.id,
    );
    expect(new Set(masks).size).toBe(2);
    document
      .querySelectorAll<HTMLElement>(".os-welcome-loader-box")
      .forEach((box, index) =>
        expect(box.getAttribute("style")).toContain(`#${masks[index]}`),
      );
  });
});
