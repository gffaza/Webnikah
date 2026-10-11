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
  /** Short label shown on the timeline (year or date). */
  // date: string;
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
  /** Remote prewed clip (R2/CDN). Leave `src` empty for placeholder. */
  video: {
    src: string;
    poster: string;
  };
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
    fullName: "Cahya Ayu Lestari S.Psi",
    parents: "Putri dari Bapak Kabul Wibowo & Ibu Suniasih",
    photo: "/galery/bride.webp",
  },
  groom: {
    nickname: "Faza",
    fullName: "Ghilman Faza S.Kom",
    parents: "Putra dari Bapak Teguh Puji Raharjo & (Almh) Ibu Asih Kurniawati",
    photo: "/galery/groom.webp",
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
    photo: "/galery/intro.webp",
    title: "With Love",
    quote:
      "“Dialah yang menciptakan kamu dari satu jiwa dan darinya Dia menciptakan pasangannya, agar dia merasa tenteram kepadanya.”",
    source: "QS. Al-A'raf: 189",
  },
  invitationText:
    "Assalamualaikum Wr.Wb. Dengan memohon Rahmat & Ridho Allah SWT, kami bermaksud mengundang Bapak / Ibu / Saudara/i untuk menghadiri acara pernikahan putra-putri kami",
  events: [
    { name: "Akad", time: "08.00 WIB - 09.00 WIB" },
    { name: "Resepsi", time: "10.00 WIB - 12.00 WIB" },
  ],
  venue: {
    address: "Jurug, Sidorejo, Lendah, Kulon Progo, Daerah Istimewa Yogyakarta",
    mapsUrl:
      "https://maps.app.goo.gl/Sc5DEPXSJ1kZY6jZ7",
  },
  video: {
    src: "https://pub-05b77a0eae67482589fcc5f88c59af9f.r2.dev/video/prewed.mp4",
    poster: "/galery/slide3.webp",
  },
  story: {
    photo: "/galery/ourstory.webp",
    items: [
      {
        title: "Awal Bertemu",
        // date: "2020",
        description:
          "Kisah Ayu & Faza bermula dari Pesona Ta’aruf, orientasi mahasiswa baru Universitas Islam Indonesia, pada tahun 2020. Saat itu Ayu adalah mahasiswa baru, sedangkan Faza adalah kakak tingkat yang bertugas sebagai panitia. Dari sanalah keduanya mulai berkenalan dan semakin dekat.",
      },
      {
        title: "Lamaran",
        // date: "5 Sep 2026",
        description:
          "Selama 6 tahun, Ayu & Faza berjalan bersama melewati masa kuliah, kelulusan, dunia kerja, hingga hubungan jarak jauh. Dari perjalanan itu, keduanya yakin untuk melangkah ke jenjang yang lebih serius. Pada 5 September 2026, mereka resmi bertunangan.",
      },
      {
        title: "Menuju Hari Bahagia",
        // date: "Des 2026",
        description:
          "Hanya sekitar 3 bulan setelah pertunangan, persiapan pernikahan harus dijalani dari jarak jauh. Berkat komunikasi yang baik dan bantuan keluarga, alhamdulillah semuanya dapat dipersiapkan dengan baik. Kini, Ayu & Faza bersiap menyambut hari bahagia mereka.",
      },
    ],
  },
  gallery: [
    { src: "/galery/galery3.webp", alt: "Ayu dan Faza di depan rumah joglo" },
    { src: "/galery/galery1.webp", alt: "Faza berbusana adat" },
    { src: "/galery/galery2.webp", alt: "Ayu di taman" },
    { src: "/galery/galery4.webp", alt: "Ayu dan Faza di tangga" },
    { src: "/galery/slide1.webp", alt: "Ayu dan Faza berdampingan di ambang pintu" },
    { src: "/galery/slide2.webp", alt: "Ayu bersandar di bahu Faza" },
    { src: "/galery/slide3.webp", alt: "Ayu dan Faza berpelukan" },
    { src: "/galery/slide4.webp", alt: "Ayu memeluk Faza dari belakang" },
    { src: "/galery/slide5.webp", alt: "Ayu dan Faza saling tersenyum" },
    { src: "/galery/slide6.webp", alt: "Ayu dan Faza di bawah lengkung" },
  ],
  gift: {
    text: "Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda. Anda dapat memberi kado secara cashless.",
    qris: "/images/qris.webp",
    accounts: [
      {
        bank: "Mandiri",
        logo: "/images/bank-mandiri.webp",
        number: "1370024027134",
        holder: "Cahya Ayu Lestari",
      },
      {
        bank: "BSI",
        logo: "/images/bank-bsi.webp",
        number: "7300777095",
        holder: "Ghilman Faza",
      },
    ],
  },
  closing: {
    photo: "/galery/end.webp",
    text: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restunya untuk pernikahan kami. Atas doa & restunya, kami ucapkan terima kasih.",
  },
  music: "/audio/backsoundjava.weba",
};
