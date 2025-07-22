// lib/services/job-manager.service.ts

import { supabaseAdmin } from '@/lib/supabase/admin';
import { Job, JobStatus, JobType, CreateJobRequest, JobResponse } from '@/lib/types';
import { logger, LogCategory } from './logger.service';
import { errorHandler, DatabaseError } from './error-handler.service';
import { metricsService } from './metrics.service';

/**
 * Service de gestion des jobs asynchrones
 * Gère la création, mise à jour et suivi des tâches de génération
 */
export class JobManagerService {
  
  /**
   * Créer un nouveau job
   */
  async createJob(userId: string, request: CreateJobRequest): Promise<JobResponse> {
    const startTime = Date.now();
    
    try {
      logger.info(LogCategory.JOB, 'Creating new job', {
        userId,
        type: request.type,
        priority: request.priority || 5
      });

      // Vérifier les quotas utilisateur
      const quotaCheck = await this.checkUserQuota(userId);
      if (!quotaCheck.canProceed) {
        return {
          success: false,
          error: `Quota dépassé. Limite quotidienne: ${quotaCheck.dailyRemaining}, mensuelle: ${quotaCheck.monthlyRemaining}`
        };
      }

      // Créer le job dans la base de données
      const { data: job, error } = await supabaseAdmin
        .from('jobs')
        .insert({
          user_id: userId,
          type: request.type,
          payload: request.payload,
          priority: request.priority || 5,
          estimated_duration: request.estimated_duration
        })
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Erreur lors de la création du job', error.message);
      }

      // Incrémenter les quotas utilisateur
      await this.incrementUserQuota(userId);

      // Enregistrer les métriques
      const duration = Date.now() - startTime;
      metricsService.recordJobCreation(request.type, duration);

      logger.info(LogCategory.JOB, 'Job created successfully', {
        jobId: job.id,
        userId,
        type: request.type,
        duration
      });

      return {
        success: true,
        jobId: job.id,
        message: 'Job créé avec succès'
      };

    } catch (error: any) {
      const duration = Date.now() - startTime;
      logger.error(LogCategory.JOB, 'Failed to create job', {
        userId,
        type: request.type,
        error: error.message,
        duration
      });

      return {
        success: false,
        error: error.message || 'Erreur lors de la création du job'
      };
    }
  }

  /**
   * Récupérer un job par ID
   */
  async getJob(jobId: string, userId?: string): Promise<Job | null> {
    try {
      let query = supabaseAdmin
        .from('jobs')
        .select('*')
        .eq('id', jobId);

      // Si un userId est fourni, vérifier que le job appartient à l'utilisateur
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: job, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Job non trouvé
        }
        throw new DatabaseError('Erreur lors de la récupération du job', error.message);
      }

      return job as Job;

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to get job', {
        jobId,
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Récupérer les jobs d'un utilisateur avec pagination
   */
  async getUserJobs(
    userId: string, 
    options: {
      page?: number;
      limit?: number;
      status?: JobStatus;
      type?: JobType;
    } = {}
  ): Promise<{ jobs: Job[]; total: number; hasMore: boolean }> {
    try {
      const { page = 1, limit = 10, status, type } = options;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('jobs')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      if (type) {
        query = query.eq('type', type);
      }

      const { data: jobs, error, count } = await query;

      if (error) {
        throw new DatabaseError('Erreur lors de la récupération des jobs', error.message);
      }

      return {
        jobs: jobs as Job[],
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      };

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to get user jobs', {
        userId,
        options,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'un job
   */
  async updateJobStatus(
    jobId: string, 
    status: JobStatus, 
    updates: {
      progress?: number;
      result?: Record<string, any>;
      error?: string;
    } = {}
  ): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (updates.progress !== undefined) {
        updateData.progress = updates.progress;
      }

      if (updates.result) {
        updateData.result = updates.result;
      }

      if (updates.error) {
        updateData.error = updates.error;
      }

      if (status === 'processing') {
        updateData.started_at = new Date().toISOString();
      }

      if (status === 'completed' || status === 'failed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabaseAdmin
        .from('jobs')
        .update(updateData)
        .eq('id', jobId);

      if (error) {
        throw new DatabaseError('Erreur lors de la mise à jour du job', error.message);
      }

      logger.info(LogCategory.JOB, 'Job status updated', {
        jobId,
        status,
        progress: updates.progress
      });

      return true;

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to update job status', {
        jobId,
        status,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Récupérer le prochain job à traiter
   */
  async getNextJob(): Promise<Job | null> {
    try {
      const { data, error } = await supabaseAdmin
        .rpc('get_next_job');

      if (error) {
        throw new DatabaseError('Erreur lors de la récupération du prochain job', error.message);
      }

      if (!data || data.length === 0) {
        return null;
      }

      const jobData = data[0];
      return {
        id: jobData.job_id,
        user_id: jobData.user_id,
        type: jobData.job_type,
        payload: jobData.job_payload,
        status: 'processing' as JobStatus,
        progress: 0,
        priority: 5,
        retry_count: 0,
        max_retries: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Job;

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to get next job', {
        error: error.message
      });
      return null;
    }
  }

  /**
   * Marquer un job comme complété
   */
  async completeJob(jobId: string, result: Record<string, any>, duration?: number): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .rpc('complete_job', {
          job_id: jobId,
          job_result: result,
          duration_seconds: duration
        });

      if (error) {
        throw new DatabaseError('Erreur lors de la completion du job', error.message);
      }

      logger.info(LogCategory.JOB, 'Job completed successfully', {
        jobId,
        duration
      });

      return true;

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to complete job', {
        jobId,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Marquer un job comme échoué
   */
  async failJob(jobId: string, errorMessage: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .rpc('fail_job', {
          job_id: jobId,
          error_message: errorMessage
        });

      if (error) {
        throw new DatabaseError('Erreur lors du marquage d\'échec du job', error.message);
      }

      logger.info(LogCategory.JOB, 'Job marked as failed', {
        jobId,
        error: errorMessage
      });

      return true;

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to mark job as failed', {
        jobId,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Vérifier les quotas utilisateur
   */
  private async checkUserQuota(userId: string): Promise<{
    canProceed: boolean;
    dailyRemaining: number;
    monthlyRemaining: number;
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .rpc('check_user_quota', { p_user_id: userId });

      if (error) {
        throw new DatabaseError('Erreur lors de la vérification des quotas', error.message);
      }

      if (!data || data.length === 0) {
        return { canProceed: false, dailyRemaining: 0, monthlyRemaining: 0 };
      }

      return data[0];

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to check user quota', {
        userId,
        error: error.message
      });
      return { canProceed: false, dailyRemaining: 0, monthlyRemaining: 0 };
    }
  }

  /**
   * Incrémenter les quotas utilisateur
   */
  private async incrementUserQuota(userId: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .rpc('increment_user_quota', { p_user_id: userId });

      if (error) {
        throw new DatabaseError('Erreur lors de l\'incrémentation des quotas', error.message);
      }

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to increment user quota', {
        userId,
        error: error.message
      });
      // Ne pas faire échouer la création du job pour cette erreur
    }
  }

  /**
   * Annuler un job
   */
  async cancelJob(jobId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('jobs')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('user_id', userId)
        .in('status', ['pending', 'processing']);

      if (error) {
        throw new DatabaseError('Erreur lors de l\'annulation du job', error.message);
      }

      logger.info(LogCategory.JOB, 'Job cancelled', {
        jobId,
        userId
      });

      return true;

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to cancel job', {
        jobId,
        userId,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Obtenir les statistiques des jobs pour un utilisateur
   */
  async getUserJobStats(userId: string): Promise<{
    total: number;
    completed: number;
    failed: number;
    pending: number;
    processing: number;
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('jobs')
        .select('status')
        .eq('user_id', userId);

      if (error) {
        throw new DatabaseError('Erreur lors de la récupération des statistiques', error.message);
      }

      const stats = {
        total: data.length,
        completed: 0,
        failed: 0,
        pending: 0,
        processing: 0
      };

      data.forEach(job => {
        switch (job.status) {
          case 'completed':
            stats.completed++;
            break;
          case 'failed':
            stats.failed++;
            break;
          case 'pending':
            stats.pending++;
            break;
          case 'processing':
            stats.processing++;
            break;
        }
      });

      return stats;

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Failed to get user job stats', {
        userId,
        error: error.message
      });
      throw error;
    }
  }
}

// Instance singleton
export const jobManagerService = new JobManagerService();
