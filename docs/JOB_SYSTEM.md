# Système de Jobs Asynchrones

## Vue d'ensemble

Le système de jobs asynchrones permet de traiter les tâches de génération IA (images, texte, vidéos, musique, 3D, graphiques) de manière asynchrone pour éviter les timeouts et améliorer l'expérience utilisateur.

## Architecture

```
Frontend (Next.js) → API Routes → Job Manager → Supabase (Jobs Table)
                                                      ↓
Edge Functions (Workers) ← Scheduler ← Cron Job
```

## Composants Principaux

### 1. Base de Données (Supabase)

#### Table `jobs`
- `id`: UUID unique du job
- `user_id`: ID de l'utilisateur
- `type`: Type de génération (image_generation, text_generation, etc.)
- `payload`: Données de la requête (JSON)
- `status`: Statut (pending, processing, completed, failed, cancelled)
- `progress`: Progression (0-100)
- `result`: Résultat de la génération (JSON)
- `error_message`: Message d'erreur si échec
- `priority`: Priorité (1-10)
- `retry_count`: Nombre de tentatives
- `estimated_duration`: Durée estimée en secondes
- `actual_duration`: Durée réelle en secondes
- `created_at`, `updated_at`: Timestamps

#### Fonctions SQL
- `get_next_job()`: Récupère le prochain job à traiter
- `complete_job(job_id, result, duration)`: Marque un job comme terminé
- `fail_job(job_id, error_message)`: Marque un job comme échoué
- `cleanup_old_jobs()`: Nettoie les anciens jobs
- `reset_user_quotas()`: Remet à zéro les quotas utilisateur

### 2. Services Backend

#### JobManagerService
- `createJob()`: Crée un nouveau job
- `getJob()`: Récupère un job spécifique
- `getUserJobs()`: Liste les jobs d'un utilisateur
- `cancelJob()`: Annule un job
- `updateJobProgress()`: Met à jour la progression

#### Routes API
- `POST /api/generate`: Crée un job de génération
- `GET /api/jobs`: Liste les jobs de l'utilisateur
- `GET /api/jobs/[jobId]`: Récupère un job spécifique
- `DELETE /api/jobs/[jobId]`: Annule un job

### 3. Edge Functions (Workers)

#### generation-worker
- Traite les jobs de génération
- Utilise les générateurs spécialisés
- Met à jour le progrès en temps réel
- Gère les erreurs et les retries

#### job-scheduler
- Vérifie les jobs en attente
- Déclenche le worker de génération
- Exécuté par cron job toutes les 2 minutes

### 4. Générateurs Spécialisés

#### ImageGenerator
- Génération d'images avec DALL-E 3
- Support de différents styles et tailles
- Modération automatique du contenu

#### TextGenerator
- Génération de texte avec GPT-4/3.5
- Support de différents types (article, email, etc.)
- Personnalisation du ton et de l'audience

#### VideoGenerator
- Génération de vidéos (simulation)
- Création de storyboards avec IA
- Support de différentes résolutions

#### MusicGenerator
- Composition musicale (simulation)
- Support de différents genres et ambiances
- Génération de métadonnées

#### ModelGenerator3D
- Modélisation 3D (simulation)
- Spécifications techniques détaillées
- Support de différents formats

#### GraphicGenerator
- Design graphique avec DALL-E 3
- Optimisation pour différents types (logo, poster, etc.)
- Support de dimensions personnalisées

### 5. Frontend

#### Hook useJobs
- Gestion des jobs côté client
- Mises à jour en temps réel via Supabase Realtime
- Pagination et filtrage
- Création et annulation de jobs

#### Composant JobTracker
- Interface utilisateur pour suivre les jobs
- Affichage du progrès en temps réel
- Filtres par statut et type
- Actions d'annulation

## Installation et Configuration

### 1. Base de Données

Exécutez le script SQL complet :

```sql
-- Voir supabase/sql/setup_complete.sql
```

### 2. Variables d'Environnement

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

### 3. Déploiement des Edge Functions

```bash
# Installer Supabase CLI
npm install -g supabase

# Déployer les fonctions
.\scripts\deploy-functions.ps1
```

### 4. Configuration du Cron Job

Dans Supabase Dashboard, ajoutez cette tâche cron :

```sql
SELECT cron.schedule(
  'process-jobs', 
  '*/2 minutes', 
  'SELECT net.http_post(
    url:=''https://your-project.supabase.co/functions/v1/job-scheduler'', 
    headers:=''{}''::jsonb
  ) as request_id;'
);
```

## Utilisation

### Créer un Job

```typescript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type: 'image_generation',
    payload: {
      prompt: 'A beautiful sunset',
      style: 'realistic',
      size: 'standard'
    }
  })
});

const { jobId } = await response.json();
```

### Suivre un Job

```typescript
const { jobs, loading, error } = useJobs({
  status: 'processing',
  realtime: true
});
```

### Récupérer un Job

```typescript
const response = await fetch(`/api/jobs/${jobId}`);
const job = await response.json();
```

## Monitoring et Métriques

### Métriques Collectées
- Temps de traitement par type de job
- Taux de succès/échec
- Utilisation des quotas
- Performance des générateurs

### Logs
- Création et complétion des jobs
- Erreurs de génération
- Performance des API externes

## Sécurité

### Authentification
- Tous les endpoints nécessitent une authentification Supabase
- Validation des tokens JWT

### Autorisation
- Row Level Security (RLS) sur toutes les tables
- Les utilisateurs ne peuvent voir que leurs propres jobs

### Modération
- Vérification automatique du contenu avec OpenAI Moderation
- Blocage des prompts inappropriés

## Limitations et Quotas

### Quotas par Défaut
- 10 jobs par heure par utilisateur
- 100 jobs par jour par utilisateur
- Taille maximale du payload : 1MB

### Rate Limiting
- 1 job par minute par utilisateur
- Pause entre les générations pour éviter les rate limits API

## Dépannage

### Problèmes Courants

1. **Jobs bloqués en "processing"**
   - Vérifier que le worker fonctionne
   - Redémarrer les Edge Functions

2. **Erreurs d'authentification**
   - Vérifier les variables d'environnement
   - Renouveler les tokens

3. **Timeouts de génération**
   - Augmenter les timeouts dans les générateurs
   - Vérifier la connectivité aux APIs externes

### Tests

Exécutez le script de test :

```bash
npx ts-node scripts/test-job-system.ts
```

## Évolutions Futures

### Prochaines Fonctionnalités
- Support de plus de modèles IA
- Génération en batch
- Webhooks pour notifications
- Interface d'administration
- Analytics avancées

### Optimisations
- Cache des résultats fréquents
- Compression des payloads
- Parallélisation des tâches
- Auto-scaling des workers

## Support

Pour toute question ou problème :
1. Vérifiez les logs dans Supabase Dashboard
2. Exécutez les tests de diagnostic
3. Consultez la documentation des APIs externes
4. Contactez l'équipe de développement
