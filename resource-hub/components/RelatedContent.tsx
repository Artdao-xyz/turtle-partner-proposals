import ArticleCard from "./ArticleCard";
import type { ResourceCardData } from "../lib/getResource";

interface RelatedContentProps {
  currentSlug: string;
  resources: ResourceCardData[];
}

export default function RelatedContent({ currentSlug, resources }: RelatedContentProps) {
  const related = resources
    .filter((r) => r.slug !== currentSlug)
    .slice(0, 3);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-16 pb-24 border-t border-white/10">
      <div className="space-y-8">
        <h2 className="text-[#f9f9f9] text-4xl font-normal font-dm-sans leading-[48px]">
          Related Content
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {related.map((resource) => (
            <div
              key={resource.slug}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.33rem)]"
            >
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
