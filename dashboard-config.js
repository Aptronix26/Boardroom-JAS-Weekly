globalThis.DASHBOARD_CONFIG = Object.freeze({
  id: "weekly-comparison",
  title: "Boardroom Intelligence — Weekly Comparison",
  reporting: Object.freeze({
    label: "Wk12 versus Wk11",
    currentPeriod: "Wk12",
    comparablePeriod: "Wk11",
    periodUnit: "week"
  }),
  governance: Object.freeze({
    source: "Validated weekly performance workbook",
    dataThrough: "Wk12",
    published: "21 Sep 2026",
    expectedStores: 69,
    expectedArms: 15
  }),
  benchmarks: Object.freeze({ loanAttachPct: 25, tradeInPct: 20 }),
  dataClassification: "Internal business reporting"
});
