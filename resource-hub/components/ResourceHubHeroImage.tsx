interface ResourceHubHeroImageProps {
  className?: string;
  variant?: "article" | "card";
}

export default function ResourceHubHeroImage({
  className = "",
  variant = "article",
}: ResourceHubHeroImageProps) {
  const isCard = variant === "card";
  return (
    <div
      className={`rounded-xl overflow-hidden ${
        isCard ? "w-full h-full" : "w-full aspect-[2.5/1] md:aspect-3/1 mb-8 lg:mb-12"
      } ${className}`.trim()}
      style={{
        backgroundColor: "var(--black-turtle)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <svg
        viewBox="0 0 400 160"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Grid pattern */}
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="whiteSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--wise-white)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--wise-white)" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Background with grid */}
        <rect width="400" height="160" fill="var(--black-turtle)" />
        <rect width="400" height="160" fill="url(#grid)" />

        {/* Isometric projection: 30° angle, scale for bar dimensions */}
        {/* Origin at center bottom. Left bar ~x=100, Right bar ~x=260 */}
        {/* Isometric: x' = x*cos(30) - y*cos(30), y' = y*sin(30) + x*sin(30) - z */}
        {/* Simplified: right axis = (0.866, 0.5), left axis = (-0.866, 0.5), up = (0, -1) */}

        <g transform="translate(200, 130)">
          {/* LEFT BAR - Short white (~30% height) */}
          {/* Dashed outline - full height isometric column wireframe */}
          <g stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" strokeDasharray="5 4">
            <line x1="-32" y1="0" x2="-32" y2="-75" />
            <line x1="32" y1="0" x2="32" y2="-75" />
            <line x1="0" y1="35" x2="0" y2="-40" />
            <line x1="-32" y1="-75" x2="0" y2="-115" />
            <line x1="0" y1="-115" x2="32" y2="-75" />
            <line x1="-32" y1="-75" x2="32" y2="-75" />
          </g>
          {/* Solid white bar - 3 faces (isometric cube at ~30% height) */}
          <g transform="translate(0, 24)">
            {/* Top face - brightest */}
            <path
              d="M -28 -22 L 0 -44 L 28 -22 L 0 0 Z"
              fill="var(--wise-white)"
              opacity="0.95"
            />
            {/* Left face */}
            <path
              d="M -28 18 L -28 -22 L 0 0 L 0 40 Z"
              fill="url(#whiteSide)"
            />
            {/* Right face */}
            <path
              d="M 28 18 L 28 -22 L 0 0 L 0 40 Z"
              fill="var(--wise-white)"
              opacity="0.6"
            />
          </g>

          {/* RIGHT BAR - Tall green (~70% height) */}
          {/* Dashed outline - full height isometric column wireframe */}
          <g transform="translate(120, 0)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" strokeDasharray="5 4">
            <line x1="-32" y1="0" x2="-32" y2="-75" />
            <line x1="32" y1="0" x2="32" y2="-75" />
            <line x1="0" y1="35" x2="0" y2="-40" />
            <line x1="-32" y1="-75" x2="0" y2="-115" />
            <line x1="0" y1="-115" x2="32" y2="-75" />
            <line x1="-32" y1="-75" x2="32" y2="-75" />
          </g>
          {/* Solid green bar - taller */}
          <g transform="translate(120, -56)">
            {/* Top face */}
            <path
              d="M -28 -22 L 0 -44 L 28 -22 L 0 0 Z"
              fill="var(--green-turtle)"
              opacity="0.95"
            />
            {/* Left face - darker */}
            <path
              d="M -28 18 L -28 -22 L 0 0 L 0 40 Z"
              fill="var(--green-turtle)"
              opacity="0.5"
            />
            {/* Right face */}
            <path
              d="M 28 18 L 28 -22 L 0 0 L 0 40 Z"
              fill="var(--green-turtle)"
              opacity="0.7"
            />
            {/* Extended height - middle section */}
            <path
              d="M -28 18 L -28 58 L 0 80 L 0 40 Z"
              fill="var(--green-turtle)"
              opacity="0.5"
            />
            <path
              d="M 28 18 L 28 58 L 0 80 L 0 40 Z"
              fill="var(--green-turtle)"
              opacity="0.65"
            />
            <path
              d="M -28 58 L 0 80 L 28 58 L 0 36 Z"
              fill="var(--green-turtle)"
              opacity="0.6"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
