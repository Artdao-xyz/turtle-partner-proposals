import SectionHeading from "./SectionHeading";
import CheckmarkList from "./CheckmarkList";

export default function ImplicationsSection() {
  return (
    <section className="space-y-6">
      <SectionHeading level={2}>Implications For The Industry</SectionHeading>
      <CheckmarkList
        items={[
          "Standardize operational metrics (CPFill, RRR) across Web3 marketing",
          "Encourage transparent reporting of campaign performance",
          "Enable protocol teams to make data-driven budget decisions",
          "Reduce wasteful spend by benchmarking against industry data",
          "Support the growth of the Web3 ecosystem through efficient acquisition",
          "Build trust with LPs and stakeholders through measurable results",
        ]}
      />
    </section>
  );
}
