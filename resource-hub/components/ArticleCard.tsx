import Link from "next/link";
import ResourceHubHeroImage from "./ResourceHubHeroImage";

interface ArticleCardProps {
  slug: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function ArticleCard({
  slug,
  title,
  badge,
}: ArticleCardProps) {
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
          className="flex flex-col rounded-2xl overflow-hidden w-full h-full p-2.5 bg-black-turtle"
        >
        {/* Top: hero image - fills space, rounded */}
        <div className="relative flex-1 min-h-48 rounded-xl overflow-hidden">
          <ResourceHubHeroImage
            variant="card"
            className="absolute inset-0 w-full h-full mb-0 rounded-t-xl rounded-b-none"
          />
          {badge && (
            <div
              className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <rect
                  x="3"
                  y="8"
                  width="2"
                  height="5"
                  rx="1"
                  fill="var(--green-turtle)"
                />
                <rect
                  x="7"
                  y="5"
                  width="2"
                  height="8"
                  rx="1"
                  fill="var(--green-turtle)"
                />
                <rect
                  x="11"
                  y="2"
                  width="2"
                  height="11"
                  rx="1"
                  fill="var(--green-turtle)"
                />
              </svg>
              <span className="text-sm font-medium text-wise-white">{badge}</span>
            </div>
          )}
        </div>

        {/* Bottom: title only, max 3 lines */}
        <div className="px-2.5 py-2.5">
          <h2 className="font-dm-sans font-semibold text-wise-white text-lg md:text-xl leading-6 line-clamp-3">
            {title}
          </h2>
        </div>
        </article>
      </div>
    </Link>
  );
}
