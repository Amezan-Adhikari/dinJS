# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] — v4.0.0

### Planned

- Optimized O(1)/O(log n) date math via precomputed cumulative day tables (no day-by-day loops)
- Immutable API — `DinDate` class with `add()` / `subtract()` returning new instances
- Full time support — hours, minutes, seconds, milliseconds
- Nepal timezone (`Asia/Kathmandu`, fixed UTC+05:45) as default for all civil date math
- Rich diff — `Duration` class with `as()`, `humanize()`, and adaptive `refreshIntervalMs()`
- `watchRelative()` helper for live UI countdowns (dayjs-inspired)
- `DinDate` Date-like getters (`getFullYear`, `getHours`, etc.) + BS accessors (`bsYear`, `bsMonth`, etc.)
- Format tokens for time: `HH`, `mm`, `ss`, `SSS`
- Deprecation warnings for v3 mutating methods (`addDays`, `subtractDays`, etc.)
- Full `d.ts` overloads and `package.json` exports map
- BS → AD conversion (was missing in v3)

### Known v3 bugs to fix in v4

| Bug | v3 behavior | v4 fix |
|-----|-------------|--------|
| AD→BS off-by-one | `new dinjs("2024-11-26")` returns `2081-08-11` (TZ rounding) | Use Nepal UTC offset for civil date |
| addDays off-by-one | `addDays(monthLength)` stays in same month instead of wrapping | O(1) dayIndex math |
| subtractDays off-by-one | `subtractDays(1)` from month start overshoots by 1 | O(1) dayIndex math |
| daysDifference off-by-one | Cross-month diffs return wrong count | dayIndex subtraction |
| Negative years ignore months/days | `addDate(-1, 2, 3)` only subtracts year | Unified sign handling |
| Month arithmetic fragile | `% 13` edge cases | Proper carry logic |
| Input mutation | All diff/add/sub functions mutate arguments | Immutable DinDate |

## [3.0.0] — Previous release

- Basic date arithmetic (add/subtract days, months, years)
- AD → BS conversion
- BS date parsing and formatting
- Date difference calculation
- Calendar data range: BS 2000–2089
