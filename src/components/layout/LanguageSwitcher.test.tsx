import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { I18nProvider } from "@/i18n/provider";
import en from "@/i18n/locales/en";
import { LanguageSwitcher } from "./LanguageSwitcher";

vi.mock("next/navigation", () => ({ usePathname: () => "/projects" }));

function renderSwitcher() {
  return render(
    <I18nProvider locale="en" dictionary={en}>
      <LanguageSwitcher />
    </I18nProvider>,
  );
}

describe("language navigation disclosure", () => {
  it("uses ordinary links and returns focus to the toggle on Escape", () => {
    renderSwitcher();
    const toggle = screen.getByRole("button", { name: /select language/i });
    expect(toggle).not.toHaveAttribute("aria-haspopup", "menu");
    fireEvent.click(toggle);
    const navigation = screen.getByRole("navigation", {
      name: en.common.select_language,
    });
    expect(navigation.id).toBe(toggle.getAttribute("aria-controls"));
    const persian = within(navigation).getByRole("link", { name: "فارسی" });
    expect(persian).toHaveAttribute("href", "/fa/projects");
    persian.focus();
    fireEvent.keyDown(persian, { key: "Escape" });
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("closes when focus leaves the disclosure without moving the next focus", () => {
    const { container } = renderSwitcher();
    const toggle = screen.getByRole("button", { name: /select language/i });
    fireEvent.click(toggle);
    const outside = document.createElement("button");
    container.append(outside);
    const link = screen.getAllByRole("link")[0];
    link.focus();
    act(() => outside.focus());
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(outside).toHaveFocus();
  });

  it("gives simultaneous desktop and mobile instances distinct targets", () => {
    renderSwitcher();
    renderSwitcher();
    const toggles = screen.getAllByRole("button", { name: /select language/i });
    toggles.forEach((toggle) => fireEvent.click(toggle));
    const ids = toggles.map((toggle) => toggle.getAttribute("aria-controls"));
    expect(new Set(ids).size).toBe(2);
    ids.forEach((id) => expect(document.getElementById(id!)).toBeTruthy());
  });
});
