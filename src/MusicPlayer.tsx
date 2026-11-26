import { useEffect, useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let frame = 0;
    let hasStarted = false;
    audio.volume = 0;

    function startMusic() {
      if (audio) void audio.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          console.info("[Music] Waiting for a browser-allowed interaction.");
        } else if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.warn("[Music] Playback could not start:", error);
        }
      });
    }

    function reportMediaError() {
      console.warn("[Music] Audio could not be loaded:", audio?.error?.message ?? "Unknown media error");
    }

    function fadeIn() {
      if (hasStarted) return;
      hasStarted = true;
      const start = performance.now();
      const fade = (now: number) => {
        if (!audio) return;
        audio.volume = Math.min((now - start) / 2000, 1) * 0.08;
        if (now - start < 2000) frame = requestAnimationFrame(fade);
      };
      frame = requestAnimationFrame(fade);
      document.removeEventListener("touchend", startMusic, true);
      document.removeEventListener("click", startMusic, true);
      document.removeEventListener("keydown", startMusic, true);
    }

    audio.addEventListener("playing", fadeIn);
    audio.addEventListener("error", reportMediaError);
    document.addEventListener("touchend", startMusic, true);
    document.addEventListener("click", startMusic, true);
    document.addEventListener("keydown", startMusic, true);
    startMusic();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("touchend", startMusic, true);
      document.removeEventListener("click", startMusic, true);
      document.removeEventListener("keydown", startMusic, true);
      audio.removeEventListener("playing", fadeIn);
      audio.removeEventListener("error", reportMediaError);
      audio.pause();
    };
  }, []);

  return <audio ref={audioRef} src="/audio/mangal-rang.mp3" loop preload="auto" />;
}
