import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SignalVortex } from "./SignalVortex";
import { TerminalCommand } from "./TerminalCommand";

const commands = ["git clone https://example.test/repo", "bash run.sh"];

describe("TerminalCommand", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("shows each command and copies them verbatim", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<TerminalCommand locale="en" commands={commands} />);
    expect(
      screen.getByRole("region", { name: "Reproduction commands" }),
    ).toHaveTextContent(commands[0]);
    expect(screen.getByText(commands[0])).toBeInTheDocument();
    expect(screen.getByText(commands[1])).toBeInTheDocument();
    await act(async () => {
      // The English label is title case per the ResearchOS spec, so the name changed.
      fireEvent.click(screen.getByRole("button", { name: "Copy Commands" }));
    });
    expect(writeText).toHaveBeenCalledWith(commands.join("\n"));
    expect(screen.getByRole("status")).toHaveTextContent("Commands copied");
  });

  it("explains how to copy when the clipboard is unavailable", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    render(<TerminalCommand locale="es" commands={commands} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copiar comandos" }));
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Selecciona los comandos para copiarlos",
    );
  });
});

describe("SignalVortex", () => {
  it("is decorative", () => {
    const { container } = render(<SignalVortex />);
    const vortex = container.querySelector(".signal-vortex");
    expect(vortex).toHaveAttribute("aria-hidden", "true");
    expect(vortex?.children).toHaveLength(21);
  });
});
