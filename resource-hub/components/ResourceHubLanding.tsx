"use client";

import Image from "next/image";

export default function ResourceHubLanding() {
  return (
    <div className="w-full space-y-8 sm:space-y-12 lg:space-y-16">
      {/* Title Section - same style as LiquidityPrograms / partners */}
      <div className="flex flex-col gap-2 sm:gap-2.5 items-center text-center px-1">
        <h1
          className="text-2xl sm:text-3xl lg:text-5xl font-medium text-wise-white tracking-[-0.15px] leading-[1.2]"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          The Resource Hub
        </h1>
        <p className="text-base sm:text-lg lg:text-[18px] font-light font-dm-sans text-white/50 tracking-[-0.216px] leading-[1.2]">
          Discover the latest insights from Turtle
        </p>
      </div>

      {/* Latest updates section heading */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5">
        <Image src="/media/dot.svg" alt="" width={14} height={14} className="sm:w-4 sm:h-4" />
        <h2
          className="text-lg sm:text-xl text-wise-white tracking-[-0.336px] leading-[1.2] text-center"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Latest updates
        </h2>
      </div>
    </div>
  );
}
