import type { SourceItem } from "../article-schema";

/** Extract real URL from Google redirect (url?q=...) */
export function resolveGoogleRedirectUrl(url: string): string {
  const match = url.match(/[?&]q=([^&]+)/);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return url;
    }
  }
  return url;
}

export function parseSourcesSection(body: string): { sources: SourceItem[]; bodyWithoutSources: string } {
  const normalized = body.replace(/\r\n/g, "\n");
  const match = normalized.match(/(?:^|\n)(#+\s*Sources\s*\n)([\s\S]*?)(?=\n#+\s|$)/i);
  if (!match) return { sources: [], bodyWithoutSources: body };

  const sectionContent = match[2].trim();
  const bodyWithoutSources = normalized
    .replace(match[0], "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const sources: SourceItem[] = [];
  const lines = sectionContent.split(/\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    let remaining = line;

    const yearMatch = remaining.match(/\s+(19|20)\d{2}\s*$/);
    const year = yearMatch ? yearMatch[0].trim() : undefined;
    if (yearMatch) remaining = remaining.slice(0, yearMatch.index).trim();

    const items: { title: string; url?: string }[] = [];

    const linkRegex = /\[(?:")?([^\]]+)(?:")?\]\(([^)]+)\)/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(line)) !== null) {
      const url = resolveGoogleRedirectUrl(linkMatch[2]);
      items.push({ title: linkMatch[1].trim().replace(/^"|"$/g, ""), url });
    }

    if (items.length === 0) {
      const quotedRegex = /"([^"]+)"(?: and "([^"]+)")?/g;
      let qMatch;
      while ((qMatch = quotedRegex.exec(line)) !== null) {
        items.push({ title: qMatch[1] });
        if (qMatch[2]) items.push({ title: qMatch[2] });
      }
    }

    if (items.length === 0) {
      const lastPhrase = remaining.match(/\s+([A-Z][A-Za-z0-9.\s()]+)$/);
      const authorStr = lastPhrase ? lastPhrase[1].trim() : "";
      const titleStr = lastPhrase
        ? remaining.slice(0, lastPhrase.index).trim().replace(/^"|"$/g, "")
        : remaining.replace(/^"|"$/g, "").trim();
      if (titleStr) {
        sources.push({ title: titleStr, author: authorStr || "—", year });
      }
      continue;
    }

    const author = remaining
      .replace(/\[(?:")?[^\]]+(?:")?\]\([^)]+\)/g, "")
      .replace(/"([^"]+)"/g, "")
      .replace(/\s+and\s+/g, " ")
      .trim();

    for (const item of items) {
      if (item.title.trim()) {
        sources.push({
          title: item.title.trim(),
          url: item.url,
          author: author || "—",
          year,
        });
      }
    }
  }

  return { sources, bodyWithoutSources };
}
