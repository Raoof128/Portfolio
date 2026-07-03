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
    const homeLink = screen.getByLabelText(/home/i);
    expect(homeLink).toHaveAttribute("href", "/");
    expect(screen.getByText("~/mohammad-raouf-abedini")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    renderNavbar();
    const navItems = ["/about", "/projects", "/lab", "/write-ups", "/resume"];
    navItems.forEach((item) => {
      expect(screen.getAllByText(item)[0]).toBeInTheDocument();
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

  it("has correct ARIA attributes for accessibility", () => {
    renderNavbar();
    const toggle = screen.getByLabelText(/open navigation menu/i);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "mobile-menu");
  });
});
