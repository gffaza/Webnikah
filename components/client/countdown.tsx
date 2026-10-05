"use client";

import { useEffect, useState } from "react";

const units = [
  { label: "Hari", ms: 86_400_000 },
  { label: "Jam", ms: 3_600_000 },
  { label: "Menit", ms: 60_000 },
  { label: "Detik", ms: 1_000 },
] as const;

function split(remaining: number) {
  let rest = Math.max(0, remaining);
  return units.map(({ label, ms }) => {
    const value = Math.floor(rest / ms);
    rest -= value * ms;
    return { label, value };
  });
}

export function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  // Null on the server and first client render so the prerendered HTML matches hydration.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = now === null ? units.map(({ label }) => ({ label, value: null })) : split(targetMs - now);

  return (
    <div className="grid grid-cols-4 gap-24" role="timer" aria-live="off">
      {parts.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-card bg-white/80 px-16 py-20 shadow-sm"
        >
          <span className="text-h2 font-bold text-rose tabular-nums">
            {value === null ? "--" : String(value).padStart(2, "0")}
          </span>
          <span className="text-caption text-ink/70">{label}</span>
        </div>
      ))}
    </div>
  );
}
