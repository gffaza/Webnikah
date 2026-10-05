import { Section } from "@/components/section";
import { wedding } from "@/content/wedding";

export function Video() {
  const { youtubeId } = wedding;

  return (
    <Section id="video" panel="frame" className="px-182 pt-251">
      <h2 className="reveal text-h1 font-bold text-rose">Video Prewed</h2>

      {youtubeId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title="Video prewedding"
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="reveal mt-64 aspect-video w-full rounded-card shadow-md"
        />
      ) : (
        <div className="reveal mt-64 flex aspect-video w-full flex-col items-center justify-center gap-16 rounded-card border-2 border-dashed border-rose/40 bg-white/40 text-rose">
          <svg viewBox="0 0 24 24" className="size-96" fill="currentColor" aria-hidden>
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
          <p className="text-body">Video akan segera hadir</p>
        </div>
      )}
    </Section>
  );
}
