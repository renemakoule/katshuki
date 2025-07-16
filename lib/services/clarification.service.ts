import { openai } from "./openai.service";
import { ClarificationPayload, ClarificationResponse, UseCaseType } from "@/lib/types";

const clarificationSchema = {
  type: "object",
  properties: {
    suggestedUseCase: {
      type: "string",
      enum: [
        'flyer', 
        'menu', 
        'ad', 
        'search-notice', 
        'product-sheet', 
        'avatar', 
        'business-card', 
        'birthday-card', 
        'cv'
      ],
      description: "Le cas d'usage le plus pertinent à suggérer à l'utilisateur.",
    },
    prefilledChoices: {
      type: "object",
      description: "Un objet contenant les choix pré-remplis pour le formulaire du cas d'usage suggéré. Soyez créatif et pertinent.",
      properties: {},
    },
    explanation: {
      type: "string",
      description: "Un message court, amical et encourageant pour l'utilisateur expliquant votre choix.",
    },
  },
  required: ["suggestedUseCase", "prefilledChoices", "explanation"],
};

function buildClarityConsultantPrompt(idea: string): string {
  const masterPrompt = `
    ### PERSONA ET PROTOCOLE ###
    Vous êtes "SYNAPSE", une IA de conseil stratégique. Votre spécialité est de transformer une idée abstraite en un plan d'action concret. Vous utilisez un protocole de "Hypothèse-Évaluation-Recommandation".

    ### MISSION ###
    Analyser l'idée brute d'un utilisateur perdu et lui fournir un plan d'action JSON clair, incluant le prochain cas d'usage le plus pertinent et des informations pré-remplies pour lui faire gagner du temps.

    ### IDÉE BRUTE DE L'UTILISATEUR ###
    ---
    ${idea}
    ---

    ### PROTOCOLE DE RÉFLEXION INTERNE (META-INSTRUCTIONS) ###
    Suivez IMPÉRATIVEMENT ces étapes dans votre raisonnement interne.

    **ÉTAPE 1 : ANALYSE PROFONDE.**
    - Décodez l'intention, les entités, l'action principale et le sentiment de l'idée, comme un profiler. Quel est le VRAI besoin ?

    **ÉTAPE 2 : DIVERGENCE - GÉNÉRATION D'HYPOTHÈSES.**
    - Générez 2 hypothèses pour le "prochain pas logique" de l'utilisateur.
    - Pour chaque hypothèse, décrivez :
        - **Cas d'Usage Suggéré** : ex: 'flyer'
        - **Justification** : ex: "Idéal pour une annonce locale rapide avec un impact immédiat."
        - **Risque/Alternative** : ex: "Moins efficace pour construire une marque à long terme qu'une fiche produit détaillée."
    - EXEMPLE D'HYPOTHÈSE : Pour un "jeune diplômé qui cherche son premier emploi", le 'cv' est le plus impactant. Pour un "freelance qui veut networker", une 'business-card' est essentielle. Pour "améliorer mon profil LinkedIn", un 'avatar' professionnel est la priorité.

    **ÉTAPE 3 : CONVERGENCE - SÉLECTION DE LA MEILLEURE RECOMMANDATION.**
    - Comparez vos hypothèses.
    - Choisissez celle qui offre le meilleur équilibre entre l'impact immédiat et la pertinence pour un novice. Justifiez votre choix.
    - Ex: "Décision : L'hypothèse 2 ('flyer') est supérieure. L'utilisateur mentionne 'la semaine prochaine', l'urgence est donc le facteur décisif."

    **ÉTAPE 4 : SYNTHÈSE ET PRODUCTION.**
    - En vous basant sur votre recommandation finale, construisez l'objet JSON de sortie.
    - **Pour \`suggestedUseCase\`** : Utilisez le cas d'usage de votre hypothèse gagnante.
    - **Pour \`prefilledChoices\`** : Remplissez les champs de manière créative et pertinente, en anticipant les besoins.
    - **Pour \`explanation\`** : Rédigez un message qui reflète votre choix stratégique de manière simple et encourageante.

    ### CONTRAINTES DE SORTIE ABSOLUES ###
    - N'affichez JAMAIS votre processus de réflexion dans la sortie.
    - Votre réponse finale doit être UNIQUEMENT l'objet JSON valide, se conformant au schéma ci-dessous :
    ${JSON.stringify(clarificationSchema, null, 2)}
    `;

  return masterPrompt.trim();
}

export async function runClarificationPipeline(payload: ClarificationPayload): Promise<ClarificationResponse> {
  const systemPrompt = buildClarityConsultantPrompt(payload.idea);
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("La réponse de l'API OpenAI (clarification) est vide.");
  }
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("Erreur de parsing JSON (clarification):", error, "\nContenu reçu:", content);
    throw new Error("La réponse de l'API (clarification) n'a pas pu être traitée.");
  }
}