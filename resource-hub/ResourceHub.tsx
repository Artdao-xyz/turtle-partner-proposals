import ResourceHubHeroImage from "./components/ResourceHubHeroImage";
import ResourceHubTitle from "./components/ResourceHubTitle";
import { parseFrontmatter, markdownToReact } from "./lib/parse";
import { getResourceContent } from "./lib/getResource";

const DEFAULT_SLUG = "turtle-1";

interface ResourceHubProps {
  slug?: string;
}

export default async function ResourceHub({ slug = DEFAULT_SLUG }: ResourceHubProps) {
  const rawContent = await getResourceContent(slug);
  const { frontmatter, content } = parseFrontmatter(rawContent);
  const body = await markdownToReact(content);

  return (
    <main
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Wide: hero image, title, subtitle */}
        <div className="space-y-16">
          <ResourceHubHeroImage />
          <ResourceHubTitle
            title={frontmatter.title}
            subtitle={frontmatter.subtitle}
            badge={frontmatter.badge}
          />
        </div>
        {/* Content: narrower, keeps max-w-3xl */}
        <article className="max-w-3xl mx-auto mt-16">
          <div className="prose-resource-hub [&>*:last-child]:mb-0">{body}</div>
        </article>
      </div>
    </main>
  );
}
