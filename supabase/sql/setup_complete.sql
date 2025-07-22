-- =====================================================
-- SETUP COMPLET SUPABASE POUR FINANCIAL LANDING
-- =====================================================
-- Ce fichier contient toutes les requêtes SQL nécessaires
-- pour optimiser le backend et supporter les fonctionnalités
-- du dashboard (génération asynchrone, cache, métriques, etc.)
-- =====================================================

-- =====================================================
-- 1. GESTION DES UTILISATEURS - Profils et préférences
-- =====================================================

-- Table des profils utilisateur (étend auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  google_id TEXT UNIQUE,
  provider TEXT DEFAULT 'google',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  subscription_expires_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferred_language TEXT DEFAULT 'fr',
  timezone TEXT DEFAULT 'Europe/Paris',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0
);

-- Index pour les profils utilisateur
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_google_id ON public.user_profiles(google_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON public.user_profiles(subscription_tier, subscription_status);

-- Table des préférences utilisateur
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  default_image_style TEXT DEFAULT 'realistic',
  default_image_quality TEXT DEFAULT 'standard' CHECK (default_image_quality IN ('draft', 'standard', 'high')),
  default_video_quality TEXT DEFAULT '720p' CHECK (default_video_quality IN ('480p', '720p', '1080p', '4k')),
  auto_save_projects BOOLEAN DEFAULT TRUE,
  show_tutorials BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les préférences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Table des sessions utilisateur (pour le tracking)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_end TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start ON public.user_sessions(session_start DESC);

-- =====================================================
-- 2. TABLE JOBS - Gestion des tâches asynchrones
-- =====================================================

-- Création de la table pour gérer les tâches de génération asynchrones
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  type TEXT NOT NULL CHECK (type IN ('image_generation', 'text_generation', 'video_creation', 'music_composition', '3d_modeling', 'graphic_design')),
  payload JSONB NOT NULL,
  result JSONB,
  error TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  estimated_duration INTEGER, -- en secondes
  actual_duration INTEGER, -- en secondes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON public.jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_priority_created ON public.jobs(priority DESC, created_at ASC) WHERE status = 'pending';

-- =====================================================
-- 3. TABLE CACHE - Système de cache pour les résultats
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cache_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  hit_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT now()
);

-- Index pour le cache
CREATE INDEX IF NOT EXISTS idx_cache_key ON public.cache_entries(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON public.cache_entries(expires_at);

-- =====================================================
-- 4. TABLE METRICS - Suivi des performances
-- =====================================================

CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  tags JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index pour les métriques
CREATE INDEX IF NOT EXISTS idx_metrics_name_timestamp ON public.metrics(metric_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON public.metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_user_id ON public.metrics(user_id);

-- =====================================================
-- 5. TABLE USER_QUOTAS - Gestion des quotas utilisateur
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_requests INTEGER DEFAULT 0,
  monthly_requests INTEGER DEFAULT 0,
  daily_limit INTEGER DEFAULT 100,
  monthly_limit INTEGER DEFAULT 1000,
  last_daily_reset DATE DEFAULT CURRENT_DATE,
  last_monthly_reset DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les quotas
CREATE INDEX IF NOT EXISTS idx_user_quotas_user_id ON public.user_quotas(user_id);

-- =====================================================
-- 6. TABLE PROJECT_HISTORY - Historique des projets
-- =====================================================

CREATE TABLE IF NOT EXISTS public.project_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  project_name TEXT,
  project_data JSONB NOT NULL,
  thumbnail_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour l'historique
CREATE INDEX IF NOT EXISTS idx_project_history_user_id ON public.project_history(user_id);
CREATE INDEX IF NOT EXISTS idx_project_history_created_at ON public.project_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_history_favorites ON public.project_history(user_id, is_favorite) WHERE is_favorite = TRUE;

-- =====================================================
-- 7. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer le cache expiré
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.cache_entries WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour réinitialiser les quotas quotidiens
CREATE OR REPLACE FUNCTION public.reset_daily_quotas()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.user_quotas 
  SET 
    daily_requests = 0,
    last_daily_reset = CURRENT_DATE
  WHERE last_daily_reset < CURRENT_DATE;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour réinitialiser les quotas mensuels
CREATE OR REPLACE FUNCTION public.reset_monthly_quotas()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.user_quotas 
  SET 
    monthly_requests = 0,
    last_monthly_reset = DATE_TRUNC('month', CURRENT_DATE)
  WHERE last_monthly_reset < DATE_TRUNC('month', CURRENT_DATE);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le prochain job à traiter
CREATE OR REPLACE FUNCTION public.get_next_job()
RETURNS TABLE(
  job_id UUID,
  job_type TEXT,
  job_payload JSONB,
  user_id UUID
) AS $$
BEGIN
  RETURN QUERY
  UPDATE public.jobs 
  SET 
    status = 'processing',
    started_at = now(),
    updated_at = now()
  WHERE id = (
    SELECT j.id 
    FROM public.jobs j
    WHERE j.status = 'pending' 
      AND (j.retry_count < j.max_retries OR j.retry_count IS NULL)
    ORDER BY j.priority DESC, j.created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING id, type, payload, jobs.user_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer un job comme complété
CREATE OR REPLACE FUNCTION public.complete_job(
  job_id UUID,
  job_result JSONB,
  duration_seconds INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.jobs 
  SET 
    status = 'completed',
    result = job_result,
    progress = 100,
    completed_at = now(),
    updated_at = now(),
    actual_duration = COALESCE(duration_seconds, EXTRACT(EPOCH FROM (now() - started_at))::INTEGER)
  WHERE id = job_id AND status = 'processing';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer un job comme échoué
CREATE OR REPLACE FUNCTION public.fail_job(
  job_id UUID,
  error_message TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.jobs 
  SET 
    status = 'failed',
    error = error_message,
    completed_at = now(),
    updated_at = now(),
    retry_count = retry_count + 1
  WHERE id = job_id AND status = 'processing';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer ou mettre à jour un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer le profil utilisateur
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, google_id, last_login_at, login_count)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'sub',
    now(),
    1
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
    last_login_at = now(),
    login_count = user_profiles.login_count + 1,
    updated_at = now();

  -- Créer les préférences par défaut
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Créer les quotas par défaut
  INSERT INTO public.user_quotas (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour le profil utilisateur lors de la connexion
CREATE OR REPLACE FUNCTION public.handle_user_login(
  p_user_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Mettre à jour le profil
  UPDATE public.user_profiles 
  SET 
    last_login_at = now(),
    login_count = login_count + 1,
    updated_at = now()
  WHERE id = p_user_id;

  -- Créer une session
  INSERT INTO public.user_sessions (user_id, ip_address, user_agent)
  VALUES (p_user_id, p_ip_address::INET, p_user_agent);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour terminer une session utilisateur
CREATE OR REPLACE FUNCTION public.handle_user_logout(
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Terminer la session active la plus récente
  UPDATE public.user_sessions 
  SET session_end = now()
  WHERE user_id = p_user_id 
    AND session_end IS NULL
    AND session_start = (
      SELECT MAX(session_start) 
      FROM public.user_sessions 
      WHERE user_id = p_user_id AND session_end IS NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour incrémenter les quotas utilisateur
CREATE OR REPLACE FUNCTION public.increment_user_quota(
  p_user_id UUID,
  increment_amount INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Créer l'entrée si elle n'existe pas
  INSERT INTO public.user_quotas (user_id, daily_requests, monthly_requests)
  VALUES (p_user_id, increment_amount, increment_amount)
  ON CONFLICT (user_id) DO UPDATE SET
    daily_requests = user_quotas.daily_requests + increment_amount,
    monthly_requests = user_quotas.monthly_requests + increment_amount,
    updated_at = now();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier les quotas utilisateur
CREATE OR REPLACE FUNCTION public.check_user_quota(
  p_user_id UUID
)
RETURNS TABLE(
  can_proceed BOOLEAN,
  daily_remaining INTEGER,
  monthly_remaining INTEGER
) AS $$
DECLARE
  quota_record RECORD;
BEGIN
  -- Récupérer ou créer les quotas de l'utilisateur
  SELECT * INTO quota_record
  FROM public.user_quotas 
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- Créer un nouvel enregistrement de quota
    INSERT INTO public.user_quotas (user_id)
    VALUES (p_user_id)
    RETURNING * INTO quota_record;
  END IF;
  
  -- Vérifier si les quotas permettent de continuer
  RETURN QUERY SELECT 
    (quota_record.daily_requests < quota_record.daily_limit AND 
     quota_record.monthly_requests < quota_record.monthly_limit) as can_proceed,
    (quota_record.daily_limit - quota_record.daily_requests) as daily_remaining,
    (quota_record.monthly_limit - quota_record.monthly_requests) as monthly_remaining;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. TRIGGERS
-- =====================================================

-- Trigger pour créer automatiquement un profil lors de l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger pour mettre à jour updated_at sur jobs
DROP TRIGGER IF EXISTS on_jobs_updated ON public.jobs;
CREATE TRIGGER on_jobs_updated
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour updated_at sur user_quotas
DROP TRIGGER IF EXISTS on_user_quotas_updated ON public.user_quotas;
CREATE TRIGGER on_user_quotas_updated
  BEFORE UPDATE ON public.user_quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour updated_at sur project_history
DROP TRIGGER IF EXISTS on_project_history_updated ON public.project_history;
CREATE TRIGGER on_project_history_updated
  BEFORE UPDATE ON public.project_history
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour updated_at sur user_profiles
DROP TRIGGER IF EXISTS on_user_profiles_updated ON public.user_profiles;
CREATE TRIGGER on_user_profiles_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour updated_at sur user_preferences
DROP TRIGGER IF EXISTS on_user_preferences_updated ON public.user_preferences;
CREATE TRIGGER on_user_preferences_updated
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 9. POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table jobs
CREATE POLICY "Users can view their own jobs" ON public.jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" ON public.jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour la table user_quotas
CREATE POLICY "Users can view their own quotas" ON public.user_quotas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotas" ON public.user_quotas
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour la table project_history
CREATE POLICY "Users can view their own projects" ON public.project_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.project_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.project_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.project_history
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour la table metrics (lecture seule pour les utilisateurs)
CREATE POLICY "Users can view their own metrics" ON public.metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Politiques pour le cache (accès service uniquement)
CREATE POLICY "Service role can manage cache" ON public.cache_entries
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour les profils utilisateur
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage profiles" ON public.user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour les préférences utilisateur
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage preferences" ON public.user_preferences
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour les sessions utilisateur
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage sessions" ON public.user_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 10. PUBLICATIONS POUR TEMPS RÉEL
-- =====================================================

-- Activer les notifications en temps réel
ALTER TABLE public.jobs REPLICA IDENTITY FULL;
ALTER TABLE public.project_history REPLICA IDENTITY FULL;
ALTER TABLE public.user_quotas REPLICA IDENTITY FULL;
ALTER TABLE public.user_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.user_preferences REPLICA IDENTITY FULL;

-- Créer les publications
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.jobs, public.project_history, public.user_quotas, public.user_profiles, public.user_preferences;

-- =====================================================
-- 11. TÂCHES PROGRAMMÉES (CRON JOBS)
-- =====================================================

-- Nettoyer le cache expiré toutes les heures
SELECT cron.schedule('cleanup-expired-cache', '0 * * * *', 'SELECT public.cleanup_expired_cache();');

-- Réinitialiser les quotas quotidiens à minuit
SELECT cron.schedule('reset-daily-quotas', '0 0 * * *', 'SELECT public.reset_daily_quotas();');

-- Réinitialiser les quotas mensuels le 1er de chaque mois
SELECT cron.schedule('reset-monthly-quotas', '0 0 1 * *', 'SELECT public.reset_monthly_quotas();');

-- Nettoyer les anciennes sessions (plus de 30 jours)
SELECT cron.schedule('cleanup-old-sessions', '0 2 * * *', 'DELETE FROM public.user_sessions WHERE created_at < NOW() - INTERVAL ''30 days'';');

-- =====================================================
-- 12. VUES UTILES
-- =====================================================

-- Vue pour les statistiques des jobs
CREATE OR REPLACE VIEW public.job_stats AS
SELECT 
  user_id,
  type,
  status,
  COUNT(*) as count,
  AVG(actual_duration) as avg_duration,
  MIN(created_at) as first_job,
  MAX(created_at) as last_job
FROM public.jobs
GROUP BY user_id, type, status;

-- Vue pour les métriques de performance
CREATE OR REPLACE VIEW public.performance_metrics AS
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  metric_name,
  AVG(metric_value) as avg_value,
  MIN(metric_value) as min_value,
  MAX(metric_value) as max_value,
  COUNT(*) as sample_count
FROM public.metrics
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp), metric_name
ORDER BY hour DESC;

-- Vue pour les statistiques utilisateur
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  up.id,
  up.email,
  up.full_name,
  up.subscription_tier,
  up.created_at as user_since,
  up.last_login_at,
  up.login_count,
  uq.daily_requests,
  uq.monthly_requests,
  uq.daily_limit,
  uq.monthly_limit,
  COUNT(j.id) as total_jobs,
  COUNT(CASE WHEN j.status = 'completed' THEN 1 END) as completed_jobs,
  COUNT(ph.id) as total_projects
FROM public.user_profiles up
LEFT JOIN public.user_quotas uq ON up.id = uq.user_id
LEFT JOIN public.jobs j ON up.id = j.user_id
LEFT JOIN public.project_history ph ON up.id = ph.user_id
GROUP BY up.id, up.email, up.full_name, up.subscription_tier, up.created_at, up.last_login_at, up.login_count, uq.daily_requests, uq.monthly_requests, uq.daily_limit, uq.monthly_limit;

-- Vue pour l'activité récente des utilisateurs
CREATE OR REPLACE VIEW public.user_activity AS
SELECT 
  up.id as user_id,
  up.email,
  up.full_name,
  us.session_start,
  us.session_end,
  EXTRACT(EPOCH FROM (COALESCE(us.session_end, NOW()) - us.session_start))/60 as session_duration_minutes,
  us.device_type,
  us.browser,
  us.country
FROM public.user_profiles up
JOIN public.user_sessions us ON up.id = us.user_id
WHERE us.session_start >= NOW() - INTERVAL '7 days'
ORDER BY us.session_start DESC;

-- =====================================================
-- 13. COMMENTAIRES ET DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.user_profiles IS 'Profils utilisateur étendus avec informations Google Auth et abonnements';
COMMENT ON TABLE public.user_preferences IS 'Préférences et paramètres personnalisés de chaque utilisateur';
COMMENT ON TABLE public.user_sessions IS 'Historique des sessions utilisateur pour analytics et sécurité';
COMMENT ON TABLE public.jobs IS 'Table pour gérer les tâches de génération asynchrones (images, vidéos, musique, 3D, etc.)';
COMMENT ON TABLE public.cache_entries IS 'Cache système pour stocker les résultats des API externes et améliorer les performances';
COMMENT ON TABLE public.metrics IS 'Métriques de performance et d''utilisation de l''application';
COMMENT ON TABLE public.user_quotas IS 'Quotas d''utilisation par utilisateur pour contrôler les coûts';
COMMENT ON TABLE public.project_history IS 'Historique des projets créés par les utilisateurs';

COMMENT ON COLUMN public.jobs.status IS 'Statut: pending, processing, completed, failed, cancelled';
COMMENT ON COLUMN public.jobs.type IS 'Type: image_generation, text_generation, video_creation, music_composition, 3d_modeling, graphic_design';
COMMENT ON COLUMN public.jobs.priority IS 'Priorité de 1 (faible) à 10 (élevée)';
COMMENT ON COLUMN public.jobs.progress IS 'Progression en pourcentage (0-100)';

-- =====================================================
-- FIN DU SETUP
-- =====================================================

-- Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Setup Supabase terminé avec succès!';
  RAISE NOTICE 'Tables créées: user_profiles, user_preferences, user_sessions, jobs, cache_entries, metrics, user_quotas, project_history';
  RAISE NOTICE 'Fonctions créées: handle_new_user, handle_user_login/logout, handle_updated_at, cleanup_expired_cache, reset_quotas, job management';
  RAISE NOTICE 'Triggers configurés: création automatique de profils, mise à jour timestamps';
  RAISE NOTICE 'Politiques RLS activées pour la sécurité';
  RAISE NOTICE 'Publications temps réel configurées';
  RAISE NOTICE 'Tâches cron programmées';
  RAISE NOTICE 'Vues analytiques créées: user_stats, user_activity, performance_metrics';
END $$;
