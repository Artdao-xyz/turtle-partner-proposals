import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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

function BadgePill({ label }: { label: string }) {
  return (
    <div
      className="pl-0.5 pr-2.5 py-0.5 rounded-[130px] inline-flex items-center gap-[5px] border border-[#f9f9f9]/10 w-fit"
    >
      <div
        className="w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0"
      >
        <Image
          src={CATEGORY_ICONS[label] ?? CATEGORY_ICONS.Benchmark}
          alt=""
          width={18}
          height={18}
          className="shrink-0"
          aria-hidden
        />
      </div>
      <span className="text-sm font-normal leading-3 text-[#eff8ed] font-dm-sans">
        {label}
      </span>
    </div>
  );
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
  const badgeLabel = badge ?? category;
  const isBig = variant === "featured";
  const heightClass = isBig
    ? "h-[280px] max-h-[280px] md:h-[455px] md:max-h-[455px]"
    : "h-[280px] max-h-[280px] md:h-[300px] md:max-h-[300px]";

  return (
    <Link href={`/resource-hub/${slug}`} className="block group h-full shadow">
      <div
        className={`rounded-5xl p-px w-full overflow-hidden ${heightClass}`}
        style={{
          background:
            "linear-gradient(to bottom right, #f9f9f950, #141514, #f9f9f950)",
        }}
      >
        <article className="relative h-full rounded-5xl overflow-hidden bg-black-turtle">
          {/* Badge: single instance, overlays both front and back */}
          {badgeLabel && (
            <div className="absolute top-8 left-8 z-20">
              <BadgePill label={badgeLabel} />
            </div>
          )}

          {/* Front: image fills card, title at bottom */}
          <div className="absolute inset-0 p-6 flex flex-col gap-3.5">
            <div className="flex-1 min-h-0 rounded-[20px] overflow-hidden relative">
              <ResourceHubHeroImage
                variant="card"
                src={heroImage}
                className="absolute inset-0 w-full h-full rounded-[16px] overflow-hidden"
              />
            </div>
            <div className="flex flex-col justify-end gap-2.5 shrink-0">
              <h2 className="text-[#f9f9f9] text-xl font-normal font-dm-sans leading-7 line-clamp-2">
                {title}
              </h2>
            </div>
          </div>

          {/* Back: hover overlay - title, description, read full */}
          <div className="absolute inset-0 p-6 pt-14 flex flex-col gap-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black-turtle rounded-5xl">
            <div className="flex-1 min-h-0 flex flex-col justify-center gap-2.5">
              <h2 className="text-[#f9f9f9] text-xl font-normal font-dm-sans leading-7 line-clamp-3">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[#f9f9f9]/50 text-sm font-normal font-dm-sans leading-4 line-clamp-3">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="inline-flex justify-between items-center shrink-0">
              <div className="flex-1 flex justify-end items-center gap-2.5">
                <span className="text-[#f9f9f9] text-xs font-semibold font-dm-sans underline leading-5">
                  read full
                </span>
                <ArrowUpRight
                  className="w-3 h-3 text-green-turtle"
                  strokeWidth={2}
                  stroke="currentColor"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </Link>
  );
}
