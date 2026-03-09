import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSectionWrap from "./rehype-section-wrap";
import rehypeAddH2Ids from "./rehype-add-h2-ids";
import rehypeReact from "rehype-react";
import matter from "gray-matter";
import * as prod from "react/jsx-runtime";
import type { ReactElement } from "react";

import { ExternalLink } from "lucide-react";
import BulletList from "../components/BulletList";
import { BulletListItem } from "../components/BulletList";
import Callout from "../components/Callout";
import SourceCitation from "../components/SourceCitation";
import Divider from "../components/Divider";
import MarkdownTable from "../components/MarkdownTable";
import SectionHeading from "../components/SectionHeading";
import ScrollRevealBlock from "../components/ScrollRevealBlock";
import type { SourceItem } from "./article-schema";

export type { SourceItem } from "./article-schema";

export interface ResourceFrontmatter {
  title: string;
  subtitle: string;
  badge?: string;
  category?: string;
  slug: string;
  heroImage?: string;
  sources?: SourceItem[];
  disclaimer?: string;
  publishedDate?: string;
  /** When true, article is hidden from hub (soft-deleted). */
  unpublished?: boolean;
}

export interface ParsedResource {
  frontmatter: ResourceFrontmatter;
  content: string;
}

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
const H1_REGEX = /^#\s+(.+)$/m;

function extractTitleFromMarkdown(markdown: string): { title: string; subtitle: string; content: string } {
  const trimmed = markdown.trim();
  const h1Match = trimmed.match(H1_REGEX);
  if (!h1Match) {
    return { title: "", subtitle: "", content: trimmed };
  }
  const title = h1Match[1].trim();
  const afterH1 = trimmed.slice(trimmed.indexOf(h1Match[0]) + h1Match[0].length).trimStart();
  const paraEnd = afterH1.search(/\n\s*\n/);
  const subtitle = paraEnd === -1 ? afterH1 : afterH1.slice(0, paraEnd).trim();
  const content = paraEnd === -1 ? "" : afterH1.slice(paraEnd).trim();
  return { title, subtitle, content };
}

function stripFrontmatterManually(markdown: string): { frontmatter: ResourceFrontmatter; content: string } {
  const match = markdown.match(FRONTMATTER_REGEX);
  if (!match) {
    const { title, subtitle, content } = extractTitleFromMarkdown(markdown);
    return {
      frontmatter: { title, subtitle, slug: "" },
      content,
    };
  }
  const [, yamlBlock, content] = match;
  const frontmatter: Record<string, string> = {};
  const lines = yamlBlock.split(/\r?\n/);
  let currentKey = "";
  let currentValue = "";

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/\\"/g, '"');
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replace(/\\'/g, "'");
    }

    if (key) {
      if (currentKey) frontmatter[currentKey] = currentValue;
      currentKey = key;
      currentValue = value;
    }
  }
  if (currentKey) frontmatter[currentKey] = currentValue;

  return {
    frontmatter: frontmatter as unknown as ResourceFrontmatter,
    content: content.trim(),
  };
}

export { extractHeadings } from "./extract-headings";

export function parseFrontmatter(markdown: string): ParsedResource {
  const parsed = matter(markdown);
  const { data, content } = parsed;

  const hasValidFrontmatter =
    data &&
    typeof data === "object" &&
    "title" in data &&
    "subtitle" in data &&
    data.title &&
    data.subtitle;

  if (hasValidFrontmatter) {
    return {
      frontmatter: data as ResourceFrontmatter,
      content: content.trim(),
    };
  }

  return stripFrontmatterManually(markdown);
}

const production = {
  Fragment: prod.Fragment,
  jsx: prod.jsx,
  jsxs: prod.jsxs,
};

function H2(props: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <ScrollRevealBlock>
      <SectionHeading level={2} {...props} />
    </ScrollRevealBlock>
  );
}

function H3(props: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <ScrollRevealBlock>
      <SectionHeading level={3} {...props} />
    </ScrollRevealBlock>
  );
}

function P({ children, ...props }: { children?: React.ReactNode }) {
  return (
    <ScrollRevealBlock>
      <p className="text-wise-white/90 text-base leading-relaxed" {...props}>
        {children}
      </p>
    </ScrollRevealBlock>
  );
}

function Strong({ children, ...props }: { children?: React.ReactNode }) {
  return (
    <strong className="font-semibold text-wise-white" {...props}>
      {children}
    </strong>
  );
}

function Em({ children, ...props }: { children?: React.ReactNode }) {
  return (
    <em className="italic text-sm text-wise-white/50" {...props}>
      {children}
    </em>
  );
}

function H1() {
  return null;
}

function Anchor({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
  const className =
    "text-wise-white/90 underline underline-offset-2 hover:text-green-turtle transition-colors inline-flex items-center gap-1.5";
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
        <ExternalLink className="w-3.5 h-3.5 text-green-turtle shrink-0" aria-hidden />
      </a>
    );
  }
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}

/**
 * Converts ::callout and ::source directives to <aside> and blockquote.
 * Supports Google Docs–friendly plain-text syntax.
 */
function preprocessCalloutsAndSources(markdown: string): string {
  const lines = markdown.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ::callout or :callout (Google Docs may strip one colon) - block content until blank line or next directive
    // Skip leading blank lines (e.g. from Google Docs: callout + line break + content)
    if (trimmed === "::callout" || trimmed === ":callout") {
      const contentLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() === "") i++;
      while (i < lines.length) {
        const next = lines[i];
        const nextTrimmed = next.trim();
        if (nextTrimmed === "" || nextTrimmed === ":callout" || nextTrimmed === "::callout" || nextTrimmed.startsWith("::") || nextTrimmed.startsWith(":source")) break;
        contentLines.push(next);
        i++;
      }
      const content = contentLines.join("\n").trim();
      result.push("<aside>", "", content, "", "</aside>", "");
      continue;
    }

    // Strip any existing [Source: ...] wrapper to prevent duplication.
    // Handles: leading "> ", blockquote HTML from Turndown, and [Source: ...] anywhere in content.
    function unwrapSource(raw: string): string {
      let s = raw.replace(/^>\s*/, "").trim();
      // Extract text from blockquote HTML (Turndown keeps blockquote as raw HTML)
      const blockquoteMatch = s.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
      if (blockquoteMatch) {
        s = blockquoteMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
      // Remove all [Source: ...] wrappers (including nested); ] not followed by ( avoids breaking [link](url)
      let prev = "";
      while (prev !== s) {
        prev = s;
        s = s.replace(/\[Source:\s*([\s\S]*?)\](?!\()/gi, (_, inner) => inner.trim());
        s = s.replace(/^\\?\[?Source:\s*/i, "").replace(/\]\s*$/, "");
      }
      // Strip leading backslashes (markdown uses \[ to escape [)
      return s.replace(/^\\+/, "").trim();
    }

    // ::source or :source with inline content: ::source Gauntlet, "Report," 2024
    const sourceInlineMatch = trimmed.match(/^:?::?source\s+(.+)$/);
    if (sourceInlineMatch) {
      const content = unwrapSource(sourceInlineMatch[1]);
      result.push(`> [Source: ${content}]`, "");
      i++;
      continue;
    }

    // ::source or :source - block content until blank line or next directive
    // Skip leading blank lines (e.g. from Google Docs)
    if (trimmed === "::source" || trimmed === ":source") {
      const contentLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() === "") i++;
      while (i < lines.length) {
        const next = lines[i];
        const nextTrimmed = next.trim();
        if (nextTrimmed === "" || nextTrimmed === ":source" || nextTrimmed === "::source" || nextTrimmed.startsWith("::") || nextTrimmed.startsWith(":callout")) break;
        contentLines.push(next);
        i++;
      }
      const content = unwrapSource(contentLines.join(" "));
      result.push(`> [Source: ${content}]`, "");
      continue;
    }

    // Standalone escaped source line: \[Source: ...] (markdown escape)
    const escapedSourceMatch = trimmed.match(/^\\?\s*\[Source:\s*([\s\S]*?)\]\s*$/);
    if (escapedSourceMatch) {
      const content = unwrapSource(trimmed);
      if (content) {
        result.push(`> [Source: ${content}]`, "");
        i++;
        continue;
      }
    }

    result.push(line);
    i++;
  }

  return result.join("\n");
}

function CalloutWithReveal(props: React.ComponentProps<typeof Callout>) {
  return (
    <ScrollRevealBlock>
      <Callout {...props} />
    </ScrollRevealBlock>
  );
}

function SourceCitationWithReveal(props: React.ComponentProps<typeof SourceCitation>) {
  return (
    <ScrollRevealBlock>
      <SourceCitation {...props} />
    </ScrollRevealBlock>
  );
}

function DividerWithReveal() {
  return (
    <ScrollRevealBlock>
      <Divider />
    </ScrollRevealBlock>
  );
}

function BulletListWithReveal(props: React.ComponentProps<typeof BulletList>) {
  return (
    <ScrollRevealBlock>
      <BulletList {...props} />
    </ScrollRevealBlock>
  );
}

function MarkdownTableWithReveal(props: React.ComponentProps<typeof MarkdownTable>) {
  return (
    <ScrollRevealBlock>
      <MarkdownTable {...props} />
    </ScrollRevealBlock>
  );
}

function ResourceHubSectionDiv(props: React.ComponentPropsWithoutRef<"div">) {
  return (
    <ScrollRevealBlock>
      <div {...props} />
    </ScrollRevealBlock>
  );
}

const components = {
  aside: CalloutWithReveal,
  blockquote: SourceCitationWithReveal,
  hr: DividerWithReveal,
  ul: BulletListWithReveal,
  li: BulletListItem,
  table: MarkdownTableWithReveal,
  a: Anchor,
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  strong: Strong,
  em: Em,
  div: (props: React.ComponentPropsWithoutRef<"div">) => {
    const className = props.className;
    const isSection =
      (typeof className === "string" && className.includes("resource-hub-section")) ||
      (Array.isArray(className) && className.includes("resource-hub-section"));
    if (isSection) {
      return <ResourceHubSectionDiv {...props} />;
    }
    return <div {...props} />;
  },
};

export async function markdownToReact(markdown: string): Promise<ReactElement> {
  const processed = preprocessCalloutsAndSources(markdown);
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeAddH2Ids, processed)
    .use(rehypeSectionWrap)
    .use(rehypeReact, {
      ...production,
      components,
      development: false,
    });
  const result = await processor.process(processed);
  return result.result as ReactElement;
}
