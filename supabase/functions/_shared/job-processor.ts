// lib/services/job-processor.service.ts
// Service pour traiter les jobs de génération dans l'environnement Node.js

import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { logger, LogCategory } from '@/lib/services/logger.service';
import { metricsService } from '@/lib/services/metrics.service';
import { openaiService } from '@/lib/services/openai.service';
import { Job, JobType } from '@/lib/types';

// Interface Job importée depuis @/lib/types

export interface ProcessingResult {
  processed: boolean
  jobId?: string
  processingTime?: number
  error?: string
}

export class JobProcessor {
  private supabase: SupabaseClient;

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || supabaseAdmin;
  }

  /**
   * Traiter le prochain job en attente
   */
  async processNextJob(): Promise<ProcessingResult> {
    const startTime = Date.now()

    try {
      logger.info(LogCategory.JOB, 'Looking for next job to process...');

      // Récupérer le prochain job à traiter
      const { data, error } = await this.supabase.rpc('get_next_job')

      if (error) {
        console.error('Error getting next job:', error)
        return { processed: false, error: error.message }
      }

      if (!data || data.length === 0) {
        logger.info(LogCategory.JOB, 'No jobs to process');
        return { processed: false };
      }

      const jobData = data[0]
      const job: Job = {
        id: jobData.job_id,
        user_id: jobData.user_id,
        type: jobData.job_type,
        payload: jobData.job_payload,
        status: 'processing',
        progress: 0,
        priority: 5,
        retry_count: 0,
        max_retries: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      logger.info(LogCategory.JOB, `Processing job ${job.id} of type ${job.type}`);

      // Traiter le job
      const result = await this.processJob(job)
      const processingTime = Date.now() - startTime

      if (result.success) {
        // Marquer le job comme terminé
        await this.completeJob(job.id, result.data, processingTime)
        logger.info(LogCategory.JOB, `Job ${job.id} completed successfully in ${processingTime}ms`);
      } else {
        // Marquer le job comme échoué
        await this.failJob(job.id, result.error || 'Unknown error')
        logger.error(LogCategory.JOB, `Job ${job.id} failed`, { error: result.error });
      }

      return {
        processed: true,
        jobId: job.id,
        processingTime
      }

    } catch (error: any) {
      logger.error(LogCategory.JOB, 'Error in processNextJob', { error: error.message });
      return { processed: false, error: error?.message || 'Unknown error' };
    }
  }

  /**
   * Traiter un job spécifique
   */
  private async processJob(job: Job): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      logger.info(LogCategory.JOB, `Processing job ${job.id} of type ${job.type}`);
      
      // Mettre à jour le progrès à 10%
      await this.updateJobProgress(job.id, 10);

      let result: any;
      
      // Traiter selon le type de job
      switch (job.type) {
        case 'image_generation':
          result = await this.processImageGeneration(job.payload, job.id);
          break;
        case 'text_generation':
          result = await this.processTextGeneration(job.payload, job.id);
          break;
        case 'video_creation':
          result = await this.processVideoCreation(job.payload, job.id);
          break;
        case 'music_composition':
          result = await this.processMusicComposition(job.payload, job.id);
          break;
        case '3d_modeling':
          result = await this.process3DModeling(job.payload, job.id);
          break;
        case 'graphic_design':
          result = await this.processGraphicDesign(job.payload, job.id);
          break;
        default:
          return { success: false, error: `Unsupported job type: ${job.type}` };
      }

      // Mettre à jour le progrès à 100%
      await this.updateJobProgress(job.id, 100);

      return { success: true, data: result };

    } catch (error: any) {
      logger.error(LogCategory.JOB, `Error processing job ${job.id}`, { error: error.message });
      return { success: false, error: error?.message || 'Unknown processing error' };
    }
  }

  /**
   * Mettre à jour le progrès d'un job
   */
  private async updateJobProgress(jobId: string, progress: number): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('jobs')
        .update({
          progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

      if (error) {
        logger.error(LogCategory.JOB, `Error updating job progress for ${jobId}`, { error });
      }
    } catch (error: any) {
      logger.error(LogCategory.JOB, `Error updating job progress for ${jobId}`, { error: error.message });
    }
  }

  /**
   * Marquer un job comme terminé
   */
  private async completeJob(jobId: string, result: any, duration: number): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('complete_job', {
        job_id: jobId,
        job_result: result,
        duration_seconds: Math.round(duration / 1000)
      })

      if (error) {
        logger.error(LogCategory.JOB, `Error completing job ${jobId}`, { error });
      }
    } catch (error: any) {
      logger.error(LogCategory.JOB, `Error completing job ${jobId}`, { error: error.message });
    }
  }

  /**
   * Marquer un job comme échoué
   */
  private async failJob(jobId: string, errorMessage: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('fail_job', {
        job_id: jobId,
        error_message: errorMessage
      })

      if (error) {
        logger.error(LogCategory.JOB, `Error failing job ${jobId}`, { error });
      }
    } catch (error: any) {
      logger.error(LogCategory.JOB, `Error failing job ${jobId}`, { error: error.message });
    }
  }

  /**
   * Traiter plusieurs jobs en parallèle (optionnel)
   */
  async processBatch(maxJobs: number = 3): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = []
    const promises: Promise<ProcessingResult>[] = []

    for (let i = 0; i < maxJobs; i++) {
      promises.push(this.processNextJob())
    }

    const batchResults = await Promise.allSettled(promises)
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        results.push({ processed: false, error: result.reason?.message || 'Unknown error' })
      }
    }

    return results;
  }

  // Méthodes de traitement spécifiques pour chaque type de job
  
  private async processImageGeneration(payload: any, jobId: string): Promise<any> {
    logger.info(LogCategory.JOB, 'Processing image generation', { jobId, payload });
    await this.updateJobProgress(jobId, 50);
    
    // TODO: Implémenter avec openaiService
    // const result = await openaiService.generateImage(payload);
    
    return {
      images: [],
      metadata: {
        model: 'dall-e-3',
        processingTime: 0
      }
    };
  }

  private async processTextGeneration(payload: any, jobId: string): Promise<any> {
    logger.info(LogCategory.JOB, 'Processing text generation', { jobId, payload });
    await this.updateJobProgress(jobId, 50);
    
    // TODO: Implémenter avec openaiService
    // const result = await openaiService.generateText(payload);
    
    return {
      text: '',
      metadata: {
        model: 'gpt-4',
        processingTime: 0
      }
    };
  }

  private async processVideoCreation(payload: any, jobId: string): Promise<any> {
    logger.info(LogCategory.JOB, 'Processing video creation', { jobId, payload });
    await this.updateJobProgress(jobId, 50);
    
    // TODO: Implémenter la création vidéo
    return {
      video_url: '',
      metadata: {
        duration: 0,
        format: 'mp4'
      }
    };
  }

  private async processMusicComposition(payload: any, jobId: string): Promise<any> {
    logger.info(LogCategory.JOB, 'Processing music composition', { jobId, payload });
    await this.updateJobProgress(jobId, 50);
    
    // TODO: Implémenter la composition musicale
    return {
      audio_url: '',
      metadata: {
        duration: 0,
        format: 'mp3'
      }
    };
  }

  private async process3DModeling(payload: any, jobId: string): Promise<any> {
    logger.info(LogCategory.JOB, 'Processing 3D modeling', { jobId, payload });
    await this.updateJobProgress(jobId, 50);
    
    // TODO: Implémenter la modélisation 3D
    return {
      model_url: '',
      metadata: {
        format: 'obj',
        vertices: 0
      }
    };
  }

  private async processGraphicDesign(payload: any, jobId: string): Promise<any> {
    logger.info(LogCategory.JOB, 'Processing graphic design', { jobId, payload });
    await this.updateJobProgress(jobId, 50);
    
    // TODO: Implémenter le design graphique
    return {
      design_url: '',
      metadata: {
        format: 'svg',
        dimensions: { width: 0, height: 0 }
      }
    };
  }
}

// Instance singleton
export const jobProcessor = new JobProcessor();
