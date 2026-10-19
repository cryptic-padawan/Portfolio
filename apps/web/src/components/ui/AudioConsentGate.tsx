"use client";

import { useEffect, useState } from "react";
import { useAudioStore } from "@/store/audioStore";
import { readStoredAudioConsent, writeStoredAudioConsent } from "@/lib/audioPrefs";

export function AudioConsentGate() {
  const [visible, setVisible] = useState(false);
  const setConsent = useAudioStore((s) => s.setConsent);

  useEffect(() => {
    const saved = readStoredAudioConsent();
    if (saved === null) setVisible(true);
    else setConsent(saved);
  }, [setConsent]);

  if (!visible) return null;

  const choose = (granted: boolean) => {
    const value = granted ? "granted" : "denied";
    writeStoredAudioConsent(value);
    setConsent(value);
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="glass-panel max-w-md p-6 text-center shadow-xl">
        <h2 className="font-display text-xl text-arcane-glow">Sound in the realm?</h2>
        <p className="mt-2 text-sm text-slate-300">
          Ambient music stays muted unless you allow it — useful in public places.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-arcane-glow px-4 py-2 text-sm font-medium text-arcane-night"
            onClick={() => choose(true)}
          >
            Enable sound
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-500 px-4 py-2 text-sm"
            onClick={() => choose(false)}
          >
            Stay muted
          </button>
        </div>
      </div>
    </div>
  );
}
