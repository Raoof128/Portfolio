import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "@/i18n";
import {
  markWelcomeSeen,
  setWelcomeLoaderDuration,
  WELCOME_LOADER_MS,
  WelcomeEnter,
  welcomeSeenThisSession,
} from "./WelcomeEnter";

const status = "Opening the research desk";

function renderEnter(onEnter = vi.fn(), locale?: Locale) {
  const view = render(
    <WelcomeEnter onEnter={onEnter} status={status} locale={locale}>
      Explore the lab
    </WelcomeEnter>,
  );
  return {
    onEnter,
    stage: view.container.querySelector<HTMLElement>(".os-enter-stage")!,
    // The name is checked by its own test; here the orb is the only button.
    button: screen.getByRole("button"),
    unmount: view.unmount,
  };
}

describe("WelcomeEnter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setWelcomeLoaderDuration(WELCOME_LOADER_MS);
    window.sessionStorage.clear();
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

  it("disables repeat selection, announces the status and enters after three seconds", () => {
    const { stage, button, onEnter } = renderEnter();
    fireEvent.click(button);
    expect(stage).toHaveAttribute("data-loading");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    // Focus moves to the polite status line while selection is disabled.
    const statusLine = screen.getByRole("status");
    expect(statusLine).toHaveTextContent(status);
    expect(statusLine).toHaveFocus();
    act(() => vi.advanceTimersByTime(WELCOME_LOADER_MS - 1));
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(stage).not.toHaveAttribute("data-loading");
  });

  it("keeps the full three-second wait after repeated selection", () => {
    const { button, onEnter } = renderEnter();
    fireEvent.click(button);
    expect(onEnter).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2999));
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("keeps the full wait when Enter or Escape is pressed on the status line", () => {
    const { button, onEnter } = renderEnter();
    fireEvent.click(button);
    const statusLine = screen.getByRole("status");
    fireEvent.keyDown(statusLine, { key: "Escape" });
    fireEvent.keyDown(statusLine, { key: "Enter" });
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2999));
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys while the wait runs", () => {
    const { button, onEnter } = renderEnter();
    fireEvent.click(button);
    fireEvent.keyDown(screen.getByRole("status"), { key: "a" });
    fireEvent.keyDown(document.body, { key: " " });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it("keeps a three-second wait under reduced motion", () => {
    // One reduced-motion answer: enter() asks once. The shared matchMedia mock stays as it is.
    vi.mocked(window.matchMedia).mockImplementationOnce(
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          media: query,
        }) as unknown as MediaQueryList,
    );
    const { button, onEnter } = renderEnter();
    fireEvent.click(button);
    act(() => vi.advanceTimersByTime(600));
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2399));
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("keeps a three-second wait on a return within the same session", () => {
    markWelcomeSeen();
    expect(welcomeSeenThisSession()).toBe(true);
    const { button, onEnter } = renderEnter();
    fireEvent.click(button);
    act(() => vi.advanceTimersByTime(2999));
    expect(onEnter).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it.each<[Locale, string]>([
    ["en", "Enter workspace"],
    ["fa", "ورود به فضای کار"],
    ["ar", "ادخل مساحة العمل"],
    ["es", "Entrar al espacio de trabajo"],
    ["zh", "进入工作空间"],
  ])("names the %s orb with its visible workspace-entry caption", (locale, caption) => {
    renderEnter(vi.fn(), locale);
    expect(screen.getByText(caption)).toBeVisible();
    expect(
      screen.getByRole("button", { name: `${caption}: Explore the lab` }),
    ).toBeVisible();
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
