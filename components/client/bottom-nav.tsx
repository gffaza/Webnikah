"use client";

import { useEffect, useState } from "react";
import { useGate } from "@/components/client/invitation-gate";

/** Sequential “slides” after the cover — prev/next walks this list. */
const SLIDES = [
  "intro",
  "mempelai-wanita",
  "mempelai-pria",
  "acara",
  "video",
  "cerita",
  "galeri",
  "hadiah",
  "rsvp",
  "penutup",
] as const;

type SlideId = (typeof SLIDES)[number];

const NAV = [
  { id: "intro" as const, label: "Beranda", Icon: HomeIcon },
  { id: "mempelai-wanita" as const, label: "Mempelai", Icon: HeartIcon },
  { id: "acara" as const, label: "Acara", Icon: CalendarIcon },
  { id: "galeri" as const, label: "Galeri", Icon: GalleryIcon },
  { id: "rsvp" as const, label: "RSVP", Icon: WishIcon },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function BottomNav() {
  const { opened } = useGate();
  const [active, setActive] = useState<SlideId | "cover">("intro");

  useEffect(() => {
    if (!opened) return;

    const ids = ["cover", ...SLIDES];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!nodes.length) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActive(bestId as SlideId | "cover");
      },
      {
        // Bias toward the vertically centered panel in the phone column.
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [opened]);

  if (!opened || active === "cover") return null;

  const index = SLIDES.indexOf(active as SlideId);
  const prevId = index > 0 ? SLIDES[index - 1] : null;
  const nextId = index >= 0 && index < SLIDES.length - 1 ? SLIDES[index + 1] : null;

  return (
    <nav
      aria-label="Navigasi undangan"
      className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 px-[12px] pb-[max(10px,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto flex items-center gap-[4px] rounded-[22px] border border-rose/15 bg-cream/90 px-[6px] py-[6px] shadow-[0_8px_28px_rgb(31_26_27/0.12)] backdrop-blur-md">
        <NavArrow
          label="Bagian sebelumnya"
          disabled={!prevId}
          onClick={() => prevId && scrollToId(prevId)}
          direction="prev"
        />

        <ul className="flex min-w-0 flex-1 items-stretch justify-between gap-[2px]">
          {NAV.map(({ id, label, Icon }) => {
            const isActive =
              active === id ||
              (id === "mempelai-wanita" &&
                (active === "mempelai-wanita" || active === "mempelai-pria"));
            return (
              <li key={id} className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => scrollToId(id)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={label}
                  className={`flex w-full flex-col items-center gap-[3px] rounded-[14px] px-[2px] py-[8px] transition ${
                    isActive
                      ? "bg-rose text-white"
                      : "text-ink/55 hover:bg-blush hover:text-rose-deep"
                  }`}
                >
                  <Icon className="size-[18px]" />
                  <span className="max-w-full truncate text-[10px] leading-none tracking-[0.02em]">
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <NavArrow
          label="Bagian berikutnya"
          disabled={!nextId}
          onClick={() => nextId && scrollToId(nextId)}
          direction="next"
        />
      </div>
    </nav>
  );
}

function NavArrow({
  label,
  disabled,
  onClick,
  direction,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-[36px] shrink-0 place-items-center rounded-full text-rose transition enabled:hover:bg-blush disabled:opacity-25"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {direction === "prev" ? (
          <path d="M15 6 9 12l6 6" />
        ) : (
          <path d="m9 6 6 6-6 6" />
        )}
      </svg>
    </button>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6.5 10.5V20h11v-9.5" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 7.2a3.8 3.8 0 0 1 7 3.6C19 15.6 12 20 12 20Z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function GalleryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m7 16 3.2-3.2a1 1 0 0 1 1.4 0L14 15l1.3-1.3a1 1 0 0 1 1.4 0L19 16" />
    </svg>
  );
}

function WishIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 6.5h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-11Z" />
      <path d="M5 6.5 12 12l7-5.5" />
    </svg>
  );
}
