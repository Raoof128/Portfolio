import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SecureContactForm } from "./SecureContactForm";
import { I18nProvider } from "@/i18n/provider";
import en from "@/i18n/locales/en";

function renderForm() {
  return render(
    <I18nProvider locale="en" dictionary={en}>
      <SecureContactForm />
    </I18nProvider>,
  );
}

describe("SecureContactForm", () => {
  it("renders all required input fields", () => {
    renderForm();

    expect(screen.getByLabelText(/target_id \(name\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/return_path \(email\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/payload \(message\)/i)).toBeInTheDocument();
  });

  it("shows keylogging state while user is typing", () => {
    renderForm();

    fireEvent.keyDown(screen.getByLabelText(/target_id \(name\)/i), {
      key: "A",
    });
    expect(screen.getByText(/keylogging_active/i)).toBeInTheDocument();
  });

  it("shows a validation message for invalid email addresses", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/target_id \(name\)/i), {
      target: { value: "Raouf" },
    });
    fireEvent.change(screen.getByLabelText(/return_path \(email\)/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/payload \(message\)/i), {
      target: { value: "Hello from tests" },
    });

    const form = screen
      .getByRole("button", { name: /transmit/i })
      .closest("form");
    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);

    expect(screen.getByRole("alert")).toHaveTextContent(/valid email address/i);
  });
});
