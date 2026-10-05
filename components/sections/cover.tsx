import Image from "next/image";
import { Suspense } from "react";
import { OpenInvitationButton } from "@/components/client/invitation-gate";
import { GuestName } from "@/components/client/guest-name";
import { Section } from "@/components/section";
import { wedding } from "@/content/wedding";

export function Cover() {
  return (
    <Section id="cover" panel="arch" preload className="pt-401">
      <div
        aria-hidden
        className="absolute inset-x-162 top-196 bottom-195 -z-10 rounded-full border-[length:calc(var(--spacing)*5)] border-rose-deep/70"
      />
      {/* Redraws the butterfly from the background above the arch, like the Figma cover. */}
      <Image
        src="/images/butterfly.webp"
        alt=""
        width={380}
        height={300}
        preload
        className="absolute top-65 left-350 -z-10 w-380 mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_70%)]"
      />

      <p className="text-lead tracking-[0.1em] text-ink">THE WEDDING OF</p>
      <h1 className="mt-20 font-script text-display text-rose">
        <span className="block">{wedding.bride.nickname}</span>
        <span className="block">&amp;</span>
        <span className="block">{wedding.groom.nickname}</span>
      </h1>
      <p className="mt-54 text-lead tracking-[0.1em] text-ink">{wedding.dateLabel.short}</p>
      <p className="mt-27 text-lead tracking-[0.1em] text-ink">{wedding.city}</p>

      <p className="mt-40 text-caption text-ink/80">
        Kepada Yth;
        <br />
        Bapak/Ibu/Saudara/i
      </p>
      <p className="mt-12 max-w-640 text-h2 font-bold tracking-[0.05em] text-ink uppercase">
        <Suspense fallback={wedding.defaultGuest}>
          <GuestName fallback={wedding.defaultGuest} />
        </Suspense>
      </p>

      <div className="mt-56">
        <OpenInvitationButton>Buka Undangan</OpenInvitationButton>
      </div>
    </Section>
  );
}
