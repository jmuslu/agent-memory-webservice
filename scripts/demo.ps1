param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$payload = Join-Path $root "examples/calculator-fusion.json"

Write-Host ""
Write-Host "== Health =="
curl.exe -s "$BaseUrl/api/health"

Write-Host ""
Write-Host ""
Write-Host "== Skill excerpt =="
$skill = curl.exe -s "$BaseUrl/skill.md"
$skill -split "`n" | Select-Object -First 18

Write-Host ""
Write-Host "== Fuse noisy memory reports =="
curl.exe -s -X POST "$BaseUrl/api/fuse" -H "Content-Type: application/json" --data-binary "@$payload"
