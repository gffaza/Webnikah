"use client";

import { useEffect, useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(value).then(() => setCopied(true))}
      aria-label={`Salin ${label}`}
      className="inline-flex items-center gap-8 rounded-card px-8 py-4 text-caption text-ink/70 transition hover:bg-rose/10 hover:text-rose"
    >
      {copied ? (
        <span className="text-rose">Tersalin</span>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-[max(14px,calc(var(--spacing)*28))]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </button>
  );
}
