"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArchBackdrop, FloralBackdrop } from "@/components/backdrop";

export type BackdropType = "floral" | "arch";

const NEAR_MARGIN = "80% 0px";
const UNMOUNT_DELAY_MS = 450;

/**
 * Rich path (non-iOS): full layered scene per section, mount near viewport.
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
  const unmountTimer = useRef<number | null>(null);
  const tint = "#f5f2f2";

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const clearUnmount = () => {
      if (unmountTimer.current == null) return;
      window.clearTimeout(unmountTimer.current);
      unmountTimer.current = null;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          clearUnmount();
          setActive(true);
          return;
        }
        clearUnmount();
        unmountTimer.current = window.setTimeout(() => {
          setActive(false);
          unmountTimer.current = null;
        }, UNMOUNT_DELAY_MS);
      },
      { rootMargin: NEAR_MARGIN, threshold: 0 },
    );

    io.observe(host);
    return () => {
      io.disconnect();
      clearUnmount();
    };
  }, []);

  let scene: ReactNode = null;
  if (active) {
    scene =
      type === "arch" ? (
        <ArchBackdrop quality="rich" />
      ) : (
        <FloralBackdrop preload={eager} quality="rich" />
      );
  }

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="absolute inset-0 -z-20"
      style={{ backgroundColor: tint }}
      data-backdrop-live={active ? "true" : "false"}
    >
      {scene}
    </div>
  );
}
