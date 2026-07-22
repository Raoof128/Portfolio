import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { HeroVideo } from "./HeroVideo";
import { I18nProvider } from "@/i18n/provider";
import en from "@/i18n/locales/en";
import fa from "@/i18n/locales/fa";

type MediaOverrides = Record<string, boolean>;

/** Override the global matchMedia mock per-query for a single test. */
function mockMedia(overrides: MediaOverrides) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: overrides[query] ?? false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function renderHero(locale: "en" | "fa" = "en") {
  const dict = locale === "fa" ? fa : en;
  return render(
    <I18nProvider locale={locale} dictionary={dict}>
      <HeroVideo />
    </I18nProvider>,
  );
}

function enableDeferredVideo() {
  act(() => {
    window.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(1200);
  });
}

afterEach(() => {
  mockMedia({});
  vi.useRealTimers();
});

describe("HeroVideo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("is hidden from assistive technology", () => {
    const { container } = renderHero();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("paints the landscape poster (avif + jpg) beneath the video", () => {
    const { container } = renderHero();
    const source = container.querySelector('source[type="image/avif"]');
    expect(source).toHaveAttribute(
      "srcset",
      "/hero-verification-desktop-poster.avif",
    );
    const img = container.querySelector("picture img");
    expect(img).toHaveAttribute("src", "/hero-verification-desktop-poster.jpg");
  });

  it("selects landscape video sources by default", () => {
    const { container } = renderHero();
    enableDeferredVideo();
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("loop");
    expect(
      container.querySelector('video source[type="video/webm"]'),
    ).toHaveAttribute("src", "/hero-verification-desktop.webm");
    expect(
      container.querySelector('video source[type="video/mp4"]'),
    ).toHaveAttribute("src", "/hero-verification-desktop.mp4");
  });

  it("selects the native portrait assets in portrait orientation", () => {
    mockMedia({ "(orientation: portrait)": true });
    const { container } = renderHero();
    enableDeferredVideo();
    expect(
      container.querySelector('video source[type="video/webm"]'),
    ).toHaveAttribute("src", "/hero-verification-mobile.webm");
    expect(
      container.querySelector('source[type="image/avif"]'),
    ).toHaveAttribute("srcset", "/hero-verification-mobile-poster.avif");
  });

  it("renders only one video element (single download/decoder)", () => {
    const { container } = renderHero();
    enableDeferredVideo();
    expect(container.querySelectorAll("video")).toHaveLength(1);
  });

  it("defers decorative video until after the initial load window", () => {
    const { container } = renderHero();
    expect(container.querySelector("video")).toBeNull();
    enableDeferredVideo();
    expect(container.querySelector("video")).not.toBeNull();
    expect(container.querySelector("video")).not.toHaveAttribute("poster");
    expect(container.querySelector("video")).toHaveAttribute(
      "preload",
      "metadata",
    );
  });

  it("never mounts the video under prefers-reduced-motion (poster only)", () => {
    mockMedia({ "(prefers-reduced-motion: reduce)": true });
    const { container } = renderHero();
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("picture img")).not.toBeNull();
  });

  it("mirrors the cinematic layer for RTL locales", () => {
    const { container } = renderHero("fa");
    const mirrored = container.querySelector('[style*="scaleX(-1)"]');
    expect(mirrored).not.toBeNull();
  });

  it("does not mirror for LTR locales", () => {
    const { container } = renderHero("en");
    expect(container.querySelector('[style*="scaleX(-1)"]')).toBeNull();
  });
});
