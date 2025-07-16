// lib/services/prompts/use-case-prompt.service.ts

import { getUseCaseInstructions } from '@/lib/use-cases';
import { BuiltPrompt, UserChoices, UseCaseType } from '@/lib/types';
import { SYSTEM_PROMPT } from './prompts';

/**
 * Ce service utilise la nouvelle architecture de handlers (use-cases)
 * pour construire les prompts.
 */
export class UseCasePromptService {
  /**
   * Construit un prompt en utilisant le handler de cas d'usage approprié.
   * @param useCase Le cas d'usage (ex: 'logo', 'cv').
   * @param choices Les options fournies par l'utilisateur.
   * @returns Un objet BuiltPrompt contenant le prompt système et le prompt utilisateur.
   */
  public build(useCase: UseCaseType, choices: UserChoices): BuiltPrompt {
    // Utilise le routeur de use-cases pour obtenir les instructions spécifiques.
    const userPrompt = getUseCaseInstructions(useCase, choices);

    if (!userPrompt) {
      throw new Error(`Impossible de générer des instructions pour le cas d'usage : ${useCase}`);
    }

    // L'objet retourné est compatible avec ce que l'OrchestratorService attend.
    return {
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
    };
  }
}
