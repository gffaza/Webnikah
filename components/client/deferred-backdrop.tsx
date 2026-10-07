"use client";

import { useEffect, useRef, useState } from "react";
import { ArchBackdrop, FloralBackdrop } from "@/components/backdrop";

type Background = "floral" | "arch";

/**
 * Mounts heavy layered backdrops only when the section nears the viewport.
 * Cover uses `eager` so the first paint stays complete; offscreen sections
 * stay as a solid tint until needed — critical for iOS Safari memory.
 */
export function DeferredBackdrop({
  type,
  eager = false,
}: {
  type: Background;
  eager?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(eager);
  const tint = type === "arch" ? "bg-[#f8f4f0]" : "bg-[#f7f1ec]";

  useEffect(() => {
    if (active) return;
    const host = hostRef.current;
    if (!host) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setActive(true);
        io.disconnect();
      },
      // Prefetch roughly one viewport ahead so scroll stays smooth.
      { rootMargin: "80% 0px", threshold: 0 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [active]);

  return (
    <div ref={hostRef} aria-hidden className={`absolute inset-0 -z-20 ${tint}`}>
      {active ? (
        type === "arch" ? (
          <ArchBackdrop preload={eager} />
        ) : (
          <FloralBackdrop preload={eager} />
        )
      ) : null}
    </div>
  );
}
