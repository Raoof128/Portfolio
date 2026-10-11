import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  readMinuteClock,
  serverMinuteClock,
  subscribeMinuteClock,
} from "./minute-clock";

describe("shared minute clock", () => {
  const unsubscribers: (() => void)[] = [];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-09T23:30:25Z"));
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  });

  afterEach(() => {
    unsubscribers.splice(0).forEach((unsubscribe) => unsubscribe());
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("shares one timer and updates only on minute boundaries", () => {
    const first = vi.fn();
    const second = vi.fn();
    unsubscribers.push(
      subscribeMinuteClock(first),
      subscribeMinuteClock(second),
    );
    expect(serverMinuteClock()).toBeNull();
    expect(readMinuteClock()).toBe(Date.parse("2026-10-09T23:30:00Z"));
    expect(vi.getTimerCount()).toBe(1);
    first.mockClear();
    second.mockClear();
    vi.advanceTimersByTime(34_999);
    expect(first).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(readMinuteClock()).toBe(Date.parse("2026-10-09T23:31:00Z"));
  });

  it("suspends in the background, catches up on return and cleans up", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeMinuteClock(listener);
    unsubscribers.push(unsubscribe);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(vi.getTimerCount()).toBe(0);
    listener.mockClear();
    vi.advanceTimersByTime(180_000);
    expect(listener).not.toHaveBeenCalled();
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(readMinuteClock()).toBe(Date.parse("2026-10-09T23:33:00Z"));
    expect(vi.getTimerCount()).toBe(1);
    unsubscribe();
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(60_000);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
