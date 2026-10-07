"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArchBackdrop, FloralBackdrop } from "@/components/backdrop";

export type BackdropType = "floral" | "arch";

/**
 * Mounts backdrops when the section nears the viewport.
 * Cover uses `eager`; offscreen sections stay tinted until needed.
 */
export function DeferredBackdrop({
  type,
  eager = false,
}: {
  type: BackdropType;
  eager?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(eager);
  const tint = "#f5f2f2";

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
      { rootMargin: "100% 0px", threshold: 0 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [active]);

  let scene: ReactNode = null;
  if (active) {
    scene =
      type === "arch" ? (
        <ArchBackdrop preload={eager} />
      ) : (
        <FloralBackdrop preload={eager} />
      );
  }

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="absolute inset-0 -z-20"
      style={{ backgroundColor: tint }}
    >
      {scene}
    </div>
  );
}
