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
        className="absolute inset-x-162 top-196 bottom-195 z-0 rounded-full border-[length:calc(var(--spacing)*5)] border-rose-deep/70"
      />

      {/* HD butterfly — unmasked embed from public/asset/Clip path group-1.svg */}
      <Image
        src="/images/parts/pink-butterfly.png"
        alt=""
        width={1462}
        height={1170}
        unoptimized
        preload
        className="pointer-events-none absolute top-40 left-1/2 z-[2] w-[36%] -translate-x-1/2 select-none"
      />

      <p className="relative z-[3] text-lead tracking-[0.1em] text-ink">THE WEDDING OF</p>
      <h1 className="relative z-[3] mt-20 font-script text-display text-rose">
        <span className="block">{wedding.bride.nickname}</span>
        <span className="block">&amp;</span>
        <span className="block">{wedding.groom.nickname}</span>
      </h1>
      <p className="relative z-[3] mt-54 text-lead tracking-[0.1em] text-ink">
        {wedding.dateLabel.short}
      </p>
      <p className="relative z-[3] mt-27 text-lead tracking-[0.1em] text-ink">{wedding.city}</p>

      <p className="relative z-[3] mt-40 text-caption text-ink/80">
        Kepada Yth;
        <br />
        Bapak/Ibu/Saudara/i
      </p>
      <p className="relative z-[3] mt-12 max-w-640 text-h2 font-bold tracking-[0.05em] text-ink uppercase">
        <Suspense fallback={wedding.defaultGuest}>
          <GuestName fallback={wedding.defaultGuest} />
        </Suspense>
      </p>

      <div className="relative z-[3] mt-56">
        <OpenInvitationButton>Buka Undangan</OpenInvitationButton>
      </div>
    </Section>
  );
}
