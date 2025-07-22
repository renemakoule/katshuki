// app/api/jobs/scheduler/route.ts
// API Route Next.js pour planifier et déclencher les jobs
// S'exécute dans l'environnement Node.js

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { logger, LogCategory } from '@/lib/services/logger.service';
import { metricsService } from '@/lib/services/metrics.service';

// Headers CORS pour les requêtes cross-origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

logger.info(LogCategory.JOB, 'Job Scheduler started');

// Handler pour les requêtes OPTIONS (CORS)
export async function OPTIONS() {
  return new NextResponse('ok', { headers: corsHeaders });
}

// Handler pour les requêtes POST
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    logger.info(LogCategory.JOB, 'Checking for pending jobs...');
    
    // Vérifier s'il y a des jobs en attente
    const { data: pendingJobs, error } = await supabaseAdmin
      .from('jobs')
      .select('id, type, priority, created_at')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(10); // Limiter à 10 jobs pour éviter la surcharge

    if (error) {
      logger.error(LogCategory.JOB, 'Error checking pending jobs', { error });
      throw new Error(`Erreur lors de la vérification des jobs: ${error.message}`);
    }

    if (!pendingJobs || pendingJobs.length === 0) {
      logger.info(LogCategory.JOB, 'No pending jobs found');
      return NextResponse.json({
        success: true,
        message: 'Aucun job en attente à traiter',
        pendingCount: 0
      }, { headers: corsHeaders });
    }

    logger.info(LogCategory.JOB, `Found ${pendingJobs.length} pending job(s), triggering worker...`);

    // Déclencher le worker de génération via notre API Route interne
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const workerUrl = `${baseUrl}/api/jobs/worker`;
    
    try {
      const workerResponse = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ajouter une clé d'authentification interne si nécessaire
          'X-Internal-Request': 'scheduler'
        },
        body: JSON.stringify({
          trigger: 'scheduler',
          timestamp: new Date().toISOString(),
          pendingJobsCount: pendingJobs.length
        })
      });

      if (!workerResponse.ok) {
        throw new Error(`Worker responded with status: ${workerResponse.status}`);
      }

      const workerResult = await workerResponse.json();
      
      logger.info(LogCategory.JOB, 'Worker triggered successfully', { 
        workerResult,
        pendingJobsCount: pendingJobs.length 
      });

      // Enregistrer les métriques
      const totalTime = Date.now() - startTime;
      metricsService.recordTiming('scheduler.execution_time', totalTime, {
        pendingJobsCount: pendingJobs.length,
        success: true
      });

      return NextResponse.json({
        success: true,
        message: 'Traitement des jobs déclenché avec succès',
        pendingJobsCount: pendingJobs.length,
        workerResult,
        executionTime: totalTime
      }, { headers: corsHeaders });

    } catch (workerError: any) {
      logger.error(LogCategory.JOB, 'Failed to trigger worker', { 
        error: workerError.message,
        workerUrl 
      });
      
      // Même si le worker échoue, on peut retourner un succès partiel
      return NextResponse.json({
        success: false,
        message: 'Erreur lors du déclenchement du worker',
        error: workerError.message,
        pendingJobsCount: pendingJobs.length
      }, { 
        status: 500,
        headers: corsHeaders 
      });
    }

  } catch (error: any) {
    const totalTime = Date.now() - startTime;
    
    logger.error(LogCategory.JOB, 'Scheduler error', {
      error: error.message,
      executionTime: totalTime
    });

    // Enregistrer les métriques d'échec
    metricsService.recordTiming('scheduler.execution_time', totalTime, {
      success: false,
      error: error.message
    });
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Erreur inconnue du scheduler'
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}

// Handler pour les requêtes GET (pour vérifier le statut)
export async function GET(request: NextRequest) {
  try {
    logger.info(LogCategory.JOB, 'Scheduler status check');
    
    // Obtenir les statistiques des jobs
    const { data: jobStats, error } = await supabaseAdmin
      .from('jobs')
      .select('status')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Dernières 24h

    if (error) {
      throw new Error(`Erreur lors de la récupération des stats: ${error.message}`);
    }

    const stats = {
      pending: jobStats?.filter(j => j.status === 'pending').length || 0,
      processing: jobStats?.filter(j => j.status === 'processing').length || 0,
      completed: jobStats?.filter(j => j.status === 'completed').length || 0,
      failed: jobStats?.filter(j => j.status === 'failed').length || 0,
      total: jobStats?.length || 0
    };

    return NextResponse.json({
      success: true,
      message: 'Scheduler is running',
      stats,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error: any) {
    logger.error(LogCategory.JOB, 'Error getting scheduler status', { error: error.message });
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Erreur lors de la vérification du statut'
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}
