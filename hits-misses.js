(() => {
  const model = typeof DATA === 'undefined' ? null : DATA;
  if (!model?.stores?.length) return;
  const clean = value => String(value || '').replace(/^Aptronix\s+/i, '');
  const money = value => Math.abs(value) >= 1e7 ? `₹${(Math.abs(value) / 1e7).toFixed(2)} Cr` : `₹${(Math.abs(value) / 1e5).toFixed(1)} L`;
  const pct = value => `${(value * 100).toFixed(1)}%`;
  const pts = value => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)} pts`;
  const rows = model.stores.map(r => ({ ...r, delta: Number(r.wk1Revenue) - Number(r.wk13Revenue) }));
  const hits = rows.filter(r => r.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 5);
  const misses = rows.filter(r => r.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 5);
  const item = (r, i, hit) => {
    const conversion = r.conversionChange >= 0 ? `conversion improved ${pts(r.conversionChange)}` : `conversion softened ${pts(r.conversionChange)}`;
    const attach = r.wk1Loan >= .25 && r.wk1Trade >= .20
      ? `both loan (${pct(r.wk1Loan)}) and trade-in (${pct(r.wk1Trade)}) are above benchmark`
      : `${r.wk1Loan < .25 ? `loan is below its 25% benchmark at ${pct(r.wk1Loan)}` : `loan is above benchmark at ${pct(r.wk1Loan)}`}, while ${r.wk1Trade < .20 ? `trade-in is below its 20% benchmark at ${pct(r.wk1Trade)}` : `trade-in is above benchmark at ${pct(r.wk1Trade)}`}`;
    const lowBase = r.wk13Revenue < 5e5 ? ' The prior-week base was low, so the absolute value change is more reliable than the percentage.' : '';
    const reason = hit
      ? `Revenue added ${money(r.delta)} versus Wk8; ${conversion}. Commercial quality check: ${attach}.${lowBase}`
      : `Revenue lost ${money(r.delta)} versus Wk8; ${conversion}. Commercial quality check: ${attach}.${lowBase}`;
    const action = hit
      ? (r.conversionChange >= 0 ? 'Document the conversion practice and replicate it within the ARM while protecting attach quality.' : 'Protect the revenue gain, but repair conversion so the improvement is repeatable rather than value-led only.')
      : (r.conversionChange < 0 ? 'Run a store conversion recovery plan and deploy loan/trade-in offers at customer objection points.' : 'Traffic-to-sale execution is not the only issue; diagnose basket value and product mix, then close the attach gap.');
    return `<div class="hm-item"><div class="hm-rank">${i + 1}</div><div><div class="hm-title">${clean(r.store)} <small>· ${r.arm}</small></div><div class="hm-signal">Wk9 ${money(r.wk1Revenue)} · ${hit ? '+' : '−'}${money(r.delta)} vs Wk8</div><div class="hm-reason">${reason}</div><div class="hm-action"><b>Action:</b> ${action}</div></div></div>`;
  };
  const section = document.createElement('section');
  section.className = 'hm-section';
  section.innerHTML = `<div class="hm-head"><div><h2>Hits &amp; Misses — Weekly Comparison</h2><p>Stores ranked on absolute revenue contribution or leakage, then explained through conversion and commercial attach quality.</p></div><span class="hm-period">Wk9 vs Wk8</span></div><div class="hm-grid"><div class="hm-panel hm-hit"><div class="hm-panel-title">Hits — gains worth replicating</div><div class="hm-list">${hits.map((r, i) => item(r, i, true)).join('')}</div></div><div class="hm-panel hm-miss"><div class="hm-panel-title">Misses — leakage to recover</div><div class="hm-list">${misses.map((r, i) => item(r, i, false)).join('')}</div></div></div><div class="hm-note"><b>Method:</b> Rankings use absolute Wk9-versus-Wk8 revenue change so low-base percentages cannot dominate. Descriptions use conversion change, 25% loan attach and 20% trade-in benchmarks. These metrics identify likely operating signals; they do not prove causation.</div>`;
  const host = document.querySelector('#overview');
  const anchor = host?.querySelector('.bottom');
  if (anchor) anchor.before(section); else if (host) host.appendChild(section);
  globalThis.HITS_MISSES_MODEL = { period: 'Wk9 vs Wk8', hits, misses };
})();
