import { Suspense } from "react";
import { Countdown } from "@/components/client/countdown";
import { RsvpForm } from "@/components/client/rsvp-form";
import { Section } from "@/components/section";
import { wedding } from "@/content/wedding";
import { getGuestbook } from "@/lib/guestbook";
import { attendanceOptions } from "@/lib/rsvp";

const attendanceLabel = Object.fromEntries(
  attendanceOptions.map((option) => [option.value, option.label]),
);

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

async function GuestbookList() {
  const entries = await getGuestbook();

  if (entries.length === 0) {
    return (
      <p className="py-40 text-body text-ink/60">Belum ada ucapan. Jadilah yang pertama!</p>
    );
  }

  return (
    <ul className="flex max-h-900 flex-col gap-24 overflow-y-auto pr-8 text-left">
      {entries.map((entry) => (
        <li key={entry._id} className="rounded-card bg-white/85 px-32 py-24 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-x-16">
            <p className="text-body font-bold text-ink">{entry.name}</p>
            <p className="text-caption text-rose">{attendanceLabel[entry.attendance]}</p>
          </div>
          <p className="mt-8 text-body whitespace-pre-line text-ink/85">{entry.message}</p>
          <p className="mt-8 text-caption text-ink/50">
            {dateFormat.format(new Date(entry._createdAt))}
          </p>
        </li>
      ))}
    </ul>
  );
}

function GuestbookSkeleton() {
  return (
    <div className="flex flex-col gap-24" aria-hidden>
      {[0, 1].map((key) => (
        <div key={key} className="h-160 animate-pulse rounded-card bg-white/60" />
      ))}
    </div>
  );
}

export function Rsvp() {
  return (
    <Section id="rsvp" className="px-142 pt-204 pb-320">
      <h2 className="reveal text-h1 font-bold text-rose">RSVP &amp; Ucapan</h2>
      <p className="reveal mt-32 text-lead text-ink">
        Menuju hari bahagia kami. Mohon konfirmasi kehadiran dan kirimkan doa terbaik Anda.
      </p>

      <div className="reveal mt-48 w-full">
        <Countdown target={wedding.startsAt} />
      </div>

      <div className="reveal mt-64 w-full">
        <RsvpForm />
      </div>

      <div className="mt-80 w-full">
        <h3 className="mb-32 text-h2 font-bold text-rose">Ucapan Tamu</h3>
        <Suspense fallback={<GuestbookSkeleton />}>
          <GuestbookList />
        </Suspense>
      </div>
    </Section>
  );
}
