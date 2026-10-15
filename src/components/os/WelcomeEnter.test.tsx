import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  setWelcomeLoaderDuration,
  WELCOME_LOADER_MS,
  WelcomeEnter,
} from "./WelcomeEnter";

function renderEnter(onEnter = vi.fn()) {
  const view = render(
    <WelcomeEnter onEnter={onEnter}>Explore the lab</WelcomeEnter>,
  );
  return {
    onEnter,
    stage: view.container.querySelector<HTMLElement>(".os-enter-stage")!,
    button: screen.getByRole("button", { name: "Explore the lab" }),
    unmount: view.unmount,
  };
}

describe("WelcomeEnter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setWelcomeLoaderDuration(WELCOME_LOADER_MS);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows the button, not the loader, on arrival", () => {
    const { stage, button } = renderEnter();
    expect(stage).not.toHaveAttribute("data-loading");
    expect(button).not.toHaveAttribute("aria-busy");
    act(() => vi.advanceTimersByTime(WELCOME_LOADER_MS * 2));
    expect(stage).not.toHaveAttribute("data-loading");
  });

  it("turns into the loader on click and enters after three seconds", () => {
    const { stage, button, onEnter } = renderEnter();
    fireEvent.click(button);
    expect(stage).toHaveAttribute("data-loading");
    expect(button).toHaveAttribute("aria-busy", "true");
    act(() => vi.advanceTimersByTime(WELCOME_LOADER_MS - 1));
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(stage).not.toHaveAttribute("data-loading");
  });

  it("ignores repeated clicks while loading", () => {
    const { button, onEnter } = renderEnter();
    fireEvent.click(button);
    fireEvent.click(button);
    act(() => vi.advanceTimersByTime(WELCOME_LOADER_MS));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("does not enter after unmounting mid-load", () => {
    const { button, onEnter, unmount } = renderEnter();
    fireEvent.click(button);
    unmount();
    act(() => vi.advanceTimersByTime(WELCOME_LOADER_MS));
    expect(onEnter).not.toHaveBeenCalled();
  });

  it("gives each loader its own mask", () => {
    render(<WelcomeEnter onEnter={vi.fn()}>One</WelcomeEnter>);
    render(<WelcomeEnter onEnter={vi.fn()}>Two</WelcomeEnter>);
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
