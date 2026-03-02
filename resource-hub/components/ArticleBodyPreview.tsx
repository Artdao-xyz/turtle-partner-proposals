"use client";

import { useState, useEffect } from "react";
import { markdownToReact } from "../lib/parse";

interface ArticleBodyPreviewProps {
  body: string;
}

export default function ArticleBodyPreview({ body }: ArticleBodyPreviewProps) {
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (!body) {
      setContent(null);
      return;
    }
    markdownToReact(body).then(setContent);
  }, [body]);

  if (!content) return <div className="animate-pulse text-wise-white/50">Loading…</div>;
  return <>{content}</>;
}
