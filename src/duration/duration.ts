import type { Unit } from "../DinDate";

// ── Constants ───────────────────────────────────────────────────

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

// ── Duration class ──────────────────────────────────────────────

export class Duration {
  readonly #ms: number;

  constructor(ms: number) {
    this.#ms = ms;
  }

  // ── Source of truth ───────────────────────────────────────────

  /** Signed total milliseconds. */
  get milliseconds(): number {
    return this.#ms;
  }

  // ── Clock breakdown (trunc toward 0) ──────────────────────────

  /** Whole days (trunc toward 0). */
  get days(): number {
    return Math.trunc(this.#ms / MS_PER_DAY);
  }

  /** Whole hours (0–23 after days). */
  get hours(): number {
    const rem = Math.abs(this.#ms) - Math.abs(this.days) * MS_PER_DAY;
    return Math.trunc(rem / MS_PER_HOUR);
  }

  /** Whole minutes (0–59 after hours). */
  get minutes(): number {
    const rem = Math.abs(this.#ms) - Math.abs(this.days) * MS_PER_DAY - Math.abs(this.hours) * MS_PER_HOUR;
    return Math.trunc(rem / MS_PER_MINUTE);
  }

  /** Whole seconds (0–59 after minutes). */
  get seconds(): number {
    const rem = Math.abs(this.#ms) - Math.abs(this.days) * MS_PER_DAY - Math.abs(this.hours) * MS_PER_HOUR - Math.abs(this.minutes) * MS_PER_MINUTE;
    return Math.trunc(rem / MS_PER_SECOND);
  }

  /** Remaining milliseconds (0–999 after seconds). */
  get millisecondsPart(): number {
    const rem = Math.abs(this.#ms) - Math.abs(this.days) * MS_PER_DAY - Math.abs(this.hours) * MS_PER_HOUR - Math.abs(this.minutes) * MS_PER_MINUTE - Math.abs(this.seconds) * MS_PER_SECOND;
    return rem;
  }

  // ── Conversion ────────────────────────────────────────────────

  /** Convert to any unit. */
  as(unit: Unit): number {
    switch (unit) {
      case "millisecond": return this.#ms;
      case "second": return this.#ms / MS_PER_SECOND;
      case "minute": return this.#ms / MS_PER_MINUTE;
      case "hour": return this.#ms / MS_PER_HOUR;
      case "day": return this.#ms / MS_PER_DAY;
      default:
        throw new TypeError(`Cannot convert Duration to ${unit} (non-time unit)`);
    }
  }

  // ── Absolute value ────────────────────────────────────────────

  abs(): Duration {
    return new Duration(Math.abs(this.#ms));
  }

  // ── Negate ────────────────────────────────────────────────────

  negate(): Duration {
    return new Duration(-this.#ms);
  }

  // ── Add / subtract durations ──────────────────────────────────

  add(other: Duration): Duration {
    return new Duration(this.#ms + other.#ms);
  }

  subtract(other: Duration): Duration {
    return new Duration(this.#ms - other.#ms);
  }

  // ── Comparison ────────────────────────────────────────────────

  lt(other: Duration): boolean {
    return this.#ms < other.#ms;
  }

  lte(other: Duration): boolean {
    return this.#ms <= other.#ms;
  }

  gt(other: Duration): boolean {
    return this.#ms > other.#ms;
  }

  gte(other: Duration): boolean {
    return this.#ms >= other.#ms;
  }

  eq(other: Duration): boolean {
    return this.#ms === other.#ms;
  }

  // ── Humanize ──────────────────────────────────────────────────

  humanize(locale: "en" | "ne" = "en"): string {
    const abs = Math.abs(this.#ms);
    const sign = this.#ms < 0 ? -1 : this.#ms > 0 ? 1 : 0;

    if (abs < 45000) {
      return locale === "ne" ? "\u0915\u0947\u0939\u0940 \u0938\u0947\u0915\u0923\u094d\u0921" : "a few seconds";
    }
    if (abs < 90000) {
      return locale === "ne" ? "\u090f\u0915 \u092e\u093f\u0928\u091f" : "a minute";
    }
    if (abs < 45 * MS_PER_MINUTE) {
      const m = Math.round(abs / MS_PER_MINUTE);
      return locale === "ne"
        ? `${m} \u092e\u093f\u0928\u091f`
        : `${m} minutes`;
    }
    if (abs < 90 * MS_PER_MINUTE) {
      return locale === "ne" ? "\u090f\u0915 \u0918\u0923\u094d\u091f\u093e" : "an hour";
    }
    if (abs < 22 * MS_PER_HOUR) {
      const h = Math.round(abs / MS_PER_HOUR);
      return locale === "ne"
        ? `${h} \u0918\u0923\u094d\u091f\u093e`
        : `${h} hours`;
    }
    if (abs < 36 * MS_PER_HOUR) {
      return locale === "ne" ? "\u090f\u0915 \u0926\u093f\u0928" : "a day";
    }
    if (abs < 25 * MS_PER_DAY) {
      const d = Math.round(abs / MS_PER_DAY);
      return locale === "ne"
        ? `${d} \u0926\u093f\u0928`
        : `${d} days`;
    }
    if (abs < 31 * MS_PER_DAY) {
      return locale === "ne" ? "\u090f\u0915 \u092e\u0939\u0940\u0928\u093e" : "a month";
    }
    if (abs < 345 * MS_PER_DAY) {
      const mo = Math.round(abs / (30 * MS_PER_DAY));
      return locale === "ne"
        ? `${mo} \u092e\u0939\u0940\u0928\u093e`
        : `${mo} months`;
    }
    if (abs < 545 * MS_PER_DAY) {
      return locale === "ne" ? "\u090f\u0915 \u0935\u0930\u094d\u0937" : "a year";
    }
    const y = Math.round(abs / (365 * MS_PER_DAY));
    return locale === "ne"
      ? `${y} \u0935\u0930\u094d\u0937`
      : `${y} years`;
  }

  humanizeAgo(locale: "en" | "ne" = "en"): string {
    const h = this.humanize(locale);
    if (this.#ms === 0) return locale === "ne" ? "\u0905\u092d\u093f" : "just now";
    if (this.#ms < 0) {
      return locale === "ne" ? `${h} \u092a\u0939\u093f\u0932\u0947` : `${h} ago`;
    }
    return locale === "ne" ? `${h} \u092e\u093e` : `in ${h}`;
  }

  // ── Refresh interval ──────────────────────────────────────────

  /**
   * Adaptive refresh interval for live-updating UIs.
   * Returns milliseconds until the next update should fire.
   */
  refreshIntervalMs(): number {
    return Duration.refreshForRemaining(Math.abs(this.#ms));
  }

  static refreshForRemaining(absMs: number): number {
    if (absMs < 60_000) return 1_000;                    // under 1 min → every 1s
    if (absMs < 2 * MS_PER_HOUR) return 60_000;          // under 2 hours → every 1m
    if (absMs < 6 * MS_PER_HOUR) return 30 * 60_000;     // under 6 hours → every 30m
    if (absMs < 12 * MS_PER_HOUR) return MS_PER_HOUR;    // under 12 hours → every 1h
    if (absMs < 24 * MS_PER_HOUR) return 2 * MS_PER_HOUR; // under 1 day → every 2h
    return MS_PER_DAY;                                    // 1+ day → every 1 day
  }

  /**
   * Compute next delay, capped to the next bucket boundary.
   */
  static nextDelay(remainingMs: number): number {
    const abs = Math.abs(remainingMs);
    const bucket = Duration.refreshForRemaining(abs);
    const boundary = Duration.msUntilNextBucket(abs);
    return Math.max(100, Math.min(bucket, boundary)); // floor 100ms to avoid spin
  }

  private static msUntilNextBucket(absMs: number): number {
    if (absMs < 60_000) {
      // Under 1 min — next bucket boundary is at 0
      return absMs;
    }
    if (absMs < 2 * MS_PER_HOUR) {
      // Next boundary: under 1 min = 60_000
      return absMs - 60_000;
    }
    if (absMs < 6 * MS_PER_HOUR) {
      // Next boundary: under 2 hours = 2 * MS_PER_HOUR
      return absMs - 2 * MS_PER_HOUR;
    }
    if (absMs < 12 * MS_PER_HOUR) {
      // Next boundary: under 6 hours = 6 * MS_PER_HOUR
      return absMs - 6 * MS_PER_HOUR;
    }
    if (absMs < 24 * MS_PER_HOUR) {
      // Next boundary: under 12 hours = 12 * MS_PER_HOUR
      return absMs - 12 * MS_PER_HOUR;
    }
    // Next boundary: under 1 day = 24 * MS_PER_HOUR
    return absMs - 24 * MS_PER_HOUR;
  }

  // ── Serialization ─────────────────────────────────────────────

  toJSON(): { milliseconds: number; days: number; hours: number; minutes: number; seconds: number } {
    return {
      milliseconds: this.#ms,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
    };
  }

  toString(): string {
    return `Duration(${this.#ms}ms)`;
  }

  valueOf(): number {
    return this.#ms;
  }

  // ── Factory ───────────────────────────────────────────────────

  static fromMs(ms: number): Duration {
    return new Duration(ms);
  }

  static fromSeconds(s: number): Duration {
    return new Duration(s * MS_PER_SECOND);
  }

  static fromMinutes(m: number): Duration {
    return new Duration(m * MS_PER_MINUTE);
  }

  static fromHours(h: number): Duration {
    return new Duration(h * MS_PER_HOUR);
  }

  static fromDays(d: number): Duration {
    return new Duration(d * MS_PER_DAY);
  }
}
