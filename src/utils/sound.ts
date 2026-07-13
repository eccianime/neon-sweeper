/**
 * Motor de sonido simplificado para React Native usando expo-av.
 *
 * El original usaba Web Audio API para sintetizar tonos en tiempo real
 * (osciladores, ruido blanco, etc). React Native no tiene Web Audio, así
 * que aquí generamos los mismos efectos como archivos WAV base64 cortos
 * generados en runtime (síntesis simple de onda cuadrada/ruido) y los
 * reproducimos con expo-av. Esto mantiene el mismo carácter "chiptune/neón"
 * del juego original sin depender de assets externos.
 */
import { Audio } from "expo-av";

let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

function base64FromBytes(bytes: Uint8Array): string {
  // Codificación base64 manual (evita dependencias extra en RN)
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    result += chars[b1 >> 2];
    result += chars[((b1 & 3) << 4) | (b2 >> 4)];
    result += i + 1 < bytes.length ? chars[((b2 & 15) << 2) | (b3 >> 6)] : "=";
    result += i + 2 < bytes.length ? chars[b3 & 63] : "=";
  }
  return result;
}

function makeWavTone(
  freq: number,
  durationMs: number,
  kind: "square" | "noise" = "square",
) {
  const sampleRate = 8000;
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const bytesPerSample = 2;
  const dataSize = numSamples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = 1 - i / numSamples; // fade-out simple
    let sample = 0;
    if (kind === "square") {
      sample = Math.sign(Math.sin(2 * Math.PI * freq * t)) * envelope * 0.6;
    } else {
      sample = (Math.random() * 2 - 1) * envelope;
    }
    view.setInt16(44 + i * 2, sample * 32767, true);
  }

  const bytes = new Uint8Array(buffer);
  return `data:audio/wav;base64,${base64FromBytes(bytes)}`;
}

async function playTone(
  freq: number,
  durationMs: number,
  kind: "square" | "noise" = "square",
) {
  if (muted) return;
  try {
    const uri = makeWavTone(freq, durationMs, kind);
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch {
    // silencioso: el audio nunca debe romper el juego
  }
}

export async function playSfx(kind: "dig" | "flag" | "win" | "lose") {
  if (muted) return;
  switch (kind) {
    case "dig":
      playTone(660, 90, "square");
      break;
    case "flag":
      playTone(880, 60, "square");
      setTimeout(() => playTone(1320, 70, "square"), 50);
      break;
    case "win":
      [523, 659, 784, 1047].forEach((f, i) =>
        setTimeout(() => playTone(f, 220, "square"), i * 110),
      );
      break;
    case "lose":
      playTone(90, 500, "noise");
      setTimeout(() => playTone(120, 400, "square"), 20);
      break;
  }
}
