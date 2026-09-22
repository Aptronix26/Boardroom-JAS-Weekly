import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
const config = fs.readFileSync(new URL("./dashboard-config.js", import.meta.url), "utf8");
const hitsMisses = fs.readFileSync(new URL("./hits-misses.js", import.meta.url), "utf8");
const match = html.match(/const DATA=(.*);\nconst money/s);
assert.ok(match, "embedded weekly DATA model is required");
const data = JSON.parse(match[1]);
const sum = (rows, key) => rows.reduce((total, row) => total + Number(row[key] || 0), 0);
const close = (actual, expected, tolerance = 0.01) => Math.abs(actual - expected) <= tolerance;

assert.equal(data.stores.length, 69);
assert.equal(data.arms.length, 15);
assert.equal(new Set(data.stores.map(row => row.store)).size, 69);
assert.equal(new Set(data.arms.map(row => row.arm)).size, 15);
assert.ok(data.stores.every(row => data.arms.some(arm => arm.arm === row.arm)));
const cap = value => Math.max(0, Math.min(100, value));
const avgWk12Productivity = sum(data.stores, "wk1RevSqFt") / data.stores.length;
for (const row of data.stores) {
  assert.ok(close(row.growthScore, cap(50 + row.growth * 200), 1e-9), `Growth score mismatch for ${row.store}`);
  assert.ok(close(row.conversionScore, cap(50 + row.conversionChange * 1000), 1e-9), `Conversion score mismatch for ${row.store}`);
  assert.ok(close(row.loanScore, cap(row.wk1Loan / 0.25 * 100), 1e-9), `Wk12 loan score mismatch for ${row.store}`);
  assert.ok(close(row.tradeScore, cap(row.wk1Trade / 0.20 * 100), 1e-9), `Wk12 trade-in score mismatch for ${row.store}`);
  assert.ok(close(row.revSqFtScore, cap(row.wk1RevSqFt / avgWk12Productivity * 100), 1e-9), `Wk12 productivity score mismatch for ${row.store}`);
  const recomputed = Math.round(((
    row.growthScore * 0.25 + row.conversionScore * 0.15 +
    row.loanScore * 0.20 + row.tradeScore * 0.20 +
    row.revSqFtScore * 0.10 + row.riskScore * 0.10
  )) * 10) / 10;
  assert.ok(close(recomputed, row.reScore, 0.051), `Retail Excellence mismatch for ${row.store}`);
}
assert.deepEqual(data.stores.map(row => row.reRank).sort((a,b) => a-b), Array.from({length:69}, (_,i) => i+1));

assert.ok(close(sum(data.stores, "wk13Revenue"), 324846228.56));
assert.ok(close(sum(data.stores, "wk1Revenue"), 575419304.22));
assert.ok(close(sum(data.arms, "wk13Revenue"), 324846228.56));
assert.ok(close(sum(data.arms, "wk1Revenue"), 575419304.22));
assert.ok(close(sum(data.stores, "wk13Footfall"), 151884));
assert.ok(close(sum(data.stores, "wk1Footfall"), 190061));
assert.ok(close(sum(data.stores, "wk13Invoices"), 17094));
assert.ok(close(sum(data.stores, "wk1Invoices"), 22504));

for (const text of [
  "Wk12 vs Wk11", "₹57.54 Cr", "₹32.48 Cr", "11.8%", "4.0%", "15.1%",
  "3,326", "472", "274", "270", "687",
  "Begumpet", "Abdul Khadeer", "69 store rows", "15 ARM rows"
]) assert.ok(html.includes(text), `missing dashboard evidence: ${text}`);
assert.ok(config.includes('source: "Validated weekly performance workbook"'));
assert.doesNotMatch(config, /\.xlsx/i);

assert.doesNotMatch(html, /Wk11 vs Wk7|Wk7 → Wk11|25 Aug 2026|31 Aug 2026|20260825|20260907|\.xlsx/i);
assert.doesNotMatch(html, />Actual</);
assert.match(hitsMisses, /Wk12 vs Wk11/);
assert.doesNotMatch(hitsMisses, /Wk10|Wk9/);
for (const text of [
  "Retail Excellence — Score Mathematics",
  "Growth×25% + Conversion×15% + Loan×20% + Trade-in×20% + Productivity×10% + Risk×10%",
  "Wk12 overall loan attach ÷ 25% × 100",
  "Green = 100 · Amber = 65 · Red = 35"
]) assert.ok(html.includes(text), `missing Retail Excellence methodology: ${text}`);
assert.ok(html.includes("#boardroom .priority .actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}"));
console.log("Weekly Wk12 vs Wk11 data model validated: 69 stores, 15 ARMs");
