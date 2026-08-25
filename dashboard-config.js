globalThis.DASHBOARD_CONFIG = Object.freeze({
  id: "weekly-comparison",
  title: "Boardroom Intelligence — Weekly Comparison",
  reporting: Object.freeze({
    label: "Wk8 versus Wk7",
    currentPeriod: "Wk8",
    comparablePeriod: "Wk7",
    periodUnit: "week"
  }),
  governance: Object.freeze({
    source: "WOW Wk7 Wk8 Performance V2.xlsx",
    dataThrough: "Wk8",
    published: "25 Aug 2026",
    expectedStores: 69,
    expectedArms: 15
  }),
  benchmarks: Object.freeze({ loanAttachPct: 25, tradeInPct: 10 }),
  dataClassification: "Internal business reporting"
});
