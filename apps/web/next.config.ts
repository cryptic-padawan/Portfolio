import type { NextConfig } from "next";
import path from "path";

const repoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@arcanum/game-core",
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/rapier",
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@content": path.join(repoRoot, "content"),
    };
    config.resolve.modules = [
      path.join(__dirname, "node_modules"),
      path.join(repoRoot, "node_modules"),
      ...(config.resolve.modules ?? []),
    ];
    // One React 19 copy for client (R3F + Next client must match).
    if (!isServer) {
      config.resolve.alias.react = path.join(repoRoot, "node_modules/react");
      config.resolve.alias["react-dom"] = path.join(repoRoot, "node_modules/react-dom");
      config.resolve.alias.zustand = path.join(repoRoot, "node_modules/zustand");
    }
    return config;
  },
};

export default nextConfig;
