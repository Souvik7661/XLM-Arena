$git = "C:\Program Files\Git\bin\git.exe"
$env:GIT_TERMINAL_PROMPT = "0"

# Remove helper scripts
Remove-Item "push_all.ps1" -Force -ErrorAction SilentlyContinue

# Stage the removal
& $git add -A
$staged = & $git status --short
if ($staged) {
    & $git commit -m "chore: remove temporary push scripts"
    Write-Host "Cleanup commit: $LASTEXITCODE"
}

& $git push origin main 2>&1
Write-Host "Push exit: $LASTEXITCODE"

Write-Host "`n=== FINAL LOG ==="
& $git log --oneline

Write-Host "`n=== All done! View your repo at: ==="
Write-Host "https://github.com/Souvik7661/XLM-Arena"
