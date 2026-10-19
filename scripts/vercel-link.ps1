# Run after: npm run vercel:login
# Links apps/web to team sahil-verma-portfolio (Hobby)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$teamId = "team_i2xEk3P8JoAYTVqvoT3Bc7rf"
$projectName = "arcanum-portfolio"

npx vercel link --cwd apps/web --yes --scope $teamId --project $projectName

Write-Host ""
Write-Host "Add env in Vercel dashboard or run:"
Write-Host '  npx vercel env add NEXT_PUBLIC_DISCORD_INVITE_URL production --cwd apps/web'
Write-Host ""
Write-Host "Deploy:"
Write-Host "  npm run vercel:prod"
