# scripts/deploy-functions.ps1

Write-Host "🚀 Déploiement des Edge Functions Supabase..." -ForegroundColor Green

# Vérifier que Supabase CLI est installé
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI n'est pas installé. Installez-le avec:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "supabase/functions")) {
    Write-Host "❌ Répertoire supabase/functions non trouvé. Exécutez ce script depuis la racine du projet." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Déploiement de la fonction generation-worker..." -ForegroundColor Blue
try {
    supabase functions deploy generation-worker
    Write-Host "✅ generation-worker déployée avec succès" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du déploiement de generation-worker: $_" -ForegroundColor Red
}

Write-Host "📦 Déploiement de la fonction job-scheduler..." -ForegroundColor Blue
try {
    supabase functions deploy job-scheduler
    Write-Host "✅ job-scheduler déployée avec succès" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du déploiement de job-scheduler: $_" -ForegroundColor Red
}

Write-Host "🔧 Configuration des variables d'environnement..." -ForegroundColor Blue
Write-Host "N'oubliez pas de configurer les variables d'environnement suivantes dans Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "- OPENAI_API_KEY" -ForegroundColor Cyan
Write-Host "- SUPABASE_URL" -ForegroundColor Cyan
Write-Host "- SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Cyan

Write-Host "⏰ Configuration du cron job..." -ForegroundColor Blue
Write-Host "Pour activer le traitement automatique, ajoutez cette tâche cron dans Supabase:" -ForegroundColor Yellow
Write-Host "SELECT cron.schedule('process-jobs', '*/2 minutes', 'SELECT net.http_post(url:=''https://your-project.supabase.co/functions/v1/job-scheduler'', headers:=''{}''::jsonb) as request_id;');" -ForegroundColor Cyan

Write-Host "🎉 Déploiement terminé!" -ForegroundColor Green
Write-Host "Les Edge Functions sont maintenant déployées et prêtes à traiter les jobs." -ForegroundColor Green
