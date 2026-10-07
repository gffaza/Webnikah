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
      <div className="float-layer float-layer--butterfly pointer-events-none absolute inset-0 z-[2]">
        <Image
          src="/images/parts/pink-butterfly.png"
          alt=""
          width={1462}
          height={1170}
          sizes="(max-width: 480px) 36vw, 173px"
          preload
          className="absolute top-40 left-1/2 w-[36%] -translate-x-1/2 select-none"
        />
      </div>

      <div className="cover-ui relative z-[3] flex flex-1 flex-col items-center">
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
      </div>
    </Section>
  );
}
