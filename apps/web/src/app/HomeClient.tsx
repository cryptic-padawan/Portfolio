"use client";

import { useEffect } from "react";
import { IslandExperience } from "@/components/world/IslandExperience";
import { Hud } from "@/components/ui/Hud";
import { ConsoleNav } from "@/components/ui/ConsoleNav";
import { CharacterProfileHud } from "@/components/ui/CharacterProfileHud";
import { Minimap } from "@/components/ui/Minimap";
import { NightModeBadge } from "@/components/ui/NightModeBadge";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { ControlsGuide } from "@/components/ui/ControlsGuide";
import { InteractionPrompt } from "@/components/ui/InteractionPrompt";
import { ResumePanel } from "@/components/panels/ResumePanel";
import { ContactPanel } from "@/components/panels/ContactPanel";
import { GamesPanel } from "@/components/panels/GamesPanel";
import { useWorldStore } from "@/store/worldStore";
import { useDeviceTier } from "@/components/providers/DeviceTierProvider";
import { AvatarCreatorModal } from "@/components/panels/AvatarCreatorModal";
import { useAvatarStore } from "@/store/avatarStore";
import { useNightStore } from "@/store/nightStore";
export default function HomeClient() {
  const panel = useWorldStore((s) => s.panel);
  const nearbyPoiId = useWorldStore((s) => s.nearbyPoiId);
  const interactNearby = useWorldStore((s) => s.interactNearby);
  const toggleCharacterProfile = useWorldStore((s) => s.toggleCharacterProfile);
  const setCharacterProfileOpen = useWorldStore((s) => s.setCharacterProfileOpen);
  const { prefersReducedMotion, ready } = useDeviceTier();
  const hydrateAvatar = useAvatarStore((s) => s.hydrate);
  const requestToggleNight = useNightStore((s) => s.requestToggleNight);

  useEffect(() => {
    hydrateAvatar();
  }, [hydrateAvatar]);

  useEffect(() => {
    if (ready && prefersReducedMotion) {
      window.location.replace("/classic");
    }
  }, [ready, prefersReducedMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape") {
        setCharacterProfileOpen(false);
        return;
      }

      if (e.key.toLowerCase() === "p") {
        toggleCharacterProfile();
        return;
      }

      if (e.key.toLowerCase() === "n") {
        requestToggleNight();
        return;
      }

      if (e.key.toLowerCase() !== "e") return;
      if (!nearbyPoiId) return;
      setCharacterProfileOpen(false);
      interactNearby();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearbyPoiId, interactNearby, toggleCharacterProfile, setCharacterProfileOpen, requestToggleNight]);

  if (ready && prefersReducedMotion) {
    return <div className="min-h-screen bg-arcane-night" />;
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url(/images/spire-realm-backdrop.svg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-arcane-night/90 via-arcane-night/40 to-transparent" />
      <IslandExperience />
      <ConsoleNav />
      <Hud />
      <Minimap />
      <NightModeBadge />
      <CharacterProfileHud />
      <SoundToggle />
      <ControlsGuide />
      <InteractionPrompt />
      {panel === "resume" && <ResumePanel />}
      {panel === "contact" && <ContactPanel />}
      {panel === "games" && <GamesPanel />}
      <AvatarCreatorModal />
    </main>
  );
}
