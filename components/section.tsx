import Image from "next/image";
import type { ReactNode } from "react";

type Panel =
  /** Rounded translucent card used on most frames (Rectangle 17/18 in Figma). */
  | "card"
  /** Pill-shaped arch used on the cover and event frames. */
  | "arch"
  /** Salmon arch from the Our Story frame. */
  | "arch-story"
  /** Narrow rectangle from the Video Prewed frame. */
  | "frame"
  /** Wide rectangle from the Our Gallery frame. */
  | "gallery"
  | "none";

const panelClass: Record<Exclude<Panel, "none">, string> = {
  card: "inset-x-70 top-70 bottom-108 rounded-panel bg-cream/75",
  arch: "inset-x-142 top-155 bottom-154 rounded-full bg-blush/90",
  "arch-story": "inset-x-142 top-155 bottom-154 rounded-full bg-story/95",
  frame: "inset-x-142 top-155 bottom-154 rounded-card bg-cream/60",
  gallery: "inset-x-110 top-155 bottom-27 rounded-card bg-cream/75",
};

export function Section({
  id,
  panel = "card",
  preload = false,
  className = "",
  children,
}: {
  id: string;
  panel?: Panel;
  preload?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative isolate flex min-h-[calc(100cqw*16/9)] flex-col overflow-hidden"
    >
      <Image
        src="/images/bg-floral.webp"
        alt=""
        fill
        preload={preload}
        sizes="480px"
        className="-z-20 object-cover object-bottom"
      />
      {panel !== "none" && (
        <div aria-hidden className={`absolute -z-10 ${panelClass[panel]}`} />
      )}
      <div className={`flex flex-1 flex-col items-center text-center ${className}`}>
        {children}
      </div>
    </section>
  );
}