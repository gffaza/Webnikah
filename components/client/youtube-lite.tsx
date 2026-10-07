"use client";

import { useState } from "react";

/**
 * Thumbnail first — YouTube iframe only after tap.
 * Avoids Safari/WebKit carrying a heavy player while the guest scrolls.
 */
export function YoutubeLite({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="aspect-[9/16] w-full rounded-card shadow-md"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-card shadow-md focus-visible:outline-2 focus-visible:outline-rose"
      aria-label={`Putar ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb}
        alt=""
        width={480}
        height={853}
        className="absolute inset-0 size-full object-cover"
        decoding="async"
        loading="lazy"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/35"
      />
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 grid size-[64px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-rose text-cream shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="ml-4 size-[28px]" fill="currentColor">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>
    </button>
  );
}
