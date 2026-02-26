"use client";

import { useState, useEffect } from "react";

interface NavItem {
  id: string;
  text: string;
}

interface ResourceHubNavigatorProps {
  items: NavItem[];
}

export default function ResourceHubNavigator({ items }: ResourceHubNavigatorProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "0px 0px -50% 0px",
        threshold: 0,
      }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (items.length === 0) return null;

  return (
    <nav className="hidden lg:block flex-1 min-w-56 sticky top-40 self-start pt-8 pl-6 pr-4 pb-4 bg-[#f9f9f9]/2 rounded-3xl">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleClick(item.id)}
              className={`text-left w-full py-1 px-3 -ml-3 border-l-2 transition-colors duration-200 cursor-pointer ${
                activeId === item.id
                  ? "border-green-turtle text-wise-white font-medium"
                  : "border-transparent text-white/50 hover:text-white/70"
              }`}
            >
              <span className="text-sm leading-snug">{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
