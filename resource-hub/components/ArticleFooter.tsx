import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { SourceItem } from "../lib/parse";
import SectionHeading from "./SectionHeading";

const DEFAULT_DISCLAIMER =
  "Including DefiLlama, Dune Analytics, governance forum disclosures, and published retroactive analyses by Gauntlet, Blockworks Research, and OpenBlock Labs. Estimates are labeled as such throughout. For questions about methodology or data, contact the Turtle research team.";

function formatPublishedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface ArticleFooterProps {
  disclaimer?: string;
  sources?: SourceItem[];
  publishedDate?: string;
}

export default function ArticleFooter({ disclaimer, sources, publishedDate }: ArticleFooterProps) {
  const disclaimerText = disclaimer ?? DEFAULT_DISCLAIMER;

  return (
    <footer className="mt-16 space-y-10">
      {/* Attribution + disclaimer - single paragraph with dividers */}
      <div className="py-6 border-y border-white/10">
        <p className="text-sm text-white/60 leading-relaxed max-w-3xl">
          This research was produced by the team at{" "}
          <Link
            href="https://turtle.club"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-turtle underline underline-offset-2 hover:text-green-turtle/90"
          >
            Turtle
          </Link>
          . {disclaimerText}
        </p>
      </div>

      {/* Sources */}
      {sources && sources.length > 0 && (
        <section className="space-y-6">
          <SectionHeading level={2}>Sources</SectionHeading>
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className="mt-1.5 shrink-0 size-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--green-turtle)" }}
                  aria-hidden
                >
                  <svg
                    width="8"
                    height="6"
                    viewBox="0 0 8 6"
                    fill="none"
                    className="text-black-turtle"
                  >
                    <path
                      d="M1 3L3 5L7 1"
                      stroke="var(--black-turtle)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-wise-white/90 text-base leading-relaxed">
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wise-white/90 underline underline-offset-2 hover:text-green-turtle transition-colors inline-flex items-center gap-1.5"
                    >
                      &quot;{source.title}&quot;
                      <ExternalLink className="w-3.5 h-3.5 text-green-turtle shrink-0" />
                    </a>
                  ) : (
                    <>&quot;{source.title}&quot;</>
                  )}
                  <span className="text-wise-white/50 text-sm ml-1">
                    {source.author}
                    {source.year && ` • ${source.year}`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Published date */}
      {publishedDate && (
        <p className="text-white/50 text-xs font-normal font-dm-sans leading-4 text-right">
          Published on {formatPublishedDate(publishedDate)}
        </p>
      )}
    </footer>
  );
}
