import Link from "next/link";
import Image from "next/image";
import ResourceHubHeroImage from "./ResourceHubHeroImage";

const CATEGORY_ICONS: Record<string, string> = {
  Benchmark: "/hub/Icons/icon-benchmark.svg",
  Comparison: "/hub/Icons/icon-comparison.svg",
  Comparisons: "/hub/Icons/icon-comparison.svg",
  Guides: "/hub/Icons/icon-guide.svg",
  Playbooks: "/hub/Icons/icon-playbook.svg",
  Research: "/hub/Icons/icon-casestudy.svg",
  Updates: "/hub/Icons/icon-benchmark.svg",
};

interface ArticleCardProps {
  slug: string;
  title: string;
  subtitle?: string;
  badge?: string;
  category?: string;
  heroImage?: string;
  variant?: "default" | "featured";
}

export default function ArticleCard({
  slug,
  title,
  badge,
  category,
  heroImage,
  variant = "default",
}: ArticleCardProps) {
  const isFeatured = variant === "featured";
  const badgeLabel = badge ?? category;

  return (
    <Link href={`/resource-hub/${slug}`} className="block group">
      <div
        className="rounded-2xl p-px transition-transform duration-200 group-hover:scale-[1.02] w-full"
        style={{
          background:
            "linear-gradient(to bottom right, #f9f9f950, #141514, #f9f9f950)",
        }}
      >
        <article
          className={`flex flex-col rounded-2xl overflow-hidden w-full h-full p-2.5 bg-black-turtle ${isFeatured ? "p-3" : ""}`}
        >
        {/* Top: hero image - fills space, rounded */}
        <div
          className={`relative rounded-xl overflow-hidden ${isFeatured ? "aspect-[16/9] md:aspect-[3/2]" : "aspect-video"}`}
        >
          <ResourceHubHeroImage
            variant="card"
            src={heroImage}
            className="absolute inset-0 w-full h-full mb-0 rounded-t-xl rounded-b-none"
          />
          {/* Badge - top left, absolute over image */}
          {badgeLabel && (
            <div
              className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Image
                src={CATEGORY_ICONS[badgeLabel] ?? CATEGORY_ICONS.Benchmark}
                alt=""
                width={16}
                height={16}
                className="shrink-0"
                aria-hidden
              />
              <span className="text-sm font-medium text-wise-white">{badgeLabel}</span>
            </div>
          )}
        </div>

        {/* Bottom: title only, max 3 lines */}
        <div className={`px-2.5 py-2.5 ${isFeatured ? "px-3 py-3" : ""}`}>
          <h2
            className={`font-dm-sans font-semibold text-wise-white leading-6 line-clamp-3 ${isFeatured ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
          >
            {title}
          </h2>
        </div>
        </article>
      </div>
    </Link>
  );
}
