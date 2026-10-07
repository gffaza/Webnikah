import Image from "next/image";
import { Section } from "@/components/section";
import { photoBlurDataURL } from "@/lib/image-blur";
import { wedding } from "@/content/wedding";

export function Closing() {
  const { photo, text } = wedding.closing;

  return (
    <Section id="penutup" className="px-116 pt-174">
      <div className="reveal relative h-975 w-849 overflow-hidden rounded-t-full rounded-b-card border-[length:calc(var(--spacing)*6)] border-rose-deep shadow-md">
        <Image
          src={photo}
          alt={`${wedding.bride.nickname} dan ${wedding.groom.nickname}`}
          fill
          sizes="(max-width: 480px) 79vw, 377px"
          placeholder="blur"
          blurDataURL={photoBlurDataURL}
          className="object-cover"
        />
      </div>
      <p className="reveal mt-57 max-w-797 text-lead text-rose-deep">{text}</p>
      <p className="reveal mt-87 font-script text-[calc(var(--spacing)*120)] leading-tight text-rose">
        {wedding.bride.nickname} &amp; {wedding.groom.nickname}
      </p>
    </Section>
  );
}
