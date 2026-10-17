import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AboutClient } from "./AboutClient";
import { I18nProvider } from "@/i18n/provider";
import en from "@/i18n/locales/en";

function renderAbout() {
  return render(
    <I18nProvider locale="en" dictionary={en}>
      <AboutClient />
    </I18nProvider>,
  );
}

describe("AboutClient", () => {
  it("renders stable About heading and profile image", () => {
    renderAbout();

    expect(
      screen.getByRole("heading", { name: /mohammad raouf abedini/i }),
    ).toBeInTheDocument();

    const image = screen.getByAltText("Mohammad Raouf Abedini");
    expect(image).toHaveAttribute(
      "src",
      "/images/raouf-about-600-7d22ea07.webp",
    );
  });

  it("walks the photo fallbacks and then shows the unavailable state", () => {
    renderAbout();

    fireEvent.error(screen.getByAltText("Mohammad Raouf Abedini"));
    expect(screen.getByAltText("Mohammad Raouf Abedini")).toHaveAttribute(
      "src",
      "/Raouf_2.jpg",
    );

    fireEvent.error(screen.getByAltText("Mohammad Raouf Abedini"));
    expect(screen.getByAltText("Mohammad Raouf Abedini")).toHaveAttribute(
      "src",
      "/Raouf_2.png",
    );

    fireEvent.error(screen.getByAltText("Mohammad Raouf Abedini"));

    expect(screen.getByText(en.about.photo_unavailable)).toBeInTheDocument();
    expect(screen.getByText("MRA")).toBeInTheDocument();
  });

  it("allows retry after fallback", () => {
    renderAbout();

    for (let i = 0; i < 3; i++) {
      fireEvent.error(screen.getByAltText("Mohammad Raouf Abedini"));
    }

    fireEvent.click(screen.getByRole("button", { name: en.about.retry_photo }));

    expect(screen.getByAltText("Mohammad Raouf Abedini")).toHaveAttribute(
      "src",
      "/images/raouf-about-600-7d22ea07.webp",
    );
  });
});
