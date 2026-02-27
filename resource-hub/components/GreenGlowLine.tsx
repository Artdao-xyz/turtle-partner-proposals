"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const SEGMENT_WIDTH_DESKTOP = 100;
const SEGMENT_WIDTH_MOBILE = 60;

export default function GreenGlowLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [endX, setEndX] = useState(0);
  const [segmentWidth, setSegmentWidth] = useState(SEGMENT_WIDTH_DESKTOP);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.offsetWidth;
      const isMobile = width < 640;
      const segWidth = isMobile ? SEGMENT_WIDTH_MOBILE : SEGMENT_WIDTH_DESKTOP;
      setSegmentWidth(segWidth);
      setEndX(Math.max(0, width - segWidth));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full px-4 sm:mx-0 sm:px-0 my-6 sm:my-8 relative h-[6px] sm:h-[10px] overflow-hidden">
      {/* Base line */}
      <div
        className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
        }}
      />
      {/* Animated green segment - travels from left edge to right edge */}
      <motion.div
        className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 rounded-full"
        style={{
          width: segmentWidth,
          background: "linear-gradient(to right, transparent, #73F36C)",
          boxShadow: "0 0 6px 1px rgba(115, 243, 108, 0.5)",
        }}
        animate={{
          x: [0, endX],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeOut",
          repeatDelay: 2,
        }}
      />
    </div>
  );
}
