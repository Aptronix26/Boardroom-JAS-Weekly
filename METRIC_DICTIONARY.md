# Metric dictionary

| Metric | Standard definition |
|---|---|
| Achievement % | Actual ÷ Target × 100 |
| Remaining gap | Maximum of zero and Target − Actual |
| Required daily run rate | Remaining gap ÷ Remaining reporting days |
| Projected exit | Actual ÷ Elapsed reporting days × Total reporting days |
| Projected exit % | Projected exit ÷ Target × 100 |
| Growth % | (Current − Comparable) ÷ Comparable × 100 |
| Percentage-point change | (Current rate − Comparable rate) × 100 |
| Loan attach % | Eligible loan transactions ÷ Eligible sales transactions × 100 |
| Trade-in attach % | Eligible trade-in transactions ÷ Eligible sales transactions × 100 |
| Weekly revenue growth % | (Wk9 total revenue − Wk8 total revenue) ÷ Wk8 total revenue × 100 |
| Weighted network conversion % | Total invoices ÷ Total footfall × 100 |
| Revenue Growth score | MAX(0, MIN(100, 50 + Wk9-vs-Wk8 revenue growth × 200)) |
| Conversion Growth score | MAX(0, MIN(100, 50 + (Wk9 conversion − Wk8 conversion) × 1,000)) |
| Loan Attach score | MAX(0, MIN(100, Wk8 overall loan attach ÷ 25% × 100)) |
| Trade-in score | MAX(0, MIN(100, Wk8 iPhone trade-in attach ÷ 10% × 100)) |
| Revenue/Sq Ft score | MAX(0, MIN(100, Wk8 revenue/sq ft ÷ average Wk8 store revenue/sq ft × 100)) |
| Risk/RAG score | Green = 100; Amber = 65; Red = 35 |
| Retail Excellence score | ROUND((Revenue Growth score × 25% + Conversion score × 20% + Loan score × 15% + Trade-in score × 10% + Revenue/Sq Ft score × 10% + Risk score × 10%) ÷ 90%, 1) |

Zero denominators return `NA` rather than an artificial zero. Aggregate views should be calculated from summed numerators and denominators, not averages of store percentages. Attach Quality is excluded because its raw source is unavailable; therefore, active Retail Excellence weights total 90% and are normalized back to a 100-point scale.
