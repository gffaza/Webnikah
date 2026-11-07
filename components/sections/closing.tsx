import Image from "next/image";
import { Section } from "@/components/section";
import { photoBlurDataURL } from "@/lib/image-blur";
import { wedding } from "@/content/wedding";

export function Closing() {
  const { photo, text } = wedding.closing;

  return (
    <Section
      id="penutup"
      fitViewport
      className="px-116 pt-100 pb-[max(5.75rem,calc(var(--spacing)*160))]"
    >
      <div className="reveal relative min-h-0 w-full max-w-849 flex-1 overflow-hidden rounded-t-full rounded-b-card border-[length:calc(var(--spacing)*6)] border-rose-deep shadow-md">
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
      <p className="reveal mt-40 max-w-797 shrink-0 text-lead text-rose-deep">{text}</p>
      <p className="reveal mt-40 shrink-0 font-script text-[calc(var(--spacing)*120)] leading-none text-rose">
        {wedding.bride.nickname} &amp; {wedding.groom.nickname}
      </p>
      <Image
        src="/images/Noheels.png"
        alt="Larangan menggunakan heels"
        width={759}
        height={758}
        sizes="120px"
        className="mt-16 h-auto w-220 max-h-[22svh] max-w-full shrink-0 object-contain"
      />
      <p className="reveal mt-16 max-w-md shrink-0 px-16 text-xs leading-snug text-rose-deep">
        Demi kenyamanan, tidak disarankan menggunakan heels
      </p>
    </Section>
  );
}
