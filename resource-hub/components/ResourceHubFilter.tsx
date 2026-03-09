"use client";

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

  return (
    <div
      className="flex items-center justify-start overflow-x-auto scrollbar-hide
        sm:bg-wise-white/5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] md:rounded-full
        p-[5px] gap-4
        md:gap-0 md:p-0 md:justify-center md:overflow-visible"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`
              shrink-0 h-[38px] px-[5px]
              flex items-center justify-center
              text-sm font-medium cursor-pointer
              transition-colors duration-200
              md:flex-1 md:min-w-0 md:px-[8px]
              md:rounded-full
              ${isSelected
                ? "text-green-turtle border-b border-green-turtle md:border-0 md:bg-white/10"
                : "text-white/50 hover:text-white/70 sm:border-b sm:border-white/10 md:border-0"
              }
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
