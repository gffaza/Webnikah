import { YoutubeLite } from "@/components/client/youtube-lite";
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
    <Section
      id="video"
      panel="frame"
      className="h-[var(--invite-frame-min-h)] justify-center gap-40 px-182 py-180"
    >
      <h2 className="reveal shrink-0 text-h1 font-bold text-rose">Video Prewed</h2>

      {youtubeId ? (
        <div className="reveal relative min-h-0 w-full flex-1">
          <div className="absolute inset-0 flex items-center justify-center">
            <YoutubeLite
              id={youtubeId}
              title="Video prewedding"
              className="aspect-[9/16] h-full w-auto max-w-full"
            />
          </div>
        </div>
      ) : (
        <div className="reveal relative min-h-0 w-full flex-1">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex aspect-[9/16] h-full w-auto max-w-full flex-col items-center justify-center gap-16 rounded-card border-2 border-dashed border-rose/40 bg-white/40 text-rose">
              <svg viewBox="0 0 24 24" className="size-96" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
              <p className="text-body">Video akan segera hadir</p>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
