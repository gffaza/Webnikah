"use client";

import { useEffect, useState } from "react";
import { ArchBackdrop, FloralBackdrop } from "@/components/backdrop";
import type { BackdropType } from "@/components/client/deferred-backdrop";

/**
 * One full layered scene for the whole invite (floral or arch).
 * Tracks the most-visible `[data-backdrop]` section and swaps type.
 * Critical for iOS Safari — many per-section copies were OOMing the tab.
 */
export function SharedInviteBackdrop() {
  const [type, setType] = useState<BackdropType>("floral");

  useEffect(() => {
    const root = document.querySelector(".invite");
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-backdrop]"),
    );
    if (sections.length === 0) return;

    const ratios = new Map<Element, number>();

    const pick = () => {
      let best: Element | null = null;
      let bestRatio = 0;
      for (const [el, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = el;
        }
      }
      if (!best || bestRatio <= 0) return;
      const next = best.getAttribute("data-backdrop");
      if (next === "floral" || next === "arch") {
        setType((current) => (current === next ? current : next));
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }
        pick();
      },
      {
        // Bias toward the section occupying the middle of the screen.
        rootMargin: "-12% 0px -12% 0px",
        threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
      },
    );

    for (const section of sections) io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-1/2 z-0 h-dvh w-full max-w-[480px] -translate-x-1/2 overflow-hidden"
    >
      {type === "arch" ? (
        <ArchBackdrop />
      ) : (
        <FloralBackdrop preload />
      )}
    </div>
  );
}
