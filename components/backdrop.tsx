import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Layered backdrops — each ornament floats on its own timeline (globals.css).
 * Parts: phone-sized WebP from `scripts/optimize-parts.mjs`.
 *
 * Floral ≈ public/bg.svg
 * Arch  ≈ public/bg 2.svg (SVG 1080×1920 + Figma transforms, assets only — no baked text)
 */

const img = {
  pinkButterfly: "/images/parts/pink-butterfly.webp",
  sideButterfly: "/images/parts/side-butterfly.webp",
  lilies: "/images/parts/lilies.webp",
  joglo: "/images/parts/joglo-house.webp",
  flowerVine: "/images/parts/flower-vine.webp",
  faintVine: "/images/parts/faint-vine.webp",
  floralFrame: "/images/parts/floral-frame.webp",
  hangingVine: "/images/parts/hanging-vine.svg",
  gunungan: "/images/parts/gunungan.webp",
} as const;

/** Peach capsule path from public/bg 2.svg */
const ARCH_PILL =
  "M954.615 495.562V1424.59C954.615 1650.37 771.62 1833.33 545.776 1833.33C320.104 1833.33 137.036 1650.37 137.036 1424.59V495.562C137.036 269.786 320 86.8281 545.776 86.8281C771.516 86.8281 954.615 269.786 954.615 495.562Z";

/** Cap decode size — Retina 3× of 94vw was blowing Safari image memory. */
const LAYER_SIZES = "360px";
const FILL_SIZES = "420px";

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
      <img
        src={src}
        alt=""
        aria-hidden
        className={`pointer-events-none absolute h-auto select-none ${className}`}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={FILL_SIZES}
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
      sizes={LAYER_SIZES}
      preload={preload}
      className={`pointer-events-none absolute h-auto select-none ${className}`}
    />
  );
}

function Float({
  variant,
  children,
}: {
  variant: "a" | "b" | "c" | "d" | "butterfly";
  children: ReactNode;
}) {
  return (
    <div className={`float-layer float-layer--${variant} absolute inset-0`}>{children}</div>
  );
}

/**
 * Ornament inside the 1080×1920 arch scene.
 * Outer transform = Figma placement; inner .float-layer = independent sway.
 */
function ArchPart({
  href,
  width,
  height,
  x = 0,
  y = 0,
  transform,
  opacity = 1,
  float,
  blend,
  meet = false,
}: {
  href: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  transform?: string;
  opacity?: number;
  float: "a" | "b" | "c" | "d" | "butterfly";
  blend?: "multiply";
  /** Keep intrinsic aspect (gunungan) instead of stretching. */
  meet?: boolean;
}) {
  return (
    <g transform={transform}>
      <g className={`float-layer float-layer--${float}`}>
        <image
          href={href}
          width={width}
          height={height}
          x={x}
          y={y}
          opacity={opacity}
          preserveAspectRatio={meet ? "xMidYMid meet" : "none"}
          style={blend === "multiply" ? { mixBlendMode: "multiply" } : undefined}
        />
      </g>
    </g>
  );
}

/** Floral scene — joglo + lilies + side butterflies */
export function FloralBackdrop({ preload = false }: { preload?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#f5f2f2]">
      <Layer src={img.floralFrame} fill preload={preload} className="inset-0" />

      <Float variant="a">
        <Layer
          src={img.faintVine}
          width={800}
          height={635}
          preload={preload}
          className="top-[2%] left-[-10%] w-[65%] opacity-60"
        />
      </Float>
      <Float variant="b">
        <Layer
          src={img.faintVine}
          width={800}
          height={635}
          preload={preload}
          className="top-[2%] right-[-10%] w-[65%] -scale-x-100 opacity-60"
        />
      </Float>

      <Float variant="c">
        <Layer
          src={img.gunungan}
          width={720}
          height={974}
          preload={preload}
          className="top-[18%] left-1/2 w-[72%] -translate-x-1/2 opacity-40"
        />
      </Float>

      <Float variant="d">
        <Layer
          src={img.joglo}
          width={1000}
          height={620}
          preload={preload}
          className="bottom-[1%] left-1/2 w-[94%] -translate-x-1/2"
        />
      </Float>

      <Float variant="a">
        <Layer
          src={img.lilies}
          width={900}
          height={925}
          preload={preload}
          className="bottom-[-3%] left-[-20%] w-[62%]"
        />
      </Float>
      <Float variant="b">
        <Layer
          src={img.lilies}
          width={900}
          height={925}
          preload={preload}
          className="right-[-20%] bottom-[-3%] w-[62%] -scale-x-100"
        />
      </Float>

      <Float variant="c">
        <Layer
          src={img.sideButterfly}
          width={420}
          height={476}
          preload={preload}
          className="bottom-[17%] left-[1%] w-[17%]"
        />
      </Float>
      <Float variant="d">
        <Layer
          src={img.sideButterfly}
          width={420}
          height={476}
          preload={preload}
          className="right-[1%] bottom-[17%] w-[17%] -scale-x-100"
        />
      </Float>

      <Float variant="a">
        <Layer
          src={img.hangingVine}
          width={604}
          height={611}
          className="top-[0%] left-[8%] w-[28%] -rotate-6"
        />
      </Float>
      <Float variant="b">
        <Layer
          src={img.hangingVine}
          width={604}
          height={611}
          className="top-[0%] right-[8%] w-[28%] rotate-6 -scale-x-100"
        />
      </Float>

      <Float variant="butterfly">
        <Layer
          src={img.pinkButterfly}
          width={640}
          height={512}
          preload={preload}
          className="top-[1%] left-1/2 w-[32%] -translate-x-1/2"
        />
      </Float>
    </div>
  );
}

/**
 * Arch scene (Events + Our Story) — layout from public/bg 2.svg.
 * Each vine / lily / butterfly floats independently (same system as floral).
 * No Frame 31/34 mockups → no stacked text.
 */
export function ArchBackdrop({ preload: _preload = false }: { preload?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#f5f2f2]">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1080 1920"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Peach capsule */}
        <path d={ARCH_PILL} fill="#EFB3A6" />

        {/* Faint line-art (Frame 38) */}
        <ArchPart
          href={img.faintVine}
          width={707}
          height={562}
          transform="matrix(-1 0 0 1 661.381 0)"
          opacity={0.5}
          float="a"
        />
        <ArchPart
          href={img.faintVine}
          width={707}
          height={562}
          x={411.419}
          y={0}
          opacity={0.5}
          float="b"
        />

        {/* Gunungan — Frame 50.svg, full silhouette (720×974), not cropped */}
        <ArchPart
          href={img.gunungan}
          width={680}
          height={920}
          x={200}
          y={300}
          opacity={0.42}
          float="c"
          meet
        />

        {/* 8 flower vines along the arch (aset.svg) — bg 2.svg placements */}
        <ArchPart
          href={img.flowerVine}
          width={303}
          height={562}
          x={661.386}
          y={1166.65}
          transform="rotate(-21.662 661.386 1166.65)"
          float="a"
        />
        <ArchPart
          href={img.flowerVine}
          width={303}
          height={562}
          transform="matrix(-0.980368 -0.197175 -0.197175 0.980368 403.19 1176.91)"
          float="b"
        />
        <ArchPart
          href={img.flowerVine}
          width={303}
          height={562}
          transform="matrix(-0.918488 -0.395449 -0.395448 0.918488 1189.5 772.592)"
          float="c"
        />
        <ArchPart
          href={img.flowerVine}
          width={303}
          height={562}
          x={-107.525}
          y={798.834}
          transform="rotate(-21.662 -107.525 798.834)"
          float="d"
        />
        <ArchPart
          href={img.flowerVine}
          width={303}
          height={562}
          transform="matrix(0.820727 -0.571321 0.571318 0.820729 624.481 363.812)"
          float="a"
        />
        <ArchPart
          href={img.flowerVine}
          width={303}
          height={562}
          transform="matrix(-0.895804 -0.444449 -0.444449 0.895804 415.13 377.723)"
          float="b"
        />
        <ArchPart
          href={img.flowerVine}
          width={303}
          height={562}
          transform="matrix(-0.226173 -0.974087 -0.974087 0.226173 624.467 274.746)"
          float="c"
        />
        <ArchPart
          href={img.flowerVine}
          width={303}
          height={562}
          x={457.681}
          y={275.289}
          transform="rotate(-77.3908 457.681 275.289)"
          float="d"
        />

        {/* Bottom lilies */}
        <ArchPart
          href={img.lilies}
          width={608}
          height={624}
          transform="matrix(0.908121 -0.418707 0.418706 0.908122 398.402 1555.29)"
          float="a"
        />
        <ArchPart
          href={img.lilies}
          width={608}
          height={624}
          transform="matrix(-0.908121 -0.418707 -0.418706 0.908122 662.932 1555.29)"
          float="b"
        />

        {/* Top butterfly */}
        <ArchPart
          href={img.pinkButterfly}
          width={386}
          height={309}
          x={346.807}
          y={-204.593}
          float="butterfly"
        />
      </svg>
    </div>
  );
}
