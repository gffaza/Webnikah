"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/wedding";
import { photoBlurDataURL } from "@/lib/image-blur";

const ASPECT = "260/163";

export function GalleryCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [index, setIndex] = useState(0);
  const count = photos.length;

  const go = useCallback(
    (next: number) => {
      const el = scroller.current;
      if (!el || count === 0) return;
      const i = ((next % count) + count) % count;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    },
    [count],
  );

  const syncIndex = useCallback(() => {
    const el = scroller.current;
    if (!el || el.clientWidth === 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((current) => (current === next ? current : next));
  }, []);

  useEffect(() => {
    if (count < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const id = window.setInterval(() => {
      if (paused.current || document.hidden) return;
      const el = scroller.current;
      if (!el || el.clientWidth === 0) return;
      const current = Math.round(el.scrollLeft / el.clientWidth);
      const next = (current + 1) % count;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 4500);

    return () => window.clearInterval(id);
  }, [count, index]);

  if (count === 0) return null;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri foto"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onFocusCapture={() => {
        paused.current = true;
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) paused.current = false;
      }}
    >
      <div
        ref={scroller}
        onScroll={syncIndex}
        className="reveal flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-card shadow-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <div key={photo.src} className="relative min-w-full shrink-0 snap-start" style={{ aspectRatio: ASPECT }}>
            <button
              type="button"
              popoverTarget={`foto-slide-${i + 1}`}
              className="relative block size-full touch-pan-x overflow-hidden focus-visible:outline-2 focus-visible:outline-rose"
              aria-label={`Perbesar foto: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 480px) 80vw, 420px"
                placeholder="blur"
                blurDataURL={photoBlurDataURL}
                className="object-cover"
                draggable={false}
              />
            </button>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="absolute top-1/2 left-[10px] z-10 grid size-[36px] -translate-y-1/2 place-items-center rounded-full bg-white/90 text-rose shadow focus-visible:outline-2 focus-visible:outline-rose"
            aria-label="Foto sebelumnya"
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="absolute top-1/2 right-[10px] z-10 grid size-[36px] -translate-y-1/2 place-items-center rounded-full bg-white/90 text-rose shadow focus-visible:outline-2 focus-visible:outline-rose"
            aria-label="Foto berikutnya"
          >
            <Chevron direction="right" />
          </button>
          <div className="absolute inset-x-0 bottom-[4px] z-10 flex justify-center">
            {photos.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Foto ${i + 1} dari ${count}`}
                aria-current={i === index ? "true" : undefined}
                className="grid size-[28px] place-items-center"
              >
                <span
                  className={
                    i === index
                      ? "h-[7px] w-[18px] rounded-full bg-white shadow"
                      : "size-[7px] rounded-full bg-white/55 shadow"
                  }
                />
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            Foto {index + 1} dari {count}
          </p>
        </>
      )}
      {photos.map((photo, i) => {
        const id = `foto-slide-${i + 1}`;
        return (
          <div key={id} id={id} popover="auto" className="h-[85vh] w-[92vw] max-w-[640px]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="92vw"
              placeholder="blur"
              blurDataURL={photoBlurDataURL}
              className="object-contain"
            />
            <button
              type="button"
              popoverTarget={id}
              popoverTargetAction="hide"
              className="absolute top-[8px] right-[8px] grid size-[40px] place-items-center rounded-full bg-white/90 text-[20px] text-ink shadow"
              aria-label="Tutup"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      {direction === "left" ? <path d="M14.5 6 8.5 12l6 6" /> : <path d="M9.5 6l6 6-6 6" />}
    </svg>
  );
}
