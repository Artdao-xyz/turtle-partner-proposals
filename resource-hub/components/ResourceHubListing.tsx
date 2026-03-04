"use client";

import { useState } from "react";
import type { ResourceCardData, FilterOption } from "../lib/types";
import ResourceHubLanding from "./ResourceHubLanding";
import GreenGlowLine from "./GreenGlowLine";
import ResourceHubFilter from "./ResourceHubFilter";
import ArticleCard from "./ArticleCard";
import TalkToUsSection from "./TalkToUsSection";

interface ResourceHubListingProps {
  resources: ResourceCardData[];
}

export default function ResourceHubListing({ resources }: ResourceHubListingProps) {
  const [filter, setFilter] = useState<FilterOption>("All");

  const featured = resources.slice(0, 2);
  const filtered =
    filter === "All"
      ? resources
      : resources.filter((r) => r.category === filter);

  return (
    <div className="w-full max-w-[1440px] space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Landing: title, subtitle, "Latest updates" heading */}
      <ResourceHubLanding />

      {/* Green glow line - edge to edge */}
      <GreenGlowLine />

      {/* Two featured articles - horizontal scroll on mobile, side by side on desktop */}
      <div className="flex overflow-x-auto overflow-y-hidden -mx-4 px-4 sm:mx-0 sm:px-0 md:flex-wrap md:justify-center gap-4 sm:gap-6 md:gap-8 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        {featured.map((resource) => (
          <div key={resource.slug} className="shrink-0 w-[85vw] sm:w-full md:w-[calc(50%-1rem)] min-w-0 h-[455px] max-h-[455px]">
            <ArticleCard
              slug={resource.slug}
              title={resource.title}
              subtitle={resource.subtitle}
              badge={resource.badge}
              category={resource.category}
              heroImage={resource.heroImage}
              variant="featured"
            />
          </div>
        ))}
      </div>

      {/* Filter + grid */}
      <div className="space-y-4 sm:space-y-6">
        <ResourceHubFilter selected={filter} onSelect={setFilter} />
        <div className="rounded-5xl p-4 sm:p-6 md:p-8 bg-[#f9f9f9]/2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-3.5">
            {filtered.map((resource) => (
              <div key={resource.slug} className="h-[300px]">
                <ArticleCard
                  slug={resource.slug}
                  title={resource.title}
                  subtitle={resource.subtitle}
                  badge={resource.badge}
                  category={resource.category}
                  heroImage={resource.heroImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Building resources + turtle logo - same as article pages */}
      <TalkToUsSection />
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8">
        <img
          src="/media/turtle-big.svg"
          alt="Turtle"
          className="w-auto h-auto mx-auto"
        />
      </div>
    </div>
  );
}
