$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
foreach ($step in @('refresh','build','gate')) {
  & pnpm $step
  if ($LASTEXITCODE -ne 0) { throw "$step failed (exit $LASTEXITCODE)" }
}
