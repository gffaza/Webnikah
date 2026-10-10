import type { ReactNode } from "react";
import type { BackdropType } from "@/components/client/deferred-backdrop";
import { SectionBackdrop } from "@/components/client/section-backdrop";

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
  background?: BackdropType;
  preload?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-backdrop={background}
      className="relative isolate flex min-h-[var(--invite-frame-min-h)] flex-col overflow-hidden"
    >
      <SectionBackdrop type={background} eager={preload} />
      {panel !== "none" && (
        <div
          aria-hidden
          className={`section-panel absolute -z-10 ${panelClass[panel]}`}
        />
      )}
      <div className={`relative z-[1] flex flex-1 flex-col items-center text-center ${className}`}>
        {children}
      </div>
    </section>
  );
}
