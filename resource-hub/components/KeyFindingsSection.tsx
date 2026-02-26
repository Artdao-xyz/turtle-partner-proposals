import SectionHeading from "./SectionHeading";
import DataTable from "./DataTable";

const RRR_TABLE = {
  columns: [
    { key: "metric", header: "Metric" },
    { key: "cex", header: "CEX Listing (30-day)" },
    { key: "lending", header: "Lending/Promotion (30-day)" },
    { key: "dapp", header: "Dapp/Chain Growth (30-day)" },
    { key: "publicReg", header: "Public Reg. (30-day)" },
  ],
  rows: [
    { metric: "CPFill", cex: "$46", lending: "$62", dapp: "$36", publicReg: "$23" },
    { metric: "Implied TVL Value", cex: "$180", lending: "$240", dapp: "$140", publicReg: "$90" },
    { metric: "RRR", cex: "7.2x", lending: "7.8x", dapp: "8.5x", publicReg: "9.1x" },
    { metric: "Est. 30-day Profit", cex: "$92", lending: "$124", dapp: "$72", publicReg: "$46" },
    { metric: "Est. 90-day Profit", cex: "$276", lending: "$372", dapp: "$216", publicReg: "$138" },
  ],
};

export default function KeyFindingsSection() {
  return (
    <section className="space-y-10">
      <SectionHeading level={2}>Key Findings</SectionHeading>

      <div className="space-y-6">
        <SectionHeading level={3}>
          Finding 1: Fresh Costs Range $50 – $100 Per TVL Unit Over 30-90 Days
        </SectionHeading>
        <p className="text-wise-white/90 text-base leading-relaxed">
          Across campaign types, the cost to acquire a new TVL unit (or
          equivalent user value) typically falls between $50 and $100 when
          measured over a 30-90 day window. CEX listing campaigns tend toward
          the higher end, while public registration campaigns often achieve the
          lower range.
        </p>
      </div>

      <div className="space-y-6">
        <SectionHeading level={3}>
          Finding 2: The Estimated RRR (Read, Retain, Recruit) is 7-10X
        </SectionHeading>
        <p className="text-wise-white/90 text-base leading-relaxed">
          When accounting for user lifetime value and referral effects, the
          estimated Read, Retain, Recruit (RRR) multiplier ranges from 7x to
          10x across campaign types. This suggests that a well-optimized
          acquisition campaign can generate 7-10x the initial spend in long-term
          value.
        </p>
        <DataTable columns={RRR_TABLE.columns} rows={RRR_TABLE.rows} />
        <p className="text-wise-white/90 text-base leading-relaxed">
          The table above illustrates how different campaign types compare on
          CPFill, implied TVL value, RRR, and estimated profit over 30 and 90
          days. Use these benchmarks to set realistic targets for your
          campaigns.
        </p>
      </div>

      <div className="space-y-6">
        <SectionHeading level={3}>Finding 3: Organic Benchmarks Are Humble</SectionHeading>
        <p className="text-wise-white/90 text-base leading-relaxed">
          Organic campaigns (content, PR, community) typically generate lower
          direct conversion metrics compared to paid campaigns. While valuable
          for brand building, they should not be expected to match paid
          acquisition efficiency.
        </p>
        <p className="text-wise-white/90 text-base leading-relaxed">
          The best strategy combines both: use paid campaigns for measurable
          acquisition and organic campaigns for awareness and trust building.
        </p>
      </div>
    </section>
  );
}
