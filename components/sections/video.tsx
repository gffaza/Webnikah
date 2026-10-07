import { Section } from "@/components/section";
import { wedding } from "@/content/wedding";

/** Accepts a bare ID or a full YouTube / Shorts URL. */
function resolveYoutubeId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/")[2] ?? null;
    }
    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2] ?? null;
    }
    const v = url.searchParams.get("v");
    if (v) return v;
  } catch {
    /* not a URL */
  }

  return null;
}

export function Video() {
  const youtubeId = resolveYoutubeId(wedding.youtubeId);

  return (
    <Section id="video" panel="frame" className="px-182 pt-251 pb-120">
      <h2 className="reveal text-h1 font-bold text-rose">Video Prewed</h2>

      {youtubeId ? (
        <div className="reveal mt-64 w-full max-w-560">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
            title="Video prewedding"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="aspect-[9/16] w-full rounded-card shadow-md"
          />
        </div>
      ) : (
        <div className="reveal mt-64 flex aspect-[9/16] w-full max-w-560 flex-col items-center justify-center gap-16 rounded-card border-2 border-dashed border-rose/40 bg-white/40 text-rose">
          <svg viewBox="0 0 24 24" className="size-96" fill="currentColor" aria-hidden>
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
          <p className="text-body">Video akan segera hadir</p>
        </div>
      )}
    </Section>
  );
}
