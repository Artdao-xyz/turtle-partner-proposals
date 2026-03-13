export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Strip markdown bold/italic from text for display (e.g. **foo** → foo) */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .trim();
}

/** Remove leading <a id="..."></a> fragments from headings. */
function stripLeadingAnchor(text: string): string {
  return text.replace(/^<a[^>]*>\s*<\/a>\s*/i, "").trim();
}

/** Unescape simple markdown escapes like \- \_ \* in plain text. */
function unescapeSimpleMarkdown(text: string): string {
  return text.replace(/\\([\\`*_{}\[\]()#+\-.!])/g, "$1");
}

export function extractHeadings(content: string): { id: string; text: string }[] {
  const regex = /^## (.+)$/gm;
  const headings: { id: string; text: string }[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const raw = match[1].trim();
    const withoutAnchor = stripLeadingAnchor(raw);
    const unescaped = unescapeSimpleMarkdown(withoutAnchor);
    const text = stripMarkdown(unescaped);
    const id = slugify(unescaped);
    headings.push({ id, text });
  }
  return headings;
}
