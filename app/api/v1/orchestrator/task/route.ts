import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OrchestratorService, CreativeTaskRequest } from '@/lib/services/orchestrator/orchestrator.service';

const orchestratorService = new OrchestratorService();

/**
 * @swagger
 * /api/v1/orchestrator/task:
 *   post:
 *     summary: Orchestrates a creative AI task
 *     description: >
 *       This endpoint acts as a central orchestrator for various AI-powered creative tasks.
 *       It routes requests to the appropriate services based on the specified `useCase`,
 *       such as image generation, text creation, etc.
 *     tags:
 *       - Orchestrator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreativeTaskRequest'
 *     responses:
 *       200:
 *         description: Successful task completion.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreativeTaskResponse'
 *       400:
 *         description: Bad Request - Invalid input or missing parameters.
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       500:
 *         description: Internal Server Error.
 */
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreativeTaskRequest = await request.json();

    if (!body.useCase || !body.params) {
      return NextResponse.json({ success: false, error: 'Missing useCase or params' }, { status: 400 });
    }

    // Inject userId into the params and create the final request object
    const taskRequest: CreativeTaskRequest = {
      useCase: body.useCase,
      params: { ...body.params, userId: user.id },
    };

    const response = await orchestratorService.handleRequest(taskRequest);

    if (!response.success) {
      return NextResponse.json(response, { status: 500 });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('[API_ORCHESTRATOR_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
