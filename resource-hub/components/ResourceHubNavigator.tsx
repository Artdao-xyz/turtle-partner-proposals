"use client";

import { useState, useEffect } from "react";

interface NavItem {
  id: string;
  text: string;
}

interface ResourceHubNavigatorProps {
  items: NavItem[];
}

function NavItemButton({
  item,
  activeId,
  onClick,
}: {
  item: NavItem;
  activeId: string | null;
  onClick: (id: string) => void;
}) {
  return (
  <li key={item.id}>
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className={`text-left w-full py-1 px-3 -ml-3 border-l-2 transition-colors duration-200 cursor-pointer ${
        activeId === item.id
          ? "border-green-turtle text-wise-white font-medium"
          : "border-transparent text-white/50 hover:text-white/70"
      }`}
    >
      <span className="text-sm leading-snug">{item.text}</span>
    </button>
  </li>
  );
}

export default function ResourceHubNavigator({ items }: ResourceHubNavigatorProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <nav className="hidden lg:block flex-1 min-w-56 sticky top-40 self-start pt-8 pl-6 pr-4 pb-4 bg-[#f9f9f9]/2 rounded-3xl">
        <ul className="space-y-4">
          {items.map((item) => (
          <NavItemButton key={item.id} item={item} activeId={activeId} onClick={handleClick} />
        ))}
        </ul>
      </nav>

      {/* Mobile: fixed bottom bar + expandable menu */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
        <div
          className={`overflow-hidden ${
            mobileMenuOpen ? "rounded-2xl" : "rounded-full"
          }`}
          style={{
            backgroundColor: "#1E1E1E",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="w-full flex items-center justify-between px-2.5 py-2 text-left"
          >
            <span className="text-wise-white text-base font-medium">
              Explore content
            </span>
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                mobileMenuOpen ? "rotate-180" : ""
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

          {mobileMenuOpen && (
            <div
              className="border-t border-white/10 max-h-[60vh] overflow-y-auto"
              style={{ backgroundColor: "#1E1E1E" }}
            >
              <ul className="space-y-1 py-3 px-4">
                {items.map((item) => (
          <NavItemButton key={item.id} item={item} activeId={activeId} onClick={handleClick} />
        ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
