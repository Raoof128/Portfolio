import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AboutClient } from "./AboutClient";

describe("AboutClient", () => {
  it("renders stable About heading and profile image", () => {
    render(<AboutClient />);

    expect(
      screen.getByRole("heading", { name: /about me/i }),
    ).toBeInTheDocument();

    const image = screen.getByAltText("Mohammad Raouf Abedini");
    expect(image).toHaveAttribute("src", "/Portfolio/Raouf_2.jpg");
  });

  it("shows a fallback when photo fails to load", () => {
    render(<AboutClient />);

    const image = screen.getByAltText("Mohammad Raouf Abedini");
    fireEvent.error(image);

    expect(screen.getByText("PHOTO_UNAVAILABLE")).toBeInTheDocument();
    expect(screen.getByText("MRA")).toBeInTheDocument();
  });
});
