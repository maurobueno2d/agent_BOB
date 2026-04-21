Write-Host "🚀 Iniciando actualización..." -ForegroundColor Cyan

# 1. Add
git add .

# 2. Commit
# Usamos el string directo para evitar problemas de variables en PowerShell
git commit -m "feat: advanced orchestration engine update v0.2.0"

# 3. Tag (borramos el anterior si falló el push completo)
git tag -d v0.2.0
git tag -a v0.2.0 -m "Release V0.2.0"

# 4. Push
git push origin main --force
git push origin --tags --force

Write-Host "✅ ¡Listo! Mira tu GitHub ahora." -ForegroundColor Green
