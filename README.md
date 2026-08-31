# Boardroom Intelligence — Weekly Comparison

Standalone weekly comparison dashboard for Wk9 versus Wk8 performance, executive KPIs, store and ARM exploration, retail-excellence signals, and priority actions.

## Run and deploy

Open `index.html` locally, or publish the repository through **GitHub Settings → Pages → Deploy from a branch → main / root**.

## Validation

Run `npm test` with Node.js 18 or later.

## Data note

The dashboard is a static snapshot refreshed from the validated weekly performance workbook on 31 Aug 2026. It covers 69 stores and 15 ARMs. Store and ARM revenue reconcile to ₹32.46 Cr for Wk9 and ₹37.77 Cr for Wk8.

The workbook's 68-row mapping sheet omits Aptronix Begumpet. Its verified assignment to Abdul Khadeer from `Store Metrics Calc` is retained. Aggregate conversion, loan attach, and trade-in attach use weighted network numerators and denominators. 3P and Apple accessory attach rates remain excluded because the workbook does not include the Raw attach % sheet.

## Quality controls

- `dashboard-config.js` is the single reporting-period and benchmark contract.
- `retail-metrics.js` defines reusable growth, percentage-point, run-rate, projection, and reconciliation formulas.
- `METRIC_DICTIONARY.md` documents the standard business definitions.
- `npm test` validates both the HTML contract and the shared formula contract.
- `weekly-data.test.mjs` reconciles reporting periods, coverage, revenue, footfall, conversion, attachment rates, LOB units, and the documented mapping fallback.
- The responsive executive UI layer improves hierarchy, navigation, KPI cards, comparison tables, and accessible focus behavior without altering business logic.
