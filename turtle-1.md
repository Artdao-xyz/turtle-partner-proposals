# turtle test

# Cost-per-TVL Benchmarks: What DeFi Protocols Actually Pay for Liquidity

An original research analysis of incentive efficiency across DeFi campaign types, with benchmark data protocol teams can use to evaluate their own spend.

DeFi protocols spent more than $500 million on liquidity incentives in 2024 alone. The number for 2025 is tracking higher. Yet when a protocol growth team sits down to plan its next campaign, there is no standardized answer to a basic question: what should a dollar of TVL cost?

Treasury managers approve multimillion-dollar incentive budgets based on vibes, competitive pressure, and whatever the last governance proposal said worked. There are no industry benchmarks. No median cost figures. No shared understanding of what "efficient" looks like across campaign types, protocol categories, or chain ecosystems.

This report attempts to fix that. Using publicly available data from DefiLlama, Dune Analytics, governance forum disclosures, Gauntlet and OpenBlock Labs retroactive analyses, and Blockworks Research advisory reports, we have assembled the first cross-category benchmark dataset for cost-per-TVL in DeFi. The goal is simple: give protocol operators real numbers they can use to evaluate whether their incentive spend is competitive, wasteful, or somewhere in between.

The findings are not comfortable. The median incentive dollar buys less TVL than most teams assume, retains it for a shorter period than most proposals promise, and decays faster than most governance forums acknowledge. But within the data, clear patterns separate efficient campaigns from expensive failures.

---

## Methodology: Defining Cost-per-TVL

### The Basic Formula

<aside>

Cost per $1 TVL = Total Incentive Spend (USD) / Peak Incremental TVL (USD)

</aside>

If a protocol distributes $1 million in token incentives and attracts $50 million in new deposits, the cost is $0.02 per dollar of TVL. Simple enough. But this number is almost useless in isolation. It tells you nothing about how long that TVL stayed, whether it was genuinely incremental, or whether it produced downstream value in volume, fees, or protocol revenue.

### The Market-Share-Adjusted Approach

The more rigorous methodology, pioneered by Gauntlet and adopted by Blockworks Research, adjusts for aggregate market movements. Rather than comparing raw TVL before and after a campaign, analysts establish a baseline by tracking a control set of non-incentivized pools during the same period. Incremental TVL is the change in market share multiplied by total market values. This neutralizes the effect of a rising or falling market inflating raw TVL numbers.

> *[Source: Gauntlet, "Arbitrum LTIPP Program Retro," 2024; Blockworks Research, "Meta-Analysis on Incentive Programs," 2024]*
> 

---

## Benchmark Data by Campaign Type

### 1. DEX Liquidity Mining Campaigns

DEX incentive programs are the most studied category, thanks to retroactive analyses conducted for Arbitrum's STIP and LTIPP programs.

**Arbitrum STIP - DEX Vertical (October 2023 - January 2024).**

The Short-Term Incentive Program distributed 50 million ARB across the Arbitrum ecosystem, with no predefined success metrics and broad distribution across protocols. Blockworks Research's retroactive analysis of the DEX vertical found wide variance in efficiency:

- The most efficient protocol achieved $12 of TVL added per dollar spent.
- A second protocol matched at roughly $12 per dollar.
- A third saw $7 per dollar.
- The least efficient managed only $2 per dollar

The spread is instructive: a 6x difference in efficiency across protocols operating in the same ecosystem, during the same time period, competing for the same token. Pool selection and protocol design mattered more than the availability of incentives.

> *[Source: Blockworks Research, "STIP Retroactive Analysis -- Spot DEX TVL," July 2024]*
> 

**Arbitrum LTIPP -DEX Vertical (June - September 2024).**

The longer-duration LTIPP *program* showed improved aggregate efficiency. DEX TVL market share increased 17%, translating to $102.6 million in market-share-adjusted added TVL. At a cost of approximately $2.66 million in incentives distributed to the DEX category, this equates to roughly **$38.64 of TVL added per dollar spent** during the active campaign period.

However, post-campaign retention told a different story. Yield farm aggregators like Beefy and Yearn, which showed impressive TVL growth during the program, saw most of that TVL exit after incentives ended. A series of large withdrawals at the end of LTIPP removed more USD value than the total amount added through the incentive program. The programs that retained TVL were those where incentivized liquidity served an existing demand -- not those that simply offered the highest APY.

---

**DEX Category Summary:**

| Protocol Type | Median Cost per $1 TVL (peak) | Median 90-day Retention | Effective 90-day Cost |
| --- | --- | --- | --- |
| Lending (supply-side) | $0.03 – $0.07 | 30–50% | $0.06 – $0.20 |
| DEX liquidity | $0.08 – $0.15 | 15–30% | $0.25 – $0.75 |