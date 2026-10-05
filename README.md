# Web Nikah Ayu & Faza

Undangan pernikahan digital (Next.js 16 App Router) berdasarkan desain Figma
[Notes / Section 1](https://www.figma.com/design/gpLE7SzFrQeIr4Ge4zSRyp/Notes?node-id=141-65932).

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi kredensial Sanity
npm run dev                  # http://localhost:3000
```

Link per tamu: `https://domain-anda/?to=Nama+Tamu`. Nama tampil di cover dan otomatis terisi di form RSVP.

## Mengganti konten

Semua teks, tanggal, jadwal, lokasi, rekening, dan path gambar ada di
[`content/wedding.ts`](content/wedding.ts).

- **Video prewedding:** isi `youtubeId` (contoh `dQw4w9WgXcQ`). Selama kosong, tampil frame placeholder.
- **Countdown:** dihitung dari `startsAt`.

## Mengganti aset

Gambar di `public/images/` saat ini adalah placeholder resolusi rendah hasil crop dari screenshot Figma
(dibuat oleh `node scripts/crop-placeholders.mjs`). Timpa dengan file berukuran lebih besar
menggunakan nama yang sama:

| File | Isi | Ekspor Figma yang disarankan |
| --- | --- | --- |
| `bg-floral.webp` | Latar ornamen bunga + joglo | node `126:3026`, PNG 2x |
| `butterfly.webp` | Kupu-kupu di cover | node `126:1775`, PNG 2x |
| `intro.webp`, `bride.webp`, `groom.webp`, `story.webp`, `closing.webp` | Foto pasangan | foto asli |
| `gallery-1..5.webp` | Galeri | foto asli |
| `qris.webp`, `bank-mandiri.webp`, `bank-bsi.webp` | Wedding gift | QRIS asli + logo bank |
| `og.jpg` | Preview saat link dibagikan (1200x630) | bebas |

Musik latar: timpa `public/audio/backsound.wav` (atau taruh `.mp3` dan ubah `music` di `content/wedding.ts`).

## RSVP & ucapan

Data disimpan di Sanity project `59mz4b8q` (dataset `production`) sebagai dokumen `_type: "rsvp"`.
Ucapan dengan `hidden: true` tidak ditampilkan. Daftar ucapan di-cache dan diperbarui otomatis setelah
tamu mengirim form, serta direvalidasi tiap menit.

Untuk deploy ke Vercel, set `SANITY_PROJECT_ID`, `SANITY_DATASET`, dan `SANITY_API_TOKEN` di
Environment Variables project.
