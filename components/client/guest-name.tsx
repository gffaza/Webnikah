"use client";

import { useSearchParams } from "next/navigation";

/** Reads `?to=Nama+Tamu`. Render inside <Suspense> so the rest of the page stays prerendered. */
export function GuestName({ fallback }: { fallback: string }) {
  const name = useSearchParams().get("to")?.trim().slice(0, 60);
  return <>{name || fallback}</>;
}
