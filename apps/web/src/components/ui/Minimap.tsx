"use client";

import { useCallback, useRef, useState } from "react";
import { WORLD_POIS, worldToMap } from "@/lib/worldPois";
import { islandRuntime } from "@/lib/islandRuntime";
import { useWorldStore } from "@/store/worldStore";

const MIN_ZOOM = 0.85;
const MAX_ZOOM = 2.2;

export function Minimap() {
  const activePoiId = useWorldStore((s) => s.activePoiId);
  const nearbyPoiId = useWorldStore((s) => s.nearbyPoiId);
  const playerPosition = useWorldStore((s) => s.playerPosition);
  const teleportTo = useWorldStore((s) => s.teleportTo);
  const phase = useWorldStore((s) => s.teleportPhase);
  const busy = phase !== "idle";

  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);

  const px = Number.isFinite(playerPosition[0]) ? playerPosition[0] : islandRuntime.posX;
  const pz = Number.isFinite(playerPosition[2]) ? playerPosition[2] : islandRuntime.posZ;
  const playerMap = worldToMap(px, pz);

  const applyZoom = useCallback((delta: number) => {
    zoomRef.current = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomRef.current + delta));
    setZoom(zoomRef.current);
  }, []);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applyZoom(-e.deltaY * 0.0015);
  };

  const onMapPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      pinchStart.current = {
        distance: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        zoom: zoomRef.current,
      };
    }
  };

  const onMapPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size !== 2 || !pinchStart.current) return;
    const pts = [...pointers.current.values()];
    const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    const ratio = dist / pinchStart.current.distance;
    zoomRef.current = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStart.current.zoom * ratio));
    setZoom(zoomRef.current);
  };

  const onMapPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  };

  const travelTo = (poiId: (typeof WORLD_POIS)[number]["id"]) => {
    if (!busy) teleportTo(poiId);
  };

  return (
    <div className="pointer-events-auto fixed right-4 top-20 z-20 w-48 rounded-xl border border-arcane-glow/30 bg-arcane-night/88 p-3 shadow-lg backdrop-blur-md">
      <p className="font-display text-[10px] uppercase tracking-wider text-arcane-glow">Realm beacons</p>
      <p className="text-[9px] text-slate-500">Click beacon to travel · scroll to zoom</p>
      <div
        className="relative mt-2 aspect-square w-full touch-none overflow-hidden rounded-lg border border-slate-700/80 bg-gradient-to-br from-[#1a2840] to-[#0f1524]"
        onWheel={onWheel}
        onPointerDown={onMapPointerDown}
        onPointerMove={onMapPointerMove}
        onPointerUp={onMapPointerUp}
        onPointerCancel={onMapPointerUp}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <g transform={`translate(50 52) scale(${zoom}) translate(-50 -52)`}>
            <ellipse cx="50" cy="52" rx="42" ry="38" fill="#243248" stroke="#3d5570" strokeWidth="0.6" />
            {WORLD_POIS.map((a, i) =>
              WORLD_POIS.slice(i + 1).map((b) => (
                <line
                  key={`${a.id}-${b.id}`}
                  x1={a.map.x}
                  y1={a.map.y}
                  x2={b.map.x}
                  y2={b.map.y}
                  stroke="#334155"
                  strokeWidth="0.35"
                  opacity="0.5"
                />
              )),
            )}
            {WORLD_POIS.map((poi) => {
              const active = poi.id === activePoiId;
              const near = poi.id === nearbyPoiId;
              return (
                <g key={poi.id}>
                  {near && <circle cx={poi.map.x} cy={poi.map.y} r={7} fill={poi.accent} opacity={0.25} />}
                  <circle
                    cx={poi.map.x}
                    cy={poi.map.y}
                    r={active ? 5 : 4}
                    fill={poi.accent}
                    stroke={active ? "#fff" : "#0f172a"}
                    strokeWidth={active ? 1.2 : 0.6}
                  />
                  <circle
                    cx={poi.map.x}
                    cy={poi.map.y}
                    r={9}
                    fill="transparent"
                    className={busy ? "cursor-wait" : "cursor-pointer"}
                    onClick={() => travelTo(poi.id)}
                  />
                  <text
                    x={poi.map.x}
                    y={poi.map.y + 1.2}
                    textAnchor="middle"
                    fontSize="4.5"
                    fill="#0f172a"
                    pointerEvents="none"
                  >
                    {poi.mapIcon}
                  </text>
                </g>
              );
            })}
            <g pointerEvents="none">
              <circle cx={playerMap.x} cy={playerMap.y} r={5} fill="#0f172a" opacity={0.45} />
              <circle cx={playerMap.x} cy={playerMap.y} r={3.6} fill="#ffffff" stroke="#38bdf8" strokeWidth="1.4" />
            </g>
          </g>
        </svg>
      </div>
      <div className="mt-1 flex justify-between text-[9px] text-slate-500">
        <button type="button" className="hover:text-arcane-glow" onClick={() => applyZoom(-0.15)}>
          −
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" className="hover:text-arcane-glow" onClick={() => applyZoom(0.15)}>
          +
        </button>
      </div>
      <ul className="mt-2 max-h-28 space-y-0.5 overflow-y-auto text-[10px]">
        {WORLD_POIS.map((poi) => (
          <li key={poi.id}>
            <button
              type="button"
              disabled={busy}
              className="flex w-full items-center gap-2 text-left hover:text-white disabled:opacity-50"
              onClick={() => travelTo(poi.id)}
            >
              <span className="inline-block w-3 text-center" style={{ color: poi.accent }}>
                {poi.mapIcon}
              </span>
              <span className={poi.id === activePoiId ? "text-arcane-glow" : "text-slate-400"}>{poi.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
