$git = "C:\Program Files\Git\bin\git.exe"
$env:GIT_TERMINAL_PROMPT = "0"

& $git add -A
$staged = & $git status --short
if ($staged) {
    Write-Host "Staging changes:"
    $staged
    & $git commit -m "chore: final updates before Blue Belt submission"
} else {
    Write-Host "No changes to commit."
}
& $git push origin main 2>&1
Write-Host "Push exit: $LASTEXITCODE"
