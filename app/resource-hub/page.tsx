import { getAllResources } from "@/resource-hub/lib/getResource";
import ArticleCard from "@/resource-hub/components/ArticleCard";

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
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-24 pb-16 md:pt-32 md:pb-24">
        <header className="mb-12 lg:mb-16">
          <h1 className="font-dm-sans font-semibold text-wise-white text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
            Resource Hub
          </h1>
          <p className="mt-4 text-white/60 text-lg max-w-2xl">
            Research, benchmarks, and guides for DeFi incentive programs and
            liquidity campaigns.
          </p>
        </header>

        <div className="rounded-3xl p-6 md:p-8 bg-[#F9F9F9]/[0.02]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start auto-rows-[minmax(320px,auto)]">
            {resources.map((resource) => (
            <ArticleCard
              key={resource.slug}
              slug={resource.slug}
              title={resource.title}
              subtitle={resource.subtitle}
              badge={resource.badge}
            />
          ))}
          </div>
        </div>
      </div>
    </main>
  );
}
