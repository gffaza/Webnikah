"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitRsvp } from "@/app/actions";
import { attendanceOptions, type RsvpState } from "@/lib/rsvp";

const initialState: RsvpState = { status: "idle" };

const fieldClass =
  "w-full rounded-card border border-rose/30 bg-white/90 px-24 py-20 text-body text-ink placeholder:text-ink/40 focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/30";

function NameInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <input
      id="rsvp-name"
      name="name"
      required
      minLength={2}
      maxLength={60}
      autoComplete="name"
      placeholder="Nama Anda"
      defaultValue={defaultValue}
      className={fieldClass}
    />
  );
}

function GuestNameInput() {
  const guest = useSearchParams().get("to")?.trim().slice(0, 60);
  return <NameInput defaultValue={guest} />;
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-8 text-left text-caption text-rose-deep">{errors[0]}</p>;
}

export function RsvpForm() {
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  if (state.status === "success") {
    return (
      <div className="rounded-card bg-white/85 px-48 py-48 shadow-sm" role="status">
        <p className="text-h2 font-bold text-rose">Terima kasih, {state.name}!</p>
        <p className="mt-16 text-body text-ink/80">
          Konfirmasi dan ucapan Anda sudah kami terima.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-28 text-left" noValidate>
      <div>
        <label htmlFor="rsvp-name" className="mb-8 block text-body font-bold text-ink">
          Nama
        </label>
        <Suspense fallback={<NameInput />}>
          <GuestNameInput />
        </Suspense>
        <FieldError errors={fieldErrors?.name} />
      </div>

      <fieldset>
        <legend className="mb-8 block text-body font-bold text-ink">Kehadiran</legend>
        <div className="grid grid-cols-3 gap-16">
          {attendanceOptions.map((option, index) => (
            <label
              key={option.value}
              className="cursor-pointer rounded-card border border-rose/30 bg-white/90 px-12 py-20 text-center text-caption text-ink transition has-checked:border-rose has-checked:bg-rose has-checked:text-white"
            >
              <input
                type="radio"
                name="attendance"
                value={option.value}
                defaultChecked={index === 0}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError errors={fieldErrors?.attendance} />
      </fieldset>

      <div>
        <label htmlFor="rsvp-message" className="mb-8 block text-body font-bold text-ink">
          Ucapan & Doa
        </label>
        <textarea
          id="rsvp-message"
          name="message"
          rows={4}
          maxLength={500}
          placeholder="Tulis ucapan untuk kedua mempelai"
          className={`${fieldClass} resize-none`}
        />
        <FieldError errors={fieldErrors?.message} />
      </div>

      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p className="text-center text-body text-rose-deep" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-center rounded-full bg-rose px-80 py-20 text-lead text-white shadow-sm transition hover:bg-rose-deep disabled:opacity-60"
      >
        {pending ? "Mengirim..." : "Kirim"}
      </button>
    </form>
  );
}
