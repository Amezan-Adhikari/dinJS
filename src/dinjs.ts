import { DinDate } from "./DinDate";

/**
 * Factory function — recommended way to create DinDate instances.
 *
 * Overloads:
 *   dinjs()                                       → now (Nepal TZ)
 *   dinjs(date: Date)                             → from native Date
 *   dinjs(utcMs: number)                          → from UTC ms
 *   dinjs(bsString, format, { bs: true })         → from BS string
 *   dinjs(adString, format)                       → from AD string
 */
export function dinjs(): DinDate;
export function dinjs(date: Date): DinDate;
export function dinjs(utcMs: number): DinDate;
export function dinjs(input: string, format?: string, options?: { bs?: boolean }): DinDate;
export function dinjs(
  input?: Date | number | string,
  format?: string,
  options?: { bs?: boolean }
): DinDate {
  if (input === undefined) {
    return new DinDate();
  }
  if (input instanceof Date) {
    return new DinDate(input);
  }
  if (typeof input === "number") {
    return new DinDate(input);
  }
  if (typeof input === "string") {
    return parseString(input, format || "YYYY-MM-DD", options?.bs ?? false);
  }
  throw new TypeError("Invalid arguments to dinjs()");
}

// ── String parsing ──────────────────────────────────────────────

function parseString(input: string, format: string, isBs: boolean): DinDate {
  const parts = extractParts(input, format);

  const year = parseInt(parts.YYYY ?? parts.YY ?? "0", 10);
  const month = parseInt(parts.MM ?? "1", 10);
  const day = parseInt(parts.DD ?? "1", 10);
  const hour = parseInt(parts.HH ?? "0", 10);
  const minute = parseInt(parts.mm ?? "0", 10);
  const second = parseInt(parts.ss ?? "0", 10);
  const ms = parseInt(parts.SSS ?? "0", 10);

  if (isBs) {
    return DinDate.from({ year, month, day, hour, minute, second, ms, calendar: "bs" });
  }
  return DinDate.from({ year, month, day, hour, minute, second, ms, calendar: "ad" });
}

function extractParts(input: string, format: string): Record<string, string> {
  const result: Record<string, string> = {};
  let fi = 0;
  let ii = 0;

  while (fi < format.length && ii < input.length) {
    if (format[fi] === "[") {
      const end = format.indexOf("]", fi);
      const literal = end === -1 ? format.slice(fi + 1) : format.slice(fi + 1, end);
      ii += literal.length;
      fi = end === -1 ? format.length : end + 1;
    } else if (format.slice(fi, fi + 4) === "YYYY") {
      result.YYYY = input.slice(ii, ii + 4);
      fi += 4;
      ii += 4;
    } else if (format.slice(fi, fi + 2) === "YY") {
      result.YY = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "MM") {
      result.MM = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "DD") {
      result.DD = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "HH") {
      result.HH = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "mm") {
      result.mm = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 2) === "ss") {
      result.ss = input.slice(ii, ii + 2);
      fi += 2;
      ii += 2;
    } else if (format.slice(fi, fi + 3) === "SSS") {
      result.SSS = input.slice(ii, ii + 3);
      fi += 3;
      ii += 3;
    } else {
      fi++;
      ii++;
    }
  }

  return result;
}
