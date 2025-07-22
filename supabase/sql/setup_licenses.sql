-- =====================================================
-- SYSTÈME DE LICENCES ET PROTECTION INTELLECTUELLE
-- =====================================================

-- Table des licences
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trial', 'personal', 'commercial', 'enterprise')),
  domain TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired', 'cancelled')),
  features JSONB DEFAULT '["basic"]'::jsonb,
  max_users INTEGER DEFAULT 1,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les licences
CREATE INDEX IF NOT EXISTS idx_licenses_key ON public.licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_domain ON public.licenses(domain);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON public.licenses(status);
CREATE INDEX IF NOT EXISTS idx_licenses_expires ON public.licenses(expires_at);

-- Table d'utilisation des licences
CREATE TABLE IF NOT EXISTS public.license_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour l'utilisation
CREATE INDEX IF NOT EXISTS idx_license_usage_license_id ON public.license_usage(license_id);
CREATE INDEX IF NOT EXISTS idx_license_usage_timestamp ON public.license_usage(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_license_usage_domain ON public.license_usage(domain);

-- Table d'analytics des licences
CREATE TABLE IF NOT EXISTS public.license_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  features_used JSONB DEFAULT '[]'::jsonb,
  session_timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les analytics
CREATE INDEX IF NOT EXISTS idx_license_analytics_license_id ON public.license_analytics(license_id);
CREATE INDEX IF NOT EXISTS idx_license_analytics_domain ON public.license_analytics(domain);
CREATE INDEX IF NOT EXISTS idx_license_analytics_timestamp ON public.license_analytics(session_timestamp DESC);

-- Table des violations de licence
CREATE TABLE IF NOT EXISTS public.license_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES public.licenses(id) ON DELETE SET NULL,
  domain TEXT NOT NULL,
  violation_type TEXT NOT NULL CHECK (violation_type IN ('expired', 'domain_mismatch', 'usage_exceeded', 'tampering_detected')),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ
);

-- Index pour les violations
CREATE INDEX IF NOT EXISTS idx_license_violations_license_id ON public.license_violations(license_id);
CREATE INDEX IF NOT EXISTS idx_license_violations_type ON public.license_violations(violation_type);
CREATE INDEX IF NOT EXISTS idx_license_violations_detected ON public.license_violations(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_license_violations_resolved ON public.license_violations(resolved);

-- =====================================================
-- FONCTIONS DE GESTION DES LICENCES
-- =====================================================

-- Fonction pour générer une clé de licence
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT AS $$
DECLARE
  key_parts TEXT[];
  i INTEGER;
BEGIN
  -- Générer 4 groupes de 4 caractères alphanumériques
  FOR i IN 1..4 LOOP
    key_parts[i] := upper(substring(encode(gen_random_bytes(3), 'hex') from 1 for 4));
  END LOOP;
  
  RETURN array_to_string(key_parts, '-');
END;
$$ LANGUAGE plpgsql;

-- Fonction pour valider une licence
CREATE OR REPLACE FUNCTION validate_license(
  p_license_key TEXT,
  p_domain TEXT
)
RETURNS TABLE(
  valid BOOLEAN,
  license_id UUID,
  license_type TEXT,
  features JSONB,
  expires_at TIMESTAMPTZ,
  days_remaining INTEGER
) AS $$
DECLARE
  license_record RECORD;
  current_time TIMESTAMPTZ := now();
BEGIN
  -- Récupérer la licence
  SELECT * INTO license_record
  FROM public.licenses
  WHERE license_key = p_license_key
    AND domain = p_domain
    AND status = 'active';

  -- Si licence non trouvée
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, NULL::JSONB, NULL::TIMESTAMPTZ, NULL::INTEGER;
    RETURN;
  END IF;

  -- Vérifier l'expiration
  IF license_record.expires_at < current_time THEN
    -- Marquer comme expirée
    UPDATE public.licenses 
    SET status = 'expired', updated_at = current_time
    WHERE id = license_record.id;
    
    -- Enregistrer la violation
    INSERT INTO public.license_violations (license_id, domain, violation_type, details)
    VALUES (license_record.id, p_domain, 'expired', jsonb_build_object('expired_at', license_record.expires_at));
    
    RETURN QUERY SELECT FALSE, license_record.id, license_record.type, license_record.features, license_record.expires_at, 0;
    RETURN;
  END IF;

  -- Calculer les jours restants
  DECLARE
    remaining_days INTEGER := EXTRACT(DAY FROM license_record.expires_at - current_time);
  BEGIN
    RETURN QUERY SELECT TRUE, license_record.id, license_record.type, license_record.features, license_record.expires_at, remaining_days;
  END;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer une nouvelle licence
CREATE OR REPLACE FUNCTION create_license(
  p_type TEXT,
  p_domain TEXT,
  p_customer_email TEXT,
  p_customer_name TEXT DEFAULT NULL,
  p_duration_days INTEGER DEFAULT 365,
  p_features JSONB DEFAULT '["basic"]'::jsonb,
  p_max_users INTEGER DEFAULT 1
)
RETURNS TABLE(
  license_id UUID,
  license_key TEXT,
  expires_at TIMESTAMPTZ
) AS $$
DECLARE
  new_license_key TEXT;
  new_license_id UUID;
  expiration_date TIMESTAMPTZ;
BEGIN
  -- Générer une clé unique
  LOOP
    new_license_key := generate_license_key();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.licenses WHERE license_key = new_license_key);
  END LOOP;

  -- Calculer la date d'expiration
  expiration_date := now() + (p_duration_days || ' days')::INTERVAL;

  -- Insérer la nouvelle licence
  INSERT INTO public.licenses (
    license_key, type, domain, customer_email, customer_name,
    features, max_users, expires_at
  ) VALUES (
    new_license_key, p_type, p_domain, p_customer_email, p_customer_name,
    p_features, p_max_users, expiration_date
  ) RETURNING id INTO new_license_id;

  RETURN QUERY SELECT new_license_id, new_license_key, expiration_date;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour enregistrer l'utilisation d'une licence
CREATE OR REPLACE FUNCTION log_license_usage(
  p_license_key TEXT,
  p_domain TEXT,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  license_id_var UUID;
BEGIN
  -- Récupérer l'ID de la licence
  SELECT id INTO license_id_var
  FROM public.licenses
  WHERE license_key = p_license_key AND domain = p_domain;

  -- Si licence trouvée, enregistrer l'utilisation
  IF FOUND THEN
    INSERT INTO public.license_usage (license_id, domain, user_agent, ip_address)
    VALUES (license_id_var, p_domain, p_user_agent, p_ip_address);
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_violations ENABLE ROW LEVEL SECURITY;

-- Politiques pour les licences (seul le service role peut accéder)
CREATE POLICY "Service role can manage licenses" ON public.licenses
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour l'utilisation (seul le service role peut accéder)
CREATE POLICY "Service role can manage license usage" ON public.license_usage
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour les analytics (seul le service role peut accéder)
CREATE POLICY "Service role can manage license analytics" ON public.license_analytics
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour les violations (seul le service role peut accéder)
CREATE POLICY "Service role can manage license violations" ON public.license_violations
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- VUES POUR LES STATISTIQUES
-- =====================================================

-- Vue des statistiques de licences
CREATE OR REPLACE VIEW license_stats AS
SELECT 
  type,
  status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE expires_at > now()) as active_count,
  COUNT(*) FILTER (WHERE expires_at <= now()) as expired_count
FROM public.licenses
GROUP BY type, status;

-- Vue de l'utilisation récente
CREATE OR REPLACE VIEW recent_license_usage AS
SELECT 
  l.license_key,
  l.type,
  l.domain,
  l.customer_email,
  COUNT(lu.id) as usage_count,
  MAX(lu.timestamp) as last_used
FROM public.licenses l
LEFT JOIN public.license_usage lu ON l.id = lu.license_id
WHERE lu.timestamp > now() - INTERVAL '30 days'
GROUP BY l.id, l.license_key, l.type, l.domain, l.customer_email
ORDER BY last_used DESC;

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE public.licenses IS 'Table des licences pour la protection intellectuelle';
COMMENT ON TABLE public.license_usage IS 'Historique d''utilisation des licences';
COMMENT ON TABLE public.license_analytics IS 'Analytics détaillées des licences';
COMMENT ON TABLE public.license_violations IS 'Violations de licence détectées';

COMMENT ON FUNCTION generate_license_key() IS 'Génère une clé de licence unique au format XXXX-XXXX-XXXX-XXXX';
COMMENT ON FUNCTION validate_license(TEXT, TEXT) IS 'Valide une licence pour un domaine donné';
COMMENT ON FUNCTION create_license(TEXT, TEXT, TEXT, TEXT, INTEGER, JSONB, INTEGER) IS 'Crée une nouvelle licence';
COMMENT ON FUNCTION log_license_usage(TEXT, TEXT, TEXT, INET) IS 'Enregistre l''utilisation d''une licence';
