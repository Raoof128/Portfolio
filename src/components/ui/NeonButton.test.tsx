import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NeonButton } from "./NeonButton";

describe("NeonButton", () => {
  it("renders with default primary variant", () => {
    render(<NeonButton href="/test">Test Button</NeonButton>);
    const link = screen.getByRole("link", { name: /test button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("renders with secondary variant", () => {
    render(
      <NeonButton href="/test" variant="secondary">
        Secondary
      </NeonButton>,
    );
    const link = screen.getByRole("link", { name: /secondary/i });
    expect(link).toBeInTheDocument();
  });

  it("renders with outline variant", () => {
    render(
      <NeonButton href="/test" variant="outline">
        Outline
      </NeonButton>,
    );
    const link = screen.getByRole("link", { name: /outline/i });
    expect(link).toBeInTheDocument();
  });

  it("supports external links", () => {
    render(
      <NeonButton href="https://example.com" external>
        External
      </NeonButton>,
    );
    const link = screen.getByRole("link", { name: /external/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("supports download attribute", () => {
    render(
      <NeonButton href="/resume.pdf" download>
        Download
      </NeonButton>,
    );
    const link = screen.getByRole("link", { name: /download/i });
    expect(link).toHaveAttribute("download");
  });

  it("applies custom className", () => {
    render(
      <NeonButton href="/test" className="custom-class">
        Custom
      </NeonButton>,
    );
    const link = screen.getByRole("link", { name: /custom/i });
    expect(link).toHaveClass("custom-class");
  });

  it("forwards shared attributes to the link renderings", () => {
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const { unmount } = render(
      <NeonButton
        href="/test"
        aria-label="Open test"
        title="Test title"
        onClick={onClick}
      >
        Internal
      </NeonButton>,
    );
    const internal = screen.getByRole("link", { name: "Open test" });
    expect(internal).toHaveAttribute("title", "Test title");
    fireEvent.click(internal);
    expect(onClick).toHaveBeenCalledTimes(1);
    unmount();

    render(
      <NeonButton
        href="https://example.com"
        external
        aria-label="Open external"
        onClick={onClick}
      >
        External
      </NeonButton>,
    );
    const external = screen.getByRole("link", { name: "Open external" });
    fireEvent.click(external);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("renders children correctly", () => {
    render(
      <NeonButton href="/test">
        <span data-testid="child">Child Content</span>
      </NeonButton>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
