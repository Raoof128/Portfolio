"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronsLeftRight,
  ChevronsUpDown,
  Grip,
  RotateCcw,
} from "lucide-react";
import type { Locale } from "@/i18n";
import type { WindowDelta } from "./window-geometry";
import { getWindowCopy } from "./window-copy";

export function ReadingWindowControls({
  locale,
  onMove,
  onResize,
  onReset,
  floating,
}: {
  locale: Locale;
  onMove: (delta: WindowDelta) => void;
  onResize: (delta: WindowDelta) => void;
  onReset: () => void;
  floating: boolean;
}) {
  const copy = getWindowCopy(locale);
  const menu = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [portalHost, setPortalHost] = useState<Element | null>(null);
  const [open, setOpen] = useState(false);
  const positionPanel = useCallback(() => {
    if (!menu.current?.open || !summary.current || !panel.current) return;
    const anchor = summary.current.getBoundingClientRect();
    const size = panel.current.getBoundingClientRect();
    // Keep all step controls above the dock even after moving/resizing the pane.
    panel.current.style.left = `${Math.max(12, Math.min(anchor.right - size.width, window.innerWidth - size.width - 12))}px`;
    panel.current.style.top = `${Math.max(64, Math.min(anchor.bottom + 9, window.innerHeight - 110 - size.height))}px`;
  }, []);
  useLayoutEffect(positionPanel);
  useLayoutEffect(() => {
    if (open)
      panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [open]);
  const close = (focus = true) => {
    if (menu.current) menu.current.open = false;
    setOpen(false);
    if (focus) summary.current?.focus();
  };

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menu.current?.contains(event.target) &&
        !panel.current?.contains(event.target)
      ) {
        if (menu.current) menu.current.open = false;
        setOpen(false);
      }
    };
    const onViewportChange = () => positionPanel();
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [positionPanel]);

  function keys(
    event: KeyboardEvent<HTMLElement>,
    operation: "move" | "resize",
  ) {
    if (event.defaultPrevented || event.nativeEvent.isComposing) return;
    const step = event.shiftKey ? 48 : 12;
    const directions: Record<string, WindowDelta> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const delta = directions[event.key];
    if (!delta || event.metaKey || event.ctrlKey || event.altKey) return;
    event.preventDefault();
    event.stopPropagation();
    (operation === "move" ? onMove : onResize)(delta);
  }

  return (
    <details
      className="os-window-controls"
      ref={menu}
      onToggle={(event) => {
        setPortalHost(event.currentTarget.closest(".os-shell"));
        setOpen(event.currentTarget.open);
      }}
      onKeyDown={(event) => {
        if (
          event.key === "Escape" &&
          menu.current?.open &&
          !event.nativeEvent.isComposing
        ) {
          event.preventDefault();
          event.stopPropagation();
          close();
        } else if (
          event.key === "Tab" &&
          menu.current?.open &&
          !event.nativeEvent.isComposing
        ) {
          const buttons = Array.from(
            panel.current?.querySelectorAll<HTMLButtonElement>(
              "button:not([disabled])",
            ) ?? [],
          );
          if (
            event.target === summary.current ||
            (event.shiftKey && event.target === buttons[0])
          ) {
            event.preventDefault();
            if (event.shiftKey) close();
            else buttons[0]?.focus();
          } else if (!event.shiftKey && event.target === buttons.at(-1)) {
            event.preventDefault();
            close(false);
            const next = menu.current.nextElementSibling;
            if (next instanceof HTMLElement) next.focus();
            else summary.current?.focus();
          }
        }
      }}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget) &&
          !panel.current?.contains(event.relatedTarget)
        ) {
          close(false);
        }
      }}
    >
      <summary
        className="os-control"
        aria-label={copy.windowControls}
        ref={summary}
      >
        <Grip aria-hidden="true" />
      </summary>
      {/* The glass titlebar establishes a fixed containing block. Keep this
          panel in the themed shell so viewport bounds and clipping stay valid. */}
      {open &&
        portalHost &&
        createPortal(
          <div className="os-window-controls-panel" ref={panel}>
            <fieldset
              aria-describedby="os-move-hint"
              onKeyDown={(event) => keys(event, "move")}
            >
              <legend>{copy.moveWindow}</legend>
              <p id="os-move-hint">{copy.moveHint}</p>
              <div
                className="os-window-step-controls"
                aria-describedby="os-move-hint"
              >
                <button
                  className="os-control"
                  aria-label={copy.moveLeft}
                  onClick={() => onMove({ x: -24, y: 0 })}
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
                <button
                  className="os-control"
                  aria-label={copy.moveUp}
                  onClick={() => onMove({ x: 0, y: -24 })}
                >
                  <ArrowUp aria-hidden="true" />
                </button>
                <button
                  className="os-control"
                  aria-label={copy.moveDown}
                  onClick={() => onMove({ x: 0, y: 24 })}
                >
                  <ArrowDown aria-hidden="true" />
                </button>
                <button
                  className="os-control"
                  aria-label={copy.moveRight}
                  onClick={() => onMove({ x: 24, y: 0 })}
                >
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </fieldset>
            <fieldset
              aria-describedby="os-resize-hint"
              onKeyDown={(event) => keys(event, "resize")}
            >
              <legend>{copy.resizeWindow}</legend>
              <p id="os-resize-hint">{copy.resizeHint}</p>
              <div
                className="os-window-step-controls"
                aria-describedby="os-resize-hint"
              >
                <button
                  className="os-control"
                  aria-label={copy.narrower}
                  onClick={() => onResize({ x: -24, y: 0 })}
                >
                  <ChevronsLeftRight aria-hidden="true" />
                  <span>−</span>
                </button>
                <button
                  className="os-control"
                  aria-label={copy.wider}
                  onClick={() => onResize({ x: 24, y: 0 })}
                >
                  <ChevronsLeftRight aria-hidden="true" />
                  <span>+</span>
                </button>
                <button
                  className="os-control"
                  aria-label={copy.shorter}
                  onClick={() => onResize({ x: 0, y: -24 })}
                >
                  <ChevronsUpDown aria-hidden="true" />
                  <span>−</span>
                </button>
                <button
                  className="os-control"
                  aria-label={copy.taller}
                  onClick={() => onResize({ x: 0, y: 24 })}
                >
                  <ChevronsUpDown aria-hidden="true" />
                  <span>+</span>
                </button>
              </div>
            </fieldset>
            <div className="os-window-controls-footer">
              <button
                className="os-control"
                disabled={!floating}
                onClick={() => {
                  close();
                  onReset();
                }}
              >
                <RotateCcw aria-hidden="true" />
                <span>{copy.resetPosition}</span>
              </button>
              <button className="os-control" onClick={() => close()}>
                <Check aria-hidden="true" />
                <span>{copy.done}</span>
              </button>
            </div>
          </div>,
          portalHost,
        )}
    </details>
  );
}
