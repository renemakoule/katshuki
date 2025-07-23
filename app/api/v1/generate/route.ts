// app/api/v1/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { OrchestratorService } from '@/lib/services/orchestrator/orchestrator.service';
import { CreativeTaskRequest } from '@/lib/services/orchestrator/orchestrator.service';

/**
 * The single entry point for all creative generation tasks.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API_GENERATE_REQUEST]', body);

    // Basic validation
    if (!body.useCase || !body.choices || !body.userId) {
      return NextResponse.json({ success: false, error: 'Missing required parameters: useCase, choices, userId' }, { status: 400 });
    }

    const taskRequest: CreativeTaskRequest = {
      useCase: body.useCase,
      choices: body.choices,
      userId: body.userId,
      params: undefined
    };

    // Instantiate the orchestrator and handle the request
    const orchestrator = new OrchestratorService();
    const response = await orchestrator.handleRequest(taskRequest);

    if (!response.success) {
      return NextResponse.json(response, { status: 500 });
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('[API_GENERATE_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
