// app/api/jobs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, PaginatedResponse, JobStatus, JobType } from "@/lib/types";
import { logger, LogCategory } from "@/lib/services/logger.service";
import { errorHandler, AuthenticationError, ValidationError } from "@/lib/services/error-handler.service";
import { jobManagerService } from "@/lib/services/job-manager.service";
import { metricsService } from "@/lib/services/metrics.service";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * GET /api/jobs - Récupérer la liste des jobs d'un utilisateur
 * Query parameters:
 * - page: numéro de page (défaut: 1)
 * - limit: nombre d'éléments par page (défaut: 10, max: 50)
 * - status: filtrer par statut (optionnel)
 * - type: filtrer par type (optionnel)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const { searchParams } = new URL(request.url);

  logger.info(LogCategory.API, 'Jobs list API called', {
    requestId,
    method: 'GET',
    params: Object.fromEntries(searchParams)
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

    // 2. Validation et parsing des paramètres
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const status = searchParams.get('status') as JobStatus | null;
    const type = searchParams.get('type') as JobType | null;

    // Validation des paramètres optionnels
    if (status && !['pending', 'processing', 'completed', 'failed', 'cancelled'].includes(status)) {
      throw new ValidationError('Statut invalide');
    }

    if (type && !['image_generation', 'text_generation', 'video_creation', 'music_composition', '3d_modeling', 'graphic_design'].includes(type)) {
      throw new ValidationError('Type de job invalide');
    }

    // 3. Récupérer les jobs
    const result = await jobManagerService.getUserJobs(userId, {
      page,
      limit,
      status: status || undefined,
      type: type || undefined
    });

    const duration = Date.now() - startTime;
    logger.info(LogCategory.API, 'Jobs list retrieved successfully', {
      requestId,
      userId,
      totalJobs: result.total,
      page,
      limit,
      duration
    });

    // 4. Enregistrer les métriques
    metricsService.recordApiCall('/api/jobs', 'GET', duration, 200);

    const response: ApiResponse<PaginatedResponse> = {
      success: true,
      data: {
        data: result.jobs,
        total: result.total,
        page,
        limit,
        hasMore: result.hasMore
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = error.statusCode || 500;
    
    logger.error(LogCategory.API, 'Jobs list API failed', {
      error: error.message,
      requestId,
      duration
    });

    // Enregistrer les métriques d'erreur
    metricsService.recordApiCall('/api/jobs', 'GET', duration, statusCode);

    const errorResponse = errorHandler.handleError(error, requestId);
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

/**
 * GET /api/jobs/stats - Récupérer les statistiques des jobs d'un utilisateur
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'stats') {
    return await getJobStats(request, requestId, startTime);
  }

  // Action non supportée
  const errorResponse = errorHandler.handleError(
    new ValidationError('Action non supportée'),
    requestId
  );
  return NextResponse.json(errorResponse, { status: 400 });
}

/**
 * Récupérer les statistiques des jobs
 */
async function getJobStats(request: NextRequest, requestId: string, startTime: number) {
  logger.info(LogCategory.API, 'Job stats API called', {
    requestId,
    method: 'POST',
    action: 'stats'
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

    // 2. Récupérer les statistiques
    const stats = await jobManagerService.getUserJobStats(userId);

    const duration = Date.now() - startTime;
    logger.info(LogCategory.API, 'Job stats retrieved successfully', {
      requestId,
      userId,
      stats,
      duration
    });

    // 3. Enregistrer les métriques
    metricsService.recordApiCall('/api/jobs', 'POST', duration, 200);

    const response: ApiResponse = {
      success: true,
      data: {
        stats,
        summary: {
          successRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
          failureRate: stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0,
          activeJobs: stats.pending + stats.processing
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = error.statusCode || 500;
    
    logger.error(LogCategory.API, 'Job stats API failed', {
      error: error.message,
      requestId,
      duration
    });

    // Enregistrer les métriques d'erreur
    metricsService.recordApiCall('/api/jobs', 'POST', duration, statusCode);

    const errorResponse = errorHandler.handleError(error, requestId);
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}
