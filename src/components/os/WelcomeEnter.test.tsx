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

const status = "Opening the research desk";

function renderEnter(onEnter = vi.fn()) {
  const view = render(
    <WelcomeEnter onEnter={onEnter} status={status}>
      Explore the lab
    </WelcomeEnter>,
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

  it("shows the button, not the progress state, on arrival", () => {
    const { stage, button } = renderEnter();
    expect(stage).not.toHaveAttribute("data-loading");
    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    act(() => vi.advanceTimersByTime(WELCOME_LOADER_MS * 2));
    expect(stage).not.toHaveAttribute("data-loading");
  });

  it("disables the button, announces the status and enters after three seconds", () => {
    const { stage, button, onEnter } = renderEnter();
    fireEvent.click(button);
    expect(stage).toHaveAttribute("data-loading");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    // Focus moves to the polite status line because a disabled button drops focus.
    const statusLine = screen.getByRole("status");
    expect(statusLine).toHaveTextContent(status);
    expect(statusLine).toHaveFocus();
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

  it("fills a decorative hairline for the same duration as the wait", () => {
    // The retired mask-based blob loader had no equivalent here; this replaces its
    // per-instance mask test. The hairline is aria-hidden and sized from WELCOME_LOADER_MS.
    const { button } = renderEnter();
    fireEvent.click(button);
    const hairline = document.querySelector<HTMLElement>(".os-enter-progress")!;
    expect(hairline).toHaveAttribute("aria-hidden", "true");
    // animation-duration does not inherit, so the duration must sit on the animated span.
    const fill = hairline.querySelector<HTMLElement>("span")!;
    expect(fill.style.animationDuration).toBe(`${WELCOME_LOADER_MS}ms`);
  });
});
