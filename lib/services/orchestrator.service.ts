import { logger, LogCategory } from './logger.service';
import { errorHandler, ValidationError, ExternalApiError } from './error-handler.service';
import { validationService } from './validation.service';
import { metricsService } from './metrics.service';
import { cacheService } from './cache.service';
import { openaiService } from './openai.service';
import { buildSuperBrainPrompt } from './prompt-builder.service';
import { GenerationPayload, AiStructuredResponse } from '@/lib/types';

export async function runGenerationPipeline(payload: GenerationPayload, userId?: string): Promise<AiStructuredResponse> {
  const startTime = Date.now();
  const requestId = generateRequestId();

  logger.info(LogCategory.GENERATION, 'Generation pipeline started', {
    useCase: payload.useCase,
    userId: userId,
    requestId
  });

  try {
    // 1. Validation: Ensure input data is correct and sanitized.
    const validationResult = validationService.validateAndSanitize(payload.choices, payload.useCase);
    if (!validationResult.isValid) {
      // Correctly throw a ValidationError with just a message string.
      throw new ValidationError(`Invalid payload for use case '${payload.useCase}': ${validationResult.errors.join(', ')}`);
    }

    // 2. Cache Check: Return cached data if available to save resources.
    const cacheKey = generateCacheKey(payload, userId);
    const cached = cacheService.get<AiStructuredResponse>(cacheKey);
    if (cached) {
      logger.info(LogCategory.GENERATION, 'Generation result served from cache', { requestId, userId: userId });
      return cached;
    }

    // 3. Prompt Engineering: Build the specific prompt for the AI.
    const systemPrompt = buildSuperBrainPrompt(payload);
    logger.debug(LogCategory.GENERATION, 'System prompt built', { requestId, promptLength: systemPrompt.length });

    // 4. AI Call: Generate content using the external AI service.
    let content: string | null;
    try {
      const response = await openaiService.createChatCompletion({
        messages: [{ role: 'system', content: systemPrompt }],
        responseFormat: { type: 'json_object' },
        cacheKey: `prompt:${generatePromptHash(systemPrompt)}`,
        useCase: payload.useCase,
        userId: userId
      });
      content = response.choices[0]?.message?.content ?? null;
      if (!content) {
        throw new Error('The OpenAI API response content is empty.');
      }
    } catch (apiError) {
      // Wrap external API errors in our custom error type.
      throw new ExternalApiError(apiError instanceof Error ? apiError.message : 'Failed to fetch from OpenAI.');
    }

    // 5. Response Parsing: Parse the JSON response from the AI.
    let parsedResponse: AiStructuredResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      logger.error(LogCategory.GENERATION, 'Failed to parse JSON response from AI', {
        requestId,
        error: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
        contentToParse: content.substring(0, 500) // Log a snippet of the problematic content
      });
      // Throw a specific error that the frontend can potentially handle.
      throw new ExternalApiError('The AI response was not in the expected format.');
    }

    // 6. Response Validation: Ensure the parsed response has the required structure.
    if (!parsedResponse.suggestions || !parsedResponse.proposals) {
      throw new ExternalApiError('Invalid AI response structure: missing suggestions or proposals.');
    }

    // 7. Caching: Store the successful result for future requests.
    cacheService.set(cacheKey, parsedResponse, 1800000); // 30 minutes

    const duration = Date.now() - startTime;
    logger.info(LogCategory.GENERATION, 'Generation pipeline completed successfully', {
      requestId, userId: userId, duration
    });

    // 8. Metrics: Record performance metrics for this successful run.
    metricsService.recordUseCaseMetrics(payload.useCase, true, duration);
    metricsService.recordTiming('generation.pipeline.total', duration, { useCase: payload.useCase });

    return parsedResponse;

  } catch (error) {
    const duration = Date.now() - startTime;
    // Log the failure with more context.
    logger.error(LogCategory.GENERATION, 'Generation pipeline failed', {
      useCase: payload.useCase,
      error: error instanceof Error ? { name: error.name, message: error.message } : 'Unknown error',
      requestId,
      userId: userId,
      duration
    });

    // Record failure metrics.
    metricsService.recordUseCaseMetrics(payload.useCase, false, duration);
    metricsService.incrementMetric('generation.pipeline.errors', { useCase: payload.useCase });

    // Re-throw the error to be handled by the global error handler.
    throw error;
  }
}

// Fonction pour générer des images
export async function runImageGenerationPipeline(params: {
  prompt: string;
  size?: string;
  quality?: string;
  style?: string;
  useCase?: string;
  userId?: string;
}): Promise<any> {
  const startTime = Date.now();
  const requestId = generateRequestId();

  logger.info(LogCategory.GENERATION, 'Image generation pipeline started', {
    useCase: params.useCase,
    size: params.size,
    userId: params.userId,
    requestId
  });

  try {
    // 1. Validation des paramètres
    const validationResult = validationService.validateImageGenerationParams(params);
    if (!validationResult.isValid) {
      throw new ValidationError(`Image generation validation failed: ${validationResult.errors.join(', ')}`);
    }

    // 2. Vérifier le cache
    const cacheKey = generateImageCacheKey(params, params.userId);
    const cached = cacheService.get(cacheKey);
    if (cached) {
      logger.info(LogCategory.GENERATION, 'Image generation result served from cache', {
        useCase: params.useCase,
        requestId,
        userId: params.userId
      });
      return cached;
    }

    // 3. Générer l'image
    const response = await openaiService.createImage({
      prompt: params.prompt,
      size: params.size || '1024x1024',
      quality: params.quality || 'standard',
      style: params.style || 'natural',
      cacheKey,
      useCase: params.useCase,
      userId: params.userId
    });

    const duration = Date.now() - startTime;
    logger.info(LogCategory.GENERATION, 'Image generation completed successfully', {
      useCase: params.useCase,
      duration,
      size: params.size,
      requestId,
      userId: params.userId
    });

    // 4. Enregistrer les métriques
    if (params.useCase) {
      metricsService.recordUseCaseMetrics(params.useCase, true, duration);
    }
    metricsService.recordTiming('generation.image.total', duration, { useCase: params.useCase });

    return response;

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error(LogCategory.GENERATION, 'Image generation pipeline failed', {
      useCase: params.useCase,
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId,
      userId: params.userId
    });

    // Enregistrer les métriques d'erreur
    if (params.useCase) {
      metricsService.recordUseCaseMetrics(params.useCase, false, duration);
    }
    metricsService.incrementMetric('generation.image.errors');

    throw error;
  }
}

// Fonctions utilitaires
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateCacheKey(payload: GenerationPayload, userId?: string): string {
  const payloadHash = JSON.stringify(payload).replace(/\s/g, '');
  return `gen:${payload.useCase}:${userId || 'anonymous'}:${hashString(payloadHash)}`;
}

function generateImageCacheKey(params: any, userId?: string): string {
  const paramsHash = JSON.stringify(params).replace(/\s/g, '');
  return `img:${params.useCase || 'unknown'}:${userId || 'anonymous'}:${hashString(paramsHash)}`;
}

function generatePromptHash(prompt: string): string {
  return hashString(prompt);
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}