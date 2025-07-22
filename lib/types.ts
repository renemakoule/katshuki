// =====================================================
// TYPES POUR L'AUTHENTIFICATION ET LES UTILISATEURS
// =====================================================

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  google_id?: string;
  provider: string;
  subscription_tier: 'free' | 'pro' | 'premium';
  subscription_status: 'active' | 'cancelled' | 'expired';
  subscription_expires_at?: string;
  onboarding_completed: boolean;
  preferred_language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  login_count: number;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  email_notifications: boolean;
  marketing_emails: boolean;
  default_image_style: string;
  default_image_quality: 'draft' | 'standard' | 'high';
  default_video_quality: '480p' | '720p' | '1080p' | '4k';
  auto_save_projects: boolean;
  show_tutorials: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserQuota {
  id: string;
  user_id: string;
  daily_requests: number;
  monthly_requests: number;
  daily_limit: number;
  monthly_limit: number;
  last_daily_reset: string;
  last_monthly_reset: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// TYPES POUR LES JOBS ASYNCHRONES
// =====================================================

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type JobType = 'image_generation' | 'text_generation' | 'video_creation' | 'music_composition' | '3d_modeling' | 'graphic_design';

export interface Job {
  id: string;
  user_id: string;
  status: JobStatus;
  type: JobType;
  payload: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
  progress: number;
  priority: number;
  retry_count: number;
  max_retries: number;
  estimated_duration?: number;
  actual_duration?: number;
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface CreateJobRequest {
  type: JobType;
  payload: Record<string, any>;
  priority?: number;
  estimated_duration?: number;
}

export interface JobResponse {
  success: boolean;
  jobId?: string;
  message?: string;
  error?: string;
}

// =====================================================
// TYPES POUR LES PAYLOADS API
// =====================================================

export interface ClarificationPayload {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface GenerationPayload {
  useCase: any;
  choices: any;
  prompt?: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  n?: number;
  stream?: boolean;
  priority?: number;
  estimated_duration?: number;
}

// =====================================================
// TYPES POUR LES PROJETS ET L'HISTORIQUE
// =====================================================

export interface ProjectHistory {
  id: string;
  user_id: string;
  job_id: string;
  project_name?: string;
  project_data: Record<string, any>;
  thumbnail_url?: string;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// =====================================================
// TYPES POUR LE CACHE
// =====================================================

export interface CacheEntry {
  id: string;
  cache_key: string;
  data: Record<string, any>;
  expires_at: string;
  created_at: string;
  hit_count: number;
  last_accessed: string;
}

// =====================================================
// TYPES POUR LES MÉTRIQUES
// =====================================================

export interface Metric {
  id: string;
  metric_name: string;
  metric_value: number;
  tags: Record<string, any>;
  timestamp: string;
  user_id?: string;
}

// =====================================================
// TYPES POUR LES RÉPONSES API
// =====================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =====================================================
// TYPES POUR LES ERREURS
// =====================================================

export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

// =====================================================
// TYPES POUR LES NOTIFICATIONS TEMPS RÉEL
// =====================================================

export interface RealtimeJobUpdate {
  jobId: string;
  status: JobStatus;
  progress?: number;
  result?: Record<string, any>;
  error?: string;
  timestamp: string;
}

// =====================================================
// TYPES POUR LES STATISTIQUES
// =====================================================

export interface UserStats {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: string;
  user_since: string;
  last_login_at?: string;
  login_count: number;
  daily_requests: number;
  monthly_requests: number;
  daily_limit: number;
  monthly_limit: number;
  total_jobs: number;
  completed_jobs: number;
  total_projects: number;
}