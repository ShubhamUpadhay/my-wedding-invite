"""Render the invitation's original, gently looping instrumental (no external audio)."""

import math
import struct
import wave
from pathlib import Path

RATE = 22050
SECONDS = 48
audio = [0.0] * (RATE * SECONDS)


def note(midi, start, duration, volume, bell=False):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    for i in range(int(duration * RATE)):
        t = i / RATE
        if bell:
            envelope = min(t / 0.015, 1) * math.exp(-t * 1.8)
            tone = math.sin(2 * math.pi * frequency * t)
            tone += 0.18 * math.sin(2 * math.pi * frequency * 2 * t)
        else:
            envelope = min(t / 1.4, 1) * min((duration - t) / 2, 1)
            tone = math.sin(2 * math.pi * frequency * t)
            tone += 0.12 * math.sin(2 * math.pi * frequency * 2.002 * t)
        # Wrap note tails for a seamless loop.
        audio[(int(start * RATE) + i) % len(audio)] += volume * envelope * tone


# D major, A major, B minor, G major: soft pads with a pentatonic music-box melody.
chords = [(50, 57, 62, 66), (45, 57, 61, 64), (47, 54, 59, 62), (43, 55, 59, 62)]
melodies = [(74, 78, 81, 78), (76, 73, 69, 73), (74, 78, 81, 86), (83, 81, 78, 76)]
for bar in range(8):
    start = bar * 6
    for pitch in chords[bar % 4]:
        note(pitch, start, 8, 0.035)
    for beat, pitch in enumerate(melodies[bar % 4]):
        note(pitch, start + beat * 1.5, 4.5, 0.095, bell=True)
        note(pitch, start + beat * 1.5 + 0.32, 4.5, 0.018, bell=True)

destination = Path("public/audio/forever-in-bloom.wav")
destination.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(destination), "wb") as output:
    output.setnchannels(1)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, value)) * 32767)) for value in audio))
