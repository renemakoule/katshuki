import { supabaseAdmin } from '@/lib/supabase/admin';
import { v4 as uuidv4 } from 'uuid';
import { AIModelGateway } from "@/lib/services/ai/ai-model.gateway";
import { UseCasePromptService } from '@/lib/services/prompts/use-case-prompt.service';
import { JobQueueService } from "@/lib/services/jobs/job-queue.service";
import { StorageService } from "@/lib/services/storage/storage.service";

// Defining the structured request for any creative task
import { UseCaseType, UserChoices } from '@/lib/types';

// The request now uses specific types for better safety.
export interface CreativeTaskRequest {
  params: any;
  useCase: UseCaseType;
  choices: UserChoices;
  userId: string;
}

// Defining the structured response for any creative task
export interface CreativeTaskResponse {
  success: boolean;
  projectId?: string;
  jobId?: string; // For async tasks
  results?: any[]; // Can contain URLs, text, etc.
  error?: string;
}

// Interface for the main orchestrator service
export interface IOrchestratorService {
  handleRequest(request: CreativeTaskRequest): Promise<CreativeTaskResponse>;
}

export class OrchestratorService implements IOrchestratorService {
    private promptService: UseCasePromptService;
  private aiGateway: AIModelGateway;
  private jobQueue: JobQueueService;
  private storage: StorageService;

  constructor() {
    // Dependencies will be injected here in a real DI container
        this.promptService = new UseCasePromptService();
    this.aiGateway = new AIModelGateway();
    this.jobQueue = new JobQueueService();
    this.storage = new StorageService();
  }

    public async handleRequest(request: CreativeTaskRequest): Promise<CreativeTaskResponse> {
    console.log(`Orchestrator handling request for use case: ${request.useCase}`);
    // All creative tasks are now handled by a single, unified method.
    return this.handleCreativeTask(request);
  }

    /**
   * Handles any creative task in a unified way.
   */
  private async handleCreativeTask(request: CreativeTaskRequest): Promise<CreativeTaskResponse> {
    try {
      const { useCase, choices, userId } = request;

      // 1. Build the prompt using the new UseCasePromptService
      const { systemPrompt, userPrompt } = this.promptService.build(useCase, choices);

      // 2. Call the AI model to get the result (JSON proposals or text)
      const aiResponse = await this.aiGateway.generateText(userPrompt, { systemPrompt });

      // 3. Save the project and results
      const projectId = uuidv4();
      const projectData = {
        id: projectId,
        user_id: userId,
        use_case: useCase,
        params: choices, // Store user choices for reference
        results: { raw: aiResponse }, // Store the raw AI response
      };

      const { error: dbError } = await supabaseAdmin.from('projects').insert(projectData);
      if (dbError) {
        console.error('[DB_INSERT_ERROR]', dbError);
        return { success: false, error: 'Failed to save project to the database.' };
      }

      // 4. Return the successful response
      return {
        success: true,
        projectId,
        results: [aiResponse], // Return the raw response for now
      };

    } catch (error) {
      console.error('[CREATIVE_TASK_ERROR]', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: `Failed to handle creative task: ${errorMessage}` };
    }
  }
}
