import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./Language";

export default function MusicPlayer() {
  const { t } = useLanguage();
  const context = useRef<AudioContext | null>(null);
  const buffer = useRef<AudioBuffer | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const gain = useRef<GainNode | null>(null);
  const request = useRef<AbortController | null>(null);
  const offset = useRef(0);
  const startedAt = useRef(0);
  const mounted = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current?.abort();
      source.current?.stop();
      void context.current?.close();
      context.current = null;
    };
  }, []);

  async function toggleMusic() {
    if (pending) return;
    if (source.current && context.current && gain.current) {
      const now = context.current.currentTime;
      offset.current += now - startedAt.current + 2;
      gain.current.gain.cancelScheduledValues(now);
      gain.current.gain.setValueAtTime(gain.current.gain.value, now);
      gain.current.gain.linearRampToValueAtTime(0, now + 2);
      source.current.stop(now + 2);
      setStopping(true);
      setPending(true);
      setPlaying(false);
      return;
    }
    setPending(true);
    setError("");
    try {
      const audioContext = context.current ?? new AudioContext();
      context.current = audioContext;
      // Resume within the guest's click, before any network request.
      await audioContext.resume();
      if (!buffer.current) {
        const controller = new AbortController();
        request.current = controller;
        const response = await fetch("/audio/mangal-rang.mp3", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load music");
        buffer.current = await audioContext.decodeAudioData(await response.arrayBuffer());
      }
      if (!mounted.current || audioContext.state === "closed") return;
      const track = audioContext.createBufferSource();
      const volume = audioContext.createGain();
      track.buffer = buffer.current;
      track.loop = true;
      volume.gain.setValueAtTime(0, audioContext.currentTime);
      volume.gain.linearRampToValueAtTime(0.16, audioContext.currentTime + 2);
      track.connect(volume);
      volume.connect(audioContext.destination);
      track.onended = () => {
        track.disconnect();
        volume.disconnect();
        if (source.current === track) {
          source.current = null;
          gain.current = null;
          if (mounted.current) {
            void audioContext.suspend();
            setStopping(false);
            setPending(false);
          }
        }
      };
      track.start(0, offset.current % buffer.current.duration);
      startedAt.current = audioContext.currentTime;
      source.current = track;
      gain.current = volume;
      setPlaying(true);
    } catch {
      if (mounted.current) {
        setError("Music couldn’t start. Tap to try again.");
        if (context.current?.state === "running") void context.current.suspend();
      }
    } finally {
      if (mounted.current) setPending(false);
    }
  }

  return (
    <div className="music-widget">
      {error && (
        <p className="music-error" role="status">
          {t(error)}
        </p>
      )}
      <button
        className={`music-toggle ${playing ? "is-playing" : ""}`}
        type="button"
        onClick={toggleMusic}
        aria-label={t(playing ? "Mute background music" : "Play background music")}
        aria-pressed={playing}
        aria-busy={pending}
        disabled={pending}
        title={t(playing ? "Mute background music" : "Play background music")}
      >
        <span className="music-symbol">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m11 4-6 5H2v6h3l6 5Z" />
            {playing ? (
              <>
                <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
              </>
            ) : (
              <path d="m16 9 6 6m0-6-6 6" />
            )}
          </svg>
        </span>
        <span>{t(stopping ? "Fading out…" : pending ? "Starting…" : playing ? "Music on" : "Play music")}</span>
        <span className="music-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </button>
    </div>
  );
}
