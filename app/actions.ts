"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { GUESTBOOK_TAG } from "@/lib/guestbook";
import { rsvpSchema, type RsvpState } from "@/lib/rsvp";
import { sanity } from "@/lib/sanity";

export async function submitRsvp(
  _prev: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("website")) {
    return { status: "success", name: String(formData.get("name") ?? "") };
  }

  const parsed = rsvpSchema.safeParse({
    name: formData.get("name"),
    attendance: formData.get("attendance"),
    guests: formData.get("guests"),
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Mohon periksa kembali isian Anda.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (!sanity) {
    return {
      status: "error",
      message: "RSVP belum aktif. Silakan coba lagi nanti.",
    };
  }

  try {
    await sanity.create({ _type: "rsvp", ...parsed.data });
  } catch {
    return {
      status: "error",
      message: "Gagal mengirim. Periksa koneksi Anda dan coba lagi.",
    };
  }

  updateTag(GUESTBOOK_TAG);
  return { status: "success", name: parsed.data.name };
}
