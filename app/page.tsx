import { BottomNav } from "@/components/client/bottom-nav";
import { InvitationGate, MusicToggle } from "@/components/client/invitation-gate";
import { SharedInviteBackdrop } from "@/components/client/shared-invite-backdrop";
import { Closing } from "@/components/sections/closing";
import { CoupleSection } from "@/components/sections/couple-section";
import { Cover } from "@/components/sections/cover";
import { Events } from "@/components/sections/events";
import { Gallery } from "@/components/sections/gallery";
import { Gift } from "@/components/sections/gift";
import { Intro } from "@/components/sections/intro";
import { Rsvp } from "@/components/sections/rsvp";
import { Story } from "@/components/sections/story";
import { Video } from "@/components/sections/video";
import { wedding } from "@/content/wedding";

export default function Home() {
  return (
    <main className="invite relative mx-auto w-full max-w-[480px] overflow-x-clip bg-[#f5f2f2] shadow-2xl">
      {/*
        Static boot veil: covers the SSR paint until InvitationGate hydrates and
        InviteLoader takes over. Removed via CSS once data-invite-phase is set.
        noscript keeps the invite usable when JS never loads.
      */}
      <noscript>
        <style>{`.invite-boot-veil{display:none!important}`}</style>
      </noscript>
      <div
        className="invite-boot-veil pointer-events-none fixed top-0 left-1/2 z-[55] h-svh w-full max-w-[480px] -translate-x-1/2 bg-[#f3e6df]"
        aria-hidden
      />
      {/* iOS only: one lite scene. Android/desktop use rich per-section backdrops. */}
      <SharedInviteBackdrop />
      <div className="relative z-[1]">
        <InvitationGate music={wedding.music} scrollTo="intro">
          <Cover />
          <Intro />
          <CoupleSection id="couple" />
          {/* <Bride />
          <Groom /> */}
          <Events />
          <Video />
          {/* <Story /> */}
          <Gallery />
          <Gift />
          <Rsvp />
          <Closing />
          <MusicToggle />
          <BottomNav />
        </InvitationGate>
      </div>
    </main>
  );
}
