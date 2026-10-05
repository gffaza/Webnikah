import { z } from "zod";

export const attendanceOptions = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
  { value: "ragu", label: "Masih Ragu" },
] as const;

export type Attendance = (typeof attendanceOptions)[number]["value"];

export const rsvpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Nama minimal 2 karakter" })
    .max(60, { error: "Nama maksimal 60 karakter" }),
  attendance: z.enum(["hadir", "tidak_hadir", "ragu"], {
    error: "Pilih status kehadiran",
  }),
  guests: z.coerce
    .number()
    .int()
    .min(1, { error: "Minimal 1 orang" })
    .max(5, { error: "Maksimal 5 orang" }),
  message: z
    .string()
    .trim()
    .max(500, { error: "Ucapan maksimal 500 karakter" }),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export type RsvpState =
  | { status: "idle" }
  | { status: "success"; name: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof RsvpInput, string[]>>;
    };

export type GuestbookEntry = {
  _id: string;
  _createdAt: string;
  name: string;
  attendance: Attendance;
  message: string;
};
