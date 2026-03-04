---
title: "Cost-per-TVL Benchmarks: What DeFi Protocols Actually Pay for Liquidity"
subtitle: "An original research analysis of incentive efficiency across DeFi campaign types, with benchmark data protocol teams can use to evaluate their own spend."
heroImage: "turtle-1.png"
category: "Benchmark"
publishedDate: "2026-02-24"
sources:
  - title: "Arbitrum LTIPP Program Retro"
    url: "https://gauntlet.xyz"
    author: "Gauntlet"
    year: "2024"
  - title: "Results and Analysis: Uniswap Arbitrum Liquidity Mining Program"
    url: "https://gauntlet.xyz"
    author: "Gauntlet"
    year: "2024"
  - title: "Uniswap Liquidity Mining Analysis"
    url: "https://gauntlet.xyz"
    author: "Gauntlet"
    year: "2023"
  - title: "Meta-Analysis on Incentive Programs"
    url: "https://blockworks.co"
    author: "Blockworks Research"
    year: "2024"
  - title: "STIP Retroactive Analysis - Spot DEX TVL"
    url: "https://blockworks.co"
    author: "Blockworks Research"
    year: "2024"
  - title: "Arbitrum LTIPP Efficacy Analysis"
    url: "https://openblocklabs.com"
    author: "OpenBlock Labs"
    year: "2024"
  - title: "DRIP Season 1 Launch Recap and January 2025 Update"
    url: "https://forum.arbitrum.foundation"
    author: "Arbitrum Governance Forum"
    year: "2025"
  - title: "Why Royco's Pre-Deposit Vault Programs Fall Short in Creating Sustainable TVL for New Blockchains"
    url: "https://sentora.com"
    author: "Sentora (ADM)"
    year: "2025"
  - title: "Points Farming - Development, Significance and Controversies"
    url: "https://crypto.com"
    author: "Crypto.com Research"
    year: "2024"
  - title: "State of OP Mainnet Q4 2024"
    url: "https://messari.io"
    author: "Messari"
    year: "2025"
  - title: "State of the Superchain H2 2025"
    url: "https://messari.io"
    author: "Messari"
    year: "2025"
  - title: "Innovation Amid Yield Compression: DeFi Lending Markets in Q1 2025"
    url: "https://coindesk.com"
    author: "CoinDesk"
    year: "2025"
  - title: "State of DeFi 2025"
    url: "https://dlnews.com"
    author: "DL News"
    year: "2025"
  - title: "DefiLlama protocol and chain data"
    url: "https://defillama.com"
    author: "DefiLlama"
  - title: "2025 in Review: Merkl's Year of Consolidation and Growth"
    url: "https://merkl.xyz"
    author: "Merkl"
    year: "2025"
  - title: "DRIP program design documentation"
    author: "Entropy Advisors"
  - title: "Curve/Convex bribe efficiency analysis"
    author: "Magnus Capital"
---

DeFi protocols spent more than $500 million on liquidity incentives in 2024 alone. The number for 2025 is tracking higher. Yet when a protocol growth team sits down to plan its next campaign, there is no standardized answer to a basic question: what should a dollar of TVL cost?

Treasury managers approve multimillion-dollar incentive budgets based on vibes, competitive pressure, and whatever the last governance proposal said worked. There are no industry benchmarks. No median cost figures. No shared understanding of what "efficient" looks like across campaign types, protocol categories, or chain ecosystems.

This report attempts to fix that. Using publicly available data from DefiLlama, Dune Analytics, governance forum disclosures, Gauntlet and OpenBlock Labs retroactive analyses, and Blockworks Research advisory reports, we have assembled the first cross-category benchmark dataset for cost-per-TVL in DeFi. The goal is simple: give protocol operators real numbers they can use to evaluate whether their incentive spend is competitive, wasteful, or somewhere in between.

The findings are not comfortable. The median incentive dollar buys less TVL than most teams assume, retains it for a shorter period than most proposals promise, and decays faster than most governance forums acknowledge. But within the data, clear patterns separate efficient campaigns from expensive failures.

---

## Methodology: Defining Cost-per-TVL

### The Basic Formula

::callout
Cost per $1 TVL = Total Incentive Spend (USD) / Peak Incremental TVL (USD)

If a protocol distributes $1 million in token incentives and attracts $50 million in new deposits, the cost is $0.02 per dollar of TVL. Simple enough. But this number is almost useless in isolation. It tells you nothing about how long that TVL stayed, whether it was genuinely incremental, or whether it produced downstream value in volume, fees, or protocol revenue.

### The Market-Share-Adjusted Approach

The more rigorous methodology, pioneered by Gauntlet and adopted by Blockworks Research, adjusts for aggregate market movements. Rather than comparing raw TVL before and after a campaign, analysts establish a baseline by tracking a control set of non-incentivized pools during the same period. Incremental TVL is the change in market share multiplied by total market values. This neutralizes the effect of a rising or falling market inflating raw TVL numbers.

::source Gauntlet, "Arbitrum LTIPP Program Retro," 2024; Blockworks Research, "Meta-Analysis on Incentive Programs," 2024


### The Time Dimension

Cost-per-TVL requires a time horizon. We track three intervals:

- Cost per $1 TVL at peak -  measured at maximum campaign impact
- Cost per $1 TVL retained at 30 days post-campaign -  the first meaningful retention checkpoint
- Cost per $1 TVL retained at 90 days post-campaign -  the benchmark separating rented liquidity from structural gains

Throughout this report, figures represent market-share-adjusted incremental TVL unless noted otherwise.

### The Market-Share-Adjusted Approach

The more rigorous methodology, pioneered by Gauntlet and adopted by Blockworks Research, adjusts for aggregate market movements. Rather than comparing raw TVL before and after a campaign, analysts establish a baseline by tracking a control set of non-incentivized pools during the same period. Incremental TVL is the change in market share multiplied by total market values. This neutralizes the effect of a rising or falling market inflating raw TVL numbers.

::source Gauntlet, "Arbitrum LTIPP Program Retro," 2024; Blockworks Research, "Meta-Analysis on Incentive Programs," 2024


---

## Benchmark Data by Campaign Type

### 1. DEX Liquidity Mining Campaigns

DEX incentive programs are the most studied category, thanks to retroactive analyses conducted for Arbitrum's STIP and LTIPP programs.

**Arbitrum STIP - DEX Vertical (October 2023 - January 2024).** The Short-Term Incentive Program distributed 50 million ARB across the Arbitrum ecosystem, with no predefined success metrics and broad distribution across protocols. Blockworks Research's retroactive analysis of the DEX vertical found wide variance in efficiency:

- The most efficient protocol achieved $12 of TVL added per dollar spent.
- A second protocol matched at roughly $12 per dollar
- A third saw $7 per dollar
- The least efficient managed only $2 per dollar

The spread is instructive: a 6x difference in efficiency across protocols operating in the same ecosystem, during the same time period, competing for the same token. Pool selection and protocol design mattered more than the availability of incentives.

> [Source: Blockworks Research, "STIP Retroactive Analysis -- Spot DEX TVL," July 2024]
> 

**Arbitrum LTIPP -DEX Vertical (June - September 2024).** The longer-duration LTIPP program showed improved aggregate efficiency. DEX TVL market share increased 17%, translating to $102.6 million in market-share-adjusted added TVL. At a cost of approximately $2.66 million in incentives distributed to the DEX category, this equates to roughly $38.64 of TVL added per dollar spent during the active campaign period.

However, post-campaign retention told a different story. Yield farm aggregators like Beefy and Yearn, which showed impressive TVL growth during the program, saw most of that TVL exit after incentives ended. A series of large withdrawals at the end of LTIPP removed more USD value than the total amount added through the incentive program. The programs that retained TVL were those where incentivized liquidity served an existing demand -- not those that simply offered the highest APY.

> [Source: Blockworks Research, "Meta-Analysis on Incentive Programs," 2024; OpenBlock Labs, "Arbitrum LTIPP Efficacy Analysis," 2024]
> 

**Gauntlet's Uniswap Arbitrum Campaign (2024).** This targeted Uniswap V3 campaign produced the most detailed efficiency data available: $259 of volume added per $1 spent during the campaign, $119 maintained post-incentives, and $1.37 million in projected annual LP fee revenue retained. Gauntlet's earlier analysis of Uniswap liquidity mining on Optimism (2022-2023) found that only 2 of 5 incentivized pools demonstrated a sustained positive impact beyond the incentive period.

> [Source: Gauntlet, "Results and Analysis: Uniswap Arbitrum Liquidity Mining Program," 2024; Gauntlet, "Uniswap Liquidity Mining Analysis," 2023]
> 

**The Curve/Convex Bribe Market.** The Curve Wars produced one of the most transparent cost-per-TVL marketplaces in DeFi history. Through Votium, the benchmark ratio was approximately **$1 in bribes generating $4.15 in CRV emissions**. At scale this was expensive -- Frax spent $19.73 million on bribes in a two-month period -- but the efficiency was quantifiable and transparent.

> [Source: Magnus Capital analysis; Votium on-chain data]
> 

### DEX Category Summary:

| Metric | Range | Median Estimate |
| --- | --- | --- |
| Peak TVL per $1 spent | $2 – $39 | ~$12 |
| 30-day retained TVL per $1 spent | $1 – $15 | ~$4–6 |
| 90-day retained TVL per $1 spent | $0.50 – $8 | ~$2–3 |

### 2. Lending Protocol Incentives

**Arbitrum LTIPP - Lending Vertical.** Blockworks Research found **$30.92 in added TVL** (market-share-adjusted) and $12.08 in added borrows per dollar spent. The distinction matters: supply-side deposits are cheaper to attract but borrow-side growth generates protocol revenue.

> [Source: Blockworks Research, "Meta-Analysis on Incentive Programs," 2024]
> 

**Arbitrum DRIP - Season 1 (September 2025 - January 2026).** DRIP allocated up to 24 million ARB (~$12 million) to Aave, Morpho, Euler, Fluid, Dolomite, and Silo, with rewards based on time-weighted average borrow balances rather than passive deposits. Early results: 20% increase in borrowing activity during the discovery phase (15% of budget). The shift from rewarding deposits to rewarding utilization represents a structural improvement in targeting.

> [Source: Arbitrum Forum, "DRIP Season 1 Launch Recap"; Entropy Advisors]
> 

**Morpho and Euler - Curator-Managed Efficiency.** These protocols introduced curators (Gauntlet, MEV Capital, Steakhouse) who manage targeted vaults. By Q1 2025, curators managed nearly $750 million in TVL, generating ~$3 million in cumulative revenue. The largest stablecoin vaults showed 5-8% base yields with token rewards adding 1-4%. Even as yields compressed from 15% to under 5%, deposits in the largest vaults quadrupled from ~$4 billion to ~$15 billion, suggesting lending deposits become sticky when institutional-grade curation reduces perceived risk

> [Source: Morpho dashboard; DefiLlama; CoinDesk, "Innovation Amid Yield Compression: DeFi Lending Markets in Q1 2025"]
> 

**Lending Category Summary:**

| Metric | Range | Median Estimate |
| --- | --- | --- |
| Peak supply-side TVL per $1 spent | $8 – $31 | ~$15–20 |
| Peak borrow-side TVL per $1 spent | $5 – $12 | ~$8–10 |
| 90-day retained supply TVL per $1 spent | $2 – $10 | ~$5–7 |

### 3. L2 and Chain Ecosystem Programs

**Arbitrum** has committed 175 million ARB (~$150-200 million) across STIP, LTIPP, and DRIP (2023-2026). DeFi TVL peaked at $21 billion in December 2024 but settled around $3.5 billion by mid-2025. Sequencer revenue generated only $0.07 per $1 of incentive spend during LTIPP -- the DAO is subsidizing growth far beyond direct revenue capture.

**Optimism** distributed 20.4 million OP through Retro Funding in 2024, plus seasonal grants and airdrops. OP Mainnet's DeFi TVL declined 16.1% YoY to $756 million by Q4 2024, though the broader Superchain reached $5.9 billion (278% YoY). The honest question: should Base's organic growth, driven by Coinbase's distribution, be credited to Superchain incentives? Probably not. Base reached $4.5 billion TVL by mid-2025 with roughly $10 million in builder grants and no token incentive program.

> [Source: Arbitrum Forum; Messari, "State of OP Mainnet Q4 2024" and "State of the Superchain H2 2025"; DefiLlama]
> 

| Program | Total Spend (est.) | Median Estimate |
| --- | --- | --- |
| Arbitrum STIP | $8 – $31 | ~$15–20 |
| Arbitrum LTIPP | $5 – $12 | ~$8–10 |
| Optimism ecosystem | $2 – $10 | ~$5–7 |

### 4. Points Programs and Their Implied Costs

Points programs introduced a fundamentally different economic model: rather than distributing tokens during the campaign, protocols promise a future allocation tied to user activity, effectively borrowing against future token value to attract present-day deposits.

**EigenLayer** was the defining case study of 2024. TVL surged from $1 billion in January to $15 billion by May, driven almost entirely by anticipation of the EIGEN token airdrop. The implied economics:

- Approximately 10% of EIGEN supply was allocated to the airdrop (estimated)
- At the post-listing fully diluted valuation of $10-13 billion, this implied $1-1.3 billion in value distributed
- Against $15 billion in peak TVL, the implied cost was approximately **$0.07-0.09 per $1 of peak TVL**

This appears remarkably cheap. But the denominator is misleading. Much of the $15 billion was leveraged through liquid restaking protocols like Renzo, [Ether.fi](http://ether.fi/), and Swell, which amplified the headline TVL figure well beyond the actual unique capital at risk. TVL dropped $351 million within 24 hours of the airdrop announcement due to policy controversies (geographic exclusions, alleged extraction from ecosystem projects), and the token entered a sustained downtrend from its $3.50 listing price.

Points programs shift cost from the protocol treasury to post-TGE token holders who bear the dilution of the eventual airdrop. This makes them appear cheaper on a cost-per-TVL basis while obscuring the true economic cost borne by the token market.

> [Source: [Crypto.com](http://crypto.com/) Research, "Points Farming," May 2024; DefiLlama]
> 

**Lending Category Summary:**

| Metric | Range | Median Estimate |
| --- | --- | --- |
| Peak supply-side TVL per $1 spent | $8 – $31 | ~$15–20 |
| Peak borrow-side TVL per $1 spent | $5 – $12 | ~$8–10 |
| 90-day retained supply TVL per $1 spent | $2 – $10 | ~$5–7 |

### 5. Pre-Launch Deposit Campaigns

**Boyco/Berachain (January - February 2025)** is the definitive case study. The ascent: $1.6 billion pre-mainnet, peaked at $3.1-3.5 billion TVL, over 150,000 wallets, ranked 8th-largest chain before mainnet launched. The collapse: TVL declined 71% to ~$990 million, token price fell 72%, monthly active users dropped 85% from 2.2 million to 330,000. The incentive cost -- 2% of BERA supply -- bought massive headline numbers but minimal retention.

> [Source: Sentora (ADM), "Why Royco's Pre-Deposit Vault Programs Fall Short," 2025; The Defiant; Blockworks]
> 

| Metric | Boyco/Berachain |
| --- | --- |
| Peak TVL | ~$3.1–3.5B |
| TVL at 90 days post-launch | ~$990M |
| Retention rate | ~29% |
| User retention (MAU) | ~15% |

---

## Key Findings

### Finding 1: Each Dollar Buys $8-15 of Peak TVL, but Only $2-4 at 90 Days

Across all campaign types, each dollar spent generates $8-15 of peak TVL. At 90 days post-campaign, retained TVL drops to $2-4 per dollar for well-designed programs and below $1 for poor ones. **Protocols should budget for 3-5x the cost that peak metrics suggest.**

### Finding 2: The Retention Cliff Hits at 7-14 Days

The sharpest TVL decline occurs in the first 7-14 days after incentives end. Gauntlet found LTIPP incremental TVL fell from 150% of baseline to 50% in approximately one week. By nine months, it was 3.5% of baseline. Unichain dropped 86% post-incentives. Berachain saw massive withdrawals in the first two weeks. **The retention cliff is the most predictable pattern in DeFi incentive data.**

> [Source: Gauntlet, "Arbitrum LTIPP Program Retro"; multiple analyses cited above]
> 

### Finding 3: Protocol Type Determines Baseline Efficiency

| Protocol Type | Median Cost per $1 TVL (peak) | Median 90-day Retention | Effective 90-day Cost |
| --- | --- | --- | --- |
| Lending (supply-side) | $0.03 – $0.07 | 30–50% | $0.06 – $0.20 |
| DEX liquidity | $0.08 – $0.15 | 15–30% | $0.25 – $0.75 |
| Perps/derivatives | $0.10 – $0.25 | 10–25% | $0.40 – $2.00+ |
| Pre-launch deposits | $0.01 – $0.05 | 15–30% | $0.05 – $0.30 |

Lending deposits are cheapest because depositors face minimal impermanent loss risk. DEX liquidity is more expensive due to IL and management costs. Derivatives face the highest cost because trading activity, not parked capital, is the value driver.

### Finding 4: Organic Benchmarks Are Humbling

Base grew to $4.5 billion TVL by mid-2025 with ~$10 million in grants and no token incentives -- implied cost: ~$0.002 per $1. **Hyperliquid** reached $6 billion TVL with zero token incentives and zero VC funding. These are exceptional cases, but they demonstrate that the floor for cost-per-TVL is far below what most programs achieve, raising uncomfortable questions about how much spend subsidizes activity that strong products could attract organically.

> [Source: DefiLlama; multiple analyses cited above]
> 

---

## What Separates Efficient Campaigns from Wasteful Ones

Five structural factors consistently predict outcomes:

- **Targeting borrows, not just deposits**. Programs rewarding borrowing activity (like DRIP) produce more economically valuable TVL. A dollar of borrows generates protocol revenue; a dollar of supply-side deposits does not.
- **Ex-post vs. ex-ante allocation.** Programs allocating rewards after measuring performance consistently outperform those distributing budgets upfront. DRIP's time-weighted borrow balance approach produces tighter alignment than STIP's lump-sum grants.
- **Pool selection precision**. Gauntlet's targeted Uniswap campaign produced $259 of volume per dollar spent. Broad, untargeted distribution in the same ecosystem produced a fraction of that. Precision matters more than budget size.
- **Duration and taper design**. Programs ending abruptly produce the sharpest retention cliffs. Tapered emissions give organic demand time to replace subsidized demand.

---

## A Framework for Protocol Teams

Five structural factors consistently predict outcomes:

- **Step 1: Set your benchmark by category.**
Lending supply-side: $0.03-0.07 per $1 peak TVL. DEX campaigns: $0.08-0.15. If projected costs significantly exceed these ranges, revise the design.
- **Step 2: Budget for retention, not peak.**
Multiply peak cost by 3-5x for the effective 90-day cost. If your treasury cannot afford this, reduce scope rather than launching an underfunded program.
- **Step 3: Measure market-share-adjusted TVL.**
Do not evaluate success using raw figures. Use control-pool or market-share methodologies to isolate incremental impact.
- **Step 4: Plan for the retention cliff.**
Assume 50-70% of incentivized TVL will leave within 14 days. Include a taper phase, conversion mechanism, or bridging program.
- **Step 5: Track revenue-per-dollar, not just TVL-per-dollar.**
Gauntlet's Uniswap analysis showed $1.37 million in projected annual LP fees against ~$1 million in spend -- a program that pays for itself. Arbitrum's LTIPP generated $0.07 in sequencer revenue per $1 spent -- a program subsidizing growth at a loss. Know which you are running.
- **Step 6: Compare against the organic baseline.**
If comparable products are growing without incentives and your growth requires massive spend, the problem is product-market fit, not insufficient incentives.

---

## Implications For The Industry

- **Most incentive spend is mispriced.** The gap between peak-TVL cost and 90-day-retained cost -- typically 3-5x -- is systematically underappreciated in governance discussions.
- **The industry is converging on better design.** The evolution from STIP to LTIPP to DRIP represents genuine progress. Merkl's infrastructure, distributing over $1.5 billion in incentives across 60+ chains, has lowered operational costs. The tooling is improving faster than the strategy.
- **Revenue-positive campaigns are possible but rare.** Only three of seven major Ethereum protocols studied were profitable post-incentives: Lido, Sky, and Aave. For the majority, incentive spend is a growth investment that may never produce positive returns.
- **The mercenary capital problem is structural, not tactical.** Unichain lost 86% of TVL after its $21 million campaign ended. Berachain's Boyco campaign saw 71% TVL decline post-launch. 0xDAO lost 90% of $4.33 billion in 48 hours. These are not anomalies. They are the default outcome for incentive programs that attract capital without building integration depth or product dependency. No amount of incentive design optimization can fix a fundamental product-market fit gap.
- **The winners are increasingly obvious.** Protocols that retain liquidity share common traits: deep ecosystem integrations, sustainable fee revenue, credible risk frameworks, and economic models that function when incentives fade. Aave, Morpho (via its curator model), Uniswap (on chains where it has structural volume), and Hyperliquid (via product quality alone) demonstrate that durable TVL is built on utility, not subsidies.

For protocol operators, the message from this data is clear: benchmark your spend against these numbers, budget for the retention cliff rather than the peak, measure what actually matters, and ask the hardest question before every campaign launch. If the incentives stopped tomorrow, would anyone stay?