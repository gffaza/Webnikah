"use client";

import { useEffect, useRef } from "react";
import { ArchBackdrop, FloralBackdrop } from "@/components/backdrop";
import { useIOSWebKit } from "@/components/client/use-ios-webkit";

/** Hermite smoothstep — softer than a linear mix at the ends. */
function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * iOS / iPadOS only.
 * Both scenes stay mounted; opacity follows a scroll-weighted floral/arch mix
 * (updated on the compositor via refs — no remount blink).
 */
export function SharedInviteBackdrop() {
  const ios = useIOSWebKit();
  const floralRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const archMixRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (ios !== true) return;

    const root = document.querySelector(".invite");
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-backdrop]"),
    );
    if (sections.length === 0) return;

    const ratios = new Map<Element, number>();

    const apply = (mix: number) => {
      const archOpacity = smoothstep(mix);
      const floralOpacity = 1 - archOpacity;
      const floralEl = floralRef.current;
      const archEl = archRef.current;
      if (floralEl) {
        floralEl.style.opacity = String(floralOpacity);
        floralEl.dataset.sceneLive = floralOpacity > 0.04 ? "true" : "false";
      }
      if (archEl) {
        archEl.style.opacity = String(archOpacity);
        archEl.dataset.sceneLive = archOpacity > 0.04 ? "true" : "false";
      }
    };

    const sampleTarget = () => {
      let floral = 0;
      let arch = 0;
      for (const section of sections) {
        const ratio = ratios.get(section) ?? 0;
        if (ratio <= 0) continue;
        const kind = section.getAttribute("data-backdrop");
        if (kind === "arch") arch += ratio;
        else if (kind === "floral") floral += ratio;
      }
      const total = floral + arch;
      targetRef.current = total > 0 ? arch / total : 0;
    };

    const tick = () => {
      rafRef.current = null;
      const target = targetRef.current;
      const current = archMixRef.current;
      // Soft follow — feels tied to scroll without hard cuts.
      const next = current + (target - current) * 0.16;
      const settled = Math.abs(target - next) < 0.0008 ? target : next;
      archMixRef.current = settled;
      apply(settled);
      if (settled !== target) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const kick = () => {
      sampleTarget();
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }
        kick();
      },
      {
        threshold: [
          0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
          0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1,
        ],
      },
    );

    for (const section of sections) io.observe(section);
    apply(0);
    kick();

    return () => {
      io.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [ios]);

  if (ios !== true) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-1/2 z-0 h-dvh w-full max-w-[480px] -translate-x-1/2 overflow-hidden bg-[#f5f2f2]"
      data-backdrop-mode="ios-lite"
    >
      <div
        ref={floralRef}
        className="ios-backdrop-scene absolute inset-0"
        data-scene-live="true"
        style={{ opacity: 1, willChange: "opacity", transform: "translateZ(0)" }}
      >
        <FloralBackdrop preload quality="lite" />
      </div>
      <div
        ref={archRef}
        className="ios-backdrop-scene absolute inset-0"
        data-scene-live="false"
        style={{ opacity: 0, willChange: "opacity", transform: "translateZ(0)" }}
      >
        <ArchBackdrop quality="lite" />
      </div>
    </div>
  );
}
