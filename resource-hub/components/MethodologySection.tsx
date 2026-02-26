import SectionHeading from "./SectionHeading";
import FormulaBlock from "./FormulaBlock";
import CheckmarkList from "./CheckmarkList";

export default function MethodologySection() {
  return (
    <section className="space-y-10">
      <SectionHeading level={2}>Methodology: Defining Cost-per-Fill</SectionHeading>

      <div className="space-y-6">
        <SectionHeading level={3}>The Basic Formula</SectionHeading>
        <p className="text-wise-white/90 text-base leading-relaxed">
          Cost-per-Fill (CPFill) measures the efficiency of marketing spend in
          acquiring new token holders. It represents the average cost to acquire
          one additional unique token holder.
        </p>
        <FormulaBlock formula="Cost-per-Fill = Total Marketing Spend / (Unique Token Holders at the end of Campaign - Unique Token Holders at the start of Campaign)" />
        <p className="text-wise-white/90 text-base leading-relaxed">
          This metric allows protocol teams to compare campaign efficiency across
          different channels and time periods, enabling data-driven budget
          allocation.
        </p>
      </div>

      <div className="space-y-6">
        <SectionHeading level={3}>The Vision: Share-Adjusted Approach</SectionHeading>
        <p className="text-wise-white/90 text-base leading-relaxed">
          A more sophisticated approach considers the share of marketing spend
          relative to total protocol value. This helps normalize for protocol
          size and stage.
        </p>
        <ul className="space-y-2 text-wise-white/90 text-base leading-relaxed list-disc list-inside">
          <li>Weight campaigns by their share of total protocol spend</li>
          <li>Adjust for protocol maturity and existing holder base</li>
          <li>Account for seasonal and market cycle effects</li>
        </ul>
        <p className="text-wise-white/90 text-base leading-relaxed">
          The share-adjusted approach provides a more comparable benchmark across
          protocols of different sizes and stages.
        </p>
      </div>

      <div className="space-y-6">
        <SectionHeading level={3}>The Formula Refinement</SectionHeading>
        <p className="text-wise-white/90 text-base leading-relaxed">
          To ensure accurate benchmarks, we exclude campaigns that don&apos;t
          fit the acquisition-focused definition:
        </p>
        <CheckmarkList
          items={[
            "Exclude DeFi campaigns focused solely on TVL or yield optimization",
            "Exclude airdrops and other distribution mechanisms that don't measure acquisition cost",
            "Exclude campaigns targeting only existing token holders (retention vs. acquisition)",
          ]}
        />
        <p className="text-wise-white/90 text-base leading-relaxed">
          This refinement ensures our benchmarks reflect true user acquisition
          costs, not retention or engagement metrics.
        </p>
      </div>
    </section>
  );
}
