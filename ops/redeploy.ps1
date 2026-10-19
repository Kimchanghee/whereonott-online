<#
  redeploy.ps1 — site-wide (non-post) release through the same production path as publish.ps1:
  GA4 + per-site env + Naver token -> og -> astro build -> full gate -> tests -> parent deploy helper (-SkipBuild).
  Requires a clean, pushed working tree so the deployed build matches a commit.
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot; Set-Location $root
function Fail($m){ Write-Host "REDEPLOY FAIL: $m" -ForegroundColor Red; exit 1 }
if (git status --porcelain) { Fail 'working tree not clean; commit first' }
$head = (git rev-parse HEAD).Trim(); $remote = ((git ls-remote origin refs/heads/v2-cloudflare-static) -split '\s')[0]
if ($head -ne $remote) { Fail 'HEAD not pushed' }
$parentRefs = Join-Path (Split-Path -Parent $root) '_refs'; $domainName = Split-Path $root -Leaf
$gaId = (Get-Content (Join-Path $parentRefs 'ga4-ids.json') -Raw | ConvertFrom-Json).($domainName.Split('.')[0]).id
if (-not $gaId) { Fail 'GA4 id missing' }; $env:PUBLIC_GA4_ID = $gaId
$siteEnv = Join-Path $parentRefs "env\$domainName.ps1"; if (Test-Path $siteEnv) { . $siteEnv }
$naverFile = Join-Path $parentRefs 'naver-verification\tokens.json'
if (-not $env:PUBLIC_NAVER_VERIFICATION -and (Test-Path $naverFile)) { $nv = (Get-Content $naverFile -Raw | ConvertFrom-Json).tokens.$domainName; if ($nv) { $env:PUBLIC_NAVER_VERIFICATION = $nv } }
$env:ASTRO_TELEMETRY_DISABLED = '1'
node scripts/og.mjs; if ($LASTEXITCODE) { Fail 'og' }
$ogDirty = @(git status --porcelain)
if ($ogDirty.Count) {
  if ($ogDirty | Where-Object { $_ -notmatch '^\s?[M?A]+\s+public/og/' }) { Fail 'og step changed non-OG files' }
  git add public/og; git commit -q -m 'chore: regenerate OG cards'; git push -q origin HEAD:refs/heads/v2-cloudflare-static
  if (((git ls-remote origin refs/heads/v2-cloudflare-static) -split '\s')[0] -ne (git rev-parse HEAD).Trim()) { Fail 'OG commit push mismatch' }
  $head = (git rev-parse HEAD).Trim()
}
node node_modules/astro/astro.js build --force; if ($LASTEXITCODE) { Fail 'build' }
node scripts/gate.mjs; if ($LASTEXITCODE) { Fail 'gate' }
node --test tests/*.test.mjs; if ($LASTEXITCODE) { Fail 'tests' }
pwsh -NoProfile -File (Join-Path $parentRefs 'deploy-site.ps1') -Domain $domainName -SkipBuild; if ($LASTEXITCODE) { Fail 'deploy helper' }
Write-Host "REDEPLOY OK $domainName $head" -ForegroundColor Green
