"use client";

import { useState } from "react";
import type { ResourceCardData, FilterOption } from "../lib/getResource";
import ResourceHubFilter from "./ResourceHubFilter";
import ArticleCard from "./ArticleCard";

interface ResourceHubListingProps {
  resources: ResourceCardData[];
}

export default function ResourceHubListing({ resources }: ResourceHubListingProps) {
  const [filter, setFilter] = useState<FilterOption>("All");

  const filtered =
    filter === "All"
      ? resources
      : resources.filter((r) => r.category === filter);

  return (
    <div className="space-y-6">
      <ResourceHubFilter selected={filter} onSelect={setFilter} />
      <div className="rounded-3xl p-6 md:p-8 bg-[#f9f9f9]/[0.02]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start auto-rows-[minmax(320px,auto)]">
          {filtered.map((resource) => (
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
  );
}
