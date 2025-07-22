// hooks/useJobs.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { Job, JobStatus, JobType, CreateJobRequest, ApiResponse, PaginatedResponse } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UseJobsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  realtimeUpdates?: boolean;
}

interface UseJobsReturn {
  // État
  jobs: Job[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  
  // Actions
  createJob: (request: CreateJobRequest) => Promise<{ success: boolean; jobId?: string; error?: string }>;
  refreshJobs: () => Promise<void>;
  loadMore: () => Promise<void>;
  cancelJob: (jobId: string) => Promise<boolean>;
  getJobStatus: (jobId: string) => Promise<Job | null>;
  
  // Filtres
  filterByStatus: (status: JobStatus | null) => void;
  filterByType: (type: JobType | null) => void;
  
  // État des filtres
  currentStatus: JobStatus | null;
  currentType: JobType | null;
}

export function useJobs(options: UseJobsOptions = {}): UseJobsReturn {
  const {
    autoRefresh = false,
    refreshInterval = 5000,
    realtimeUpdates = true
  } = options;

  // État
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState<JobStatus | null>(null);
  const [currentType, setCurrentType] = useState<JobType | null>(null);

  // Refs
  const supabase = createClientComponentClient();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const realtimeChannelRef = useRef<any>(null);

  /**
   * Construire l'URL avec les paramètres de requête
   */
  const buildJobsUrl = useCallback((pageNum: number = 1) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    params.set('limit', '10');
    
    if (currentStatus) params.set('status', currentStatus);
    if (currentType) params.set('type', currentType);
    
    return `/api/jobs?${params.toString()}`;
  }, [currentStatus, currentType]);

  /**
   * Récupérer les jobs depuis l'API
   */
  const fetchJobs = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(buildJobsUrl(pageNum));
      const data: ApiResponse<PaginatedResponse<Job>> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement des jobs');
      }

      if (append) {
        setJobs(prev => [...prev, ...data.data!.data]);
      } else {
        setJobs(data.data!.data);
      }

      setHasMore(data.data!.hasMore);
      setTotal(data.data!.total);
      setPage(pageNum);

    } catch (err: any) {
      setError(err.message);
      console.error('Erreur lors du chargement des jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [buildJobsUrl]);

  /**
   * Créer un nouveau job
   */
  const createJob = useCallback(async (request: CreateJobRequest) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          useCase: request.type,
          choices: request.payload,
          priority: request.priority,
          estimated_duration: request.estimated_duration
        }),
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Erreur lors de la création du job'
        };
      }

      // Rafraîchir la liste des jobs
      await refreshJobs();

      return {
        success: true,
        jobId: data.data?.jobId
      };

    } catch (err: any) {
      return {
        success: false,
        error: err.message
      };
    }
  }, []);

  /**
   * Rafraîchir la liste des jobs
   */
  const refreshJobs = useCallback(async () => {
    await fetchJobs(1, false);
  }, [fetchJobs]);

  /**
   * Charger plus de jobs (pagination)
   */
  const loadMore = useCallback(async () => {
    if (hasMore && !loading) {
      await fetchJobs(page + 1, true);
    }
  }, [fetchJobs, hasMore, loading, page]);

  /**
   * Annuler un job
   */
  const cancelJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        // Mettre à jour le job localement
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { ...job, status: 'cancelled' as JobStatus, updated_at: new Date().toISOString() }
            : job
        ));
        return true;
      }

      return false;

    } catch (err: any) {
      console.error('Erreur lors de l\'annulation du job:', err);
      return false;
    }
  }, []);

  /**
   * Récupérer le statut d'un job spécifique
   */
  const getJobStatus = useCallback(async (jobId: string): Promise<Job | null> => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      const data: ApiResponse<Job> = await response.json();

      if (data.success && data.data) {
        // Mettre à jour le job dans la liste locale
        setJobs(prev => prev.map(job => 
          job.id === jobId ? data.data! : job
        ));
        return data.data;
      }

      return null;

    } catch (err: any) {
      console.error('Erreur lors de la récupération du statut du job:', err);
      return null;
    }
  }, []);

  /**
   * Filtrer par statut
   */
  const filterByStatus = useCallback((status: JobStatus | null) => {
    setCurrentStatus(status);
    setPage(1);
  }, []);

  /**
   * Filtrer par type
   */
  const filterByType = useCallback((type: JobType | null) => {
    setCurrentType(type);
    setPage(1);
  }, []);

  /**
   * Configurer les mises à jour en temps réel
   */
  useEffect(() => {
    if (!realtimeUpdates) return;

    const setupRealtimeUpdates = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // S'abonner aux changements de jobs pour cet utilisateur
      const channel = supabase
        .channel(`jobs-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'jobs',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Job update received:', payload);
            
            if (payload.eventType === 'INSERT') {
              const newJob = payload.new as Job;
              setJobs(prev => [newJob, ...prev]);
              setTotal(prev => prev + 1);
            } else if (payload.eventType === 'UPDATE') {
              const updatedJob = payload.new as Job;
              setJobs(prev => prev.map(job => 
                job.id === updatedJob.id ? updatedJob : job
              ));
            } else if (payload.eventType === 'DELETE') {
              const deletedJob = payload.old as Job;
              setJobs(prev => prev.filter(job => job.id !== deletedJob.id));
              setTotal(prev => prev - 1);
            }
          }
        )
        .subscribe();

      realtimeChannelRef.current = channel;
    };

    setupRealtimeUpdates();

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [realtimeUpdates, supabase]);

  /**
   * Configurer le rafraîchissement automatique
   */
  useEffect(() => {
    if (!autoRefresh) return;

    refreshIntervalRef.current = setInterval(() => {
      refreshJobs();
    }, refreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, refreshJobs]);

  /**
   * Charger les jobs initiaux et lors des changements de filtres
   */
  useEffect(() => {
    fetchJobs(1, false);
  }, [currentStatus, currentType, fetchJobs]);

  /**
   * Nettoyage lors du démontage
   */
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [supabase]);

  return {
    // État
    jobs,
    loading,
    error,
    hasMore,
    total,
    
    // Actions
    createJob,
    refreshJobs,
    loadMore,
    cancelJob,
    getJobStatus,
    
    // Filtres
    filterByStatus,
    filterByType,
    
    // État des filtres
    currentStatus,
    currentType,
  };
}
