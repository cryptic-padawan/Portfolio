# Deploy to Vercel (free Hobby)

## Your team (configured in npm scripts)

| Field | Value |
|--------|--------|
| Team URL | [vercel.com/sahil-verma-portfolio](https://vercel.com/sahil-verma-portfolio) |
| Team ID | `team_i2xEk3P8JoAYTVqvoT3Bc7rf` |
| Suggested project name | `arcanum-portfolio` |

CLI login via **Google** (`sahilverma0433@gmail.com`) is OK — it is your Vercel account that owns the hobby team. GitHub linked in the Vercel **dashboard** is separate from CLI login.

**Production URL:** https://arcanum-portfolio.vercel.app

Deploy from **repo root** (monorepo):

```powershell
cd C:\Users\sahil.verma\Desktop\Project
npm run vercel:prod
```

If the site shows a **Vercel login** to visitors: Project → Settings → Deployment Protection → disable for Hobby public portfolio (or add password only if you want privacy).

### Optional: GitHub auto-deploy

1. Create an empty repo on GitHub: `cryptic-padawan/arcanum-portfolio` (or any name).
2. Push this project (`git remote add origin ...`, `git push -u origin main`).
3. Vercel dashboard → **Add New Project** → Import that repo → **Root Directory** = `apps/web`.

## Environment variables (Vercel dashboard → Project → Settings → Environment Variables)

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_DISCORD_INVITE_URL` | `https://discord.gg/v4nn8H9Q46` |
| `NEXT_PUBLIC_EMAILJS_*` | (when ready) |
| `NEXT_PUBLIC_RPM_AVATAR_URL` | (when ready) |
| `UPSTASH_REDIS_REST_URL` | (optional — for `/api/rooms` in production) |
| `UPSTASH_REDIS_REST_TOKEN` | (optional) |

Local `PORTFOLIO_REDIS_URL` does **not** apply on Vercel; use [Upstash](https://upstash.com/) free tier for room codes in prod.

## Deploy

```bash
npx vercel --cwd apps/web          # preview
npx vercel --cwd apps/web --prod   # production URL
```

Or connect a Git repo in the Vercel dashboard and set **Root Directory** to `apps/web` (install/build commands are in `apps/web/vercel.json`).

## Monorepo note

Dependencies live at the repo root (`npm workspaces`). Vercel runs install/build from root via `vercel.json` so `@arcanum/game-core` resolves correctly.
