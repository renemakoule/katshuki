// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GenerationPayload } from "@/lib/types";
import { runGenerationPipeline } from "@/lib/services/orchestrator.service";
import { logger, LogCategory } from "@/lib/services/logger.service";
import { errorHandler, ValidationError } from "@/lib/services/error-handler.service";
import { validationService } from "@/lib/services/validation.service";
import { metricsService } from "@/lib/services/metrics.service";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const path = '/api/generate';
  const method = 'POST';

  logger.info(LogCategory.API, 'Generate API called', {
    requestId,
    method,
    path
  });

  const userId = extractUserId(request); // Extract userId early for logging

  try {
    // 1. Parser et valider le payload
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

    // 2. Exécuter la génération
    const result = await runGenerationPipeline(payload, userId);

    const duration = Date.now() - startTime;
    logger.info(LogCategory.API, 'Generate API completed successfully', {
      useCase: payload.useCase,
      duration,
      requestId,
      userId
    });

    // 3. Enregistrer les métriques
    metricsService.recordAPIMetrics(path, method, 200, duration);

    return NextResponse.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    return errorHandler(error, duration, { requestId, userId, path, method });
  }
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function extractUserId(request: NextRequest): string | undefined {
  // À adapter selon votre système d'authentification
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Décoder le JWT pour extraire l'userId
    return 'user_from_token'; // Placeholder
  }
  return undefined;
}