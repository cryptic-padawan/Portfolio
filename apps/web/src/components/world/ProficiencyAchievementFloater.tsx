"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Billboard } from "@react-three/drei/core/Billboard";
import { Html } from "@react-three/drei/web/Html";
import { useFruitStore } from "@/store/fruitStore";

const LIFT1 = 0.85;
const HOLD = 2.4;
const LIFT2 = 1.75;
const Y0 = 2.05;
const Y1 = 2.72;
const Y2 = 3.55;

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

export function ProficiencyAchievementFloater() {
  const toast = useFruitStore((s) => s.toast);
  const clearToast = useFruitStore((s) => s.clearToast);
  const animT = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const liftRef = useRef<THREE.Group>(null);

  useEffect(() => {
    animT.current = 0;
  }, [toast]);

  useFrame((_, dt) => {
    const lift = liftRef.current;
    const panel = panelRef.current;
    if (!toast || !lift || !panel) return;

    animT.current += dt;
    const t = animT.current;
    const total = LIFT1 + HOLD + LIFT2;

    let y = Y0;
    let opacity = 0.22;
    let blur = 10;

    if (t <= LIFT1) {
      const p = easeOut(t / LIFT1);
      y = Y0 + (Y1 - Y0) * p;
      opacity = 0.22 + 0.78 * p;
      blur = 10 * (1 - p);
    } else if (t <= LIFT1 + HOLD) {
      y = Y1;
      opacity = 1;
      blur = 0;
    } else if (t <= total) {
      const p = (t - LIFT1 - HOLD) / LIFT2;
      y = Y1 + (Y2 - Y1) * p;
      opacity = Math.max(0, 1 - p * 1.15);
      blur = p * 4;
    } else {
      clearToast();
      return;
    }

    lift.position.y = y;
    panel.style.opacity = String(opacity);
    panel.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none";
  });

  if (!toast) return null;

  return (
    <Billboard follow>
      <group ref={liftRef} position={[0, Y0, 0.25]}>
        <Html
          center
          transform
          occlude={false}
          distanceFactor={11}
          zIndexRange={[55, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={panelRef}
            className="flex w-[min(88vw,22rem)] items-stretch gap-2.5 rounded-xl border border-amber-500/55 bg-slate-950/93 px-3 py-2.5 shadow-[0_6px_28px_rgba(0,0,0,0.7)]"
            role="status"
            style={{ opacity: 0.22, filter: "blur(10px)" }}
          >
            <div className="flex w-11 shrink-0 items-center justify-center rounded-lg border border-amber-400/45 bg-gradient-to-br from-amber-500/55 to-slate-900">
              <span className="font-sans text-[11px] font-extrabold text-amber-50">XP</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm font-bold leading-snug text-amber-100">{toast.title}</p>
              <p className="mt-0.5 font-sans text-xs leading-snug text-slate-100">{toast.body}</p>
            </div>
          </div>
        </Html>
      </group>
    </Billboard>
  );
}
