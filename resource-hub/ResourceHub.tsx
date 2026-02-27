import ResourceHubHeroImage from "./components/ResourceHubHeroImage";
import ResourceHubTitle from "./components/ResourceHubTitle";
import ResourceHubNavigator from "./components/ResourceHubNavigator";
import GoBackButton from "./components/GoBackButton";
import ArticleFooter from "./components/ArticleFooter";
import ArticleLayoutTemplate from "./components/ArticleLayoutTemplate";
import { parseFrontmatter, markdownToReact, extractHeadings } from "./lib/parse";
import { getResourceContent, getAllResources } from "./lib/getResource";

const DEFAULT_SLUG = "turtle-1";

interface ResourceHubProps {
  slug?: string;
}

export default async function ResourceHub({ slug = DEFAULT_SLUG }: ResourceHubProps) {
  const [rawContent, resources] = await Promise.all([
    getResourceContent(slug),
    getAllResources(),
  ]);
  const { frontmatter, content } = parseFrontmatter(rawContent);
  const body = await markdownToReact(content);
  const headings = extractHeadings(content).map((h) => ({ id: h.id, text: h.text }));

  return (
    <main
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-24 pb-28 md:pt-32 md:pb-24">
        {/* Wide: go back, hero image, title, subtitle */}
        <div className="space-y-10 lg:space-y-5">
          <GoBackButton href="/resource-hub" />
          <ResourceHubHeroImage src={frontmatter.heroImage} />
          <ResourceHubTitle
            title={frontmatter.title}
            subtitle={frontmatter.subtitle}
            badge={frontmatter.badge ?? frontmatter.category}
          />
        </div>
        {/* Content with navigator */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mt-4 lg:mt-16">
          <ResourceHubNavigator items={headings} />
          <article className="shrink-0 max-w-3xl w-full">
            <div className="prose-resource-hub [&>*:last-child]:mb-0">{body}</div>
            <ArticleFooter
              disclaimer={frontmatter.disclaimer}
              sources={frontmatter.sources}
              publishedDate={frontmatter.publishedDate}
            />
          </article>
        </div>
      </div>

      {/* Layout template: Related Content → Building a liquidity program → Turtle logo */}
      <ArticleLayoutTemplate currentSlug={slug} resources={resources} />
    </main>
  );
}
