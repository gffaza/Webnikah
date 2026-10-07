import { wedding, type Wedding } from "@/content/wedding";

/**
 * Only what the cover needs before "Buka Undangan".
 * Gallery / couple / gift photos lazy-load via next/image while scrolling.
 */
export const coverAssets = [
  "/images/parts/floral-frame.webp",
  "/images/parts/pink-butterfly.webp",
  "/images/parts/lilies.webp",
  "/images/parts/faint-vine.webp",
  "/images/parts/joglo-house.webp",
  "/images/parts/gunungan.webp",
] as const;

/** Warm after the gate opens (idle) so scroll feels smoother without blocking splash. */
export function collectWarmAssets(data: Wedding = wedding): string[] {
  return [
    "/images/parts/side-butterfly.webp",
    "/images/parts/flower-vine.webp",
    "/images/parts/hanging-vine.svg",
    data.intro.photo,
    data.bride.photo,
    data.groom.photo,
  ];
}

/** @deprecated use coverAssets — kept name for call sites during refactor */
export function collectInviteAssets(_data: Wedding = wedding): string[] {
  return [...coverAssets];
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const done = () => resolve();
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(done, done);
      } else {
        done();
      }
    };
    img.onerror = done;
    img.src = src;
  });
}

export type PreloadProgress = {
  loaded: number;
  total: number;
  ratio: number;
};

/**
 * Warm a small asset list into cache. Does not wait on audio/fonts forever.
 */
export async function preloadInviteAssets(
  assets: string[],
  onProgress?: (progress: PreloadProgress) => void,
): Promise<void> {
  const total = assets.length;
  let loaded = 0;

  const tick = () => {
    loaded += 1;
    onProgress?.({ loaded, total, ratio: total === 0 ? 1 : loaded / total });
  };

  onProgress?.({ loaded: 0, total, ratio: 0 });

  await Promise.all(
    assets.map(async (src) => {
      try {
        await preloadImage(src);
      } finally {
        tick();
      }
    }),
  );
}

/** Fire-and-forget warm of upcoming sections (after invite is interactive). */
export function warmUpcomingAssets(data: Wedding = wedding): void {
  if (typeof window === "undefined") return;
  const run = () => {
    void preloadInviteAssets(collectWarmAssets(data));
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 600);
  }
}
