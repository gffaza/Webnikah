export type Person = {
  nickname: string;
  fullName: string;
  parents: string;
  photo: string;
};

export type WeddingEvent = {
  name: string;
  time: string;
};

export type StoryItem = {
  title: string;
  description: string;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
};

export type BankAccount = {
  bank: string;
  logo: string;
  number: string;
  holder: string;
};

export type Wedding = {
  bride: Person;
  groom: Person;
  /** ISO 8601 with timezone; drives the countdown. */
  startsAt: string;
  dateLabel: {
    short: string;
    weekday: string;
    day: string;
    monthYear: string;
  };
  city: string;
  defaultGuest: string;
  intro: {
    photo: string;
    title: string;
    quote: string;
    source: string;
  };
  invitationText: string;
  events: WeddingEvent[];
  venue: {
    address: string;
    mapsUrl: string;
  };
  /** YouTube video ID. Leave empty to show the placeholder frame. */
  youtubeId: string;
  story: {
    photo: string;
    items: StoryItem[];
  };
  gallery: GalleryPhoto[];
  gift: {
    text: string;
    qris: string;
    accounts: BankAccount[];
  };
  closing: {
    photo: string;
    text: string;
  };
  music: string;
};

export const wedding: Wedding = {
  bride: {
    nickname: "Ayu",
    fullName: "Cahya Ayu Lestari",
    parents: "Putri dari Bapak Nama Ayah & Ibu Nama Ibu",
    photo: "/images/bride.webp",
  },
  groom: {
    nickname: "Faza",
    fullName: "Ghilman Faza",
    parents: "Putra dari Bapak Nama Ayah & Ibu Nama Ibu",
    photo: "/images/groom.webp",
  },
  startsAt: "2026-12-19T08:00:00+07:00",
  dateLabel: {
    short: "19.12.26",
    weekday: "Sabtu",
    day: "19",
    monthYear: "Desember 2026",
  },
  city: "Yogyakarta",
  defaultGuest: "Tamu Undangan",
  intro: {
    photo: "/images/intro.webp",
    title: "With Love",
    quote:
      "“Dialah yang menciptakan kamu dari satu jiwa dan darinya Dia menciptakan pasangannya, agar dia merasa tenteram kepadanya.”",
    source: "QS. Al-A'raf: 189",
  },
  invitationText:
    "Assalamualaikum Wr.Wb. Dengan memohon Rahmat & Ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan putra-putri kami",
  events: [
    { name: "Akad", time: "08.00 WIB - 09.00 WIB" },
    { name: "Resepsi", time: "10.00 WIB - 12.00 WIB" },
  ],
  venue: {
    address: "Sidorejo, Lendah, Kulon Progo, Daerah Istimewa Yogyakarta",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Sidorejo%2C+Lendah%2C+Kulon+Progo",
  },
  youtubeId: "",
  story: {
    photo: "/images/story.webp",
    items: [
      {
        title: "Awal Bertemu",
        description:
          "Alamat Bby is simply dummy text of the printing and typesetting industry.",
      },
      {
        title: "Lamaran",
        description:
          "Alamat Bby is simply dummy text of the printing and typesetting industry.",
      },
      {
        title: "Pernikahan",
        description:
          "Alamat Bby is simply dummy text of the printing and typesetting industry.",
      },
    ],
  },
  gallery: [
    { src: "/images/gallery-1.webp", alt: "Ayu dan Faza di depan rumah joglo" },
    { src: "/images/gallery-2.webp", alt: "Faza berbusana adat" },
    { src: "/images/gallery-3.webp", alt: "Ayu di taman" },
    { src: "/images/gallery-4.webp", alt: "Ayu dan Faza di tangga" },
    { src: "/images/gallery-5.webp", alt: "Ayu dan Faza berdampingan" },
  ],
  gift: {
    text: "Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda. Anda dapat memberi kado secara cashless.",
    qris: "/images/qris.webp",
    accounts: [
      {
        bank: "Mandiri",
        logo: "/images/bank-mandiri.webp",
        number: "712345123",
        holder: "Cahya Ayu Lestari",
      },
      {
        bank: "BSI",
        logo: "/images/bank-bsi.webp",
        number: "712345123",
        holder: "Ghilman Faza",
      },
    ],
  },
  closing: {
    photo: "/images/closing.webp",
    text: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restunya untuk pernikahan kami. Atas doa & restunya, kami ucapkan terima kasih.",
  },
  music: "/audio/backsoundjava.weba",
};
