/**
 * iOS (and iPadOS) WebKit — every browser on iOS uses WebKit, so UA "CriOS"
 * still needs the memory-safe backdrop path.
 */
export function isIOSWebKit(
  ua: string = typeof navigator !== "undefined" ? navigator.userAgent : "",
): boolean {
  if (!ua) return false;
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  // iPadOS desktop-UA mode
  if (
    typeof navigator !== "undefined" &&
    navigator.platform === "MacIntel" &&
    navigator.maxTouchPoints > 1
  ) {
    return true;
  }
  return false;
}
