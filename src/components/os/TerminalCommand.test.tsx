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
    vi.useRealTimers();
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
    expect(screen.getByRole("status")).not.toHaveClass("sr-only");
    expect(
      screen.getByRole("button", { name: "Commands copied" }),
    ).toBeInTheDocument();
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
    expect(screen.getByRole("status")).not.toHaveClass("sr-only");
  });

  it("keeps recovery instructions visible until another copy attempt", async () => {
    vi.useFakeTimers();
    const writeText = vi
      .fn()
      .mockRejectedValueOnce(new Error("denied"))
      .mockResolvedValueOnce(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<TerminalCommand locale="en" commands={commands} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy Commands" }));
    });
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Select the commands to copy them",
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy Commands" }));
    });
    expect(screen.getByRole("status")).toHaveTextContent("Commands copied");
    act(() => vi.advanceTimersByTime(2500));
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it.each([true, false])(
    "keeps the latest copy result when overlapping requests finish out of order (latest succeeds: %s)",
    async (latestSucceeds) => {
      vi.useFakeTimers();
      let finishFirst!: () => void;
      let finishLatest!: () => void;
      const writeText = vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise<void>((resolve, reject) => {
              finishFirst = () =>
                latestSucceeds ? reject(new Error("denied")) : resolve();
            }),
        )
        .mockImplementationOnce(
          () =>
            new Promise<void>((resolve, reject) => {
              finishLatest = () =>
                latestSucceeds ? resolve() : reject(new Error("denied"));
            }),
        );
      Object.assign(navigator, { clipboard: { writeText } });
      render(<TerminalCommand locale="en" commands={commands} />);
      const button = screen.getByRole("button", { name: "Copy Commands" });
      fireEvent.click(button);
      fireEvent.click(button);

      await act(async () => finishLatest());
      await act(async () => finishFirst());

      expect(screen.getByRole("status")).toHaveTextContent(
        latestSucceeds ? "Commands copied" : "Select the commands to copy them",
      );
      expect(vi.getTimerCount()).toBe(latestSucceeds ? 1 : 0);
    },
  );

  it("does not start a confirmation timer when a pending copy settles after unmount", async () => {
    vi.useFakeTimers();
    let finishCopy!: () => void;
    const writeText = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishCopy = resolve;
        }),
    );
    Object.assign(navigator, { clipboard: { writeText } });
    const { unmount } = render(
      <TerminalCommand locale="en" commands={commands} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Copy Commands" }));
    unmount();

    await act(async () => finishCopy());

    expect(vi.getTimerCount()).toBe(0);
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
