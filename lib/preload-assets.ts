import { wedding, type Wedding } from "@/content/wedding";

/** Unique HD backdrop parts used across Floral + Arch scenes. */
export const backdropAssets = [
  "/images/parts/pink-butterfly.png",
  "/images/parts/side-butterfly.png",
  "/images/parts/lilies.png",
  "/images/parts/joglo-house.png",
  "/images/parts/flower-vine.png",
  "/images/parts/faint-vine.png",
  "/images/parts/floral-frame.png",
  "/images/parts/hanging-vine.svg",
  "/images/parts/gunungan-raster.webp",
] as const;

/** Every image (and optional audio) the invite should warm before revealing. */
export function collectInviteAssets(data: Wedding = wedding): string[] {
  const urls = new Set<string>([
    ...backdropAssets,
    data.bride.photo,
    data.groom.photo,
    data.intro.photo,
    data.story.photo,
    data.closing.photo,
    data.gift.qris,
    data.music,
    ...data.gallery.map((photo) => photo.src),
    ...data.gift.accounts.map((account) => account.logo),
  ]);
  return [...urls];
}

function isAudio(src: string) {
  return /\.(weba|webm|mp3|ogg|m4a|wav)(\?|$)/i.test(src);
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

function preloadAudio(src: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio();
    const done = () => {
      audio.removeEventListener("canplaythrough", done);
      audio.removeEventListener("error", done);
      resolve();
    };
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", done, { once: true });
    audio.addEventListener("error", done, { once: true });
    audio.src = src;
    // Some browsers never fire canplaythrough for large/looped files.
    window.setTimeout(done, 8000);
  });
}

export type PreloadProgress = {
  loaded: number;
  total: number;
  ratio: number;
};

/**
 * Warm every invite asset into the browser cache, reporting progress.
 * Failures never block reveal — a soft timeout keeps the gate from hanging.
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
        if (isAudio(src)) {
          await preloadAudio(src);
        } else {
          await preloadImage(src);
        }
      } finally {
        tick();
      }
    }),
  );

  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }
}
