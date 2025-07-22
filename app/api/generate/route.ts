// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GenerationPayload, JobType, CreateJobRequest, ApiResponse } from "@/lib/types";
import { logger, LogCategory } from "@/lib/services/logger.service";
import { errorHandler, ValidationError, AuthenticationError } from "@/lib/services/error-handler.service";
import { validationService } from "@/lib/services/validation.service";
import { metricsService } from "@/lib/services/metrics.service";
import { jobManagerService } from "@/lib/services/job-manager.service";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const path = '/api/generate';
  const method = 'POST';

  logger.info(LogCategory.API, 'Generate API called (Async)', {
    requestId,
    method,
    path
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

    // 2. Parser et valider le payload
    const payload = await request.json() as GenerationPayload;

    // Validation de base
    if (!payload.useCase || !payload.choices) {
      throw new ValidationError("Payload invalide. 'useCase' et 'choices' sont requis.");
    }

    // Validation détaillée
    const validationResult = validationService.validateAndSanitize(payload.choices, payload.useCase);
    if (!validationResult.isValid) {
      throw new ValidationError(`Validation failed: ${validationResult.errors.join(', ')}`);
    }

    // 3. Déterminer le type de job basé sur le useCase
    const jobType = mapUseCaseToJobType(payload.useCase);
    
    // 4. Estimer la durée basée sur le type de tâche
    const estimatedDuration = estimateJobDuration(jobType, payload);

    // 5. Créer le job asynchrone
    const jobRequest: CreateJobRequest = {
      type: jobType,
      payload: {
        useCase: payload.useCase,
        choices: payload.choices,
        prompt: payload.prompt,
        model: payload.model,
        temperature: payload.temperature,
        max_tokens: payload.max_tokens,
        // Autres paramètres...
      },
      priority: payload.priority || 5,
      estimated_duration: estimatedDuration
    };

    const jobResponse = await jobManagerService.createJob(userId, jobRequest);

    if (!jobResponse.success) {
      throw new ValidationError(jobResponse.error || 'Erreur lors de la création du job');
    }

    const duration = Date.now() - startTime;
    logger.info(LogCategory.API, 'Generate API job created successfully', {
      useCase: payload.useCase,
      jobId: jobResponse.jobId,
      jobType,
      estimatedDuration,
      duration,
      requestId,
      userId
    });

    metricsService.recordApiCall(path, method, duration, 200);
    metricsService.recordJobCreation(jobType, duration);

    const response: ApiResponse = {
      success: true,
      data: {
        jobId: jobResponse.jobId,
        message: 'Tâche créée avec succès. Vous recevrez une notification une fois terminée.',
        estimatedDuration,
        jobType
      },
      message: jobResponse.message,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    const statusCode = error.statusCode || 500;
    
    logger.error(LogCategory.API, 'Generate API failed', {
      error: error.message,
      stack: error.stack,
      duration,
      requestId
    });

    metricsService.recordApiCall(path, method, duration, statusCode);
    metricsService.recordGenerationError(error.constructor.name, error.message);

    const errorResponse = errorHandler.handleError(error, requestId);
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

/**
 * Mapper le useCase vers le type de job approprié
 */
function mapUseCaseToJobType(useCase: string): JobType {
  const useCaseMap: Record<string, JobType> = {
    'image_generation': 'image_generation',
    'text_generation': 'text_generation',
    'writing_assistant': 'text_generation',
    'video_creation': 'video_creation',
    'music_composition': 'music_composition',
    '3d_modeling': '3d_modeling',
    'graphic_design': 'graphic_design'
  };

  return useCaseMap[useCase] || 'text_generation';
}

/**
 * Estimer la durée d'un job basée sur son type et ses paramètres
 */
function estimateJobDuration(jobType: JobType, payload: GenerationPayload): number {
  const baseDurations: Record<JobType, number> = {
    'text_generation': 30,      // 30 secondes
    'image_generation': 60,     // 1 minute
    'graphic_design': 120,      // 2 minutes
    'music_composition': 180,   // 3 minutes
    '3d_modeling': 300,         // 5 minutes
    'video_creation': 600       // 10 minutes
  };

  let duration = baseDurations[jobType] || 60;

  // Ajuster basé sur la complexité
  if (payload.choices) {
    const complexity = Object.keys(payload.choices).length;
    duration *= Math.max(1, complexity / 3);
  }

  return Math.round(duration);
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}