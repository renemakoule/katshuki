// lib/services/prompt-builder.service.ts
import { GenerationPayload } from "@/lib/types";
import { getUseCaseInstructions } from "@/lib/use-cases";
import {
  PERSONA_PROMPT,
  MISSION_PROMPT,
  REFLECTION_PROTOCOL_PROMPT,
  OUTPUT_CONSTRAINTS_PROMPT
} from "../prompts/prompt-components";

/**
 * Schéma de la réponse JSON attendue de l'IA.
 * Le style n'est plus une enum fixe, mais une chaîne de caractères générée dynamiquement
 * par l'IA pour correspondre aux archétypes qu'elle a créés.
 */
const responseSchema = {
  type: "object",
  properties: {
    suggestions: {
      type: "array",
      items: { type: "string" },
      description: "3-4 suggestions concrètes et actionnables pour améliorer la demande initiale de l'utilisateur.",
    },
    proposals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "Un identifiant unique, ex: proposal-1" },
          style: { 
            type: "string", 
            description: "L'archétype de design unique et pertinent généré par l'IA pour cette proposition (ex: 'Néo-Brutalisme Digital', 'Luxe Organique')." 
          },
          description: { type: "string", description: "Description de la stratégie de design de cette proposition." },
          imagePrompt: { type: "string", description: "Le prompt final et optimisé, en anglais, prêt à être envoyé à un générateur d'images comme DALL-E 3." },
        },
        required: ["id", "style", "description", "imagePrompt"],
      },
    },
    optimalParameters: {
      type: "object",
      properties: {
        size: { type: "string", enum: ["1024x1024", "1792x1024", "1024x1792"], description: "La taille optimale pour l'image, basée sur le contenu." },
        quality: { type: "string", enum: ["standard", "hd"], description: "'hd' pour le photoréalisme, sinon 'standard'." },
        style: { type: "string", enum: ["natural", "vivid"], description: "'natural' pour le réalisme, 'vivid' pour un rendu artistique." },
        reasoning: { type: "string", description: "Courte explication justifiant le choix des paramètres." }
      },
      required: ["size", "quality", "style", "reasoning"]
    },
  },
  required: ["suggestions", "proposals", "optimalParameters"],
};

/**
 * Construit le prompt final en assemblant les composants modulaires.
 * @param payload Les données de la requête de l'utilisateur.
 * @returns Le prompt complet et structuré pour l'IA.
 */
export function buildSuperBrainPrompt(payload: GenerationPayload): string {
  const { useCase, choices } = payload;
  const userRequestInstructions = getUseCaseInstructions(useCase, choices);
  const schemaString = JSON.stringify(responseSchema, null, 2);

  const masterPrompt = `
    ${PERSONA_PROMPT}
    ${MISSION_PROMPT}

    ### DEMANDE BRUTE DE L'UTILISATEUR ###
    - Cas d'usage : "${useCase}"
    - Détails fournis :
    ---
    ${userRequestInstructions}
    ---

    ${REFLECTION_PROTOCOL_PROMPT}
    ${OUTPUT_CONSTRAINTS_PROMPT(schemaString)}
  `;

  return masterPrompt.trim();
}