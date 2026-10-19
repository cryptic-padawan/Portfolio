# Connect THIS folder to personal GitHub only (no global git changes).
# Usage: .\scripts\connect-personal-github.ps1 -RepoName "your-repo-name"
param(
  [Parameter(Mandatory = $true)]
  [string]$RepoName,
  [ValidateSet("https", "ssh")]
  [string]$Method = "https"
)

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

if (-not (Test-Path (Join-Path (Get-Location) ".git"))) {
  Write-Host "Initializing git repository (branch main)..."
  git init -b main
}

git config --local user.name "Sahil Verma"
git config --local user.email "sahilverma0433@gmail.com"

$owner = "cryptic-padawan"
if ($Method -eq "ssh") {
  $url = "git@github.com-personal:${owner}/${RepoName}.git"
  Write-Host 'SSH remote uses Host alias github.com-personal - see docs/GIT-AND-ACCOUNTS.md'
} else {
  $url = "https://github.com/${owner}/${RepoName}.git"
}

$prevEap = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
$existing = git remote get-url origin 2>$null
$hasOrigin = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $prevEap
if ($hasOrigin) {
  if ($existing -eq $url) {
    Write-Host "Remote origin already set: $url"
    exit 0
  }
  Write-Host "Updating origin from $existing"
  git remote set-url origin $url
} else {
  git remote add origin $url
}

Write-Host "Origin: $(git remote get-url origin)"
Write-Host ""
Write-Host 'First push: use personal PAT or SSH only, not work GitHub:'
Write-Host "  git add -A"
Write-Host "  git commit -m `"Initial portfolio`""
Write-Host "  git push -u origin main"
