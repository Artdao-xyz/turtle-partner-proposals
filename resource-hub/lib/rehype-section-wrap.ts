/**
 * Rehype plugin: wraps content from each h2 until the next hr in a section div
 * with 45px padding for visual hierarchy.
 */
export default function rehypeSectionWrap() {
  return (tree: { children: Array<{ type: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] }> }) => {
    const children = tree.children;
    const newChildren: typeof children = [];
    let i = 0;

    while (i < children.length) {
      const node = children[i];

      if (node.type === "element" && node.tagName === "h2") {
        newChildren.push(node);
        i++;

        const sectionChildren = [];
        while (i < children.length) {
          const next = children[i];
          if (next.type === "element" && next.tagName === "hr") {
            break;
          }
          sectionChildren.push(next);
          i++;
        }

        if (sectionChildren.length > 0) {
          const sectionWrapper = {
            type: "element" as const,
            tagName: "div" as const,
            properties: {
              className: ["resource-hub-section"],
            },
            children: sectionChildren,
          };
          newChildren.push(sectionWrapper as (typeof children)[0]);
        }
      } else {
        newChildren.push(node);
        i++;
      }
    }

    tree.children = newChildren;
  };
}
