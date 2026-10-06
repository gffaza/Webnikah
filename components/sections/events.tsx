import { Section } from "@/components/section";
import { wedding } from "@/content/wedding";

export function Events() {
  const { dateLabel, venue } = wedding;

  return (
    <Section id="acara" background="arch" panel="none" className="px-200 pt-295">
      {wedding.events.map((event, index) => (
        <div key={event.name} className={`reveal ${index > 0 ? "mt-27" : ""}`}>
          <h2 className="text-h1 font-bold text-rose">{event.name}</h2>
          <p className="mt-68 text-lead text-ink">{event.time}</p>
        </div>
      ))}

      <div className="reveal mt-68 flex flex-col items-center text-rose-deep">
        <p className="text-h1 font-bold">{dateLabel.weekday}</p>
        <p className="mt-24 text-numeral font-bold">{dateLabel.day}</p>
        <p className="mt-32 text-h2 font-bold">{dateLabel.monthYear}</p>
      </div>

      <svg
        viewBox="0 0 24 24"
        className="reveal mt-64 size-64 text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />
      </svg>
      <p className="reveal mt-32 max-w-416 text-body text-ink">{venue.address}</p>

      <a
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="reveal mt-60 inline-flex w-468 items-center justify-center rounded-full bg-rose py-16 text-lead text-white shadow-sm transition hover:bg-rose-deep"
      >
        Lihat Lokasi
      </a>
    </Section>
  );
}
