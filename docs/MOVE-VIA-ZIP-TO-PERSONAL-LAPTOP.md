# Move this project via ZIP → personal laptop → GitHub

Use this when copying **Arcanum portfolio** from a work machine to a personal laptop and connecting to **cryptic-padawan** on GitHub. Does not change global Git on either machine.

## Before you ZIP (source machine)

1. Open **`Desktop\Project`** only (not the whole Desktop).
2. **Exclude** from the ZIP (or delete after unzip before push):
   - `node_modules/`
   - `apps/web/.next/`
   - `.env`, `apps/web/.env.local` (secrets — recreate from `.env.example` on the laptop)
   - `recordings/` (optional local videos)
   - `.vercel/` (re-link on laptop if needed)
3. Include everything else: source, `scripts/`, `docs/`, `config/personal-github.repo.example`, etc.

## After unzip (personal laptop)

```powershell
cd path\to\Project
npm install
copy .env.example .env.local
# edit apps/web/.env.local if needed
```

## Connect Git + personal GitHub

1. Copy repo name hint (optional):

```powershell
copy config\personal-github.repo.example config\personal-github.repo
# edit personal-github.repo — one line, e.g. arcanum-portfolio
```

2. Run the connect script (creates `.git` if missing, sets **local** identity + `origin`):

```powershell
.\scripts\connect-personal-github.ps1 -RepoName "arcanum-portfolio"
```

Use your real repo name if different. For SSH with a personal key alias:

```powershell
.\scripts\connect-personal-github.ps1 -RepoName "arcanum-portfolio" -Method ssh
```

See [GIT-AND-ACCOUNTS.md](./GIT-AND-ACCOUNTS.md) for PAT vs `github.com-personal` SSH.

3. First commit and push (personal GitHub auth only):

```powershell
git add -A
git status
git commit -m "Arcanum portfolio — sync from work machine"
git branch -M main
git push -u origin main
```

If the GitHub repo already has commits, you may need `git pull origin main --rebase` first, or push to a new empty repo.

## Manual equivalent (no script)

```powershell
cd path\to\Project
git init -b main
git config --local user.name "Sahil Verma"
git config --local user.email "sahilverma0433@gmail.com"
git remote add origin https://github.com/cryptic-padawan/arcanum-portfolio.git
git add -A
git commit -m "Initial portfolio"
git push -u origin main
```

## Verify

```powershell
git remote -v
git config --local user.email
```

Remote should be `cryptic-padawan/<your-repo>`. Email should be **sahilverma0433@gmail.com** (local to this folder only).
