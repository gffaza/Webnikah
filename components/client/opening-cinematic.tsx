"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

/** Brief living-backdrop beat — butterflies keep looping; we don't wait for a full cycle. */
const BEAT_MS = 4200;
/** Soft handoff into the next slide (matches cover fade / skip control). */
const EXIT_MS = 700;

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
    const id = window.setTimeout(onComplete, EXIT_MS);
    return () => window.clearTimeout(id);
  }, [exiting, onComplete]);

  return (
    <div
      className={`pointer-events-none fixed top-0 left-1/2 z-40 h-svh w-full max-w-[480px] -translate-x-1/2 transition-opacity duration-700 ease-out ${
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
