import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

function parseBoldItalicClassesFromStyleBlock(html: string): {
  boldClasses: Set<string>;
  italicClasses: Set<string>;
} {
  const boldClasses = new Set<string>();
  const italicClasses = new Set<string>();
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return { boldClasses, italicClasses };

  const styleContent = styleMatch[1];
  const ruleRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]*)\}/g;
  let ruleMatch;
  while ((ruleMatch = ruleRegex.exec(styleContent)) !== null) {
    const className = ruleMatch[1];
    const decls = ruleMatch[2].toLowerCase();
    const isBold = /font-weight:\s*(700|bold)/.test(decls);
    const isItalic = /font-style:\s*italic/.test(decls);
    if (isBold) boldClasses.add(className);
    if (isItalic) italicClasses.add(className);
  }
  return { boldClasses, italicClasses };
}

function getClassList(node: { getAttribute?: (n: string) => string | null }): string[] {
  const cls = node.getAttribute?.("class") || "";
  return cls.trim().split(/\s+/).filter(Boolean);
}

export function htmlToMarkdown(html: string): string {
  const { boldClasses, italicClasses } = parseBoldItalicClassesFromStyleBlock(html);

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });
  turndown.use(gfm);
  turndown.keep(["blockquote"]);

  // Convert <aside> to ::callout format (not raw aside) for consistency with upload flow
  turndown.addRule("asideToCallout", {
    filter: "aside",
    replacement: (content) => {
      const trimmed = content.trim();
      return `\n\n::callout\n\n${trimmed}\n\n`;
    },
  });

  turndown.addRule("googleBoldItalic", {
    filter: (node) => {
      if (node.nodeName !== "SPAN") return false;
      const classes = getClassList(node);
      const hasBold = classes.some((c) => boldClasses.has(c));
      const hasItalic = classes.some((c) => italicClasses.has(c));
      return hasBold && hasItalic;
    },
    replacement: (content) => `***${content}***`,
  });

  turndown.addRule("googleBold", {
    filter: (node) => {
      if (node.nodeName !== "SPAN") return false;
      const classes = getClassList(node);
      return classes.some((c) => boldClasses.has(c));
    },
    replacement: (content) => `**${content}**`,
  });

  turndown.addRule("googleItalic", {
    filter: (node) => {
      if (node.nodeName !== "SPAN") return false;
      const classes = getClassList(node);
      return classes.some((c) => italicClasses.has(c));
    },
    replacement: (content) => `*${content}*`,
  });

  turndown.addRule("googleBoldItalicInline", {
    filter: (node) => {
      if (node.nodeName !== "SPAN") return false;
      const style = (node.getAttribute?.("style") || "").toLowerCase();
      return /font-weight:\s*(700|bold)/.test(style) && /font-style:\s*italic/.test(style);
    },
    replacement: (content) => `***${content}***`,
  });

  turndown.addRule("googleBoldInline", {
    filter: (node) => {
      if (node.nodeName !== "SPAN") return false;
      const style = (node.getAttribute?.("style") || "").toLowerCase();
      return /font-weight:\s*(700|bold)/.test(style);
    },
    replacement: (content) => `**${content}**`,
  });

  turndown.addRule("googleItalicInline", {
    filter: (node) => {
      if (node.nodeName !== "SPAN") return false;
      const style = (node.getAttribute?.("style") || "").toLowerCase();
      return /font-style:\s*italic/.test(style);
    },
    replacement: (content) => `*${content}*`,
  });

  return turndown.turndown(html);
}
