"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Gate = {
  opened: boolean;
  playing: boolean;
  open: () => void;
  toggleMusic: () => void;
};

const GateContext = createContext<Gate | null>(null);

function useGate() {
  const gate = use(GateContext);
  if (!gate) throw new Error("useGate must be used inside <InvitationGate>");
  return gate;
}

/**
 * Locks scrolling until the guest taps "Buka Undangan", then starts the music.
 * Browsers only allow audio playback after a user gesture, so the button is the trigger.
 * The lock is applied from JS, so the page stays scrollable if JS never loads.
 */
export function InvitationGate({
  music,
  scrollTo,
  children,
}: {
  music: string;
  scrollTo: string;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (opened) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [opened]);

  const play = useCallback(() => {
    audioRef.current?.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const open = useCallback(() => {
    setOpened(true);
    play();
    requestAnimationFrame(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [play, scrollTo]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      play();
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, [play]);

  return (
    <GateContext value={{ opened, playing, open, toggleMusic }}>
      {children}
      <audio ref={audioRef} src={music} loop preload="none" />
    </GateContext>
  );
}

export function OpenInvitationButton({ children }: { children: ReactNode }) {
  const { open } = useGate();
  return (
    <button
      type="button"
      onClick={open}
      className="reveal rounded-card bg-rose px-64 py-16 text-body text-white shadow-sm transition hover:bg-rose-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
    >
      {children}
    </button>
  );
}

export function MusicToggle() {
  const { opened, playing, toggleMusic } = useGate();
  if (!opened) return null;

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-label={playing ? "Jeda musik" : "Putar musik"}
      aria-pressed={playing}
      className="fixed right-[max(16px,calc(50vw-224px))] bottom-[16px] z-50 grid size-[44px] place-items-center rounded-full bg-rose text-white shadow-lg ring-2 ring-white/70 transition hover:bg-rose-deep"
    >
      <svg
        viewBox="0 0 24 24"
        className={`size-[20px] ${playing ? "animate-spin [animation-duration:4s]" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {playing ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="2.5" />
          </>
        ) : (
          <path d="M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        )}
      </svg>
    </button>
  );
}
