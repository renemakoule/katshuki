// app/api/jobs/[jobId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types";
import { logger, LogCategory } from "@/lib/services/logger.service";
import { errorHandler, AuthenticationError, NotFoundError } from "@/lib/services/error-handler.service";
import { jobManagerService } from "@/lib/services/job-manager.service";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * GET /api/jobs/[jobId] - Récupérer le statut d'un job spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const jobId = params.jobId;

  logger.info(LogCategory.API, 'Job status API called', {
    requestId,
    jobId,
    method: 'GET'
  });

  try {
    // 1. Authentification utilisateur
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new AuthenticationError('Utilisateur non authentifié');
    }

    const userId = user.id;

    // 2. Récupérer le job
    const job = await jobManagerService.getJob(jobId, userId);

    if (!job) {
      throw new NotFoundError('Job non trouvé');
    }

    const duration = Date.now() - startTime;
    logger.info(LogCategory.API, 'Job status retrieved successfully', {
      requestId,
      jobId,
      status: job.status,
      progress: job.progress,
      duration
    });

    const response: ApiResponse = {
      success: true,
      data: {
        id: job.id,
        status: job.status,
        type: job.type,
        progress: job.progress,
        result: job.result,
        error: job.error,
        created_at: job.created_at,
        updated_at: job.updated_at,
        started_at: job.started_at,
        completed_at: job.completed_at,
        estimated_duration: job.estimated_duration,
        actual_duration: job.actual_duration
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = error.statusCode || 500;
    
    logger.error(LogCategory.API, 'Job status API failed', {
      error: error.message,
      requestId,
      jobId,
      duration
    });

    const errorResponse = errorHandler.handleError(error, requestId);
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

/**
 * DELETE /api/jobs/[jobId] - Annuler un job
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const jobId = params.jobId;

  logger.info(LogCategory.API, 'Job cancellation API called', {
    requestId,
    jobId,
    method: 'DELETE'
  });

  try {
    // 1. Authentification utilisateur
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new AuthenticationError('Utilisateur non authentifié');
    }

    const userId = user.id;

    // 2. Annuler le job
    const success = await jobManagerService.cancelJob(jobId, userId);

    if (!success) {
      throw new NotFoundError('Job non trouvé ou impossible à annuler');
    }

    const duration = Date.now() - startTime;
    logger.info(LogCategory.API, 'Job cancelled successfully', {
      requestId,
      jobId,
      duration
    });

    const response: ApiResponse = {
      success: true,
      data: {
        jobId,
        status: 'cancelled',
        message: 'Job annulé avec succès'
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = error.statusCode || 500;
    
    logger.error(LogCategory.API, 'Job cancellation API failed', {
      error: error.message,
      requestId,
      jobId,
      duration
    });

    const errorResponse = errorHandler.handleError(error, requestId);
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}
