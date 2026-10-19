/**
 * Single source of truth for island walk input + avatar XZ.
 * Plain object (not Zustand) so dynamic chunks cannot duplicate store state.
 */

export const islandRuntime = {
  posX: 0,
  posZ: 0,
  streamRadius: 24,
  interactionLocked: false,
  forward: false,
  back: false,
  left: false,
  right: false,
  run: false,
};

const KEY_MAP: Record<string, keyof Pick<typeof islandRuntime, "forward" | "back" | "left" | "right" | "run">> = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "back",
  ArrowDown: "back",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  ShiftLeft: "run",
  ShiftRight: "run",
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function setIslandPosition(x: number, z: number): void {
  islandRuntime.posX = x;
  islandRuntime.posZ = z;
}

export function bindIslandKeyboard(): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    if (isTypingTarget(e.target)) return;
    const axis = KEY_MAP[e.code];
    if (!axis) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)) {
      e.preventDefault();
      e.stopPropagation();
    }
    islandRuntime[axis] = true;
  };

  const onKeyUp = (e: KeyboardEvent) => {
    const axis = KEY_MAP[e.code];
    if (!axis) return;
    islandRuntime[axis] = false;
  };

  const reset = () => {
    islandRuntime.forward = false;
    islandRuntime.back = false;
    islandRuntime.left = false;
    islandRuntime.right = false;
    islandRuntime.run = false;
  };

  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  window.addEventListener("blur", reset);
  return () => {
    window.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("keyup", onKeyUp, true);
    window.removeEventListener("blur", reset);
  };
}
