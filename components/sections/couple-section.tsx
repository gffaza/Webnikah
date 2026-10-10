import Image from "next/image";
import { Section } from "@/components/section";
import { photoBlurDataURL } from "@/lib/image-blur";
import { wedding, type Person } from "@/content/wedding";

export function CoupleSection({ id }: { id: string }) {
  const bride = wedding.bride;
  const groom = wedding.groom;
  return (
    <Section id={id} className="px-142 pt-147">
      <h2 className="reveal text-h2 font-bold text-rose">Bride &amp; Groom</h2>
      <p className="reveal mt-72 text-lead text-ink text-xs">{wedding.invitationText}</p>
      <div className="reveal relative mt-54 h-400 w-380 overflow-hidden rounded-card shadow-md">
        <Image
          src={bride.photo}
          alt={bride.fullName}
          fill
          sizes="(max-width: 480px) 74vw, 355px"
          placeholder="blur"
          blurDataURL={photoBlurDataURL}
          className="object-cover"
        />
      </div>
      <p className="reveal mt-40 font-script text-4xl leading-tight text-rose">
        {bride.fullName}
      </p>
      <p className="reveal mt-12 text-body text-ink">{bride.parents}</p>
      <h2 className="reveal mt-32 font-script text-4xl leading-tight text-rose">
        &amp;</h2>
      <div className="reveal relative mt-32 h-400 w-380 overflow-hidden rounded-card shadow-md">
        <Image
          src={groom.photo}
          alt={groom.fullName}
          fill
          sizes="(max-width: 480px) 74vw, 355px"
          placeholder="blur"
          blurDataURL={photoBlurDataURL}
          className="object-cover"
        />
      </div>
      <p className="reveal mt-40 font-script text-4xl leading-tight text-rose">
        {groom.fullName}
      </p>
      <p className="reveal mt-12 text-body text-ink">{groom.parents}</p>
    </Section>
  );
}