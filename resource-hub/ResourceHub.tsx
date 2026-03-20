import type React from "react";
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
  /** When provided, skip fetch and render this content (e.g. draft preview). */
  rawContent?: string;
  /** Optional right-side header content (e.g. draft badge + edit button). */
  headerRight?: React.ReactNode;
}

export default async function ResourceHub({
  slug = DEFAULT_SLUG,
  rawContent,
  headerRight,
}: ResourceHubProps) {
  const [content, resources] = rawContent
    ? [rawContent, [] as Awaited<ReturnType<typeof getAllResources>>]
    : await Promise.all([getResourceContent(slug), getAllResources()]);
  const { frontmatter, content: markdown } = parseFrontmatter(content);
  const displaySlug = frontmatter.slug ?? slug;
  const body = await markdownToReact(markdown);
  const headings = extractHeadings(markdown).map((h) => ({ id: h.id, text: h.text }));

  return (
    <main
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--black-turtle)" }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 pt-28 pb-12 sm:pt-32 sm:pb-28 md:pt-36 md:pb-24">
        {/* Wide: go back, hero image, title, subtitle */}
        <div className="space-y-10 lg:space-y-5">
          <div className="flex items-center justify-between gap-3">
            <GoBackButton href="/blog" />
            {headerRight}
          </div>
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
      <ArticleLayoutTemplate currentSlug={displaySlug} resources={resources} />
    </main>
  );
}
