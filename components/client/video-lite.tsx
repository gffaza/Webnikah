"use client";

import { useState } from "react";

/**
 * Poster first — R2/HTML5 video only after tap.
 * Avoids pulling the full MP4 while the guest scrolls.
 */
export function VideoLite({
  src,
  poster,
  title,
  className = "aspect-[9/16] w-full",
}: {
  src: string;
  poster: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const shell = `rounded-card shadow-md ${className}`;

  if (playing) {
    return (
      <video
        src={src}
        poster={poster}
        title={title}
        controls
        playsInline
        autoPlay
        preload="metadata"
        className={`${shell} bg-ink object-contain`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`group relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-rose ${shell}`}
      aria-label={`Putar ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
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
