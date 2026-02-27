"use client";

import { useRef, useState, useEffect } from "react";
import { FILTER_OPTIONS, type FilterOption } from "../lib/constants";

interface ResourceHubFilterProps {
  selected: FilterOption;
  onSelect: (value: FilterOption) => void;
}

export default function ResourceHubFilter({
  selected,
  onSelect,
}: ResourceHubFilterProps) {
  const options: FilterOption[] = [...FILTER_OPTIONS];
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className="relative w-full">
      {/* Mobile: dropdown (like navigator) */}
      <div className="flex flex-col gap-2.5 md:hidden">
        <div
          className={`overflow-hidden rounded-2xl ${
            mobileOpen ? "rounded-2xl" : "rounded-full"
          }`}
          style={{
            backgroundColor: "#1E1E1E",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-wise-white text-base font-medium">
              {selected}
            </span>
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                mobileOpen ? "rotate-180" : ""
              }`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 12.5L10 7.5L15 12.5"
                  stroke="var(--green-turtle)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {mobileOpen && (
            <div
              className="border-t border-white/10 max-h-[50vh] overflow-y-auto"
              style={{ backgroundColor: "#1E1E1E" }}
            >
              <ul className="space-y-1 py-3 px-4">
                {options.map((option) => {
                  const isSelected = selected === option;
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(option);
                          setMobileOpen(false);
                        }}
                        className={`text-left w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? "text-green-turtle bg-white/5"
                            : "text-white/70 hover:text-wise-white hover:bg-white/5"
                        }`}
                      >
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: horizontal pill bar */}
      <div
        ref={containerRef}
        className="hidden md:flex relative justify-between items-center gap-4 lg:gap-6 bg-wise-white/5 rounded-3xl"
      >
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
    </div>
  );
}
