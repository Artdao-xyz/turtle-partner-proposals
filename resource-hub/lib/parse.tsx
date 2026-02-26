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

import BulletList from "../components/BulletList";
import { BulletListItem } from "../components/BulletList";
import Callout from "../components/Callout";
import SourceCitation from "../components/SourceCitation";
import Divider from "../components/Divider";
import MarkdownTable from "../components/MarkdownTable";
import SectionHeading from "../components/SectionHeading";

export interface ResourceFrontmatter {
  title: string;
  subtitle: string;
  badge?: string;
  category?: string;
  slug: string;
  heroImage?: string;
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
  return <SectionHeading level={2} {...props} />;
}

function H3(props: React.ComponentPropsWithoutRef<"h3">) {
  return <SectionHeading level={3} {...props} />;
}

function P({ children, ...props }: { children?: React.ReactNode }) {
  return (
    <p className="text-wise-white/90 text-base leading-relaxed mb-[15px] last:mb-0" {...props}>
      {children}
    </p>
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

const components = {
  aside: Callout,
  blockquote: SourceCitation,
  hr: Divider,
  ul: BulletList,
  li: BulletListItem,
  table: MarkdownTable,
  h2: H2,
  h3: H3,
  p: P,
  strong: Strong,
  em: Em,
};

export async function markdownToReact(markdown: string): Promise<ReactElement> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeAddH2Ids, markdown)
    .use(rehypeSectionWrap)
    .use(rehypeReact, {
      ...production,
      components,
      development: false,
    });
  const result = await processor.process(markdown);
  return result.result as ReactElement;
}
