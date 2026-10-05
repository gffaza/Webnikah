import Image from "next/image";
import { Section } from "@/components/section";
import { wedding, type Person } from "@/content/wedding";

function CoupleSection({ id, person }: { id: string; person: Person }) {
  return (
    <Section id={id} className="px-142 pt-147">
      <h2 className="reveal text-h2 font-bold text-rose">Bride &amp; Groom</h2>
      <p className="reveal mt-72 text-lead text-ink">{wedding.invitationText}</p>
      <div className="reveal relative mt-54 h-764 w-797 overflow-hidden rounded-card shadow-md">
        <Image
          src={person.photo}
          alt={person.fullName}
          fill
          sizes="(max-width: 480px) 74vw, 355px"
          className="object-cover"
        />
      </div>
      <p className="reveal mt-40 font-script text-[calc(var(--spacing)*110)] leading-tight text-rose">
        {person.fullName}
      </p>
      <p className="reveal mt-12 text-body text-ink">{person.parents}</p>
    </Section>
  );
}

export function Bride() {
  return <CoupleSection id="mempelai-wanita" person={wedding.bride} />;
}

export function Groom() {
  return <CoupleSection id="mempelai-pria" person={wedding.groom} />;
}
