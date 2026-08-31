globalThis.DASHBOARD_CONFIG = Object.freeze({
  id: "weekly-comparison",
  title: "Boardroom Intelligence — Weekly Comparison",
  reporting: Object.freeze({
    label: "Wk9 versus Wk8",
    currentPeriod: "Wk9",
    comparablePeriod: "Wk8",
    periodUnit: "week"
  }),
  governance: Object.freeze({
    source: "Validated weekly performance workbook",
    dataThrough: "Wk9",
    published: "31 Aug 2026",
    expectedStores: 69,
    expectedArms: 15
  }),
  benchmarks: Object.freeze({ loanAttachPct: 25, tradeInPct: 20 }),
  dataClassification: "Internal business reporting"
});
