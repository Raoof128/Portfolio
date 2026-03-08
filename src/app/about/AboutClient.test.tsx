import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AboutClient } from "./AboutClient";

describe("AboutClient", () => {
  it("renders stable About heading and profile image", () => {
    render(<AboutClient />);

    expect(
      screen.getByRole("heading", { name: /mohammad raouf abedini/i }),
    ).toBeInTheDocument();

    const image = screen.getByAltText("Mohammad Raouf Abedini");
    expect(image).toHaveAttribute("src", "/Raouf_2.jpg");
  });

  it("shows a fallback when photo fails to load", () => {
    render(<AboutClient />);

    const image = screen.getByAltText("Mohammad Raouf Abedini");
    fireEvent.error(image);

    const fallbackImage = screen.getByAltText("Mohammad Raouf Abedini");
    expect(fallbackImage).toHaveAttribute("src", "/Raouf_2.png");

    fireEvent.error(fallbackImage);

    expect(screen.getByText("PHOTO_UNAVAILABLE")).toBeInTheDocument();
    expect(screen.getByText("MRA")).toBeInTheDocument();
  });

  it("allows retry after fallback", () => {
    render(<AboutClient />);

    const image = screen.getByAltText("Mohammad Raouf Abedini");
    fireEvent.error(image);
    fireEvent.error(screen.getByAltText("Mohammad Raouf Abedini"));

    fireEvent.click(screen.getByRole("button", { name: "RETRY_PHOTO" }));

    expect(screen.getByAltText("Mohammad Raouf Abedini")).toHaveAttribute(
      "src",
      "/Raouf_2.jpg",
    );
  });
});
