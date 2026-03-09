import ArticleCard from "./ArticleCard";
import type { ResourceCardData } from "../lib/types";

interface RelatedContentProps {
  currentSlug: string;
  resources: ResourceCardData[];
}

export default function RelatedContent({ currentSlug, resources }: RelatedContentProps) {
  const current = resources.find((r) => r.slug === currentSlug);
  const others = resources
    .filter((r) => r.slug !== currentSlug)
    .sort((a, b) => {
      const sameCategoryA = a.category === current?.category ? 1 : 0;
      const sameCategoryB = b.category === current?.category ? 1 : 0;
      if (sameCategoryB !== sameCategoryA) return sameCategoryB - sameCategoryA;
      const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
      const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 pb-16 sm:pb-24 border-t border-white/10">
      <div className="space-y-8">
        <h2 className="text-[#f9f9f9] text-4xl font-normal font-dm-sans leading-[48px]">
          Related Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {others.map((resource) => (
            <div key={resource.slug} className="h-[280px] md:h-[300px]">
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
    </section>
  );
}
