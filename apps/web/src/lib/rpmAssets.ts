/** Ready Player Me CDN assets (animation library). */

/** Bundled rigged humanoid with Idle / Walk / Run clips (three.js example Soldier, Mixamo rig). */
export const LOCAL_DEFAULT_MODEL = "/models/realm-soldier.glb";

/** Earlier bundled default without idle/run clips — stored URLs pointing here are upgraded. */
const RETIRED_LOCAL_MODELS = ["/models/realm-traveler.glb"];

/** Example RPM GLB if `models.readyplayer.me` resolves on your network (not used as default). */
export const RPM_EXAMPLE_MODEL =
  "https://models.readyplayer.me/64d61e9e17883fd73ebe5eb7.glb?morphTargets=ARKit,Eyes%20Extra&textureAtlas=none&lod=0";

/** @deprecated Broken GitHub Pages path — migrate stored URLs away from this. */
export const BROKEN_LEGACY_RPM_URL = "https://readyplayerme.github.io/visage/male.glb";

export function isRpmAvatarUrl(url: string): boolean {
  return /readyplayer\.me/i.test(url);
}

export function resolveAvatarModelUrl(stored: string | null | undefined, envUrl?: string): string {
  const fromEnv = envUrl?.trim();
  if (fromEnv) return fromEnv;
  const saved = stored?.trim();
  if (saved && saved !== BROKEN_LEGACY_RPM_URL && !RETIRED_LOCAL_MODELS.includes(saved)) return saved;
  return LOCAL_DEFAULT_MODEL;
}

const ANIM_CDN =
  "https://cdn.jsdelivr.net/gh/readyplayerme/animation-library@master/masculine/fbx";

export const RPM_ANIMATIONS = {
  idle: `${ANIM_CDN}/idle/M_Standing_Idle_001.fbx`,
  walk: `${ANIM_CDN}/locomotion/M_Walk_001.fbx`,
  run: `${ANIM_CDN}/locomotion/M_Run_001.fbx`,
} as const;

export const RPM_STORAGE_KEY = "arcanum-rpm-avatar-url";
