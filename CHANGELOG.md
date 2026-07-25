# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] — 2026-07-25

### Added

- **`DinDate` immutable class** — Date-like API with private `#utcMs` source of truth
  - Constructors: `new DinDate()`, `new DinDate(utcMs)`, `new DinDate(date)`
  - Static: `DinDate.from({ year, month, day, calendar })` — BS or AD input
  - Factory: `dinjs()` function with 4 overloads
  - `add()` / `subtract()` — returns new DinDate (immutable)
  - `set()` — returns new DinDate
  - `diff()` — full DiffResult or per-unit number
  - `diffNow()` — Duration or number relative to now
  - `format()` — tokens YYYY/YY/MM/DD/HH/mm/ss/SSS + `[literals]`
  - Date-like getters: `getFullYear()`, `getMonth()`, `getDate()`, `getDay()`, `getHours()`, etc.
  - BS accessors: `bsYear()`, `bsMonth()`, `bsDate()`, `monthName()`, `bs()`, `ad()`
  - Conversions: `toDate()`, `valueOf()`, `toISOString()`, `toJSON()`
  - `dayIndex()` — internal BS epoch day count

- **`Duration` class** — signed millisecond duration
  - Clock breakdown: `days`, `hours`, `minutes`, `seconds`, `millisecondsPart`
  - `as(unit)` — convert to any time unit
  - `humanize()` / `humanizeAgo()` — English and Nepali strings
  - `refreshIntervalMs()` — adaptive refresh for live UIs
  - `nextDelay()` — boundary-capped scheduling
  - Arithmetic: `add()`, `subtract()`, `abs()`, `negate()`
  - Comparison: `lt()`, `lte()`, `gt()`, `gte()`, `eq()`
  - Factory: `fromMs()`, `fromSeconds()`, `fromMinutes()`, `fromHours()`, `fromDays()`

- **Relative time** — `fromNow()`, `from()`, `watchRelative()` on DinDate
  - `watchRelative()` — live-updating callback with cancel function

- **Nepal timezone** — fixed UTC+05:45 for all civil date math
  - `NEPAL_OFFSET_MS` (20,700,000 ms)
  - `NEPAL_TZ` ("Asia/Kathmandu")

- **BS ↔ AD conversion** — O(1)/O(log n) via precomputed cumulative tables
  - `bsToDayIndex()` / `dayIndexToBs()` — bidirectional
  - `nepalDateToDayIndex()` / `dayIndexToNepalDate()` — AD ↔ dayIndex
  - `utcMsToBsDateTime()` / `bsDateTimeToUtcMs()` — full date+time round-trip

- **Month names** — `getMonthNameNe()` / `getMonthNameEn()` (1-based)

- **LRU format cache** — 256-entry cache for repeated `format()` calls
  - `DinDate.clearCache()` static method for tests

- **Performance** — all core operations O(1) or O(log n)
  - No day-by-day loops in v4 code
  - Benchmarks: `DinDate.from()` 5.5M ops/sec, `add(10000, 'day')` 6.7M ops/sec

- **TypeScript** — full `.d.ts` overloads for factory, add, subtract, diff, diffNow
  - `sideEffects: false` for tree-shaking
  - `exports` map with types for import/require

- **Tests** — 33,143 tests passing
  - Exhaustive BS round-trip: 32,917 tests (every valid BS date in range)
  - Timezone: 29 tests (AD↔BS fixtures, midnight boundaries, TZ invariance)
  - DinDate: 88 tests (construction, arithmetic, diff, format, round-trips, immutability)
  - Duration: 61 tests (humanize, refresh, boundaries, fake timers)
  - v3 golden: 21 tests + 3 deprecation tests

### Changed

- **Major version bump** — v3 → v4 (breaking changes)
- Package version: `3.0.0` → `4.0.0`

### Fixed (v3 bugs resolved)

- AD→BS off-by-one: Nepal UTC offset used for civil date (no host TZ rounding)
- `addDays` off-by-one: O(1) dayIndex math wraps correctly at month boundaries
- `subtractDays` off-by-one: O(1) dayIndex math wraps correctly
- `daysDifference` off-by-one: dayIndex subtraction
- Negative years: unified sign handling in `add()`
- Month arithmetic: proper carry logic (no `% 13` fragility)
- Input mutation: all operations return new instances (immutable)

### Deprecated

- `new dinjs(str, fmt, isBS)` → use `dinjs(str, fmt, { bs: true })`
- `addDays()` / `subtractDays()` / `addMonths()` / `subtractMonths()` / `addYears()` / `subtractYears()` → use `.add(n, unit)` / `.subtract(n, unit)`
- `addDate(y, m, d)` → use `.add({ years, months, days })`
- `daysDifference(other)` → use `.diff(other, "day")`
- `dateInBS` → use `.format("BS-YYYY-MM-DD")`
- `DATE_OBJECT` → use `.bs()`
- `DATE_FORMAT_STRING` → not needed in v4

## [3.0.0] — Previous release

- Basic date arithmetic (add/subtract days, months, years)
- AD → BS conversion
- BS date parsing and formatting
- Date difference calculation
- Calendar data range: BS 2000–2089
