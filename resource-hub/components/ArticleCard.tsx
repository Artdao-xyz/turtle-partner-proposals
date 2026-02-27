import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
  subtitle,
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
        className="rounded-2xl p-px w-full"
        style={{
          background:
            "linear-gradient(to bottom right, #f9f9f950, #141514, #f9f9f950)",
        }}
      >
        <article
          className={`flex flex-col rounded-2xl overflow-hidden w-full h-full p-2.5 bg-black-turtle ${isFeatured ? "p-3" : ""}`}
        >
          {/* Badge - always visible, in flow so nothing overlays it */}
          {badgeLabel && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit mb-3 shrink-0"
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

          {/* Content area - badge sits above this */}
          <div className="relative flex-1 min-h-0 flex flex-col">
            {/* Default: image, title - hidden on hover */}
            <div className="flex flex-col flex-1 group-hover:opacity-0 group-hover:pointer-events-none transition-opacity duration-200">
              <div
                className={`relative rounded-xl overflow-hidden flex-1 min-h-0 ${isFeatured ? "aspect-video md:aspect-3/2" : "aspect-video"}`}
              >
                <ResourceHubHeroImage
                  variant="card"
                  src={heroImage}
                  className="absolute inset-0 w-full h-full mb-0 rounded-xl"
                />
              </div>
              <h2
                className={`mt-3 font-dm-sans font-semibold text-wise-white leading-6 line-clamp-3 ${isFeatured ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
              >
                {title}
              </h2>
            </div>

            {/* Hovered: title, description, read full - visible on hover, only covers content area */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 bg-black-turtle rounded-xl">
              <div>
                <h2
                  className={`font-dm-sans font-semibold text-wise-white leading-6 line-clamp-3 ${isFeatured ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-2 text-wise-white/80 text-sm leading-relaxed line-clamp-3">
                    {subtitle}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center self-end gap-1.5 text-sm font-medium text-green-turtle w-fit">
                Read full
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </span>
            </div>
          </div>
        </article>
      </div>
    </Link>
  );
}
