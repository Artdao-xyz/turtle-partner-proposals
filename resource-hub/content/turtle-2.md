---
title: "DEX vs Lending: Which Incentive Model Delivers Better Retention?"
subtitle: "A side-by-side comparison of liquidity mining campaigns versus lending incentives, with real retention data from Arbitrum STIP, LTIPP, and DRIP."
heroImage: "turtle-2.png"
category: "Comparisons"
publishedDate: "2026-02-25"
sources:
  - title: "Meta-Analysis on Incentive Programs"
    url: "https://blockworks.co"
    author: "Blockworks Research"
    year: "2024"
  - title: "Arbitrum LTIPP Efficacy Analysis"
    url: "https://openblocklabs.com"
    author: "OpenBlock Labs"
    year: "2024"
  - title: "DRIP Season 1 Launch Recap"
    url: "https://forum.arbitrum.foundation"
    author: "Arbitrum Governance Forum"
    year: "2025"
---

When protocol teams allocate incentive budgets, the first question is often: DEX liquidity mining or lending rewards? The answer matters. Lending protocols retain TVL at roughly 2–3x the rate of DEX campaigns, but the economics differ in ways that affect both cost and downstream revenue.

This comparison draws on Blockworks Research retroactive analyses of Arbitrum's STIP, LTIPP, and DRIP programs to quantify the gap.

---

## The Retention Gap

### DEX Liquidity Mining

DEX campaigns attract capital with high APY, but impermanent loss and yield-chasing behavior create a retention problem. Arbitrum LTIPP's DEX vertical saw 17% market-share growth during the program, translating to ~$38 of TVL per dollar spent at peak. Post-campaign, yield aggregators like Beefy and Yearn saw most of that TVL exit within weeks.

**90-day retained TVL per $1 spent: ~$2–3** for well-designed DEX campaigns. Poorly targeted programs fall below $1.

### Lending Incentives

Lending protocols benefit from stickier deposits. Arbitrum LTIPP's lending vertical achieved **$30.92 in added TVL** (market-share-adjusted) and **$12.08 in added borrows** per dollar spent. The distinction matters: borrow-side growth generates protocol revenue.

DRIP's shift to rewarding time-weighted borrow balances rather than passive deposits represents a structural improvement. Early results showed 20% increase in borrowing activity during the discovery phase.

**90-day retained supply TVL per $1 spent: ~$5–7** for lending. Borrow-side retention tends to be higher because utilization creates protocol dependency.

---

## Why Lending Retains Better

1. **No impermanent loss.** Depositors face minimal IL risk in lending markets. DEX LPs absorb volatility.
2. **Revenue alignment.** Borrow-side incentives grow protocol fees. DEX incentives grow volume, but fee capture is indirect.
3. **Curation models.** Morpho and Euler's curator-managed vaults showed deposits quadrupling as yields compressed, suggesting institutional-grade curation reduces perceived risk and increases stickiness.

---

## When DEX Campaigns Win

DEX incentives can outperform when:
- Pool selection is precise (Gauntlet's targeted Uniswap campaign: $259 volume per $1 spent)
- Liquidity serves existing demand rather than chasing APY
- Programs use tapered emissions instead of abrupt endings

---

## Bottom Line

| Metric | DEX | Lending |
| --- | --- | --- |
| Peak TVL per $1 spent | ~$12 | ~$15–20 |
| 90-day retained TVL per $1 spent | ~$2–3 | ~$5–7 |
| Revenue alignment | Indirect | Direct (borrows) |

For protocol teams: if the goal is retention and revenue, lending incentives offer better unit economics. If the goal is volume and market share, DEX campaigns can work—but budget for 3–5x the peak cost and expect the retention cliff.
