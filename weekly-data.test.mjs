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

assert.ok(close(sum(data.stores, "wk13Revenue"), 626057168.64));
assert.ok(close(sum(data.stores, "wk1Revenue"), 377726825.96));
assert.ok(close(sum(data.arms, "wk13Revenue"), 626057168.64));
assert.ok(close(sum(data.arms, "wk1Revenue"), 377726825.96));
assert.ok(close(sum(data.stores, "wk13Footfall"), 177449));
assert.ok(close(sum(data.stores, "wk1Footfall"), 135280));
assert.ok(close(sum(data.stores, "wk13Invoices"), 12049));
assert.ok(close(sum(data.stores, "wk1Invoices"), 8613));

for (const text of [
  "Wk8 vs Wk7", "₹37.77 Cr", "₹62.61 Cr", "6.4%", "21.1%", "19.8%",
  "2,450", "660", "309", "183", "432",
  "Begumpet", "Abdul Khadeer", "69 store rows", "15 ARM rows"
]) assert.ok(html.includes(text), `missing dashboard evidence: ${text}`);
assert.ok(config.includes("WOW Wk7 Wk8 Performance V2.xlsx"));

assert.doesNotMatch(html, /Wk7 vs Wk6|Wk6 → Wk7|20260822/);
console.log("Weekly Wk8 vs Wk7 data model validated: 69 stores, 15 ARMs");
