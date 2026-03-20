import Image from "next/image";

const CATEGORY_ICONS: Record<string, string> = {
  Benchmark: "/hub/Icons/icon-benchmark.svg",
  Comparison: "/hub/Icons/icon-comparison.svg",
  Comparisons: "/hub/Icons/icon-comparison.svg",
  Guides: "/hub/Icons/icon-guide.svg",
  Usecases: "/hub/Icons/icon-playbook.svg",
  "Case Studies": "/hub/Icons/icon-playbook.svg",
  Playbooks: "/hub/Icons/icon-playbook.svg",
  Research: "/hub/Icons/icon-casestudy.svg",
  Updates: "/hub/Icons/icon-benchmark.svg", // fallback
};

interface ResourceHubTitleProps {
  title: string;
  subtitle: string;
  badge?: string;
}

function CategoryIcon({ category }: { category: string }) {
  const src = CATEGORY_ICONS[category] ?? CATEGORY_ICONS.Benchmark;
  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      className="shrink-0"
      aria-hidden
    />
  );
}

export default function ResourceHubTitle({ title, subtitle, badge }: ResourceHubTitleProps) {
  return (
    <header className="space-y-6 mb-4 lg:mb-16 max-w-4xl">
      {/* Badge - above title, Figma style: pill, dark bg, green icon */}
      {badge && (
        <div
          className="inline-flex items-center gap-2 px-2.5 py-2 rounded-full"
          style={{
            backgroundColor: "#F9F9F902",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <CategoryIcon category={badge} />
          <span className="text-lg font-medium text-wise-white">{badge}</span>
        </div>
      )}

      {/* Main title - break at colon if present */}
      <h1 className="font-dm-sans font-semibold text-wise-white text-3xl md:text-4xl lg:text-5xl leading-9 lg:leading-tight tracking-tight mb-[15px]">
        {title.includes(": ") ? (
          <>
            {title.split(": ")[0]}:
            <br />
            {title.split(": ").slice(1).join(": ")}
          </>
        ) : (
          title
        )}
      </h1>

      {/* Subtitle */}
      <p className="font-light text-white/50 text-lg leading-6 lg:leading-relaxed" style={{ fontFamily: "var(--font-montserrat)" }}>
        {subtitle}
      </p>
    </header>
  );
}
