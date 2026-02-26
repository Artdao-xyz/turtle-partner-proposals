import SectionHeading from "./SectionHeading";
import CheckmarkList from "./CheckmarkList";

export default function OptimizingSection() {
  return (
    <section className="space-y-6">
      <SectionHeading level={2}>
        Optimizing Separates Efficient Campaigns from Wasteful Ones
      </SectionHeading>
      <CheckmarkList
        items={[
          "Align campaign objectives with business KPIs before launching",
          "Build a data-driven attribution model to track true acquisition cost",
          "Test and iterate on creative, targeting, and channels before scaling",
          "Benchmark against industry data to identify underperforming campaigns",
        ]}
      />
    </section>
  );
}
