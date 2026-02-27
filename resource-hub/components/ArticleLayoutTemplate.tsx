import Image from "next/image";
import RelatedContent from "./RelatedContent";
import TalkToUsSection from "./TalkToUsSection";
import type { ResourceCardData } from "../lib/getResource";

interface ArticleLayoutTemplateProps {
  currentSlug: string;
  resources: ResourceCardData[];
}

/**
 * Layout template for article pages.
 * Fixed structure: Related Content → Building a liquidity program → Turtle logo
 */
export default function ArticleLayoutTemplate({
  currentSlug,
  resources,
}: ArticleLayoutTemplateProps) {
  return (
    <>
      <RelatedContent currentSlug={currentSlug} resources={resources} />
      <TalkToUsSection />
        <img
          src="/media/turtle-big.svg"
          alt="Turtle"
          className="w-auto h-auto mx-auto"
        />
    </>
  );
}
