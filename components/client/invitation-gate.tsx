"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { InviteLoader } from "@/components/client/invite-loader";
import { OpeningCinematic } from "@/components/client/opening-cinematic";

type Phase = "loading" | "locked" | "cinematic" | "opened";

type Gate = {
  phase: Phase;
  opened: boolean;
  playing: boolean;
  open: () => void;
  toggleMusic: () => void;
};

const GateContext = createContext<Gate | null>(null);

/** Survives Safari tab reloads within the same session (iOS memory kills). */
const OPENED_KEY = "webnikah-invite-opened";

function useGate() {
  const gate = use(GateContext);
  if (!gate) throw new Error("useGate must be used inside <InvitationGate>");
  return gate;
}

function readOpened(): boolean {
  try {
    return sessionStorage.getItem(OPENED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeOpened() {
  try {
    sessionStorage.setItem(OPENED_KEY, "1");
  } catch {
    /* private mode / quota — ignore */
  }
}

/** iOS Safari needs both html + body cleared; overflow on html alone can stick. */
function lockScroll() {
  const { documentElement: root, body } = document;
  root.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.touchAction = "none";
  body.style.overscrollBehavior = "none";
}

function unlockScroll() {
  const { documentElement: root, body } = document;
  root.style.overflow = "";
  body.style.overflow = "";
  body.style.touchAction = "";
  body.style.overscrollBehavior = "";
}

/**
 * Boots behind a full-screen loader until invite assets are cached,
 * then locks scrolling until the guest taps "Buka Undangan".
 * Starts music on the gesture, holds a short living-backdrop beat, then unlocks + scrolls.
 * Browsers only allow audio playback after a user gesture, so the button is the trigger.
 * The lock is applied from JS, so the page stays scrollable if JS never loads.
 * Opened state is persisted in sessionStorage so an iOS memory-reload does not re-lock.
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
  const [phase, setPhase] = useState<Phase>("loading");
  const [bootstrapped, setBootstrapped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const opened = phase === "opened";
  const loading = bootstrapped && phase === "loading";

  // Restore after Safari soft-reload before applying the scroll lock / asset loader.
  useEffect(() => {
    if (readOpened()) setPhase("opened");
    setBootstrapped(true);
  }, []);

  useLayoutEffect(() => {
    if (!bootstrapped) return;
    const invite = document.querySelector(".invite");
    invite?.setAttribute("data-invite-phase", phase);
    return () => {
      invite?.removeAttribute("data-invite-phase");
    };
  }, [phase, bootstrapped]);

  useEffect(() => {
    if (!bootstrapped) return;
    if (opened) {
      unlockScroll();
      return;
    }
    lockScroll();
    return unlockScroll;
  }, [opened, bootstrapped]);

  const finishLoading = useCallback(() => {
    setPhase((current) => (current === "loading" ? "locked" : current));
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const open = useCallback(() => {
    if (phase !== "locked") return;
    setPhase("cinematic");
    play();
  }, [phase, play]);

  const finishCinematic = useCallback(() => {
    writeOpened();
    setPhase("opened");
    requestAnimationFrame(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [scrollTo]);

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
    <GateContext value={{ phase, opened, playing, open, toggleMusic }}>
      {/* Keep the invite mounted under the loader so <img> nodes decode into cache. */}
      <div
        className={
          loading
            ? "pointer-events-none select-none"
            : phase !== "loading"
              ? "animate-[invite-reveal_0.55s_ease-out]"
              : undefined
        }
        aria-hidden={loading || undefined}
      >
        {children}
      </div>
      {loading ? <InviteLoader onReady={finishLoading} /> : null}
      {phase === "cinematic" ? <OpeningCinematic onComplete={finishCinematic} /> : null}
      <audio ref={audioRef} src={music} loop preload="auto" />
    </GateContext>
  );
}

export function OpenInvitationButton({ children }: { children: ReactNode }) {
  const { open, phase } = useGate();
  if (phase === "opened") return null;

  return (
    <button
      type="button"
      onClick={open}
      disabled={phase !== "locked"}
      className="reveal rounded-card bg-rose px-64 py-16 text-body text-white shadow-sm transition hover:bg-rose-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose disabled:opacity-60"
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
