"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface GoBackButtonProps {
  href?: string;
}

export default function GoBackButton({ href = "/blog" }: GoBackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-1.5 py-1.5 rounded-full transition-colors hover:opacity-90"
      style={{
        backgroundColor: "#141514",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <span
        className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
      >
        <ChevronLeft className="w-4 h-4 text-green-turtle" strokeWidth={2.5} />
      </span>
      <span className="text-wise-white">Go back</span>
    </Link>
  );
}
