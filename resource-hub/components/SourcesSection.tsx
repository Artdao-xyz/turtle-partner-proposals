import SectionHeading from "./SectionHeading";

const SOURCES = [
  { name: "Nansen", url: "https://www.nansen.ai/research/defi-report-2023" },
  { name: "Dune Analytics", url: "https://dune.com" },
  { name: "Token Terminal", url: "https://tokenterminal.com" },
  { name: "DeFi Llama", url: "https://defillama.com" },
  { name: "Messari", url: "https://messari.io" },
  { name: "The Block", url: "https://www.theblock.co" },
];

export default function SourcesSection() {
  return (
    <section className="space-y-6">
      <SectionHeading level={2}>Sources</SectionHeading>
      <ul className="space-y-3">
        {SOURCES.map((source, index) => (
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
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wise-white/90 text-base leading-relaxed underline underline-offset-2 hover:text-green-turtle transition-colors"
            >
              {source.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
