import Image from "next/image";

/**
 * Layered HD backdrops built from public/asset/ embeds
 * (extracted → public/images/parts/*.png via scripts/rebuild-hd-parts.mjs).
 *
 * Do NOT reference the Figma SVGs directly as <img>:
 * their width/height attrs are tiny (e.g. 353×283) while embeds are ~1462px.
 * Chrome rasterizes at the SVG attrs size then upscales → soft/jagged edges.
 */

const img = {
  pinkButterfly: "/images/parts/pink-butterfly.png",
  sideButterfly: "/images/parts/side-butterfly.png",
  lilies: "/images/parts/lilies.png",
  joglo: "/images/parts/joglo-house.png",
  flowerVine: "/images/parts/flower-vine.png",
  faintVine: "/images/parts/faint-vine.png",
  floralFrame: "/images/parts/floral-frame.png",
  hangingVine: "/images/parts/hanging-vine.svg",
  gunungan: "/images/parts/gunungan-raster.webp",
} as const;

function Layer({
  src,
  width,
  height,
  className,
  preload = false,
  fill = false,
}: {
  src: string;
  width?: number;
  height?: number;
  className: string;
  preload?: boolean;
  fill?: boolean;
}) {
  if (src.endsWith(".svg")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" aria-hidden className={`pointer-events-none absolute select-none ${className}`} />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        unoptimized
        preload={preload}
        className={`pointer-events-none absolute select-none object-cover object-center ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={width!}
      height={height!}
      unoptimized
      preload={preload}
      className={`pointer-events-none absolute select-none ${className}`}
    />
  );
}

/** Floral scene — layout aligned with public/5.svg */
export function FloralBackdrop({ preload = false }: { preload?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden bg-[#f7f1ec]">
      <Layer src={img.floralFrame} fill preload={preload} className="inset-0" />

      <Layer
        src={img.faintVine}
        width={1892}
        height={1501}
        className="top-[2%] left-[-10%] w-[65%] opacity-60"
      />
      <Layer
        src={img.faintVine}
        width={1892}
        height={1501}
        className="top-[2%] right-[-10%] w-[65%] -scale-x-100 opacity-60"
      />

      <Layer
        src={img.gunungan}
        width={800}
        height={900}
        className="top-[26%] left-1/2 w-[78%] -translate-x-1/2 opacity-45 mix-blend-multiply"
      />

      <Layer
        src={img.joglo}
        width={2400}
        height={1488}
        className="bottom-[1%] left-1/2 w-[94%] -translate-x-1/2"
      />

      <Layer
        src={img.lilies}
        width={1751}
        height={1800}
        className="bottom-[-3%] left-[-20%] w-[62%]"
      />
      <Layer
        src={img.lilies}
        width={1751}
        height={1800}
        className="right-[-20%] bottom-[-3%] w-[62%] -scale-x-100"
      />

      <Layer
        src={img.sideButterfly}
        width={860}
        height={975}
        className="bottom-[17%] left-[1%] w-[17%]"
      />
      <Layer
        src={img.sideButterfly}
        width={860}
        height={975}
        className="right-[1%] bottom-[17%] w-[17%] -scale-x-100"
      />

      <Layer
        src={img.hangingVine}
        width={604}
        height={611}
        className="top-[0%] left-[8%] w-[28%] -rotate-6"
      />
      <Layer
        src={img.hangingVine}
        width={604}
        height={611}
        className="top-[0%] right-[8%] w-[28%] rotate-6 -scale-x-100"
      />
    </div>
  );
}

/** Arch scene — layout aligned with public/7.svg */
export function ArchBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden bg-[#f8f4f0]">
      <Layer
        src={img.faintVine}
        width={1892}
        height={1501}
        className="top-[5%] left-[-14%] w-[58%] opacity-45"
      />
      <Layer
        src={img.faintVine}
        width={1892}
        height={1501}
        className="top-[5%] right-[-14%] w-[58%] -scale-x-100 opacity-45"
      />

      <div className="absolute inset-x-[12.5%] top-[4%] bottom-[7%] rounded-[999px] bg-[#f0c9b8]" />

      <Layer
        src={img.gunungan}
        width={800}
        height={900}
        className="top-[16%] left-1/2 w-[70%] -translate-x-1/2 opacity-40 mix-blend-multiply"
      />

      <Layer
        src={img.flowerVine}
        width={1163}
        height={2150}
        className="top-[7%] left-[6%] w-[24%] -rotate-[6deg]"
      />
      <Layer
        src={img.flowerVine}
        width={1163}
        height={2150}
        className="top-[7%] right-[6%] w-[24%] rotate-[6deg] -scale-x-100"
      />

      <Layer
        src={img.lilies}
        width={1751}
        height={1800}
        className="bottom-[-2%] left-[-16%] w-[55%]"
      />
      <Layer
        src={img.lilies}
        width={1751}
        height={1800}
        className="right-[-16%] bottom-[-2%] w-[55%] -scale-x-100"
      />

      <Layer
        src={img.pinkButterfly}
        width={1462}
        height={1170}
        className="top-[1%] left-1/2 w-[32%] -translate-x-1/2"
      />
    </div>
  );
}
