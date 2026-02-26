import { extractHeadings } from "./extract-headings";

/**
 * Rehype plugin: adds id attributes to h2 elements based on their text content.
 * Pass content (markdown body) as option to match headings in order.
 */
export default function rehypeAddH2Ids(content: string) {
  const headings = extractHeadings(content);
  let headingIndex = 0;

  return (tree: { children: Array<{ type: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] }> }) => {
    const visit = (nodes: typeof tree.children) => {
      for (const node of nodes) {
        if (node.type === "element" && node.tagName === "h2" && headingIndex < headings.length) {
          const heading = headings[headingIndex];
          if (heading) {
            node.properties = node.properties || {};
            node.properties.id = heading.id;
            headingIndex++;
          }
        }
        if (node.type === "element" && Array.isArray(node.children)) {
          visit(node.children as typeof tree.children);
        }
      }
    };
    visit(tree.children);
  };
}
