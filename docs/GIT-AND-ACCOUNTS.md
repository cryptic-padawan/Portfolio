# Git & account isolation (personal project only)

This repo is **personal** (`cryptic-padawan` on GitHub). Your laptop may use **work** GitHub/Cursor for other folders. Nothing here changes global Git, SSH, or Cursor settings.

## What is already scoped to this folder

| Setting | Scope | Value |
|---------|--------|--------|
| `user.name` / `user.email` | **This repo only** (`.git/config`) | Sahil Verma · sahilverma0433@gmail.com |
| npm / Vercel CLI | **This repo** `node_modules` | Not global installs |
| Vercel team | Hobby team **sahil-verma-portfolio** | Deploys from CLI use `--scope team_i2xEk3P8JoAYTVqvoT3Bc7rf` |

Work repos elsewhere keep their own folder-level or global config unchanged.

## Vercel CLI vs GitHub on Vercel

- CLI login with **Google** (`sahilverma0433@gmail.com`) is your **Vercel account** — fine if that account owns the hobby team.
- **GitHub connected in the Vercel dashboard** is used for *Import Git Repository* and auto-deploy — separate from which GitHub account is default on your PC.
- CLI deploy (`npm run vercel:prod`) uploads files; it does **not** switch your system GitHub login.

## Pushing to personal GitHub without mixing work credentials

**Option A — HTTPS + one repo (simplest)**

1. Create repo on **personal** GitHub: `cryptic-padawan/arcanum-portfolio` (empty, no README).
2. In **this folder only**:

```powershell
cd C:\Users\sahil.verma\Desktop\Project
git remote add origin https://github.com/cryptic-padawan/arcanum-portfolio.git
```

3. When Git asks for credentials, use a **personal** [fine-grained PAT](https://github.com/settings/tokens) (repo access only). Windows Credential Manager can store this URL separately from work `github.com` if you use different URLs/users.

**Option B — SSH host alias (best separation)**

Add to your **user** `~/.ssh/config` (you edit manually; not committed):

```
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
```

Generate `id_ed25519_personal` only for personal GitHub. Then:

```powershell
git remote add origin git@github.com-personal:cryptic-padawan/arcanum-portfolio.git
```

Work repos keep using default `github.com` + work key.

## Do not run (would affect all projects)

```bash
git config --global user.email ...
git config --global credential.helper ...
npm install -g vercel
```

## Cursor vs work GitHub (what is and is not isolated)

### GitHub push history

| Question | Answer |
|----------|--------|
| If I push from this folder, does **work GitHub** get commits? | **No**, as long as `origin` is `cryptic-padawan/<repo>` and you sign in with a **personal** PAT or personal SSH key — not work credentials. |
| Does **personal GitHub** show my work identity? | Only what you set in **this repo’s** local `user.name` / `user.email` (already personal). |
| Can I avoid touching **global** git config? | **Yes.** Only `git config --local` in this folder (already done). |

Work repos in other directories are unchanged.

### Cursor (work account / team plan)

| Question | Answer |
|----------|--------|
| Can team admins **not see** that I used Cursor on this personal project? | **Do not rely on hiding it.** On many team/enterprise setups, orgs can see usage (and policies vary). Cursor **Privacy Mode** limits training/sharing of code content; it does **not** guarantee invisibility from your employer’s Cursor admin. |
| Does connecting GitHub here expose work GitHub? | **No** — if the remote is personal and auth is personal. Cursor does not push to GitHub by itself; only `git push` does. |
| Safest options if admin visibility matters | (1) **Personal Cursor account** + personal machine/path for this repo, (2) **no Git remote** — copy folder manually and push from home, (3) keep remote but only push from a machine/session where you use **personal** GitHub credentials. |

Using your **work Cursor login** on this folder may still show the project in **your** recent workspaces/chats on that account. That is separate from GitHub.

## Moving a ZIP copy to your personal laptop

See **[MOVE-VIA-ZIP-TO-PERSONAL-LAPTOP.md](./MOVE-VIA-ZIP-TO-PERSONAL-LAPTOP.md)** (what to exclude from ZIP, `npm install`, connect script, first push).

## Connect personal remote (this repo)

If the repo name on Vercel/GitHub is not `arcanum-portfolio`, fix the name in the script:

```powershell
cd C:\Users\sahil.verma\Desktop\Project
.\scripts\connect-personal-github.ps1 -RepoName "YOUR-REPO-NAME"
git remote -v
```

First push (only when ready — use **personal** GitHub auth when prompted):

```powershell
git add -A
git commit -m "Initial portfolio"
git push -u origin main
```

## Cursor workflow tip

Open **`Desktop\Project`** as its own Cursor window (not inside a work monorepo). Do not add a second `origin` pointing at work GitHub.
