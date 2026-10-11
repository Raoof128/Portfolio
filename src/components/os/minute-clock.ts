const minute = 60_000;
const listeners = new Set<() => void>();
let snapshot: number | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

function stopTimer() {
  clearTimeout(timer);
  timer = undefined;
}

function update() {
  stopTimer();
  const now = Date.now();
  const next = Math.floor(now / minute) * minute;
  if (snapshot !== next) {
    snapshot = next;
    listeners.forEach((listener) => listener());
  }
  // Both displayed clocks share one minute-aligned timer. Background tabs
  // resume with the current time rather than replaying missed ticks.
  if (listeners.size && !document.hidden)
    timer = setTimeout(update, minute - (now % minute));
}

function visibilityChanged() {
  if (document.hidden) stopTimer();
  else update();
}

export function subscribeMinuteClock(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", visibilityChanged);
    update();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      stopTimer();
      document.removeEventListener("visibilitychange", visibilityChanged);
    }
  };
}

export const readMinuteClock = () => snapshot;
export const serverMinuteClock = () => null;
