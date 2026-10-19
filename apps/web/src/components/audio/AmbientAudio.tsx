"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/audioStore";

function startWindBed(ctx: AudioContext, volume: number): () => void {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const gain = ctx.createGain();
  gain.gain.value = Math.max(0.02, volume * 0.35);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  const hum = ctx.createOscillator();
  hum.type = "sine";
  hum.frequency.value = 110;
  const humGain = ctx.createGain();
  humGain.gain.value = volume * 0.04;
  hum.connect(humGain);
  humGain.connect(ctx.destination);
  hum.start();
  return () => {
    source.stop();
    hum.stop();
  };
}

export function AmbientAudio() {
  const consent = useAudioStore((s) => s.consent);
  const volume = useAudioStore((s) => s.volume);
  const stopRef = useRef<(() => void) | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    stopRef.current?.();
    stopRef.current = null;
    if (consent !== "granted") {
      ctxRef.current?.close().catch(() => undefined);
      ctxRef.current = null;
      return;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    ctx.resume().then(() => {
      stopRef.current = startWindBed(ctx, volume);
    });

    return () => {
      stopRef.current?.();
      stopRef.current = null;
      ctx.close().catch(() => undefined);
      ctxRef.current = null;
    };
  }, [consent, volume]);

  return null;
}
