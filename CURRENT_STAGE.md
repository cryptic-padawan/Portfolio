# CURRENT_STAGE — Sahil Portfolio Island

> **Agent rule:** Read this file first each session. Update **Changelog** + **Next actions** when work completes. Do not re-scan the whole repo unless this file says a path changed structurally.

**Last updated:** 2026-10-17 (single-island POI + minimap teleport)  
**Phase:** 1 — Local dev running; Vercel wired (account + login required to deploy)  
**World title (public):** *Archipelago of Arcanum* (fantasy MMORPG-inspired; **no** Warner/HP trademarks in UI or code)

**Auto-context on any machine:** `.cursor/rules/arcanum-project-context.mdc` (`alwaysApply: true`) + [AGENTS.md](./AGENTS.md)

---

## 1. Owner & contact (canonical)

| Field | Value |
|--------|--------|
| Name | Sahil Verma |
| Email | sahilverma0433@gmail.com |
| Phone | +91-8368410581 |
| Location | Delhi, India |
| GitHub | https://github.com/cryptic-padawan |
| LinkedIn | https://www.linkedin.com/in/sahilverma0433 |
| Discord user | `.sahilverma` |
| Discord server invite | **`https://discord.gg/v4nn8H9Q46`** (permanent) |
| Vercel team | [sahil-verma-portfolio](https://vercel.com/sahil-verma-portfolio) · `team_i2xEk3P8JoAYTVqvoT3Bc7rf` |
| Vercel project | `arcanum-portfolio` · **https://arcanum-portfolio.vercel.app** |
| Vercel CLI | Logged in as `sahilverma0433@gmail.com` (Google); team scope in npm scripts |
| Git identity (local only) | `Sahil Verma` · `sahilverma0433@gmail.com` — see `docs/GIT-AND-ACCOUNTS.md` |
| Git remote (personal) | `https://github.com/cryptic-padawan/arcanum-portfolio.git` — fix name via `scripts/connect-personal-github.ps1` if Vercel uses another repo |
| EmailJS | Not configured — form shows hint until keys in `apps/web/.env.local` |

**Assets:**

- `content/resume.json` — structured resume (from PDF)
- `apps/web/public/images/avatar.jpg` — from root `image.jpg`
- Root PDF/JPGs kept as originals

**Resume links TBD:** Cricketer's App demo URL; E-commerce GitHub URL

---

## 2. Creative & legal

- **Primary biome:** fantasy MMORPG / wizard-**academy** vibe (Arcanum, Cozy Hearth, Neon Circuit, Orbital Outpost).
- **Forbidden:** `Harry Potter`, `Hogwarts`, HP names/logos/ripped assets.
- **Audio:** consent modal; default muted (`AudioConsentGate`).
- **Movement:** single island plane; OrbitControls + WASD scholar avatar; **Realm chart** minimap teleports with blink/portal FX + camera lerp.
- **Audio:** `AmbientAudio` (Web Audio wind bed + optional `/audio/spire-ambient.mp3`); consent + 🔊 toggle.

---

## 3. Tech stack (installed — this repo only)

| Layer | Choice |
|--------|--------|
| Monorepo | npm workspaces: `apps/web`, `packages/game-core` |
| App | Next.js 15.1.9, port **3920** |
| 3D | R3F 8, drei, Rapier, detect-gpu |
| Avatar | RPM URL via `NEXT_PUBLIC_RPM_AVATAR_URL` (placeholder capsule until set) |
| Redis | Docker `arcanum-portfolio-redis` → **127.0.0.1:6392** |
| Room API | `POST/GET /api/rooms` → Redis keys `room:{CODE}` |

---

## 4. Repo map (actual)

```
Project/
├── CURRENT_STAGE.md
├── AGENTS.md
├── README.md
├── .cursor/rules/arcanum-project-context.mdc
├── package.json              # npm workspaces root
├── docker-compose.yml          # redis :6392
├── .env.example
├── content/resume.json
├── packages/game-core/src/index.ts
├── apps/web/
│   ├── .env.local              # gitignored — Discord + Redis
│   ├── public/images/avatar.jpg
│   └── src/
│       ├── app/                # page, classic, games/*, api/rooms
│       ├── components/world/   # IslandCanvas, ArcanumIsland, minimap POIs
│       ├── components/audio/   # AmbientAudio
│       ├── lib/worldPois.ts
│       ├── components/panels/  # Resume, Contact, Games
│       ├── components/games/   # GameShell, SudokuGame
│       ├── components/providers/, ui/
│       ├── lib/redis.ts, sudoku.ts
│       └── store/
└── (root resume PDF/JPGs)
```

---

## 5. Redis / Docker

| Service | Container | Host |
|---------|-----------|------|
| Portfolio Redis | `arcanum-portfolio-redis` | **127.0.0.1:6392** |

Commands: `npm run redis:up` / `npm run redis:down` from repo root.

**Do not use 6379/6380** — other Desktop stacks (OmniStudio, databricks-ai-optimizer, etc.).

---

## 6. Reusable components (status)

| Component | Path | Status |
|-----------|------|--------|
| `ArcanumIsland` | `components/world/ArcanumIsland.tsx` + `island/*` | ✅ expanded grass island (r≈38), central stone hub, radial paths, sway trees, wind grass |
| `Minimap` | `components/ui/Minimap.tsx` | ✅ realm chart teleport + live player dot |
| `PlayerAvatar` / `HumanoidAvatar` | `components/world/` | ✅ WASD/arrows walk, Shift run; `public/models/realm-soldier.glb` (three.js Soldier, Idle/Walk/Run) |
| `CameraDirector` | `components/world/CameraDirector.tsx` | ✅ third-person follow, drag to orbit |
| `islandRuntime` | `lib/islandRuntime.ts` | ✅ keyboard input + live avatar XZ |
| `AmbientAudio` | `components/audio/AmbientAudio.tsx` | ✅ |
| `ConsoleNav` | `components/ui/ConsoleNav.tsx` | ✅ PS5-style tabs |
| `DeviceTierProvider` | `components/providers/DeviceTierProvider.tsx` | ✅ |
| `AudioConsentGate` | `components/ui/AudioConsentGate.tsx` | ✅ |
| `GameShell` | `components/games/GameShell.tsx` | ✅ |
| `RoomCodeModal` | — | ⬜ V1.1 |
| `BotPlayer` | Sudoku bot hint | ✅ partial |
| `ContactPanel` | `components/panels/ContactPanel.tsx` | ✅ EmailJS optional |
| `ResumePanel` | `components/panels/ResumePanel.tsx` | ✅ |
| `IslandCanvas` | `components/world/IslandCanvas.tsx` | ✅ |

---

## 7. Environment variables

See `.env.example`. Local copy: `apps/web/.env.local`.

```env
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/v4nn8H9Q46
PORTFOLIO_REDIS_URL=redis://127.0.0.1:6392/0
```

---

## 8. Next actions

1. [ ] User: EmailJS keys in `apps/web/.env.local`
2. [ ] User: Cricketer's App + E-commerce URLs → `content/resume.json`
3. [ ] User: Ready Player Me → `NEXT_PUBLIC_RPM_AVATAR_URL`
4. [x] Vercel linked + production deploy (`vercel.json` at repo root for monorepo)
5. [x] Local `origin` → personal GitHub (no global git); first `git push` still manual with **personal** PAT
6. [ ] Vercel: disable Deployment Protection if visitors see Vercel login wall
7. [ ] Ludo/Carrom + room UI (V1.1); richer GLB cells; RPM GLB loader
8. [ ] Bump Next.js to patched release when convenient (15.1.9 audit notice)

---

## 9. Changelog

| Date | Change |
|------|--------|
| 2026-10-17 | Phase 0 planning; Redis 6392; Discord permanent invite |
| 2026-10-17 | **Phase 1 scaffold:** monorepo, Next+R3F island, panels, Sudoku, `/api/rooms`, Redis compose, `.cursor` alwaysApply rule, build passes |
| 2026-10-17 | Dev on :3920; `apps/web/vercel.json` + `docs/VERCEL.md` + npm `vercel:*` scripts |
| 2026-10-17 | Git init; Vercel team id wired in npm scripts; CLI login must be done locally (no token in agent shell) |
| 2026-10-17 | Prod live arcanum-portfolio.vercel.app; root deploy; git local identity; GIT-AND-ACCOUNTS + isolation cursor rule; Vercel CLI 64.5.0 |
| 2026-10-17 | Fix R3F ReactCurrentBatchConfig crash: client webpack react alias, IslandExperience dynamic chunk, npm overrides |
| 2026-10-17 | White screen fix: React 19 + R3F 9; postinstall dedupe nested react in apps/web/node_modules |
| 2026-10-17 | Sudoku hydration fix: client-only puzzle (useEffect) + dynamic ssr:false; readOnly vs disabled on clues |
| 2026-10-17 | Single island: minimap teleport, observatory scenery, scholar avatar, ambient audio, removed drei Html hotspots (React unmount errors) |
| 2026-10-17 | Movement/minimap sync: window-level WASD+arrows, rigid-body teleport snap (no store/physics fight), camera follows walk, minimap viewBox zoom + pinch, smaller POI props |
| 2026-10-17 | Fix Rapier crash: defer `setTranslation` to `useFrame` (no `useLayoutEffect` before WASM body exists) |
| 2026-10-17 | Island walk rewrite: `islandRuntime` singleton (input+pos), keyboard bound in island bundle, static import (no dynamic chunk), minimap zoom via SVG group |
| 2026-10-19 | **Avatar actually moves:** skinned GLB cloned with `SkeletonUtils.clone` (plain `clone()` left mesh bound to detached bones at spawn). New default `realm-soldier.glb` with Idle/Walk/Run crossfades; third-person follow camera; teleport lands in front of POI; minimap scale fits whole island; beacon icons no longer block clicks |
| 2026-10-19 | **Island scale & biome:** disc radius 38, POIs spread on hex ring; spawn on central stone platform; stone paths to each beacon; green grass / rocky patches / forest scatter; `AnimatedTree` + clickable `WindGrass` |
| 2026-10-19 | **Paths & grass v2:** six `CobblestoneSpoke` (packed stones + curbs) hub→each POI; `InteractiveGrassField` instanced blades with wind + bend when avatar walks through (R3F, no Unity) |
| 2026-10-19 | **Paths & grass v3:** path beds use quaternion-aligned boxes (all 6 spokes); dense flat flagstone collage; `CobblestoneHub` stone plaza; grass clusters (~5× blades per cell) + tone variation |
| 2026-10-19 | **Pavement & perf:** `isOnPavement` strips grass from hub/paths; jigsaw extruded stones; grass LOD (near player/camera full, far hazy/hidden) + tier scaling; lighter grass; avatar 1.38× |

---

## 10. Session notes for agents

- Dev: `npm run dev` → http://localhost:3920
- Dependencies only under `Project/node_modules` — never modify sibling repos.
- Update this file after each feature; §4/§6 when paths/components change.
