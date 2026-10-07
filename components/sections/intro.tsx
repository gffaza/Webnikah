import Image from "next/image";
import { Section } from "@/components/section";
import { photoBlurDataURL } from "@/lib/image-blur";
import { wedding } from "@/content/wedding";

export function Intro() {
  const { photo, title, quote, source } = wedding.intro;

  return (
    <Section id="intro" className="px-142 pt-210">
      <div className="reveal relative h-750 w-695 overflow-hidden rounded-card shadow-md">
        <Image
          src={photo}
          alt={`${wedding.bride.nickname} dan ${wedding.groom.nickname}`}
          fill
          sizes="(max-width: 480px) 65vw, 310px"
          placeholder="blur"
          blurDataURL={photoBlurDataURL}
          className="object-cover"
        />
      </div>
      <h2 className="reveal mt-40 text-h2 font-bold text-rose">{title}</h2>
      <p className="reveal mt-32 text-body text-ink">{quote}</p>
      <p className="reveal mt-32 text-body text-ink">{source}</p>
    </Section>
  );
}
