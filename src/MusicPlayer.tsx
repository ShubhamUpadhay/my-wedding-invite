import { useEffect, useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let frame = 0;
    audio.volume = 0;

    function startMusic() {
      if (audio) void audio.play().catch(() => {
        // Browsers may require a guest gesture before playing sound.
      });
    }

    function fadeIn() {
      const start = performance.now();
      const fade = (now: number) => {
        if (!audio) return;
        audio.volume = Math.min((now - start) / 2000, 1) * 0.08;
        if (now - start < 2000) frame = requestAnimationFrame(fade);
      };
      frame = requestAnimationFrame(fade);
      document.removeEventListener("pointerdown", startMusic, true);
      document.removeEventListener("keydown", startMusic, true);
    }

    audio.addEventListener("play", fadeIn);
    document.addEventListener("pointerdown", startMusic, true);
    document.addEventListener("keydown", startMusic, true);
    startMusic();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", startMusic, true);
      document.removeEventListener("keydown", startMusic, true);
      audio.removeEventListener("play", fadeIn);
      audio.pause();
    };
  }, []);

  return <audio ref={audioRef} src="/audio/mangal-rang.mp3" loop preload="auto" />;
}
