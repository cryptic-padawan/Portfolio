"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { version } from "@react-three/drei/helpers/constants.js";

/** Sparkles-style points that drift in local space (stable when the anchor moves). */
class FairySparklesMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float pixelRatio;
        uniform float time;
        attribute float size;
        attribute float speed;
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec3 pos = position;
          pos.y += sin(time * speed + pos.x * noise.x * 12.0) * 0.16;
          pos.z += cos(time * speed + pos.y * noise.y * 12.0) * 0.16;
          pos.x += cos(time * speed + pos.z * noise.z * 12.0) * 0.16;
          vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = size * 28.0 * pixelRatio;
          gl_PointSize *= (1.0 / -viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float core = 1.0 - smoothstep(0.05, 0.42, d);
          float strength = core * (0.16 / max(d, 0.035) - 0.06);
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${version >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
        }
      `,
    });
  }
}

type FairySparklesProps = {
  count?: number;
  scale?: number | [number, number, number];
  size?: number;
  speed?: number;
  opacity?: number;
  color?: string;
};

function normalizeScale(scale: number | [number, number, number]): [number, number, number] {
  if (Array.isArray(scale)) return scale;
  return [scale, scale, scale];
}

export const FairySparkles = React.forwardRef<THREE.Points, FairySparklesProps>(function FairySparkles(
  { count = 48, scale = 1, size = 7, speed = 0.35, opacity = 1, color = "#fff8e8" },
  forwardRef,
) {
  const ref = React.useRef<THREE.Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);
  const material = React.useMemo(() => new FairySparklesMaterial(), []);
  const [sx, sy, sz] = normalizeScale(scale);

  const positions = React.useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count }, () => [
          THREE.MathUtils.randFloatSpread(sx),
          THREE.MathUtils.randFloatSpread(sy),
          THREE.MathUtils.randFloatSpread(sz),
        ]).flat(),
      ),
    [count, sx, sy, sz],
  );

  const sizes = React.useMemo(
    () => Float32Array.from({ length: count }, () => size * (0.88 + Math.random() * 0.24)),
    [count, size],
  );
  const opacities = React.useMemo(() => Float32Array.from({ length: count }, () => opacity), [count, opacity]);
  const speeds = React.useMemo(
    () => Float32Array.from({ length: count }, () => speed * (0.75 + Math.random() * 0.5)),
    [count, speed],
  );
  const noises = React.useMemo(
    () => Float32Array.from({ length: count * 3 }, () => Math.random()),
    [count],
  );
  const colors = React.useMemo(() => {
    const c = new THREE.Color(color);
    return Float32Array.from(
      Array.from({ length: count * 3 }, (_, i) => (i % 3 === 0 ? c.r : i % 3 === 1 ? c.g : c.b)),
    );
  }, [count, color]);

  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime;
    material.uniforms.pixelRatio.value = dpr;
  });

  React.useImperativeHandle(forwardRef, () => ref.current!, []);

  return (
    <points ref={ref} frustumCulled={false} material={material} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-opacity" args={[opacities, 1]} />
        <bufferAttribute attach="attributes-speed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-noise" args={[noises, 3]} />
      </bufferGeometry>
    </points>
  );
});
