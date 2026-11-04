import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { I18nProvider } from "@/i18n/provider";
import en from "@/i18n/locales/en";

// Mock usePathname
vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

function renderNavbar() {
  return render(
    <I18nProvider locale="en" dictionary={en}>
      <Navbar />
    </I18nProvider>,
  );
}

describe("Navbar", () => {
  it("renders logo with home link", () => {
    renderNavbar();
    const homeLink = screen.getByRole("link", { name: /raouf/i });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(screen.getByText("~/mohammad-raouf-abedini")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    renderNavbar();
    const navItems = [
      { name: /about/i, path: "/about" },
      { name: /projects/i, path: "/projects" },
      { name: /lab/i, path: "/lab" },
      { name: /write-ups/i, path: "/write-ups" },
      { name: /résumé/i, path: "/resume" },
    ];
    navItems.forEach((item) => {
      const links = screen.getAllByRole("link", { name: item.name });
      links.forEach((link) => expect(link).toHaveAttribute("href", item.path));
    });
  });

  it("renders contact button", () => {
    renderNavbar();
    const contactLink = screen.getAllByText(/contact/i)[0];
    expect(contactLink.closest("a")).toHaveAttribute("href", "/contact");
  });

  it("has mobile menu toggle button", () => {
    renderNavbar();
    const toggle = screen.getByLabelText(/open navigation menu/i);
    expect(toggle).toBeInTheDocument();
  });

  it("toggles mobile menu when button is clicked", () => {
    renderNavbar();
    const toggle = screen.getByLabelText(/open navigation menu/i);

    // Click to open
    fireEvent.click(toggle);
    expect(screen.getByLabelText(/close navigation menu/i)).toBeInTheDocument();

    // Click to close
    const closeToggle = screen.getByLabelText(/close navigation menu/i);
    fireEvent.click(closeToggle);
    expect(screen.getByLabelText(/open navigation menu/i)).toBeInTheDocument();
  });

  it("closes the mobile disclosure on Escape and restores its toggle", () => {
    renderNavbar();
    const toggle = screen.getByLabelText(/open navigation menu/i);
    fireEvent.click(toggle);
    const mobile = document.getElementById(
      toggle.getAttribute("aria-controls")!,
    )!;
    const link = mobile.querySelector("a")!;
    link.focus();
    fireEvent.keyDown(link, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("uses distinct language and mobile disclosure IDs across instances", () => {
    renderNavbar();
    renderNavbar();
    const toggles = screen.getAllByLabelText(/open navigation menu/i);
    toggles.forEach((toggle) => fireEvent.click(toggle));
    const languages = screen.getAllByRole("button", {
      name: /select language/i,
    });
    languages.forEach((toggle) => fireEvent.click(toggle));
    const ids = [...document.querySelectorAll("[id]")].map(
      (element) => element.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has correct ARIA attributes for accessibility", () => {
    renderNavbar();
    const toggle = screen.getByLabelText(/open navigation menu/i);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle.getAttribute("aria-controls")).toBeTruthy();
    fireEvent.click(toggle);
    expect(
      document.getElementById(toggle.getAttribute("aria-controls")!),
    ).toHaveAttribute("aria-label", en.nav.mobile_nav_label);
  });
});
