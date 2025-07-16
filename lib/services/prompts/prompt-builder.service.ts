import {
  PERSONA_PROMPT,
  MISSION_PROMPT,
  REFLECTION_PROTOCOL_PROMPT,
  OUTPUT_CONSTRAINTS_PROMPT,
  USER_REQUEST_PROMPT,
} from '@/lib/prompts/prompt-components';
import {
  DESIGN_PROPOSAL_SCHEMA,
  CV_SCHEMA,
  SOCIAL_POST_SCHEMA,
  LETTER_SCHEMA,
  PRODUCT_SHEET_SCHEMA,
  MUSIC_COMPOSITION_SCHEMA,
} from '@/lib/schemas/schemas';

// Defining the structured output for the prompt builder
export interface BuiltPrompt {
  finalPrompt: string;
  modelParams: Record<string, any>; // For temperature, max_tokens, etc.
}

// Interface for the prompt builder service
export interface IPromptBuilderService {
  build(useCase: string, params: any): Promise<BuiltPrompt>;
}

export class PromptBuilderService implements IPromptBuilderService {
  public async build(useCase: string, params: any): Promise<BuiltPrompt> {
    console.log(`Building prompt for use case: ${useCase}`);

    switch (useCase) {
      case 'image-generation':
        return this.buildImagePrompt(params);
      case 'text-generation':
        return this.buildTextPrompt(params);
      default:
        throw new Error(`Use case '${useCase}' is not supported.`);
    }
  }

  private async buildImagePrompt(params: any): Promise<BuiltPrompt> {
    const { assetType, ...creationParams } = params;
    let userRequest: string;

    switch (assetType) {
      case 'logo':
        userRequest = this.constructLogoRequest(creationParams);
        break;
      case 'flyer':
        userRequest = this.constructFlyerRequest(creationParams);
        break;
      case 'advertisement':
        userRequest = this.constructAdvertisementRequest(creationParams);
        break;
      case 'menu':
        userRequest = this.constructMenuRequest(creationParams);
        break;
      case 'profile_picture':
        userRequest = this.constructProfilePictureRequest(creationParams);
        break;
      case 'card':
        userRequest = this.constructCardRequest(creationParams);
        break;
      case 'wanted_poster':
        userRequest = this.constructWantedPosterRequest(creationParams);
        break;
      default:
        throw new Error(`Type d'asset visuel non supporté : ${assetType}`);
    }

    const finalPrompt = `
      ${PERSONA_PROMPT}
      ${MISSION_PROMPT}
      ${USER_REQUEST_PROMPT(userRequest)}
      ${REFLECTION_PROTOCOL_PROMPT}
      ${OUTPUT_CONSTRAINTS_PROMPT(DESIGN_PROPOSAL_SCHEMA)}
    `;

    return {
      finalPrompt,
      modelParams: {
        temperature: 0.4,
        max_tokens: 2048,
      },
    };
  }

  private async buildTextPrompt(params: any): Promise<BuiltPrompt> {
    const { assetType, ...creationParams } = params;
    let userRequest: string;
    let outputSchema: string;

    switch (assetType) {
      case 'cv':
        userRequest = this.constructCvRequest(creationParams);
        outputSchema = CV_SCHEMA;
        break;
      case 'social_post':
        userRequest = this.constructSocialPostRequest(creationParams);
        outputSchema = SOCIAL_POST_SCHEMA;
        break;
      case 'letter':
        userRequest = this.constructLetterRequest(creationParams);
        outputSchema = LETTER_SCHEMA;
        break;
      case 'product_sheet':
        userRequest = this.constructProductSheetRequest(creationParams);
        outputSchema = PRODUCT_SHEET_SCHEMA;
        break;
      case 'music_composition':
        userRequest = this.constructMusicCompositionRequest(creationParams);
        outputSchema = MUSIC_COMPOSITION_SCHEMA;
        break;
      default:
        throw new Error(`Type d'asset texte non supporté : ${assetType}`);
    }

    const finalPrompt = `
      ${PERSONA_PROMPT}
      ${MISSION_PROMPT}
      ${USER_REQUEST_PROMPT(userRequest)}
      ${REFLECTION_PROTOCOL_PROMPT}
      ${OUTPUT_CONSTRAINTS_PROMPT(outputSchema)}
    `;

    return {
      finalPrompt,
      modelParams: {
        temperature: 0.6, // Slightly higher temperature for creative writing
        max_tokens: 3000,
      },
    };
  }

  private constructLogoRequest(params: any): string {
    const { companyName, slogan, industry, style } = params;
    if (!companyName || !industry || !style) {
      throw new Error('Les paramètres pour le logo (companyName, industry, style) sont incomplets.');
    }
    return `Je dois créer une proposition de design pour un logo. Voici les détails :\n- Nom de l'entreprise : ${companyName}\n- Slogan : ${slogan || 'Non spécifié'}\n- Secteur d'activité : ${industry}\n- Style visuel souhaité : ${style}`;
  }

  private constructFlyerRequest(params: any): string {
    const { eventName, eventDate, location, description, targetAudience, style } = params;
    if (!eventName || !eventDate || !location || !description || !targetAudience || !style) {
      throw new Error('Les paramètres pour le flyer (eventName, eventDate, location, description, targetAudience, style) sont incomplets.');
    }
    return `Je dois créer une proposition de design pour un flyer promotionnel. Voici les détails :\n- Nom de l'événement : ${eventName}\n- Date et heure : ${eventDate}\n- Lieu : ${location}\n- Brève description : ${description}\n- Public cible : ${targetAudience}\n- Style visuel souhaité : ${style}`;
  }

  private constructCvRequest(params: any): string {
    const { fullName, jobTitle, tone, keyAchievements, experienceSummary } = params;
    if (!fullName || !jobTitle || !tone || !keyAchievements || !experienceSummary) {
      throw new Error('Les paramètres pour le CV (fullName, jobTitle, tone, keyAchievements, experienceSummary) sont incomplets.');
    }
    return `Je dois rédiger le contenu d'un Curriculum Vitae (CV). Voici les informations brutes fournies par l'utilisateur :\n- Nom complet : ${fullName}\n- Poste visé : ${jobTitle}\n- Ton souhaité : ${tone}\n- Réalisations clés (brutes) : ${keyAchievements}\n- Résumé de l'expérience (brut) : ${experienceSummary}`;
  }

  // New construct methods for image-generation
  private constructAdvertisementRequest(params: any): string {
    const { product, targetAudience, keyMessage, style } = params;
    return `Je dois créer une proposition de design pour un visuel publicitaire. Voici les détails :\n- Produit/Service à promouvoir : ${product}\n- Public cible : ${targetAudience}\n- Message clé : ${keyMessage}\n- Style visuel : ${style}`;
  }

  private constructMenuRequest(params: any): string {
    const { restaurantName, menuType, cuisine, style, items } = params;
    return `Je dois créer une proposition de design pour un menu. Voici les détails :\n- Nom du restaurant/café : ${restaurantName}\n- Type de menu : ${menuType}\n- Type de cuisine : ${cuisine}\n- Style visuel : ${style}\n- Exemples d'articles : ${items}`;
  }

  private constructProfilePictureRequest(params: any): string {
    const { subject, style, mood, colors } = params;
    return `Je dois créer une proposition de design pour une photo de profil ou un avatar. Voici les détails :\n- Sujet/Personne : ${subject}\n- Style artistique : ${style}\n- Ambiance/Mood : ${mood}\n- Palette de couleurs : ${colors}`;
  }

  private constructCardRequest(params: any): string {
    const { cardType, occasion, recipient, message, style } = params;
    return `Je dois créer une proposition de design pour une carte. Voici les détails :\n- Type de carte : ${cardType}\n- Occasion : ${occasion}\n- Destinataire : ${recipient}\n- Message à inclure : ${message}\n- Style visuel : ${style}`;
  }

  private constructWantedPosterRequest(params: any): string {
    const { subject, reason, reward, style } = params;
    return `Je dois créer une proposition de design pour un avis de recherche (style western, fantaisie, etc.). Voici les détails :\n- Sujet recherché : ${subject}\n- Raison : ${reason}\n- Récompense : ${reward}\n- Style visuel : ${style}`;
  }

  // New construct methods for text-generation
  private constructSocialPostRequest(params: any): string {
    const { topic, platform, tone, callToAction } = params;
    return `Je dois rédiger un post pour les réseaux sociaux. Voici les détails :\n- Sujet : ${topic}\n- Plateforme : ${platform}\n- Ton : ${tone}\n- Appel à l'action : ${callToAction}`;
  }

  private constructLetterRequest(params: any): string {
    const { letterType, senderInfo, recipientInfo, context, tone } = params;
    return `Je dois rédiger une lettre. Voici les détails :\n- Type de lettre : ${letterType}\n- Infos sur l'expéditeur : ${senderInfo}\n- Infos sur le destinataire : ${recipientInfo}\n- Contexte/Objectif : ${context}\n- Ton souhaité : ${tone}`;
  }

  private constructProductSheetRequest(params: any): string {
    const { productName, keyFeatures, targetAudience, tone } = params;
    return `Je dois rédiger une fiche produit. Voici les détails :\n- Nom du produit : ${productName}\n- Caractéristiques clés : ${keyFeatures}\n- Public cible : ${targetAudience}\n- Ton : ${tone}`;
  }

  private constructMusicCompositionRequest(params: any): string {
    const { genre, mood, theme, instruments } = params;
    return `Je dois composer une idée musicale. Voici les détails :\n- Genre musical : ${genre}\n- Ambiance/Mood : ${mood}\n- Thème des paroles : ${theme}\n- Instruments souhaités : ${instruments}`;
  }
}
