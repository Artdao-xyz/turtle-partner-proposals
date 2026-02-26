"use client";

import { useRef, useState, useEffect } from "react";
import type { FilterOption } from "../lib/getResource";

interface ResourceHubFilterProps {
  selected: FilterOption;
  onSelect: (value: FilterOption) => void;
}

export default function ResourceHubFilter({
  selected,
  onSelect,
}: ResourceHubFilterProps) {
  const options: FilterOption[] = [
    "All",
    "Guides",
    "Playbooks",
    "Research",
    "Comparisons",
    "Updates",
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const updatePillPosition = () => {
    const index = options.indexOf(selected);
    const button = buttonRefs.current[index];
    const container = containerRef.current;
    if (button && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setPillStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  };

  useEffect(() => {
    updatePillPosition();
    window.addEventListener("resize", updatePillPosition);
    return () => window.removeEventListener("resize", updatePillPosition);
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-between items-center gap-4 md:gap-6 bg-wise-white/5 rounded-3xl"
    >
      {/* Sliding pill indicator */}
      <div
        className="absolute top-0 bottom-0 rounded-full bg-white/10 transition-[left,width] duration-300 ease-out"
        style={{ left: pillStyle.left, width: pillStyle.width }}
      />
      {options.map((option, index) => {
        const isSelected = selected === option;
        return (
          <button
            key={option}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            onClick={() => onSelect(option)}
            className={`relative z-10 w-full px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200
              ${isSelected ? "text-green-turtle" : "text-white/50 hover:text-white/70"}
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
