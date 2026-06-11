# Emil's SelfImprove - loop launcher (unattended)
# Run this, then type:  /loop /iterate
#
# PERMISSION MODE: this launches with --dangerously-skip-permissions so the loop never
# stalls waiting for an approval nobody is there to give. On an internet-connected
# personal machine that means the ONLY guard is the written safety rules in CLAUDE.md +
# identity/CONSTITUTION.md (the soft sandbox Emil chose). Want oversight instead? Run
# plain `claude` and approve actions yourself (a "watched" session).

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

# Keep toolchain caches INSIDE the folder instead of ~/.cargo, npm global cache, etc.
$cache = Join-Path $root '.cache'
$env:CARGO_HOME       = Join-Path $cache 'cargo'
$env:RUSTUP_HOME      = Join-Path $cache 'rustup'
$env:npm_config_cache = Join-Path $cache 'npm'
$env:UV_CACHE_DIR     = Join-Path $cache 'uv'
$env:PIP_CACHE_DIR    = Join-Path $cache 'pip'
New-Item -ItemType Directory -Force -Path `
  $env:CARGO_HOME, $env:RUSTUP_HOME, $env:npm_config_cache, $env:UV_CACHE_DIR, $env:PIP_CACHE_DIR | Out-Null

Write-Host ""
Write-Host "  SelfImprove loop -- launching unattended (no approval prompts)." -ForegroundColor Cyan
Write-Host "  When Claude is ready, type:  /loop /iterate" -ForegroundColor Cyan
Write-Host "  Stop anytime with:           /loop stop" -ForegroundColor DarkGray
Write-Host ""

Set-Location $root
claude --dangerously-skip-permissions
