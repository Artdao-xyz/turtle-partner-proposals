import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
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
  slug: string;
  heroImage?: string;
}

export interface ParsedResource {
  frontmatter: ResourceFrontmatter;
  content: string;
}

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function stripFrontmatterManually(markdown: string): { frontmatter: ResourceFrontmatter; content: string } {
  const match = markdown.match(FRONTMATTER_REGEX);
  if (!match) {
    return {
      frontmatter: { title: "", subtitle: "", slug: "" },
      content: markdown.trim(),
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
    <p className="text-wise-white/90 text-base leading-relaxed" {...props}>
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

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeReact, {
    ...production,
    components,
    development: false,
  });

export async function markdownToReact(markdown: string): Promise<ReactElement> {
  const result = await processor.process(markdown);
  return result.result as ReactElement;
}
