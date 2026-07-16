import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { I18nProvider } from "@/i18n/provider";
import en from "@/i18n/locales/en";

function renderFooter() {
  return render(
    <I18nProvider locale="en" dictionary={en}>
      <Footer />
    </I18nProvider>,
  );
}

describe("Footer", () => {
  it("renders social links", () => {
    renderFooter();
    expect(screen.getByLabelText("GitHub").closest("a")).toHaveAttribute(
      "href",
      "https://github.com/Raoof128",
    );
    expect(screen.getByLabelText("LinkedIn").closest("a")).toHaveAttribute(
      "href",
      "https://linkedin.com/in/mohammad-raouf-abedini-885a9226a",
    );
  });

  it("renders system status", () => {
    renderFooter();
    expect(screen.getByText("PROD-SYD")).toBeInTheDocument();
  });

  it("renders last index date", () => {
    renderFooter();
    expect(screen.getByText("JUL 2026")).toBeInTheDocument();
    expect(screen.getByText(/Last Index/i)).toBeInTheDocument();
  });

  it("has correct structure", () => {
    const { container } = renderFooter();
    expect(container.querySelector("footer")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderFooter();
    expect(screen.getByText("/projects").closest("a")).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByText("/resume").closest("a")).toHaveAttribute(
      "href",
      "/resume",
    );
  });

  it("renders copyright", () => {
    renderFooter();
    expect(
      screen.getByText(/© 2026 Mohammad Raouf Abedini/i),
    ).toBeInTheDocument();
  });
});
