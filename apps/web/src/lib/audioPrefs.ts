export const AUDIO_CONSENT_STORAGE_KEY = "arcanum-audio-consent";

export type AudioConsentValue = "granted" | "denied";

export function readStoredAudioConsent(): AudioConsentValue | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(AUDIO_CONSENT_STORAGE_KEY);
  if (saved === "granted" || saved === "denied") return saved;
  return null;
}

export function writeStoredAudioConsent(value: AudioConsentValue) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUDIO_CONSENT_STORAGE_KEY, value);
}
