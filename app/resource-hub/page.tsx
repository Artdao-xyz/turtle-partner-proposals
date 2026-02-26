import { ResourceHub } from "@/resource-hub";
import Header from "@/app/components/Header";

export const metadata = {
  title: "Cost-Per-TVL Benchmarks | Turtle Partner Proposals",
  description:
    "An original research analysis of incentive efficiency across DeFi campaign types, with benchmark data protocol teams can use to evaluate their own spend.",
};

export const dynamic = "force-static";

export default function ResourceHubPage() {
  return (
    <>
      <Header />
      <ResourceHub />
    </>
  );
}
