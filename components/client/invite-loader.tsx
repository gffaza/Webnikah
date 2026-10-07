"use client";

import { useEffect, useEffectEvent, useState } from "react";
import {
  collectInviteAssets,
  preloadInviteAssets,
  warmUpcomingAssets,
} from "@/lib/preload-assets";
import { wedding } from "@/content/wedding";

/** Keep splash short on real mobile networks — cover assets only. */
const MIN_MS = 600;
const MAX_MS = 6000;

/**
 * Full-screen gate while cover assets decode.
 * Does not wait on gallery / music (those load after open).
 */
export function InviteLoader({ onReady }: { onReady: () => void }) {
  const [ratio, setRatio] = useState(0);
  const [exiting, setExiting] = useState(false);
  const percent = Math.min(100, Math.round(ratio * 100));

  const finish = useEffectEvent(() => {
    setExiting(true);
  });

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();
    const assets = collectInviteAssets(wedding);

    const hardCap = window.setTimeout(() => {
      if (!cancelled) finish();
    }, MAX_MS);

    preloadInviteAssets(assets, (progress) => {
      if (!cancelled) setRatio(progress.ratio);
    }).then(async () => {
      if (cancelled) return;
      const elapsed = performance.now() - started;
      const wait = Math.max(0, MIN_MS - elapsed);
      if (wait > 0) await new Promise((r) => window.setTimeout(r, wait));
      if (!cancelled) finish();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(hardCap);
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;
    warmUpcomingAssets(wedding);
    const id = window.setTimeout(onReady, 420);
    return () => window.clearTimeout(id);
  }, [exiting, onReady]);

  const couple = `${wedding.bride.nickname} & ${wedding.groom.nickname}`;

  return (
    <div
      className={`fixed top-0 left-1/2 z-[60] flex h-dvh w-full max-w-[480px] -translate-x-1/2 flex-col items-center justify-center bg-[#f3e6df] px-48 transition-opacity duration-500 ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label="Memuat undangan"
    >
      <div
        aria-hidden
        className="invite-loader-glow pointer-events-none absolute inset-0"
      />

      <p className="relative text-caption tracking-[0.22em] text-ink/55 uppercase">
        The Wedding of
      </p>
      <h1 className="relative mt-20 font-script text-[clamp(2.75rem,12vw,4.25rem)] leading-none text-rose">
        {couple}
      </h1>
      <p className="relative mt-28 text-caption tracking-[0.14em] text-ink/50">
        {wedding.dateLabel.weekday}, {wedding.dateLabel.day}{" "}
        {wedding.dateLabel.monthYear}
      </p>

      <div className="relative mt-80 w-full max-w-520">
        <div className="h-[2px] overflow-hidden rounded-full bg-rose/15">
          <div
            className="h-full origin-left rounded-full bg-rose transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-20 text-center text-caption tracking-[0.18em] text-ink/45 tabular-nums">
          Memuat · {percent}%
        </p>
      </div>
    </div>
  );
}
