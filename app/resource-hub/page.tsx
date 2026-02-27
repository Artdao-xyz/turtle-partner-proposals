import { getAllResources } from "@/resource-hub/lib/getResource";
import ResourceHubListing from "@/resource-hub/components/ResourceHubListing";

export const metadata = {
  title: "Resource Hub | Turtle Partner Proposals",
  description:
    "Research, benchmarks, and guides for DeFi incentive programs and liquidity campaigns.",
};

export const dynamic = "force-dynamic";

export default async function ResourceHubListingPage() {
  const resources = await getAllResources();

  return (
    <main
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full flex flex-col items-center px-4 lg:px-20 pt-24 pb-16 md:pt-32 md:pb-24">
        <ResourceHubListing resources={resources} />
      </div>
    </main>
  );
}
