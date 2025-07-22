-- supabase/sql/setup_cron.sql
-- Configuration du système de cron pour le traitement automatique des jobs

-- Activer l'extension pg_cron si pas déjà fait
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Supprimer les anciens jobs cron s'ils existent
SELECT cron.unschedule('process-jobs') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'process-jobs'
);

SELECT cron.unschedule('cleanup-old-jobs') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'cleanup-old-jobs'
);

SELECT cron.unschedule('reset-quotas') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'reset-quotas'
);

-- Job principal : traitement des jobs en attente (toutes les 2 minutes)
SELECT cron.schedule(
  'process-jobs',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project-id.supabase.co/functions/v1/job-scheduler',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
    body := '{"trigger": "cron", "timestamp": "' || now()::text || '"}'::jsonb
  ) as request_id;
  $$
);

-- Job de nettoyage : supprimer les anciens jobs (tous les jours à 2h du matin)
SELECT cron.schedule(
  'cleanup-old-jobs',
  '0 2 * * *',
  $$
  SELECT cleanup_old_jobs();
  $$
);

-- Job de reset des quotas : remettre à zéro les quotas quotidiens (tous les jours à minuit)
SELECT cron.schedule(
  'reset-quotas',
  '0 0 * * *',
  $$
  SELECT reset_user_quotas();
  $$
);

-- Vérifier que les jobs cron sont bien créés
SELECT 
  jobname,
  schedule,
  command,
  active,
  jobid
FROM cron.job 
WHERE jobname IN ('process-jobs', 'cleanup-old-jobs', 'reset-quotas')
ORDER BY jobname;

-- Fonction pour vérifier le statut des jobs cron
CREATE OR REPLACE FUNCTION get_cron_status()
RETURNS TABLE (
  job_name text,
  schedule text,
  active boolean,
  last_run timestamptz,
  next_run timestamptz,
  run_count bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    j.jobname::text,
    j.schedule::text,
    j.active,
    jr.start_time as last_run,
    cron.schedule_in_database(j.schedule, COALESCE(jr.start_time, now())) as next_run,
    COUNT(jr.runid) as run_count
  FROM cron.job j
  LEFT JOIN cron.job_run_details jr ON j.jobid = jr.jobid
  WHERE j.jobname IN ('process-jobs', 'cleanup-old-jobs', 'reset-quotas')
  GROUP BY j.jobname, j.schedule, j.active, jr.start_time
  ORDER BY j.jobname;
$$;

-- Fonction pour activer/désactiver les jobs cron
CREATE OR REPLACE FUNCTION toggle_cron_job(job_name text, enable boolean DEFAULT true)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF enable THEN
    UPDATE cron.job SET active = true WHERE jobname = job_name;
    RAISE NOTICE 'Job cron % activé', job_name;
  ELSE
    UPDATE cron.job SET active = false WHERE jobname = job_name;
    RAISE NOTICE 'Job cron % désactivé', job_name;
  END IF;
  
  RETURN FOUND;
END;
$$;

-- Fonction pour obtenir les statistiques des jobs
CREATE OR REPLACE FUNCTION get_job_stats()
RETURNS TABLE (
  total_jobs bigint,
  pending_jobs bigint,
  processing_jobs bigint,
  completed_jobs bigint,
  failed_jobs bigint,
  avg_processing_time interval,
  jobs_last_hour bigint,
  jobs_last_day bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) as total_jobs,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_jobs,
    COUNT(*) FILTER (WHERE status = 'processing') as processing_jobs,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_jobs,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_jobs,
    AVG(
      CASE 
        WHEN actual_duration IS NOT NULL 
        THEN make_interval(secs => actual_duration)
        ELSE NULL 
      END
    ) as avg_processing_time,
    COUNT(*) FILTER (WHERE created_at > now() - interval '1 hour') as jobs_last_hour,
    COUNT(*) FILTER (WHERE created_at > now() - interval '1 day') as jobs_last_day
  FROM jobs;
$$;

-- Créer une vue pour le monitoring des jobs
CREATE OR REPLACE VIEW job_monitoring AS
SELECT 
  j.id,
  j.user_id,
  j.type,
  j.status,
  j.progress,
  j.priority,
  j.retry_count,
  j.created_at,
  j.updated_at,
  CASE 
    WHEN j.status = 'processing' AND j.updated_at < now() - interval '10 minutes'
    THEN 'stuck'
    WHEN j.status = 'pending' AND j.created_at < now() - interval '1 hour'
    THEN 'delayed'
    ELSE 'normal'
  END as health_status,
  CASE 
    WHEN j.actual_duration IS NOT NULL 
    THEN make_interval(secs => j.actual_duration)
    WHEN j.status = 'processing'
    THEN now() - j.updated_at
    ELSE NULL
  END as processing_duration
FROM jobs j
WHERE j.created_at > now() - interval '7 days'
ORDER BY j.created_at DESC;

-- Accorder les permissions nécessaires
GRANT SELECT ON job_monitoring TO authenticated;
GRANT EXECUTE ON FUNCTION get_cron_status() TO authenticated;
GRANT EXECUTE ON FUNCTION get_job_stats() TO authenticated;

-- Seuls les admins peuvent gérer les jobs cron
GRANT EXECUTE ON FUNCTION toggle_cron_job(text, boolean) TO service_role;

-- Commentaires pour la documentation
COMMENT ON FUNCTION get_cron_status() IS 'Retourne le statut des jobs cron configurés';
COMMENT ON FUNCTION toggle_cron_job(text, boolean) IS 'Active ou désactive un job cron spécifique';
COMMENT ON FUNCTION get_job_stats() IS 'Retourne les statistiques globales des jobs';
COMMENT ON VIEW job_monitoring IS 'Vue de monitoring des jobs avec statut de santé';

-- Instructions finales
DO $$
BEGIN
  RAISE NOTICE '✅ Configuration cron terminée!';
  RAISE NOTICE '📋 Jobs cron configurés:';
  RAISE NOTICE '   - process-jobs: toutes les 2 minutes';
  RAISE NOTICE '   - cleanup-old-jobs: tous les jours à 2h';
  RAISE NOTICE '   - reset-quotas: tous les jours à minuit';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Pour vérifier le statut: SELECT * FROM get_cron_status();';
  RAISE NOTICE '📊 Pour les statistiques: SELECT * FROM get_job_stats();';
  RAISE NOTICE '👀 Pour le monitoring: SELECT * FROM job_monitoring;';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  N''oubliez pas de remplacer "your-project-id" par votre vrai project ID!';
END $$;
