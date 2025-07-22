// lib/services/openai.service.ts

import OpenAI from 'openai';
import { logger, LogCategory } from './logger.service';
import { errorHandler, ExternalApiError, TimeoutError, RateLimitError } from './error-handler.service';
import { configService } from './config.service';
import { rateLimiterService } from './rate-limiter.service';
import { metricsService } from './metrics.service';
import { cacheService } from './cache.service';

class OpenAIService {
  private client: OpenAI;
  private config: any;

  constructor() {
    this.config = { apiKey: configService.openaiApiKey, timeout: configService.timeout };
    
    if (!this.config.apiKey) {
  throw new Error("La clé API OpenAI n'est pas configurée dans .env.local");
}

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    });

    logger.info(LogCategory.API, 'OpenAI service initialized', {
      model: this.config.model,
      timeout: this.config.timeout
    });
  }

  async createChatCompletion(params: {
    messages: any[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: string };
    cacheKey?: string;
    useCase?: string;
    userId?: string;
  }): Promise<any> {
    const startTime = Date.now();
    const {
      messages,
      model = this.config.model,
      temperature = this.config.temperature,
      maxTokens = this.config.maxTokens,
      responseFormat,
      cacheKey,
      useCase,
      userId
    } = params;

    // Vérifier le cache si une clé est fournie
    if (cacheKey) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        metricsService.recordTiming('openai.cache.hit', Date.now() - startTime);
        logger.debug(LogCategory.API, 'OpenAI response served from cache', { cacheKey });
        return cached;
      }
    }

    // Rate limiting par utilisateur
    if (userId) {
      const { success } = await rateLimiterService.limit(userId);
      if (!success) {
        throw new RateLimitError();
      }
    }

    try {
      // Vérifier la validité des messages
      this.validateMessages(messages);

      const completionParams: any = {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      };

      if (responseFormat) {
        completionParams.response_format = responseFormat;
      }

      logger.debug(LogCategory.API, 'OpenAI request initiated', {
        model,
        messageCount: messages.length,
        useCase,
        userId
      });

      const response = await this.client.chat.completions.create(completionParams);
      const duration = Date.now() - startTime;

      // Enregistrer les métriques
      metricsService.recordTiming('openai.response.time', duration);
      metricsService.incrementMetric('openai.requests.success');
      
      if (useCase) {
        metricsService.recordUseCaseMetrics(useCase, true, duration);
      }

      // Mettre en cache si une clé est fournie
      if (cacheKey && response.choices[0]?.message?.content) {
        cacheService.set(cacheKey, response, 3600000); // 1 heure
      }

      logger.info(LogCategory.API, 'OpenAI request completed', {
        model,
        duration,
        tokensUsed: response.usage?.total_tokens,
        useCase,
        userId
      });

      return response;

    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Enregistrer les métriques d'erreur
      metricsService.incrementMetric('openai.requests.error');
      if (useCase) {
        metricsService.recordUseCaseMetrics(useCase, false, duration);
      }

      // Gérer les différents types d'erreurs
      if (error.code === 'rate_limit_exceeded') {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI quota exceeded. Please contact support.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key.');
      } else if (error.code === 'context_length_exceeded') {
        throw new Error('Request too long. Please reduce the input size.');
      } else if (error.code === 'timeout') {
        throw new TimeoutError('OpenAI request', this.config.timeout);
      } else {
        throw new ExternalApiError('OpenAI', error as Error);
      }
    }
  }

  async createImage(params: {
    prompt: string;
    size?: string;
    quality?: string;
    style?: string;
    cacheKey?: string;
    useCase?: string;
    userId?: string;
  }): Promise<any> {
    const startTime = Date.now();
    const {
      prompt,
      size = '1024x1024',
      quality = 'standard',
      style = 'natural',
      cacheKey,
      useCase,
      userId
    } = params;

    // Vérifier le cache si une clé est fournie
    if (cacheKey) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        metricsService.recordTiming('openai.image.cache.hit', Date.now() - startTime);
        logger.debug(LogCategory.API, 'OpenAI image response served from cache', { cacheKey });
        return cached;
      }
    }

    // Rate limiting plus strict pour les images
    if (userId) {
      const { success } = await rateLimiterService.limit(userId);
      if (!success) {
        throw new RateLimitError();
      }
    }

    try {
      // Valider le prompt
      if (!prompt || prompt.length < 10) {
        throw new Error('Prompt must be at least 10 characters long.');
      }

      if (prompt.length > 1000) {
        throw new Error('Prompt must be less than 1000 characters.');
      }

      logger.debug(LogCategory.API, 'OpenAI image generation initiated', {
        size,
        quality,
        style,
        useCase,
        userId
      });

      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt,
        size: size as any,
        quality: quality as any,
        style: style as any,
      });

      const duration = Date.now() - startTime;

      // Enregistrer les métriques
      metricsService.recordTiming('openai.image.generation.time', duration);
      metricsService.incrementMetric('openai.image.requests.success');
      
      if (useCase) {
        metricsService.recordUseCaseMetrics(useCase, true, duration);
      }

      // Mettre en cache si une clé est fournie
      if (cacheKey && response.data?.[0]?.url) {
        cacheService.set(cacheKey, response, 7200000); // 2 heures pour les images
      }

      logger.info(LogCategory.API, 'OpenAI image generation completed', {
        size,
        quality,
        style,
        duration,
        useCase,
        userId
      });

      return response;

    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Enregistrer les métriques d'erreur
      metricsService.incrementMetric('openai.image.requests.error');
      if (useCase) {
        metricsService.recordUseCaseMetrics(useCase, false, duration);
      }

      // Gérer les erreurs spécifiques aux images
      if (error.code === 'content_policy_violation') {
        throw new Error('Image generation blocked due to content policy violation.');
      } else if (error.code === 'billing_quota_exceeded') {
        throw new Error('Image generation quota exceeded.');
      } else {
        throw new ExternalApiError('OpenAI Image', error as Error);
      }
    }
  }

  private validateMessages(messages: any[]): void {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array.');
    }

    for (const message of messages) {
      if (!message.role || !message.content) {
        throw new Error('Each message must have a role and content.');
      }

      if (!['system', 'user', 'assistant'].includes(message.role)) {
        throw new Error('Message role must be system, user, or assistant.');
      }
    }
  }

  // Méthode pour obtenir des informations sur l'utilisation
  async getUsage(): Promise<any> {
    try {
      // Note: OpenAI n'a pas de méthode usage.list() dans la v4
      // Cette méthode est à implémenter selon les besoins
      logger.warn(LogCategory.API, 'OpenAI usage method not implemented in v4');
      return { error: 'Usage method not available in OpenAI v4' };
    } catch (error: any) {
      logger.error(LogCategory.API, 'Failed to get OpenAI usage', error);
      throw new ExternalApiError('OpenAI Usage', error as Error);
    }
  }

  // Méthode pour tester la connexion
  async testConnection(): Promise<boolean> {
    try {
      await this.client.models.list();
      logger.info(LogCategory.API, 'OpenAI connection test successful');
      return true;
    } catch (error: any) {
      logger.error(LogCategory.API, 'OpenAI connection test failed', error);
      return false;
    }
  }
}

// Instance singleton
export const openaiService = new OpenAIService();

// Export pour compatibilité avec le code existant
export const openai = openaiService['client'];