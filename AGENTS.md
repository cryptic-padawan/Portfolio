# Agent entrypoint — Arcanum portfolio

Cursor rules in `.cursor/rules/` apply automatically. Human-readable source of truth:

**→ [CURRENT_STAGE.md](./CURRENT_STAGE.md)**

Read it before planning, coding, or answering questions about this project.

Quick start (from this folder only):

```bash
npm install
npm run redis:up
copy .env.example .env.local   # then edit apps/web/.env.local if needed
npm run dev                    # http://localhost:3920 — hot reload (uses more RAM)
npm run preview                # build + production server — smoother local playtest
npm run dev:clean              # frees port 3920 then dev (Windows)
```

Use any terminal at this repo root; Cursor’s integrated terminal is optional.

Personal GitHub (cryptic-padawan): [docs/GIT-AND-ACCOUNTS.md](./docs/GIT-AND-ACCOUNTS.md) · ZIP → laptop: [docs/MOVE-VIA-ZIP-TO-PERSONAL-LAPTOP.md](./docs/MOVE-VIA-ZIP-TO-PERSONAL-LAPTOP.md)

Dependencies are isolated to this repo via npm workspaces (`apps/web`, `packages/game-core`).
