import Image from "next/image";
import RelatedContent from "./RelatedContent";
import TalkToUsSection from "./TalkToUsSection";
import type { ResourceCardData } from "../lib/types";

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
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8">
        <img
          src="/media/turtle-big.svg"
          alt="Turtle"
          className="w-auto h-auto mx-auto"
        />
      </div>
    </>
  );
}
