import { Duration } from "./duration";
import type { DinDate } from "../DinDate";

/**
 * Live-updating relative time display.
 *
 * Uses chained `setTimeout` (not fixed `setInterval`) with adaptive
 * `refreshIntervalMs` to avoid unnecessary ticks.
 *
 * @param target    The DinDate to watch
 * @param callback  Called with the humanized text and current Duration
 * @param options   `{ base, locale }` — base defaults to Date.now()
 * @returns         Cancel function (must call to avoid timer leaks)
 */
export function watchRelative(
  target: DinDate,
  callback: (text: string, duration: Duration) => void,
  options?: { base?: DinDate | (() => DinDate); locale?: "en" | "ne" }
): () => void {
  const locale = options?.locale ?? "en";
  let cancelled = false;
  let timerId: ReturnType<typeof setTimeout> | undefined;

  const getBase = (): DinDate => {
    if (options?.base) {
      return typeof options.base === "function" ? options.base() : options.base;
    }
    // Return a DinDate representing "now"
    return new (target.constructor as typeof DinDate)();
  };

  const tick = () => {
    if (cancelled) return;

    const now = getBase();
    const diffMs = target.valueOf() - now.valueOf();
    const duration = Duration.fromMs(diffMs);
    const text = duration.humanizeAgo(locale);

    callback(text, duration);

    const delay = Duration.nextDelay(diffMs);
    timerId = setTimeout(tick, delay);
  };

  // First tick is immediate
  tick();

  return () => {
    cancelled = true;
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
  };
}
