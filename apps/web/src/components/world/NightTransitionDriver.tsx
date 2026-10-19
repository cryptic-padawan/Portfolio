"use client";

import { useEffect, useRef } from "react";
import { useNightStore } from "@/store/nightStore";

export function NightTransitionDriver() {
  const transitionBusy = useNightStore((s) => s.transitionBusy);
  const direction = useNightStore((s) => s.transitionDirection);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (!transitionBusy || !direction) return;

    const store = useNightStore.getState();

    if (direction === "to-night") {
      timers.current.push(
        window.setTimeout(() => store._advanceTransition("scenery"), 32),
        window.setTimeout(() => store._advanceTransition("atmosphere"), 96),
        window.setTimeout(() => store._advanceTransition("torches"), 168),
        window.setTimeout(() => store._finishTransition(), 220),
      );
    } else {
      timers.current.push(
        window.setTimeout(() => {
          store._advanceTransition("atmosphere");
          useNightStore.setState({ atmosphereNight: false });
        }, 0),
        window.setTimeout(() => {
          store._advanceTransition("scenery");
          useNightStore.setState({ sceneryNight: false });
        }, 48),
        window.setTimeout(() => {
          store._advanceTransition("sky");
          useNightStore.setState({ visualNight: false });
        }, 96),
        window.setTimeout(() => {
          store._resetDay();
          store._finishTransition();
        }, 140),
      );
    }

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [transitionBusy, direction]);

  return null;
}
