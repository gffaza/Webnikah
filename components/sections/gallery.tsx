import Image from "next/image";
import { GalleryCarousel } from "@/components/client/gallery-carousel";
import { Section } from "@/components/section";
import { wedding, type GalleryPhoto } from "@/content/wedding";

/** Aspect ratios of the four grid slots above the wide carousel, in reading order. */
const slots = ["125/115", "125/161", "125/161", "125/118"] as const;

function Photo({ photo, id, aspect }: { photo: GalleryPhoto; id: string; aspect: string }) {
  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        className="reveal relative block w-full overflow-hidden rounded-card shadow-sm focus-visible:outline-2 focus-visible:outline-rose"
        style={{ aspectRatio: aspect }}
        aria-label={`Perbesar foto: ${photo.alt}`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 480px) 36vw, 175px"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </button>
      <div id={id} popover="auto" className="h-[85vh] w-[92vw] max-w-[640px]">
        <Image src={photo.src} alt={photo.alt} fill sizes="92vw" className="object-contain" />
        <button
          type="button"
          popoverTarget={id}
          popoverTargetAction="hide"
          className="absolute top-[8px] right-[8px] grid size-[40px] place-items-center rounded-full bg-white/90 text-[20px] text-ink shadow"
          aria-label="Tutup"
        >
          ×
        </button>
      </div>
    </>
  );
}

export function Gallery() {
  const photos = wedding.gallery.slice(0, slots.length);
  const slides = wedding.gallery.slice(slots.length);
  const at = (index: number) =>
    photos[index] && (
      <Photo photo={photos[index]} id={`foto-${index + 1}`} aspect={slots[index]} />
    );

  return (
    <Section id="galeri" panel="gallery" className="px-150 pt-204">
      <h2 className="reveal text-h1 font-bold text-rose">Our Gallery</h2>
      <div className="mt-30 grid w-full grid-cols-2 gap-30">
        <div className="flex flex-col gap-30">
          {at(0)}
          {at(2)}
        </div>
        <div className="flex flex-col gap-30">
          {at(1)}
          {at(3)}
        </div>
        <div className="col-span-2">
          <GalleryCarousel photos={slides} />
        </div>
      </div>
    </Section>
  );
}
