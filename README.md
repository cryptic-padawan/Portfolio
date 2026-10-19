# Archipelago of Arcanum — Sahil Verma portfolio

3D fantasy hub (React Three Fiber + Next.js), resume, contact, and mini-games.

**Context for AI / future machines:** see [CURRENT_STAGE.md](./CURRENT_STAGE.md) and [AGENTS.md](./AGENTS.md).

## Local setup

```bash
npm install
docker compose up -d redis   # 127.0.0.1:6392
cp .env.example apps/web/.env.local
npm run dev
```

Open [http://localhost:3920](http://localhost:3920). Low-motion preference redirects to `/classic`.

## Structure

- `apps/web` — Next.js app
- `packages/game-core` — shared game registry & room helpers
- `content/resume.json` — resume data
