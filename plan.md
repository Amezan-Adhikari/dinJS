# DinJS v4 — Optimization & Modernization Plan

> Living implementation checklist. Follow phases in order. Check boxes as work completes.
> Last updated: 2026-07-25

---

## Goals

1. **Optimize** date arithmetic — eliminate day-by-day loops; use O(1)/O(log n) math.
2. **Preserve workflow** — existing v3 code keeps working via deprecated APIs.
3. **Date-like API** — `DinDate` with familiar Date getters, `toDate()`, `valueOf()`.
4. **Time accuracy** — hours, minutes, seconds, milliseconds.
5. **Nepal timezone** — default `Asia/Kathmandu` (fixed UTC+05:45, no DST).
6. **Rich diffs** — full duration (not just whole days) + adaptive relative timer.
7. **Caches** — precomputed tables + bounded format/parse caches.
8. **Ship as v4.0.0** — major version; immutable-first API.

---

## Locked product decisions

| Decision | Choice |
|----------|--------|
| Mutability | **Immutable** core (dayjs-style). Mutating v3 methods kept as `@deprecated` wrappers. |
| Primary type | **`DinDate`** — Date-like class + factory `dinjs()`. |
| Versioning | **v4.0.0** major release. |
| Default TZ | **Asia/Kathmandu** (`+05:45`). BS civil day = Nepal wall date. |
| Calendar range | BS **2000–2089** (data-driven; extend data later without API break). |

---

## Current state audit (v3)

### Package

- Name: `dinjs`, version string currently `"3.0"` (invalid semver → fix to `3.0.0` baseline then `4.0.0`).
- Build: `tsup` → CJS + ESM + DTS.
- No tests, no lint script, no typecheck script.

### Public surface today

```ts
class dinjs {
  dateInBS: string;
  DATE_FORMAT_STRING: string;
  DATE_OBJECT: { YEAR; MONTH; DATE };
  constructor(DATE?: string, FORMAT_STRING?: string, isInBS?: boolean);
  addDate(y, m, d): void;       // mutates
  addDays/Months/Years: void;   // mutates
  subtractDays/Months/Years: void;
  daysDifference(other): number;
}
```

### Performance problems

| Function | Approach | Cost |
|----------|----------|------|
| `dinjs_CONVERT_AD_TO_BS` | `while (DAYS_DIFF--)` day walk from 2000 BS | O(days from epoch) |
| `dinjs_DAYS_DIFFERENCE_BS` | day walk between two dates | O(\|Δdays\|) |
| `dinjs_ADD_DATE_BS` (days) | day walk | O(days) |
| `dinjs_SUB_DAYS_BS` | day walk | O(days) |
| Month lookup | Devanagari string keys every call | extra overhead |

### Correctness / design issues

- [ ] **Mutation of inputs**: `ADD_DATE_BS` and `DAYS_DIFFERENCE_BS` mutate caller objects (incl. swap in diff).
- [ ] **Negative years early return**: if `years < 0`, months/days ignored.
- [ ] **Month arithmetic**: `MONTH % 13` edge cases are fragile.
- [ ] **No BS → AD** conversion exported.
- [ ] **No time** fields.
- [ ] **Host timezone**: `new Date(y, m, d)` / `new Date("YYYY-MM-DD")` use local TZ → wrong BS near midnight outside Nepal.
- [ ] **No chaining**; methods return `void`.
- [ ] **Parse** only supports `YYYY`/`MM`/`DD` position via `indexOf` — brittle.
- [ ] Class name `dinjs` is lowercase (keep for compat; add `DinDate`).

### Data

- File: `src/data/nepaliCalenderData.ts`
- Years: 2000–2089 BS
- Reference: AD `1943-04-14` = BS `2000-01-01` (Baisakh 1)
- Months keyed by Nepali names (वैशाख … चैत)

---

## Design principles (v4)

1. **No day-loops in hot paths** — cumulative day tables + dayIndex.
2. **Store instants** — internal UTC epoch ms; derive Nepal wall + BS/AD fields.
3. **Immutable operations** — `add` / `subtract` / `set` return new instances.
4. **Date-like ergonomics** — getters mirror `Date` where sensible; BS accessors explicit.
5. **Deprecate, don’t delete** (in v4) — v3 names warn once; removal target v5.
6. **Caches where amortization wins** — prefer full precompute for calendar; LRU for format/parse.
7. **Test before optimize claims** — golden fixtures + exhaustive round-trips in range.

---

## Target public API

### Preferred (v4)

```ts
import { dinjs, DinDate, Duration, NEPAL_TZ, NEPAL_OFFSET_MS } from "dinjs";

// Factory (recommended)
const a = dinjs();                                      // now, Nepal TZ
const b = dinjs("2024-11-26 14:30", "YYYY-MM-DD HH:mm");
const c = dinjs("2081-08-10 09:15:00", "YYYY-MM-DD HH:mm:ss", { bs: true });
const d = dinjs(new Date());                            // from instant
const e = DinDate.from({
  year: 2081, month: 8, day: 10, hour: 9, minute: 15,
  calendar: "bs",
});

// Immutable arithmetic → DinDate
a.add(1, "day");
a.add(2, "hour");
a.subtract(30, "minute");
a.add({ years: 1, months: 2, days: 3, hours: 4 });

// Diff
a.diff(b);                    // Duration
a.diff(b, "day");             // number (float or trunc — document)
a.diff(b, "millisecond");

// Relative + timer
a.fromNow();                  // string
a.toNow();
a.from(b);
a.refreshIntervalMs(b);       // adaptive UI refresh
const stop = watchRelative(a, (text, duration) => { /* render */ });

// Format / convert
a.format("YYYY-MM-DD HH:mm:ss");
a.toDate();                   // native Date
a.valueOf();                  // utc ms
a.toISOString();
a.bs();                       // { year, month, day, hour, minute, second, ms }
a.ad();                       // AD wall in Nepal TZ (1-based month in object form)

// Date-like getters (AD wall in default TZ unless noted)
a.getTime();
a.getFullYear();              // AD year
a.getMonth();                 // AD month 0-based (Date compat)
a.getDate();
a.getDay();                   // weekday 0=Sun
a.getHours(); a.getMinutes(); a.getSeconds(); a.getMilliseconds();

// BS accessors (1-based month)
a.bsYear(); a.bsMonth(); a.bsDate();
a.monthName("ne" | "en");
```

### Deprecated (v3-compatible, still work)

```ts
const old = new dinjs("2081-08-10", "YYYY-MM-DD", true);
old.addDays(5);                 // mutates; @deprecated → .add(5, "day")
old.addMonths(1);
old.addYears(1);
old.addDate(1, 2, 3);
old.subtractDays(5);
old.subtractMonths(1);
old.subtractYears(1);
old.daysDifference(other);      // number of calendar days; @deprecated → .diff(other, "day")
old.dateInBS;                   // string getter retained
old.DATE_OBJECT;                // { YEAR, MONTH, DATE } retained
old.DATE_FORMAT_STRING;
```

### Return-type rules

| Operation | v3 | v4 |
|-----------|----|----|
| Arithmetic | `void` (mutate) | **`DinDate`** (new instance) |
| Diff full | N/A | **`Duration`** |
| Diff unit | `number` (days only) | **`number`** for any unit |
| String form | `dateInBS` field | **`.format()`**; `dateInBS` deprecated getter |
| Native Date | N/A | **`.toDate()`** |

---

## Architecture

### Proposed tree

```
src/
  index.ts                 # public exports
  types.ts                 # DateObj, DinDateInput, Unit, DurationJSON, ...
  constants.ts             # NEPAL_TZ, NEPAL_OFFSET_MS, epoch constants
  core/
    calendar-data.ts       # number[][] month lengths + meta (start/end year)
    cumulative.ts          # cumDaysBeforeYear, daysInYear, build tables
    day-index.ts           # bsToDayIndex, dayIndexToBs (O(1)/O(log n))
    convert-ad.ts          # AD civil (Nepal) ↔ dayIndex / utcMs
    time.ts                # wall Nepal ↔ utcMs; split/join date+time
    cache.ts               # LRU + optional prefilled maps
  duration/
    duration.ts            # Duration class
    relative.ts            # humanize, refreshIntervalMs
    watch.ts               # watchRelative helper
  parse/
    parse.ts               # token parser (date + time)
  format/
    format.ts              # token formatter
  DinDate.ts               # immutable main class
  dinjs.ts                 # factory + deprecated mutable class wrapper
  data/
    nepaliCalenderData.ts  # raw source (may be transformed at build or runtime once)
  legacy/
    v3-methods.ts          # thin deprecated wrappers if needed
```

### Internal model

```
DinDate {
  #utcMs: number           // source of truth (instant)
  #formatHint?: string     // last format string for dateInBS compat
  // lazily cached:
  #nepalParts?: WallParts  // y,m,d,h,mi,s,ms in +0545
  #bsParts?: BsParts       // BS y,m,d for that Nepal civil day
  #dayIndex?: number       // days since BS epoch date
}
```

### Epoch definition

| Anchor | Value |
|--------|-------|
| BS | 2000-01-01 (Baisakh 1), 00:00:00.000 |
| Nepal offset | `+05:45` = `(5 * 60 + 45) * 60 * 1000` ms |
| AD civil (Nepal) | 1943-04-14 00:00:00.000 +0545 |
| UTC ms | Compute once: `Date.UTC(1943, 3, 14, 0, 0, 0) - NEPAL_OFFSET_MS` **or** equivalent verified fixture |

> **Critical:** Never use `new Date("YYYY-MM-DD")` (UTC parse) or `new Date(y, m-1, d)` (host local) for BS civil math. Always apply Nepal offset explicitly.

### Optimized calendar math

**At module init (once):**

1. Convert month data to `daysInMonth: number[yearCount][12]`.
2. `daysInYear[i] = sum(daysInMonth[i])`.
3. `cumDaysBeforeYear[0] = 0`; `cumDaysBeforeYear[i+1] = cumDaysBeforeYear[i] + daysInYear[i]`.
4. Optional: `cumDaysBeforeMonth[i][m]` for O(1) BS→index.
5. Optional full arrays: `yearOfDay[]`, `monthOfDay[]`, `dateOfDay[]` (or packed `Uint16Array`) for O(1) index→BS.

**Operations:**

| Op | Method | Complexity |
|----|--------|------------|
| BS → dayIndex | cum year + cum month + (d-1) | O(1) |
| dayIndex → BS | binary search year + month scan **or** table lookup | O(log Y) or O(1) |
| add/sub days | dayIndex ± n → BS; keep time-of-day | O(1)/O(log) |
| diff days | dayIndexA - dayIndexB | O(1) |
| diff ms | utcMsA - utcMsB | O(1) |
| add months/years | field arithmetic + clamp day to month length | O(1) |
| AD (Nepal) ↔ dayIndex | civil day difference from reference | O(1) |

**Forbidden in production paths:** `while (days--)` style loops over each day.

### Time & timezone

- Default interpretation of date-only strings: **Nepal midnight**.
- Default “now”: `Date.now()` → Nepal wall → BS.
- Option bag: `{ bs?: boolean; timeZone?: "Asia/Kathmandu" | "UTC" | "local" }`.
  - BS calendar day always tied to **Nepal civil date** of the instant (document this).
  - `local` only affects parsing naive strings / display helpers if enabled.
- Units for `add`/`subtract`/`diff`:  
  `year | month | day | hour | minute | second | millisecond`.

### Duration

```ts
class Duration {
  readonly milliseconds: number; // signed total ms (source of truth for absolute)
  // breakdown helpers (absolute calendar vs clock — document):
  as(unit: Unit): number;
  // clock breakdown:
  readonly days: number;      // trunc toward 0 of ms / 86400000 for absolute mode
  readonly hours: number;     // remainder parts
  readonly minutes: number;
  readonly seconds: number;
  // optional calendar mode via DinDate.diff(other, unit, { calendar: true })
  humanize(locale?: "en" | "ne"): string;
  refreshIntervalMs(): number;
  toJSON(): object;
}
```

**Absolute vs calendar diff (document clearly):**

- Default `diff(other)` / `diff(other, 'hour')` → **exact time** from utcMs.
- `diff(other, 'day')` default = ms / 86400000 (or calendar-day index diff — **choose calendar-day index for 'day'** to match v3 `daysDifference` semantics for date-only; for datetime use start-of-day Nepal or exact — **decision: `diff(other, 'day')` uses Nepal calendar dayIndex difference** to preserve v3 meaning; `diff(other, 'millisecond'|'second'|...)` uses utcMs).

### Adaptive refresh policy (`refreshIntervalMs`)

Let `r = abs(remainingMs)`.

| Condition | Interval |
|-----------|----------|
| `r < 60_000` (under 1 min) | **1 second** |
| `r < 2 * 3_600_000` (under 2 hours) | **1 minute** |
| `r < 6 * 3_600_000` (under 6 hours) | **30 minutes** |
| `r < 12 * 3_600_000` (under 12 hours) | **1 hour** |
| `r < 24 * 3_600_000` (under 1 day) | **2 hours** |
| `r >= 1 day` | **1 day** |

**Threshold scheduling:** when computing next timeout, also cap by time until the next bucket boundary (e.g. crossing from 61s → 59s remaining should not wait a full minute). Same for the **1-day remaining** edge: fire at the transition into the last 24h.

```ts
function nextDelay(remainingMs: number): number {
  const abs = Math.abs(remainingMs);
  const bucket = bucketInterval(abs);
  const boundary = msUntilNextBucketBoundary(abs);
  return Math.max(100, Math.min(bucket, boundary)); // floor 100ms to avoid spin
}
```

### `watchRelative` (dayjs-inspired helper)

```ts
function watchRelative(
  target: DinDate,
  callback: (text: string, duration: Duration) => void,
  options?: { base?: DinDate | (() => DinDate); locale?: "en" | "ne" }
): () => void; // cancel
```

- Uses chained `setTimeout` (not fixed `setInterval`) with `refreshIntervalMs`.
- Recomputes from `Date.now()` each tick.
- Returns cancel function; must not leak timers.

### Caching strategy

| Layer | Strategy | Notes |
|-------|----------|-------|
| Calendar | **Full precompute** at init | Best correctness/perf; memory ≪ 1MB |
| BS ↔ dayIndex | Tables / cum sums | No LRU needed if full range encoded |
| `format` | LRU Map cap **256** | Key: `utcMs|pattern|calendarFlag` |
| `parse` | LRU Map cap **128** | Key: `input|pattern|bsFlag` |
| Month names | static const maps | ne + en |

Provide `DinDate.clearCache()` for tests.

### Deprecation matrix

| v3 API | v4 replacement | Compat behavior |
|--------|----------------|-----------------|
| `new dinjs(str, fmt, isBS)` | `dinjs(str, fmt, { bs })` | Still works |
| `addDays(n)` mutates | `.add(n, "day")` | Mutates + one-time warn |
| `addMonths` / `addYears` / `addDate` | `.add(...)` | same |
| `subtractDays` / Months / Years | `.subtract(...)` | same |
| `daysDifference(other)` | `.diff(other, "day")` | same numeric calendar-day semantics |
| `dateInBS` | `.format(...)` / `.bs()` | getter remains |
| `DATE_OBJECT` | `.toObject()` / `.bs()` | remains |
| `DATE_FORMAT_STRING` | stored format hint | remains |

Warnings: `console.warn` **once per process per API key** (guard map). JSDoc `@deprecated` on all legacy methods.

---

## Phased delivery

### Phase 0 — Repo hygiene & baseline ✅

**Intent:** Safe foundation before rewrites.

- [x] Add this file as `plan.md`.
- [x] Normalize version path: document current as 3.x; release target **4.0.0** (version set to `3.0.0`).
- [x] Add scripts in `package.json`:
  - [x] `"test": "vitest run"`
  - [x] `"test:watch": "vitest"`
  - [x] `"typecheck": "tsc --noEmit"`
  - [x] `"build": "tsup"`
- [x] Add devDependencies: `vitest`, keep `typescript`, `tsup`.
- [x] Add `vitest.config.mts` (`.mts` for CJS compat).
- [x] Add strict-enough `tsconfig.json` for src + tests.
- [x] **Golden tests** capturing current public behavior (even buggy) under `tests/golden/v3-compat.test.ts` — 21 tests, all passing.
- [x] Known bugs documented in CHANGELOG.md "Behavior changes in v4" section.
- [x] Updated `.gitignore` (coverage, dist, tgz).

**Exit criteria**

- [x] `npm run build` succeeds (CJS 51 KB + ESM 50 KB + DTS).
- [x] `npm test` runs — **21/21 passing**.
- [x] `npm run typecheck` succeeds (clean).

---

### Phase 1 — Data layer rewrite (internal) ✅

**Intent:** O(1)/O(log n) BS day index; bit-identical to brute force.

- [x] Introduce `daysInMonth: number[][]` (yearIndex × 12) — `src/core/calendar-data.ts`
- [x] Keep month name maps separately (`ne`, `en`) — `src/core/month-names.ts`
- [x] Implement `buildCumulative(data)` — `src/core/cumulative.ts`
- [x] Implement `bsToDayIndex(y, m, d)` — O(1) — `src/core/day-index.ts`
- [x] Implement `dayIndexToBs(index)` — O(log n) — `src/core/day-index.ts`
- [x] Implement brute-force oracle (test-only) — `tests/core/oracle.ts`
- [x] Exhaustive test: **every dayIndex** in range round-trips (32,850 BS dates tested)
- [x] Exhaustive test: oracle vs fast match for full range
- [x] Validate each year length ∈ [354–384] (BS years can be long)
- [x] Edge tests: `2000-01-01`, last day of 2089, month boundaries
- [x] Bench script — `scripts/bench-convert.js`

**Exit criteria**

- [x] 100% match vs oracle for full range — **32,917 tests pass**
- [x] No production dependency on Devanagari keys for math
- [x] Bench shows orders-of-magnitude speedup:
  - `bsToDayIndex` BS 2081: **55,822x faster** (6.3s → 0.1ms per 100k)
  - `dayIndexToBs` index 32000: **3,082x faster** (5.6s → 1.8ms per 100k)

---

### Phase 2 — Timezone + time model ✅

**Intent:** Correct Nepal wall time; host-TZ independent.

- [x] Constants: `NEPAL_OFFSET_MS` = 20,700,000, `NEPAL_TZ` = "Asia/Kathmandu" — `src/core/time.ts`
- [x] `utcMsToNepalParts(utcMs)` → `{ y, m, d, h, mi, s, ms }` AD — O(1) Howard Hinnant algorithm
- [x] `nepalPartsToUtcMs(parts)` inverse — O(1)
- [x] Nepal civil date ↔ `dayIndex` via reference anchor (AD 1943-04-14 = BS 2000-01-01)
- [x] `utcMsToBsDateTime` / `bsDateTimeToUtcMs` — full BS date+time round-trip
- [x] Tests forced independent of machine TZ (all UTC ms based)
- [x] Midnight boundary tests ±1 min / ±1 ms
- [x] **20 known AD↔BS fixtures** at 00:00 and 12:00 Nepal (40 test cases)
- [x] Native Date preserves instant
- [x] Fixed offset verified (no DST: same +05:45 in Jan and Jul)

**Exit criteria**

- [x] **33,011 tests pass** (29 new in time.test.ts)
- [x] Typecheck clean
- [x] Build clean

---

### Phase 3 — `DinDate` immutable core ✅

**Intent:** Main class usable end-to-end without legacy.

- [x] `DinDate` class with private `#utcMs` + lazy caches (`#nepalParts`, `#bsParts`, `#dayIndex`) — `src/DinDate.ts`
- [x] Constructors: `new DinDate()`, `new DinDate(utcMs)`, `new DinDate(date)` + static `DinDate.from()` — supports both BS and AD calendar input
- [x] `dinjs()` factory function — `src/dinjs.ts`
- [x] `add(value, unit)` / `add(map)` / `subtract` → new DinDate instance (immutable)
- [x] Month/year add with **day clamp** to target BS month length
- [x] `set` helpers (year, month, day, hour, minute, second, ms) → new instance
- [x] `diff` → DiffResult (full) or number per unit (calendar-aware dayIndex for "day", BS field for "month"/"year")
- [x] `format` tokens: `YYYY YY MM DD HH mm ss SSS` + `[literals]`
- [x] `dinjs(str, format, { bs })` parse via `extractParts` (inverse of format)
- [x] `toDate`, `valueOf`, `toISOString`, `toString`, `toJSON`
- [x] Date-like getters: `getFullYear`, `getMonth` (0-based), `getDate`, `getDay`, `getHours/Minutes/Seconds/MS` — all Nepal wall time
- [x] BS accessors: `bsYear`, `bsMonth`, `bsDate`, `bsHour/Minute/Second/Ms`, `monthName("ne"|"en")`
- [x] Full decomposition: `bs()` → BsDateTime, `ad()` → NepaliParts (both return copies)
- [x] Range checks: invalid BS dates throw `RangeError`, invalid AD years throw `RangeError`
- [x] Immutable guarantee: all ops return new instance; original unchanged; bs()/ad() return copies

**Exit criteria**

- [x] Unit tests: 88 new tests in `tests/DinDate.test.ts` (parse/format/add/subtract/set/diff/time/round-trips/immutability)
- [x] `npm run typecheck` clean
- [x] `npm run build` clean (CJS + ESM + DTS)
- [x] No day-loops in `src/core` or `DinDate`

---

### Phase 4 — Duration, relative time, timer ✅

**Intent:** Product requirement for live updating UIs.

- [x] `Duration` class with `#ms` source of truth + clock breakdown (`days`, `hours`, `minutes`, `seconds`, `millisecondsPart`) — `src/duration/duration.ts`
- [x] `Duration.as(unit)` for unit conversion (ms/sec/min/hr/day)
- [x] `Duration.humanize()` English + Nepali strings, `humanizeAgo()` for past/future
- [x] `Duration.refreshIntervalMs()` adaptive policy (1s → 1m → 30m → 1h → 2h → 1d)
- [x] `Duration.nextDelay()` with bucket boundary capping (floor 100ms)
- [x] `Duration` arithmetic: `abs()`, `negate()`, `add()`, `subtract()`
- [x] `Duration` comparison: `lt()`, `lte()`, `gt()`, `gte()`, `eq()`
- [x] `Duration` factory: `fromMs()`, `fromSeconds()`, `fromMinutes()`, `fromHours()`, `fromDays()`
- [x] `Duration` serialization: `toJSON()`, `toString()`, `valueOf()`
- [x] `DinDate.diffNow()` / `diffNow(unit)` — returns Duration or number
- [x] `DinDate.fromNow()` / `DinDate.from(other)` — humanized relative strings
- [x] `DinDate.watchRelative()` — live-updating callback with cancel
- [x] `watchRelative()` standalone helper — chained setTimeout, cancel function — `src/duration/relative.ts`
- [x] Bucket boundary tests: 0ms, 59s, 61s, 2h+1s, 90min
- [x] Fake-timer tests: `vi.useFakeTimers` / `vi.advanceTimersByTime`
- [x] No runaway 0ms loops — floor 100ms in `nextDelay`

**Exit criteria**

- [x] Fake-timer tests green
- [x] `npm run typecheck` clean
- [x] `npm run build` clean (CJS + ESM + DTS)

---

### Phase 5 — Compatibility layer (`dinjs` v3 API)

**Intent:** Existing users keep working.

- [ ] `dinjs` factory function returning `DinDate`.
- [ ] `class dinjs` **or** dual export: prefer  
  - `function dinjs(...): DinDate`  
  - `class DinJS` deprecated alias if `new dinjs` must remain  
  - Support `new dinjs(...)` via constructable function pattern if required.
- [ ] Mutating methods update internal state on wrapper **or** reassign pattern documented.
  - Recommended: legacy class holds `{ current: DinDate }` and mutates by replacing `current`.
- [ ] `daysDifference` uses dayIndex; sign matches v3.
- [ ] Golden tests: README v3 snippets still pass.
- [ ] Once-only deprecation warnings.
- [ ] Export `DateObj` type expanded optionally with time fields (non-breaking add).

**Exit criteria**

- [ ] v3 golden suite green.
- [ ] v4 API suite green.
- [ ] Deprecation warnings tested (spy on `console.warn`).

---

### Phase 6 — Caching & performance pass

**Intent:** Fast path + stable memory.

- [ ] Prefer full dayIndex tables if bundle size acceptable; else cum+binary search.
- [ ] Format/parse LRU.
- [ ] `sideEffects` review for tree-shaking.
- [ ] Benchmarks recorded (construct, convert, add 10_000 days, diff, format):
  - [ ] Document numbers in `BENCHMARKS.md` or section below after run.
- [ ] Ensure init time acceptable (&lt; ~10–20ms typical desktop for precompute).
- [ ] Optional lazy init of heavy tables on first use (if startup matters).

**Exit criteria**

- [ ] No O(n day) loops remaining in `src/`.
- [ ] Benchmarks attached; convert p50 ≪ 0.1ms for in-range dates.
- [ ] Correctness suite still 100% after cache enable.

---

### Phase 7 — Types, build, package exports

**Intent:** Solid npm package.

- [ ] Complete overloads in `.d.ts` (factory, diff, add).
- [ ] `package.json`:
  - [ ] `"version": "4.0.0"`
  - [ ] `"exports"` map: import/require/types
  - [ ] `"files": ["dist"]` (+ LICENSE/README)
  - [ ] `"sideEffects": false` if true
- [ ] `tsup.config.ts`: entry, cjs, esm, dts, clean, target
- [ ] Verify `dist/index.d.ts` exports match README.
- [ ] `npm run typecheck && npm test && npm run build`
- [ ] `npm pack --dry-run` sanity.

**Exit criteria**

- [ ] Clean publishable tarball contents.
- [ ] Types work from a sample consumer project (optional `examples/`).

---

### Phase 8 — Docs & release

**Intent:** Users can migrate confidently.

- [ ] README rewrite:
  - [ ] Install, quick start v4
  - [ ] Time & timezone section
  - [ ] Format tokens table (date + time)
  - [ ] Diff & relative timer
  - [ ] Migration from v3
  - [ ] Range & limitations
- [ ] CHANGELOG.md (`## 4.0.0`)
- [ ] Deprecation table published
- [ ] Example: relative ticker
- [ ] Tag `v4.0.0` and publish to npm (when ready)
- [ ] GitHub release notes

**Exit criteria**

- [ ] Docs match implemented API.
- [ ] Migration path clear for every v3 method.

---

## Correctness fixtures (mandatory tests)

- [ ] Reference: AD 1943-04-14 ↔ BS 2000-01-01 (Nepal).
- [ ] ≥ 20 known AD↔BS pairs spanning 2000–2089.
- [ ] ∀ dayIndex in range: `toBs(toIndex(bs)) == bs`.
- [ ] Round-trip AD Nepal midnight → BS → AD date.
- [ ] Diff symmetry: `a.diff(b, u) == -b.diff(a, u)` for units.
- [ ] Add inverse: `d.add(n,u).subtract(n,u)` equals `d` (time units exact; month/year clamp cases listed).
- [ ] TZ fixture: e.g. `2024-06-01T18:20:00.000Z` ↔ Nepal `2024-06-01 23:05:00`.
- [ ] Near midnight Nepal does not flip BS date incorrectly.
- [ ] Month-end clamp: 32-day month → shorter month on add months.
- [ ] Out-of-range throws.
- [ ] Invalid parse throws.
- [ ] Legacy golden paths.
- [ ] `watchRelative` cancel stops further callbacks.

---

## Per-PR verification checklist

Copy into PRs:

- [ ] Types accurate; `npm run typecheck`
- [ ] Tests green; `npm test`
- [ ] Build green; `npm run build`
- [ ] No new day-by-day loops in hot path
- [ ] Core functions do not mutate inputs
- [ ] Deprecated paths still work if touched
- [ ] README/plan updated if API changed
- [ ] Benchmarks if perf-sensitive change

---

## Risk register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users rely on mutation | Break chains of local vars | Legacy mutating wrappers + major version |
| Host TZ bugs | Wrong BS date | Fixed +0545 math; CI TZ-independent tests |
| Calendar data typos | Wrong conversions | Exhaustive round-trip + external fixture cross-check |
| Precompute bundle size | Heavier install | Typed arrays; lazy init; measure |
| Month/year clamp vs v3 bugs | Different results | Document in CHANGELOG; fixtures for new correct behavior |
| Invalid semver history | npm issues | Publish 4.0.0 cleanly; avoid `3.0` |
| Timer leaks in browsers | Memory | Always return cancel; document |

---

## Non-goals (v4)

- Full IANA timezone database / arbitrary zones beyond Kathmandu/UTC/local parse.
- Other calendar systems (Hijri, etc.).
- UI components (React/Vue wrappers).
- Server locale packs beyond en/ne month names + basic humanize.
- Removing deprecated APIs (defer to v5).

---

## Implementation order (when coding)

1. ~~Write `plan.md`~~ 
2. Phase 0 — tooling + golden tests  
3. Phase 1 — cumulative calendar / dayIndex  
4. Phase 2 — time + Nepal TZ  
5. Phase 3 — `DinDate`  
6. Phase 4 — Duration + relative timer  
7. Phase 5 — v3 compat layer  
8. Phase 6 — cache/perf  
9. Phase 7 — package/types  
10. Phase 8 — docs + release  

---

## Benchmark log (fill during Phase 6)

| Op | v3 (approx) | v4 (approx) | Notes |
|----|-------------|-------------|-------|
| AD→BS (today) | | | |
| diff 1 day | | | |
| diff 10 years | | | |
| add 10000 days | | | |
| format | | | |
| module init | | | |

---

## Open implementation notes (resolve during coding, not blockers)

1. **Constructable factory:** support both `dinjs()` and `new dinjs()` for DX — use dual pattern.
2. **`getMonth()` 0-based** for Date parity; **`month()` / `bsMonth()` 1-based** — document in README bold callout.
3. **Humanize locale ne:** can ship en in 4.0.0 and ne in 4.1 if time-boxed.
4. **Expand calendar range:** data-only change later; keep algorithms range-agnostic.
5. **Error type:** single `DinDateError` with `code` field (`OUT_OF_RANGE` | `INVALID_FORMAT` | …).

---

## Quick reference — format tokens (v4 target)

| Token | Meaning | Example |
|-------|---------|---------|
| YYYY | 4-digit year | 2081 |
| MM | month 2-digit | 08 |
| DD | day 2-digit | 10 |
| HH | hour 00–23 | 14 |
| mm | minute | 05 |
| ss | second | 09 |
| SSS | millisecond | 030 |

Delimiters: `-`, `/`, `:`, `T`, space, and other literals escaped as needed.

---

## Definition of done (v4.0.0)

- [ ] All phases 0–8 checkboxes complete (or explicitly deferred with reason).
- [ ] Exhaustive calendar round-trip tests pass.
- [ ] v3 golden compat passes.
- [ ] No day-loop converters in production code.
- [ ] Time + Nepal TZ documented and tested.
- [ ] `Duration` + `refreshIntervalMs` + `watchRelative` shipped.
- [ ] Types + dual CJS/ESM build publishable.
- [ ] README migration guide live.
- [ ] Version **4.0.0** tagged.

---

*End of plan. Execute phase by phase; check boxes as you go.*
