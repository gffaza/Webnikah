// Synthesises a soft looping music-box arpeggio as placeholder background music.
// Replace public/audio/backsound.wav (and `music` in content/wedding.ts) with the real song.
import { mkdir, writeFile } from "node:fs/promises";

const sampleRate = 22050;
const bpm = 72;
const beat = 60 / bpm;
const bars = 8;
const duration = bars * 4 * beat;
const samples = Math.floor(duration * sampleRate);

// I–vi–IV–V in C major, as arpeggiated triads (MIDI note numbers).
const progression = [
  [60, 64, 67, 72],
  [57, 60, 64, 69],
  [53, 57, 60, 65],
  [55, 59, 62, 67],
];

const freq = (midi) => 440 * 2 ** ((midi - 69) / 12);
const pcm = new Float32Array(samples);

for (let bar = 0; bar < bars; bar++) {
  const chord = progression[bar % progression.length];
  for (let step = 0; step < 8; step++) {
    const note = chord[[0, 1, 2, 3, 2, 1, 2, 3][step]];
    const start = Math.floor((bar * 4 + step * 0.5) * beat * sampleRate);
    const length = Math.floor(beat * 2.5 * sampleRate);
    const f = freq(note);
    for (let i = 0; i < length && start + i < samples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 2.2) * Math.min(1, t * 200);
      const tone = Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t);
      pcm[start + i] += tone * envelope * 0.16;
    }
  }
}

const data = Buffer.alloc(samples * 2);
for (let i = 0; i < samples; i++) {
  const value = Math.max(-1, Math.min(1, pcm[i]));
  data.writeInt16LE(Math.round(value * 32767), i * 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);

await mkdir("public/audio", { recursive: true });
await writeFile("public/audio/backsound.wav", Buffer.concat([header, data]));
console.log(`Wrote public/audio/backsound.wav (${duration.toFixed(1)}s)`);
