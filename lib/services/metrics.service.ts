// lib/services/metrics.service.ts
import { logger, LogCategory } from './logger.service';

/**
 * A service for recording application metrics.
 * In a real-world scenario, this would integrate with a monitoring service
 * like DataDog, Prometheus, or New Relic.
 */
class MetricsService {
  /**
   * Records API performance metrics.
   *
   * @param path The API endpoint path (e.g., '/api/generate').
   * @param method The HTTP method (e.g., 'POST').
   * @param statusCode The HTTP status code of the response.
   * @param duration The duration of the request in milliseconds.
   */
  public recordAPIMetrics(path: string, method: string, statusCode: number, duration: number): void {
    logger.info(LogCategory.METRIC, 'API Metric Recorded', {
      metric: 'api.response',
      path,
      method,
      statusCode,
      duration,
    });
    // Example: StatsD.timing('api.response_time', duration, { path, method, statusCode });
  }

  public recordUseCaseMetrics(useCase: string, success: boolean, duration: number): void {
    logger.info(LogCategory.METRIC, 'Use Case Metric Recorded', {
      metric: 'usecase.execution',
      useCase,
      success,
      duration,
    });
    // Example: StatsD.timing('usecase.duration', duration, { useCase, success });
  }

  public recordTiming(metricName: string, duration: number, tags?: any): void {
    logger.info(LogCategory.METRIC, 'Timing Metric Recorded', {
      metric: metricName,
      duration,
      tags,
    });
    // Example: StatsD.timing(metricName, duration, tags);
  }

  public incrementMetric(metricName: string, tags?: any): void {
    logger.info(LogCategory.METRIC, 'Counter Metric Incremented', {
      metric: metricName,
      tags,
    });
    // Example: StatsD.increment(metricName, tags);
  }

  /**
   * Records API call metrics with standardized format
   */
  public recordApiCall(path: string, method: string, duration: number, statusCode: number): void {
    logger.info(LogCategory.METRIC, 'API Call Metric Recorded', {
      metric: 'api.call',
      path,
      method,
      duration,
      statusCode,
    });
    // Example: StatsD.timing('api.call.duration', duration, { path, method, statusCode });
  }

  /**
   * Records generation success metrics
   */
  public recordGenerationSuccess(useCase: string, duration: number): void {
    logger.info(LogCategory.METRIC, 'Generation Success Metric Recorded', {
      metric: 'generation.success',
      useCase,
      duration,
    });
    // Example: StatsD.timing('generation.success.duration', duration, { useCase });
  }

  /**
   * Records generation error metrics
   */
  public recordGenerationError(errorType: string, errorMessage: string): void {
    logger.info(LogCategory.METRIC, 'Generation Error Metric Recorded', {
      metric: 'generation.error',
      errorType,
      errorMessage,
    });
    // Example: StatsD.increment('generation.error.count', { errorType });
  }

  /**
   * Records cache hit/miss metrics
   */
  public recordCacheHit(cacheType: string): void {
    logger.info(LogCategory.METRIC, 'Cache Hit Metric Recorded', {
      metric: 'cache.hit',
      cacheType,
    });
    // Example: StatsD.increment('cache.hit.count', { cacheType });
  }

  public recordCacheMiss(cacheType: string): void {
    logger.info(LogCategory.METRIC, 'Cache Miss Metric Recorded', {
      metric: 'cache.miss',
      cacheType,
    });
    // Example: StatsD.increment('cache.miss.count', { cacheType });
  }

  /**
   * Records user quota metrics
   */
  public recordQuotaUsage(userId: string, quotaType: 'daily' | 'monthly', usage: number, limit: number): void {
    logger.info(LogCategory.METRIC, 'Quota Usage Metric Recorded', {
      metric: 'quota.usage',
      userId,
      quotaType,
      usage,
      limit,
      percentage: (usage / limit) * 100,
    });
    // Example: StatsD.gauge('quota.usage.percentage', (usage / limit) * 100, { userId, quotaType });
  }

  /**
   * Records job creation metrics.
   *
   * @param jobType The type of job being created.
   * @param duration The duration of the job creation process in milliseconds.
   */
  public recordJobCreation(jobType: string, duration: number): void {
    logger.info(LogCategory.METRIC, 'Job Creation Metric Recorded', {
      metric: 'job.creation',
      jobType,
      duration,
    });
    // Example: StatsD.timing('job.creation_time', duration, { jobType });
  }

  /**
   * Records job completion metrics.
   *
   * @param jobType The type of job that was completed.
   * @param duration The duration of the job processing in milliseconds.
   * @param success Whether the job completed successfully.
   */
  public recordJobCompletion(jobType: string, duration: number, success: boolean): void {
    logger.info(LogCategory.METRIC, 'Job Completion Metric Recorded', {
      metric: 'job.completion',
      jobType,
      duration,
      success,
    });
    // Example: StatsD.timing('job.completion_time', duration, { jobType, success });
  }
}

export const metricsService = new MetricsService();

// Export the class for potential extension
export { MetricsService };
