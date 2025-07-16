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
}

export const metricsService = new MetricsService();
