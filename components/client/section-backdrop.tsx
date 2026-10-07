"use client";

import { DeferredBackdrop, type BackdropType } from "@/components/client/deferred-backdrop";
import { useIOSWebKit } from "@/components/client/use-ios-webkit";

/**
 * Non-iOS: rich layered DeferredBackdrop per section.
 * iOS: skip — SharedInviteBackdrop owns the single lite scene.
 */
export function SectionBackdrop({
  type,
  eager = false,
}: {
  type: BackdropType;
  eager?: boolean;
}) {
  const ios = useIOSWebKit();

  if (ios === null) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[#f5f2f2]"
      />
    );
  }

  if (ios) return null;

  return <DeferredBackdrop type={type} eager={eager} />;
}
