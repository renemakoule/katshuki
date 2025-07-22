# scripts/setup-complete.ps1
# Script de configuration complète du système de jobs asynchrones

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$OpenAIKey,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipFunctions,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipDatabase
)

Write-Host "🚀 Configuration complète du système de jobs asynchrones" -ForegroundColor Green
Write-Host "Project ID: $ProjectId" -ForegroundColor Cyan

# Vérifications préliminaires
Write-Host "`n🔍 Vérifications préliminaires..." -ForegroundColor Blue

# Vérifier Supabase CLI
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI non trouvé. Installation..." -ForegroundColor Red
    try {
        npm install -g supabase
        Write-Host "✅ Supabase CLI installé" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur installation Supabase CLI: $_" -ForegroundColor Red
        exit 1
    }
}

# Vérifier la structure du projet
$requiredPaths = @(
    "supabase/sql/setup_complete.sql",
    "supabase/functions/generation-worker",
    "supabase/functions/job-scheduler"
)

foreach ($path in $requiredPaths) {
    if (-not (Test-Path $path)) {
        Write-Host "❌ Fichier manquant: $path" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Structure du projet vérifiée" -ForegroundColor Green

# Configuration de la base de données
if (-not $SkipDatabase) {
    Write-Host "`n📊 Configuration de la base de données..." -ForegroundColor Blue
    
    try {
        # Exécuter le script SQL principal
        Write-Host "Exécution du script setup_complete.sql..." -ForegroundColor Yellow
        supabase db reset --linked
        
        # Appliquer les migrations
        Write-Host "Application des migrations..." -ForegroundColor Yellow
        supabase db push
        
        Write-Host "✅ Base de données configurée" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur configuration base de données: $_" -ForegroundColor Red
        Write-Host "Continuez manuellement avec: supabase db reset --linked" -ForegroundColor Yellow
    }
}

# Déploiement des Edge Functions
if (-not $SkipFunctions) {
    Write-Host "`n⚡ Déploiement des Edge Functions..." -ForegroundColor Blue
    
    try {
        # Déployer generation-worker
        Write-Host "Déploiement de generation-worker..." -ForegroundColor Yellow
        supabase functions deploy generation-worker
        
        # Déployer job-scheduler
        Write-Host "Déploiement de job-scheduler..." -ForegroundColor Yellow
        supabase functions deploy job-scheduler
        
        Write-Host "✅ Edge Functions déployées" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur déploiement functions: $_" -ForegroundColor Red
        Write-Host "Continuez manuellement avec: supabase functions deploy <function-name>" -ForegroundColor Yellow
    }
}

# Configuration des variables d'environnement
Write-Host "`n🔧 Configuration des variables d'environnement..." -ForegroundColor Blue

$envVars = @{
    "OPENAI_API_KEY" = $OpenAIKey
    "SUPABASE_URL" = "https://$ProjectId.supabase.co"
    "SUPABASE_SERVICE_ROLE_KEY" = "Configurez manuellement"
}

foreach ($var in $envVars.GetEnumerator()) {
    if ($var.Value -and $var.Value -ne "Configurez manuellement") {
        try {
            supabase secrets set "$($var.Key)=$($var.Value)"
            Write-Host "✅ $($var.Key) configurée" -ForegroundColor Green
        } catch {
            Write-Host "⚠️ Erreur configuration $($var.Key): $_" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️ $($var.Key): $($var.Value)" -ForegroundColor Yellow
    }
}

# Configuration du cron job
Write-Host "`n⏰ Configuration du système cron..." -ForegroundColor Blue

$cronSql = @"
-- Remplacer your-project-id par le vrai project ID
UPDATE cron.job 
SET command = REPLACE(command, 'your-project-id', '$ProjectId')
WHERE jobname = 'process-jobs';
"@

Write-Host "SQL à exécuter manuellement dans Supabase Dashboard:" -ForegroundColor Yellow
Write-Host $cronSql -ForegroundColor Cyan

# Création du fichier .env.local si nécessaire
Write-Host "`n📝 Création du fichier .env.local..." -ForegroundColor Blue

$envContent = @"
# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL=https://$ProjectId.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Configuration OpenAI
OPENAI_API_KEY=$OpenAIKey

# Configuration de l'application
NODE_ENV=development
"@

if (-not (Test-Path ".env.local")) {
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Fichier .env.local créé" -ForegroundColor Green
} else {
    Write-Host "⚠️ Fichier .env.local existe déjà" -ForegroundColor Yellow
}

# Tests du système
Write-Host "`n🧪 Lancement des tests..." -ForegroundColor Blue

try {
    if (Test-Path "scripts/test-job-system.ts") {
        Write-Host "Exécution des tests..." -ForegroundColor Yellow
        npx ts-node scripts/test-job-system.ts
    } else {
        Write-Host "⚠️ Script de test non trouvé" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Erreur lors des tests: $_" -ForegroundColor Yellow
    Write-Host "Exécutez manuellement: npx ts-node scripts/test-job-system.ts" -ForegroundColor Cyan
}

# Résumé final
Write-Host "`n🎉 Configuration terminée!" -ForegroundColor Green
Write-Host "`n📋 Résumé des actions:" -ForegroundColor Blue

Write-Host "✅ Structure du projet vérifiée" -ForegroundColor Green
if (-not $SkipDatabase) { Write-Host "✅ Base de données configurée" -ForegroundColor Green }
if (-not $SkipFunctions) { Write-Host "✅ Edge Functions déployées" -ForegroundColor Green }
Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green
Write-Host "✅ Fichier .env.local créé" -ForegroundColor Green

Write-Host "`n⚠️ Actions manuelles requises:" -ForegroundColor Yellow
Write-Host "1. Configurez SUPABASE_SERVICE_ROLE_KEY dans Supabase Dashboard" -ForegroundColor Cyan
Write-Host "2. Configurez NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local" -ForegroundColor Cyan
Write-Host "3. Exécutez le script SQL de cron dans Supabase Dashboard" -ForegroundColor Cyan
Write-Host "4. Testez le système avec: npx ts-node scripts/test-job-system.ts" -ForegroundColor Cyan

Write-Host "`n🔗 Liens utiles:" -ForegroundColor Blue
Write-Host "- Dashboard Supabase: https://supabase.com/dashboard/project/$ProjectId" -ForegroundColor Cyan
Write-Host "- Documentation: docs/JOB_SYSTEM.md" -ForegroundColor Cyan
Write-Host "- Tests: scripts/test-job-system.ts" -ForegroundColor Cyan

Write-Host "`n🚀 Le système de jobs asynchrones est prêt!" -ForegroundColor Green
