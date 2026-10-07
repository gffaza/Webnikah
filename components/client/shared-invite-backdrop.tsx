"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ArchBackdrop, FloralBackdrop } from "@/components/backdrop";
import type { BackdropType } from "@/components/client/deferred-backdrop";
import { useIOSWebKit } from "@/components/client/use-ios-webkit";

const FADE_MS = 850;

function LiteScene({ type }: { type: BackdropType }) {
  return type === "arch" ? (
    <ArchBackdrop quality="lite" />
  ) : (
    <FloralBackdrop preload quality="lite" />
  );
}

/**
 * iOS / iPadOS only: one lite layered scene for the whole invite.
 * Crossfades floral ↔ arch so the swap does not blink.
 */
export function SharedInviteBackdrop() {
  const ios = useIOSWebKit();
  const [current, setCurrent] = useState<BackdropType>("floral");
  const [outgoing, setOutgoing] = useState<BackdropType | null>(null);
  const [incomingVisible, setIncomingVisible] = useState(true);
  const [outgoingVisible, setOutgoingVisible] = useState(true);
  const busy = useRef(false);
  const wanted = useRef<BackdropType>("floral");
  const currentRef = useRef<BackdropType>("floral");

  const finishFade = useEffectEvent(() => {
    setOutgoing(null);
    setOutgoingVisible(true);
    busy.current = false;
    if (wanted.current !== currentRef.current) {
      startFade(wanted.current);
    }
  });

  const startFade = useEffectEvent((next: BackdropType) => {
    if (next === currentRef.current) return;
    busy.current = true;
    setOutgoing(currentRef.current);
    setOutgoingVisible(true);
    setIncomingVisible(false);
    setCurrent(next);
    currentRef.current = next;

    // Double rAF so the browser paints opacity:0 before transitioning to 1.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIncomingVisible(true);
        setOutgoingVisible(false);
      });
    });

    window.setTimeout(() => finishFade(), FADE_MS + 50);
  });

  useEffect(() => {
    if (ios !== true) return;

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
      // Ignore weak intersections so boundary flicker does not thrash fades.
      if (!best || bestRatio < 0.2) return;
      const next = best.getAttribute("data-backdrop");
      if (next !== "floral" && next !== "arch") return;
      wanted.current = next;
      if (busy.current) return;
      if (next === currentRef.current) return;
      startFade(next);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }
        pick();
      },
      {
        rootMargin: "-18% 0px -18% 0px",
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
      },
    );

    for (const section of sections) io.observe(section);
    return () => io.disconnect();
  }, [ios]);

  if (ios !== true) return null;

  const fadeStyle = {
    transitionProperty: "opacity",
    transitionDuration: `${FADE_MS}ms`,
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  } as const;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-1/2 z-0 h-dvh w-full max-w-[480px] -translate-x-1/2 overflow-hidden bg-[#f5f2f2]"
      data-backdrop-mode="ios-lite"
    >
      {outgoing != null && (
        <div
          className="absolute inset-0"
          style={{ ...fadeStyle, opacity: outgoingVisible ? 1 : 0 }}
        >
          <LiteScene type={outgoing} />
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{ ...fadeStyle, opacity: incomingVisible ? 1 : 0 }}
      >
        <LiteScene type={current} />
      </div>
    </div>
  );
}
