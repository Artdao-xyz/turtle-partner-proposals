import ResourceHubHeroImage from "./components/ResourceHubHeroImage";
import ResourceHubTitle from "./components/ResourceHubTitle";
import ResourceHubNavigator from "./components/ResourceHubNavigator";
import { parseFrontmatter, markdownToReact, extractHeadings } from "./lib/parse";
import { getResourceContent } from "./lib/getResource";

const DEFAULT_SLUG = "turtle-1";

interface ResourceHubProps {
  slug?: string;
}

export default async function ResourceHub({ slug = DEFAULT_SLUG }: ResourceHubProps) {
  const rawContent = await getResourceContent(slug);
  const { frontmatter, content } = parseFrontmatter(rawContent);
  const body = await markdownToReact(content);
  const headings = extractHeadings(content).map((h) => ({ id: h.id, text: h.text }));

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
        {/* Content with navigator */}
        <div className="flex gap-16 mt-16">
          <ResourceHubNavigator items={headings} />
          <article className="shrink-0 max-w-3xl w-full">
            <div className="prose-resource-hub [&>*:last-child]:mb-0">{body}</div>
          </article>
        </div>
      </div>
    </main>
  );
}
