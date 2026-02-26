interface ResourceHubTitleProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export default function ResourceHubTitle({ title, subtitle, badge }: ResourceHubTitleProps) {
  return (
    <header className="space-y-6 mb-16 max-w-4xl">
      {/* Badge - only show if provided */}
      {badge && (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <rect
            x="3"
            y="8"
            width="2"
            height="5"
            rx="1"
            fill="var(--green-turtle)"
          />
          <rect
            x="7"
            y="5"
            width="2"
            height="8"
            rx="1"
            fill="var(--green-turtle)"
          />
          <rect
            x="11"
            y="2"
            width="2"
            height="11"
            rx="1"
            fill="var(--green-turtle)"
          />
        </svg>
        <span className="text-sm font-medium text-wise-white">{badge}</span>
      </div>
      )}

      {/* Main title - break at colon if present */}
      <h1 className="font-dm-sans font-semibold text-wise-white text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight mb-[15px]">
        {title.includes(": ") ? (
          <>
            {title.split(": ")[0]}:
            <br />
            {title.split(": ").slice(1).join(": ")}
          </>
        ) : (
          title
        )}
      </h1>

      {/* Subtitle */}
      <p className="font-light text-white/50 text-lg leading-relaxed" style={{ fontFamily: "var(--font-montserrat)" }}>
        {subtitle}
      </p>
    </header>
  );
}
