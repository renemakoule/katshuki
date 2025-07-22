//app/api/clarify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { openaiService } from '@/lib/services/openai.service';
import { errorHandler } from '@/lib/services/error-handler.service';
import { logger, LogCategory } from '@/lib/services/logger.service';
import { metricsService } from '@/lib/services/metrics.service';
import { ClarificationPayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const { pathname: path } = request.nextUrl;
  const method = request.method;
  const userId = extractUserId(request);

  logger.info(LogCategory.API, 'Clarify request received', { requestId, userId, path, method });

  try {
    const body: ClarificationPayload = await request.json();

    // Using the correct method from the OpenAI service
    const result = await openaiService.createChatCompletion(body);

    const duration = Date.now() - startTime;
    logger.info(LogCategory.API, 'Clarify request successful', { requestId, duration });
    metricsService.recordAPIMetrics(path, method, 200, duration);

    return NextResponse.json(result);

  } catch (error: any) {
    return errorHandler.handleError(error, requestId);
  }
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function extractUserId(request: NextRequest): string | undefined {
  // This should be adapted to your actual authentication system
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return 'user_from_token'; // Placeholder
  }
  return undefined;
}
