/**
 * DinJS v4 Benchmarks
 *
 * Run: npm run bench
 */

// ── Helpers ─────────────────────────────────────────────────────

function bench(label, fn, iterations = 100_000) {
  // Warmup
  for (let i = 0; i < 1000; i++) fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const elapsed = performance.now() - start;

  const avgMs = elapsed / iterations;
  const opsPerSec = Math.round((iterations / elapsed) * 1000);
  const avgNs = Math.round(avgMs * 1_000_000);

  return { label, opsPerSec, avgNs };
}

function report(results) {
  console.log("");
  console.log("┌─────────────────────────────────────┬──────────────┬──────────┐");
  console.log("│ Operation                           │ ops/sec      │ avg ns   │");
  console.log("├─────────────────────────────────────┼──────────────┼──────────┤");
  for (const r of results) {
    const label = r.label.padEnd(35);
    const ops = String(r.opsPerSec).padStart(12);
    const ns = String(r.avgNs).padStart(8);
    console.log("│ " + label + " │ " + ops + " │ " + ns + " │");
  }
  console.log("└─────────────────────────────────────┴──────────────┴──────────┘");
  console.log("");
}

// ── Import the built dist ───────────────────────────────────────
const { DinDate, dinjs, Duration } = require("../dist/index.js");

// ── Benchmarks ──────────────────────────────────────────────────

const results = [];

// 1. Construction
results.push(bench("DinDate.from() BS", () => {
  DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
}));

results.push(bench("DinDate.from() AD", () => {
  DinDate.from({ year: 2024, month: 11, day: 26, calendar: "ad" });
}));

results.push(bench("new DinDate(utcMs)", () => {
  new DinDate(1700000000000);
}));

results.push(bench("dinjs() factory", () => {
  dinjs();
}));

// 2. BS ↔ AD conversion
results.push(bench("bsYear/bsMonth/bsDate", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.bsYear();
  d.bsMonth();
  d.bsDate();
}));

results.push(bench("dayIndex()", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.dayIndex();
}));

// 3. Arithmetic
results.push(bench("add(1, 'day')", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.add(1, "day");
}));

results.push(bench("add(1, 'month')", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.add(1, "month");
}));

results.push(bench("add(1, 'year')", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.add(1, "year");
}));

results.push(bench("subtract(100, 'day')", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.subtract(100, "day");
}));

// 4. Diff
results.push(bench("diff(other, 'day')", () => {
  const a = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  const b = DinDate.from({ year: 2081, month: 12, day: 25, calendar: "bs" });
  a.diff(b, "day");
}));

results.push(bench("diff(other) full", () => {
  const a = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  const b = DinDate.from({ year: 2081, month: 12, day: 25, calendar: "bs" });
  a.diff(b);
}));

// 5. Format
results.push(bench("format('YYYY-MM-DD')", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.format("YYYY-MM-DD");
}));

results.push(bench("format('BS-YYYY-MM-DD HH:mm:ss')", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, hour: 14, minute: 30, second: 45, calendar: "bs" });
  d.format("BS-YYYY-MM-DD HH:mm:ss");
}));

// 6. Getters
results.push(bench("getFullYear/getMonth/getDate", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.getFullYear();
  d.getMonth();
  d.getDate();
}));

// 7. Conversions
results.push(bench("toDate()", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.toDate();
}));

results.push(bench("valueOf()", () => {
  const d = DinDate.from({ year: 2081, month: 8, day: 11, calendar: "bs" });
  d.valueOf();
}));

// 8. Duration
results.push(bench("Duration.humanize()", () => {
  Duration.fromMs(90061001).humanize();
}));

results.push(bench("Duration.fromMs().as('hour')", () => {
  Duration.fromMs(90061001).as("hour");
}));

// 9. Batch: 10k days add
results.push(bench("add(10000, 'day')", () => {
  const d = DinDate.from({ year: 2000, month: 1, day: 1, calendar: "bs" });
  d.add(10000, "day");
}, 10_000));

// ── Output ──────────────────────────────────────────────────────

console.log("\nDinJS v4 Benchmarks");
console.log("===================");
console.log("Iterations per benchmark: 100,000 (batch: 10,000)\n");

report(results);
