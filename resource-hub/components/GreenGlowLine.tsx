"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const SEGMENT_WIDTH = 100;

export default function GreenGlowLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [endX, setEndX] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateEndX = () => {
      const width = el.offsetWidth;
      setEndX(Math.max(0, width - SEGMENT_WIDTH));
    };

    updateEndX();
    const observer = new ResizeObserver(updateEndX);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full my-8 relative h-[10px] overflow-hidden">
      {/* Base line */}
      <div
        className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 80%, transparent 100%)",
        }}
      />
      {/* Animated green segment - travels from left edge to right edge */}
      <motion.div
        className="absolute top-1/2 left-0 w-[100px] h-[2px] -translate-y-1/2 rounded-full"
        style={{
          background: "linear-gradient(to right, transparent, #73F36C)",
          boxShadow: "0 0 8px 1px rgba(115, 243, 108, 0.5)",
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
