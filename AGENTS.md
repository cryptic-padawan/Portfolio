# Agent entrypoint — Arcanum portfolio

Cursor rules in `.cursor/rules/` apply automatically. Human-readable source of truth:

**→ [CURRENT_STAGE.md](./CURRENT_STAGE.md)**

Read it before planning, coding, or answering questions about this project.

Quick start (from this folder only):

```bash
npm install
npm run redis:up
copy .env.example .env.local   # then edit apps/web/.env.local if needed
npm run dev                    # http://localhost:3920
```

Dependencies are isolated to this repo via npm workspaces (`apps/web`, `packages/game-core`).
