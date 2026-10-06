"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

/** How long the living-backdrop beat holds before scrolling to the next slide. */
const BEAT_MS = 2800;

/**
 * Opening beat after "Buka Undangan" — background assets drift, then we unlock + scroll.
 * Video clips are intentionally omitted for now (they stacked poorly).
 * Client-only (gesture timing) — the invite shell stays a Server Component.
 */
export function OpeningCinematic({ onComplete }: { onComplete: () => void }) {
  const finished = useRef(false);
  const [exiting, setExiting] = useState(false);

  const finish = useEffectEvent(() => {
    if (finished.current) return;
    finished.current = true;
    setExiting(true);
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const timeout = window.setTimeout(finish, BEAT_MS);
    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  useEffect(() => {
    if (!exiting) return;
    const id = window.setTimeout(onComplete, 450);
    return () => window.clearTimeout(id);
  }, [exiting, onComplete]);

  return (
    <div
      className={`pointer-events-none fixed top-0 left-1/2 z-40 h-dvh w-full max-w-[480px] -translate-x-1/2 transition-opacity duration-500 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <button
        type="button"
        onClick={finish}
        className="pointer-events-auto absolute right-16 bottom-16 rounded-full bg-ink/45 px-20 py-10 text-caption tracking-[0.08em] text-white backdrop-blur-sm transition hover:bg-ink/60"
      >
        Lewati
      </button>
    </div>
  );
}
