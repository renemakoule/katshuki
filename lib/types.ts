// lib/types.ts

// Les différents cas d'usage que notre application supporte
export type UseCaseType = 
  // Visuals
  | 'flyer' 
  | 'menu' 
  | 'ad' 
  | 'search-notice' 
  | 'product-sheet'
  | 'avatar'
  | 'business-card'
  | 'birthday-card'
  | 'logo'
  | 'lost-pet'
  | 'wedding-card'
  // Text & Content
  | 'cv'
  | 'music-composition'
  | 'social-post'
  | 'cover-letter'
  | 'internship-letter'
  | 'job-app-letter'
  | 'official-letter';


// La structure des choix de l'utilisateur envoyée par le frontend
// C'est un objet flexible pour s'adapter à tous les formulaires
export interface UserChoices {
  [key: string]: any;
}

// Le payload complet que le frontend envoie à notre API
export interface GenerationPayload {
  useCase: UseCaseType;
  choices: UserChoices;
}

// La structure de la réponse que GPT-4o DOIT nous retourner
export type ProposalStyle = 'Classic' | 'Bold' | 'Minimalist' | 'Strategic';

export interface AiProposal {
  id: string;
  style: ProposalStyle;
  description: string;
  imagePrompt: string;
}

export interface AiStructuredResponse {
  suggestions: string[];
  proposals: AiProposal[];
}



export interface ClarificationPayload {
  idea: string;
}

// Réponse structurée de l'IA de clarification
// C'est le "plan d'action" pour le frontend
export interface ClarificationResponse {
  suggestedUseCase: UseCaseType;
  prefilledChoices: UserChoices;
  explanation: string; // Message pour l'utilisateur, ex: "Bonne idée ! Un flyer d'ouverture semble parfait. Voici un brouillon."
}

// Defines the structure of a prompt ready to be sent to the AI.
export interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
}