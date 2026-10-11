import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SimpleMarkdown } from "./SimpleMarkdown";

describe("markdown link boundary", () => {
  it.each([
    "javascript:alert%281%29",
    "JaVaScRiPt:alert%281%29",
    "java\tscript:alert%281%29",
    "data:text/html,payload",
    "vbscript:payload",
    "file:///private/key",
    "//attacker.invalid",
    "/\\attacker.invalid",
    "https:\\attacker.invalid",
    "https://trusted.example@attacker.invalid",
    "https://",
  ])("renders disallowed %s as inert text", (href) => {
    render(<SimpleMarkdown content={`[Read article](${href})`} />);
    expect(screen.getByText("Read article")).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it.each([
    ["https://example.org/paper?q=one%26two", true],
    ["HTTPS://example.org/paper", true],
    ["/projects/project-simurgh#overview", false],
    ["#references", false],
  ])("preserves approved destination %s", (href, external) => {
    render(<SimpleMarkdown content={`[Read article](${href})`} />);
    const link = screen.getByRole("link", { name: "Read article" });
    expect(link).toHaveAttribute("href", href);
    if (external) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    } else {
      expect(link).not.toHaveAttribute("target");
    }
  });
});

describe("localized markdown direction", () => {
  it("keeps RTL prose in its document direction while isolating exact code as LTR", () => {
    const content =
      "## بررسی نمونه\n\nمتن فارسی با `foo(bar)`\n\n```ts\nconst answer = 42;\n```\n\n> نقل‌قول\n\n| عنوان | مقدار |\n| --- | --- |\n| نمونه | 42 |";
    const { container } = render(
      <div dir="rtl">
        <SimpleMarkdown content={content} locale="fa" />
      </div>,
    );
    expect(
      screen.getByRole("heading", { name: "بررسی نمونه" }).closest("[dir]"),
    ).toHaveAttribute("dir", "rtl");
    expect(screen.getByText("foo(bar)")).toHaveAttribute("dir", "ltr");
    expect(container.querySelector("pre")?.closest("[dir]")).toHaveAttribute(
      "dir",
      "ltr",
    );
    expect(container.querySelector("pre")?.textContent).toBe(
      "const answer = 42;",
    );
    expect(screen.getByRole("columnheader", { name: "عنوان" })).toHaveClass(
      "text-start",
    );
    expect(container.querySelector("blockquote")).toHaveClass(
      "border-s-2",
      "ps-4",
    );
  });

  it("makes overflowing code and tables named keyboard focus targets", () => {
    render(
      <div lang="fa" dir="rtl">
        <SimpleMarkdown
          locale="fa"
          content={
            "```ts\nconst answer = 42;\n```\n\n| عنوان | مقدار |\n| --- | --- |\n| نمونه | 42 |"
          }
        />
      </div>,
    );

    const code = screen.getByRole("region", {
      name: "کد منبع · زبان اصلی · ۱ · ts",
    });
    const table = screen.getByRole("region", { name: "عنوان / مقدار · ۱" });
    for (const region of [code, table]) {
      expect(region).toHaveAttribute("tabindex", "0");
      region.focus();
      expect(region).toHaveFocus();
    }
    expect(code).toHaveAttribute("lang", "fa");
    expect(code.querySelector("pre")).toHaveAttribute("lang", "en");
    expect(code.querySelector("pre")).toHaveAttribute("dir", "ltr");
    expect(code.querySelector("pre")?.textContent).toBe("const answer = 42;");
  });

  it("distinguishes repeated code and table regions without changing source text", () => {
    render(
      <SimpleMarkdown
        locale="fa"
        content={
          "```ts\nconst first = 1;\n```\n\n```ts\nconst second = 2;\n```\n\n| عنوان | مقدار |\n| --- | --- |\n| یک | 1 |\n\n| عنوان | مقدار |\n| --- | --- |\n| دو | 2 |"
        }
      />,
    );
    const regions = screen.getAllByRole("region");
    const names = regions.map((region) => region.getAttribute("aria-label"));
    expect(new Set(names).size).toBe(4);
    expect(names).toEqual([
      "کد منبع · زبان اصلی · ۱ · ts",
      "کد منبع · زبان اصلی · ۲ · ts",
      "عنوان / مقدار · ۱",
      "عنوان / مقدار · ۲",
    ]);
    expect(regions[0].querySelector("code")).toHaveTextContent(
      "const first = 1;",
    );
    expect(regions[1].querySelector("code")).toHaveTextContent(
      "const second = 2;",
    );
    for (const region of regions)
      expect(region).toHaveAttribute("tabindex", "0");
  });
});
