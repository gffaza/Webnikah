import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sanity } from "@/lib/sanity";
import type { GuestbookEntry } from "@/lib/rsvp";

export const GUESTBOOK_TAG = "guestbook";

const guestbookQuery = `*[_type == "rsvp" && message != "" && hidden != true]
  | order(_createdAt desc)[0...50]{ _id, _createdAt, name, attendance, message }`;

export async function getGuestbook(): Promise<GuestbookEntry[]> {
  "use cache";
  cacheTag(GUESTBOOK_TAG);
  cacheLife("minutes");

  if (!sanity) return [];
  return sanity.fetch<GuestbookEntry[]>(guestbookQuery);
}
