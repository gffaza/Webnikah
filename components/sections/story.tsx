import Image from "next/image";
import { Section } from "@/components/section";
import { wedding } from "@/content/wedding";

export function Story() {
  const { photo, items } = wedding.story;

  return (
    <Section id="cerita" panel="arch-story" className="px-233 pt-251">
      <h2 className="reveal text-h1 font-bold text-white">Our Story</h2>

      <div className="reveal relative mt-46 size-500 overflow-hidden rounded-full border-[length:calc(var(--spacing)*12)] border-white shadow-md">
        <Image
          src={photo}
          alt={`${wedding.bride.nickname} dan ${wedding.groom.nickname}`}
          fill
          sizes="(max-width: 480px) 46vw, 222px"
          className="object-cover"
        />
      </div>

      <ol className="mt-100 flex flex-col gap-40">
        {items.map((item) => (
          <li key={item.title} className="reveal">
            <h3 className="text-lead font-bold text-ink">{item.title}</h3>
            <p className="mt-12 text-caption text-ink">{item.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
