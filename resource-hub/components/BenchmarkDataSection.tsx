import SectionHeading from "./SectionHeading";
import CheckmarkList from "./CheckmarkList";
import DataTable from "./DataTable";

const CEX_LISTING_DATA = {
  columns: [
    { key: "campaign", header: "Campaign Name" },
    { key: "minSpend", header: "Min Spend (USD)" },
    { key: "cpFill", header: "CPFill (USD)" },
  ],
  rows: [
    { campaign: "Campaign A", minSpend: "150,000", cpFill: "45" },
    { campaign: "Campaign B", minSpend: "200,000", cpFill: "52" },
    { campaign: "Campaign C", minSpend: "120,000", cpFill: "38" },
    { campaign: "Campaign D", minSpend: "180,000", cpFill: "48" },
    { campaign: "Average", minSpend: "162,500", cpFill: "46" },
  ],
};

const LENDING_DATA = {
  columns: [
    { key: "campaign", header: "Campaign Name" },
    { key: "minSpend", header: "Min Spend (USD)" },
    { key: "cpFill", header: "CPFill (USD)" },
  ],
  rows: [
    { campaign: "Lending A", minSpend: "80,000", cpFill: "62" },
    { campaign: "Lending B", minSpend: "95,000", cpFill: "58" },
    { campaign: "Lending C", minSpend: "70,000", cpFill: "71" },
    { campaign: "Lending D", minSpend: "110,000", cpFill: "55" },
    { campaign: "Average", minSpend: "88,750", cpFill: "62" },
  ],
};

const DAPP_CHAIN_DATA = {
  columns: [
    { key: "campaign", header: "Campaign Name" },
    { key: "minSpend", header: "Min Spend (USD)" },
    { key: "cpFill", header: "CPFill (USD)" },
  ],
  rows: [
    { campaign: "DApp A", minSpend: "60,000", cpFill: "35" },
    { campaign: "DApp B", minSpend: "75,000", cpFill: "42" },
    { campaign: "Chain A", minSpend: "120,000", cpFill: "28" },
    { campaign: "Chain B", minSpend: "90,000", cpFill: "38" },
    { campaign: "Average", minSpend: "86,250", cpFill: "36" },
  ],
};

const PUBLIC_REG_DATA = {
  columns: [
    { key: "campaign", header: "Campaign Name" },
    { key: "minSpend", header: "Min Spend (USD)" },
    { key: "cpFill", header: "CPFill (USD)" },
  ],
  rows: [
    { campaign: "Reg A", minSpend: "40,000", cpFill: "22" },
    { campaign: "Reg B", minSpend: "55,000", cpFill: "25" },
    { campaign: "Reg C", minSpend: "35,000", cpFill: "20" },
    { campaign: "Reg D", minSpend: "50,000", cpFill: "24" },
    { campaign: "Average", minSpend: "45,000", cpFill: "23" },
  ],
};

const ORGANIC_DATA = {
  columns: [
    { key: "campaign", header: "Campaign Name" },
    { key: "totalSpend", header: "Total Spend (USD)" },
    { key: "impressions", header: "Est. Impressions" },
    { key: "clicks", header: "Est. Clicks" },
    { key: "signups", header: "Est. Signups" },
    { key: "conversions", header: "Est. Conversions" },
  ],
  rows: [
    { campaign: "Organic A", totalSpend: "25,000", impressions: "2.5M", clicks: "45K", signups: "3.2K", conversions: "180" },
    { campaign: "Organic B", totalSpend: "30,000", impressions: "3.1M", clicks: "52K", signups: "3.8K", conversions: "210" },
    { campaign: "Organic C", totalSpend: "22,000", impressions: "2.2M", clicks: "38K", signups: "2.8K", conversions: "155" },
    { campaign: "Organic D", totalSpend: "28,000", impressions: "2.8M", clicks: "48K", signups: "3.5K", conversions: "195" },
    { campaign: "Average", totalSpend: "26,250", impressions: "2.65M", clicks: "45,750", signups: "3,325", conversions: "185" },
  ],
};

const BENCHMARK_SECTION = ({ title, intro, criteria, table, note }: {
  title: string;
  intro: string[];
  criteria?: string[];
  table: { columns: { key: string; header: string }[]; rows: Record<string, string>[] };
  note?: string;
}) => (
  <div className="space-y-6">
    <SectionHeading level={3}>{title}</SectionHeading>
    {intro.map((p, i) => (
      <p key={i} className="text-wise-white/90 text-base leading-relaxed">{p}</p>
    ))}
    {criteria && <CheckmarkList items={criteria} />}
    {note && <p className="text-wise-white/90 text-base leading-relaxed">{note}</p>}
    <DataTable columns={table.columns} rows={table.rows} />
  </div>
);

export default function BenchmarkDataSection() {
  return (
    <section className="space-y-10">
      <SectionHeading level={2}>Benchmark Data by Campaign Type</SectionHeading>

      <BENCHMARK_SECTION
        title="1. CEX Listing Strategy Campaigns"
        intro={[
          "CEX listing campaigns typically involve significant marketing spend to drive awareness and adoption around a new exchange listing. These campaigns often have higher CPFill due to the competitive nature of exchange listings.",
          "Campaigns included in this benchmark meet the following criteria:",
        ]}
        criteria={[
          "Minimum 100K USD spend",
          "At least 1-month campaign duration",
          "Clear acquisition-focused objectives",
          "Measurable on-chain holder growth",
        ]}
        note="Implied Cost-per-Fill for CEX listing campaigns typically ranges from $38–$52 per new holder, with an average of approximately $46."
        table={CEX_LISTING_DATA}
      />

      <BENCHMARK_SECTION
        title="2. Lending/Protocol Promotion"
        intro={[
          "Lending and DeFi protocol promotions focus on acquiring users who will interact with the protocol (deposit, borrow, etc.). These campaigns often have higher CPFill due to the need for users to complete onboarding and fund accounts.",
          "Implied Cost-per-Fill for lending protocol promotions typically ranges from $55–$71 per new user.",
        ]}
        table={LENDING_DATA}
      />

      <BENCHMARK_SECTION
        title="3. DApp and Chain Ecosystem Growth"
        intro={[
          "DApp and chain ecosystem campaigns aim to grow the user base of a specific application or blockchain. These often benefit from lower CPFill due to broader targeting and simpler onboarding.",
          "Implied Cost-per-Fill for DApp/chain growth campaigns typically ranges from $28–$42 per new user.",
        ]}
        table={DAPP_CHAIN_DATA}
      />

      <BENCHMARK_SECTION
        title="4. Public Registrations and Their Implied Costs"
        intro={[
          "Public registration campaigns focus purely on user acquisition through signup flows. These campaigns often have the lowest CPFill due to the simplicity of the conversion action.",
        ]}
        criteria={[
          "Focus purely on user acquisition",
          "Registration or signup as primary conversion",
          "Measurable on-chain or off-chain attribution",
        ]}
        note="To determine implied CPFill for registration campaigns, divide total spend by the number of completed registrations that can be attributed to the campaign."
        table={PUBLIC_REG_DATA}
      />

      <div className="space-y-6">
        <SectionHeading level={3}>5. Top-Level Organic Campaigns</SectionHeading>
        <p className="text-wise-white/90 text-base leading-relaxed">
          Organic campaigns (content, PR, community) don&apos;t have a direct
          CPFill metric since they don&apos;t typically drive measurable
          on-chain holder growth in the same way. Instead, we track estimated
          impressions, clicks, signups, and conversions.
        </p>
        <p className="text-wise-white/90 text-base leading-relaxed">
          These campaigns are valuable for brand building and awareness but
          should be evaluated separately from paid acquisition campaigns.
        </p>
        <DataTable columns={ORGANIC_DATA.columns} rows={ORGANIC_DATA.rows} />
      </div>
    </section>
  );
}
