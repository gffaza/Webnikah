import type { ReactNode } from "react";
import { ArchBackdrop, FloralBackdrop } from "@/components/backdrop";

type Panel =
  /** Rounded translucent card used on most frames (Rectangle 17/18 in Figma). */
  | "card"
  /** Pill-shaped arch used on the cover (CSS overlay on floral background). */
  | "arch"
  /** Narrow rectangle from the Video Prewed frame. */
  | "frame"
  /** Wide rectangle from the Our Gallery frame. */
  | "gallery"
  | "none";

/** Floral = layered asset composition. Arch = peach pill + vines + lilies. */
type Background = "floral" | "arch";

const panelClass: Record<Exclude<Panel, "none">, string> = {
  card: "inset-x-70 top-70 bottom-108 rounded-panel bg-cream/75",
  arch: "inset-x-142 top-155 bottom-154 rounded-full bg-blush/90",
  frame: "inset-x-142 top-155 bottom-154 rounded-card bg-cream/60",
  gallery: "inset-x-110 top-155 bottom-27 rounded-card bg-cream/75",
};

export function Section({
  id,
  panel = "card",
  background = "floral",
  preload = false,
  className = "",
  children,
}: {
  id: string;
  panel?: Panel;
  background?: Background;
  preload?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative isolate flex min-h-[calc(100cqw*16/9)] flex-col overflow-hidden"
    >
      {background === "arch" ? (
        <ArchBackdrop />
      ) : (
        <FloralBackdrop preload={preload} />
      )}
      {panel !== "none" && (
        <div aria-hidden className={`absolute -z-10 ${panelClass[panel]}`} />
      )}
      <div className={`relative z-[1] flex flex-1 flex-col items-center text-center ${className}`}>
        {children}
      </div>
    </section>
  );
}
