"use client";

import { useAudioStore } from "@/store/audioStore";
import { writeStoredAudioConsent } from "@/lib/audioPrefs";

export function SoundToggle() {
  const consent = useAudioStore((s) => s.consent);
  const setConsent = useAudioStore((s) => s.setConsent);

  const on = consent === "granted";

  return (
    <button
      type="button"
      className="pointer-events-auto fixed bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-600/80 bg-arcane-night/80 text-lg backdrop-blur hover:border-arcane-glow/50"
      aria-label={on ? "Mute ambient sound" : "Enable ambient sound"}
      onClick={() => {
        const next = on ? "denied" : "granted";
        writeStoredAudioConsent(next);
        setConsent(next);
      }}
    >
      {on ? "🔊" : "🔇"}
    </button>
  );
}
