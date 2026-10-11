import Image from "next/image";
import { Section } from "@/components/section";
import { photoBlurDataURL } from "@/lib/image-blur";
import { wedding } from "@/content/wedding";

export function Story() {
  const { photo, items } = wedding.story;

  return (
    <Section id="cerita" background="arch" panel="none" className="px-100 pt-200 pb-280">
      <h2 className="reveal text-h1 font-bold text-rose-deep drop-shadow-sm">Our Story</h2>

      <div className="reveal relative mt-36 size-360 overflow-hidden rounded-full border-[length:calc(var(--spacing)*10)] border-white shadow-md">
        <Image
          src={photo}
          alt={`${wedding.bride.nickname} dan ${wedding.groom.nickname}`}
          fill
          sizes="(max-width: 480px) 34vw, 160px"
          placeholder="blur"
          blurDataURL={photoBlurDataURL}
          className="object-cover"
        />
      </div>

      <ol className="reveal relative mt-56 w-full max-w-820 rounded-panel bg-cream/80 px-48 py-56 text-left shadow-sm backdrop-blur-[2px]">
        <span
          aria-hidden
          className="absolute top-72 bottom-72 left-74 w-3 rounded-full bg-rose/35"
        />

        {items.map((item, index) => (
          <li
            key={item.title}
            className={`relative flex gap-28 ${index > 0 ? "mt-56" : ""}`}
          >
            <div className="relative z-[1] flex w-56 shrink-0 justify-center pt-8">
              <span className="size-28 rounded-full border-[length:calc(var(--spacing)*4)] border-rose bg-cream shadow-sm" />
            </div>

            <div className="min-w-0 flex-1">
              {/* <p className="text-caption tracking-[0.12em] text-rose-deep uppercase">{item.date}</p> */}
              <h3 className="mt-8 text-lead font-bold text-ink">{item.title}</h3>
              <p className="mt-16 text-body leading-[1.7] text-ink/85">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
