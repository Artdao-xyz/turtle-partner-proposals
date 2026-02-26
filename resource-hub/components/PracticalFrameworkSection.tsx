import SectionHeading from "./SectionHeading";
import CheckmarkList from "./CheckmarkList";

export default function PracticalFrameworkSection() {
  return (
    <section className="space-y-6">
      <SectionHeading level={2}>
        A Practical Framework for Protocol Teams
      </SectionHeading>
      <CheckmarkList
        items={[
          "1. Set clear campaign KPIs aligned with protocol growth goals",
          "2. Map KPIs to business impact (TVL, users, revenue)",
          "3. Choose the right campaign type based on your stage and objectives",
          "4. Allocate budget based on benchmark data and expected CPFill",
          "5. Implement attribution tracking before launch",
          "6. Review and optimize campaigns at 30 and 90-day intervals",
        ]}
      />
    </section>
  );
}
