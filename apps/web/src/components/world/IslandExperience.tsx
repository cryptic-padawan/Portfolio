"use client";

import { useEffect } from "react";
import { bindIslandKeyboard } from "@/lib/islandRuntime";
import { IslandCanvas } from "./IslandCanvas";

export function IslandExperience() {
  useEffect(() => bindIslandKeyboard(), []);

  return <IslandCanvas />;
}
