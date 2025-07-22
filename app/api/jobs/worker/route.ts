// app/api/jobs/worker/route.ts
// API Route Next.js pour traiter les jobs de génération
// S'exécute dans l'environnement Node.js

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { jobManagerService } from '@/lib/services/job-manager.service';
import { logger, LogCategory } from '@/lib/services/logger.service';
import { metricsService } from '@/lib/services/metrics.service';
import { Job, JobType } from '@/lib/types';

// Headers CORS pour les requêtes cross-origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

console.log('Generation Worker started')

// Handler pour les requêtes OPTIONS (CORS)
export async function OPTIONS() {
  return new NextResponse('ok', { headers: corsHeaders });
}

// Handler pour les requêtes POST
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    logger.info(LogCategory.JOB, 'Processing generation jobs...');
    
    // Récupérer le prochain job à traiter
    const { data: jobs, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) {
      throw new Error(`Erreur lors de la récupération des jobs: ${error.message}`);
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun job en attente',
        processed: false
      }, { headers: corsHeaders });
    }

    const job: Job = jobs[0];
    
    // Marquer le job comme en cours de traitement
    await supabaseAdmin
      .from('jobs')
      .update({ 
        status: 'processing', 
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    // Traiter le job selon son type
    let result: any;
    const processingStartTime = Date.now();

    try {
      result = await processJob(job);
      
      const processingTime = Date.now() - processingStartTime;

      // Marquer le job comme terminé
      await supabaseAdmin
        .from('jobs')
        .update({
          status: 'completed',
          result: result,
          progress: 100,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          actual_duration: Math.round(processingTime / 1000)
        })
        .eq('id', job.id);

      // Enregistrer les métriques
      metricsService.recordTiming('job.processing_time', processingTime, {
        jobType: job.type,
        success: true
      });

      logger.info(LogCategory.JOB, 'Job completed successfully', {
        jobId: job.id,
        type: job.type,
        processingTime
      });

      return NextResponse.json({
        success: true,
        message: 'Job traité avec succès',
        processed: true,
        jobId: job.id,
        processingTime
      }, { headers: corsHeaders });

    } catch (processingError: any) {
      // Marquer le job comme échoué
      await supabaseAdmin
        .from('jobs')
        .update({
          status: 'failed',
          error: processingError.message,
          updated_at: new Date().toISOString(),
          retry_count: job.retry_count + 1
        })
        .eq('id', job.id);

      throw processingError;
    }

  } catch (error: any) {
    const totalTime = Date.now() - startTime;
    
    logger.error(LogCategory.JOB, 'Erreur lors du traitement des jobs', {
      error: error.message,
      processingTime: totalTime
    });

    return NextResponse.json({
      success: false,
      error: error?.message || 'Erreur lors du traitement du job'
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}

// Fonction pour traiter un job selon son type
async function processJob(job: Job): Promise<any> {
  switch (job.type) {
    case 'image_generation':
      return await processImageGeneration(job.payload);
    case 'text_generation':
      return await processTextGeneration(job.payload);
    case 'video_creation':
      return await processVideoCreation(job.payload);
    case 'music_composition':
      return await processMusicComposition(job.payload);
    case '3d_modeling':
      return await process3DModeling(job.payload);
    case 'graphic_design':
      return await processGraphicDesign(job.payload);
    default:
      throw new Error(`Type de job non supporté: ${job.type}`);
  }
}

// Fonctions de traitement spécifiques
async function processImageGeneration(payload: any) {
  // TODO: Implémenter avec vos services existants
  logger.info(LogCategory.JOB, 'Processing image generation', { payload });
  
  return {
    images: [],
    metadata: {
      model: 'dall-e-3',
      processingTime: 0
    }
  };
}

async function processTextGeneration(payload: any) {
  // TODO: Implémenter avec vos services existants
  logger.info(LogCategory.JOB, 'Processing text generation', { payload });
  
  return {
    text: '',
    metadata: {
      model: 'gpt-4',
      processingTime: 0
    }
  };
}

async function processVideoCreation(payload: any) {
  logger.info(LogCategory.JOB, 'Processing video creation', { payload });
  return { video_url: '', metadata: {} };
}

async function processMusicComposition(payload: any) {
  logger.info(LogCategory.JOB, 'Processing music composition', { payload });
  return { audio_url: '', metadata: {} };
}

async function process3DModeling(payload: any) {
  logger.info(LogCategory.JOB, 'Processing 3D modeling', { payload });
  return { model_url: '', metadata: {} };
}

async function processGraphicDesign(payload: any) {
  logger.info(LogCategory.JOB, 'Processing graphic design', { payload });
  return { design_url: '', metadata: {} };
}
