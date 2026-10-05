import { InvitationGate, MusicToggle } from "@/components/client/invitation-gate";
import { Closing } from "@/components/sections/closing";
import { Bride, Groom } from "@/components/sections/couple";
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
    <main className="invite mx-auto w-full max-w-[480px] overflow-x-clip bg-cream shadow-2xl">
      <InvitationGate music={wedding.music} scrollTo="intro">
        <Cover />
        <Intro />
        <Bride />
        <Groom />
        <Events />
        <Video />
        <Story />
        <Gallery />
        <Gift />
        <Rsvp />
        <Closing />
        <MusicToggle />
      </InvitationGate>
    </main>
  );
}
