import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
const config = fs.readFileSync(new URL("./dashboard-config.js", import.meta.url), "utf8");
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
for (const row of data.stores) {
  const recomputed = Math.round(((
    row.growthScore * 0.25 + row.conversionScore * 0.20 +
    row.loanScore * 0.15 + row.tradeScore * 0.10 +
    row.revSqFtScore * 0.10 + row.riskScore * 0.10
  ) / 0.90) * 10) / 10;
  assert.ok(close(recomputed, row.reScore, 0.051), `Retail Excellence mismatch for ${row.store}`);
}

assert.ok(close(sum(data.stores, "wk13Revenue"), 377726825.96));
assert.ok(close(sum(data.stores, "wk1Revenue"), 324599908.46));
assert.ok(close(sum(data.arms, "wk13Revenue"), 377726825.96));
assert.ok(close(sum(data.arms, "wk1Revenue"), 324599908.46));
assert.ok(close(sum(data.stores, "wk13Footfall"), 138587));
assert.ok(close(sum(data.stores, "wk1Footfall"), 137108));
assert.ok(close(sum(data.stores, "wk13Invoices"), 8613));
assert.ok(close(sum(data.stores, "wk1Invoices"), 7849));

for (const text of [
  "Wk9 vs Wk8", "₹32.46 Cr", "₹37.77 Cr", "5.7%", "20.8%", "16.3%",
  "1,973", "590", "309", "235", "498",
  "Begumpet", "Abdul Khadeer", "69 store rows", "15 ARM rows"
]) assert.ok(html.includes(text), `missing dashboard evidence: ${text}`);
assert.ok(config.includes('source: "Validated weekly performance workbook"'));
assert.doesNotMatch(config, /\.xlsx/i);

assert.doesNotMatch(html, /Wk8 vs Wk7|Wk7 → Wk8|25 Aug 2026|20260825/);
assert.doesNotMatch(html, />Actual</);
for (const text of [
  "Retail Excellence — Score Mathematics",
  "Growth×25% + Conversion×20% + Loan×15% + Trade-in×10% + Productivity×10% + Risk×10%",
  "Wk8 overall loan attach ÷ 25% × 100",
  "Green = 100 · Amber = 65 · Red = 35"
]) assert.ok(html.includes(text), `missing Retail Excellence methodology: ${text}`);
assert.ok(html.includes("#boardroom .priority .actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}"));
console.log("Weekly Wk9 vs Wk8 data model validated: 69 stores, 15 ARMs");
