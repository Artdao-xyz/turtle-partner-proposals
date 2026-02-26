interface CheckmarkListProps {
  items: string[];
  className?: string;
}

export default function CheckmarkList({ items, className = "" }: CheckmarkListProps) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
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
          <span className="text-wise-white/90 text-base leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
