// lib/prompts/creative-levers.ts

/**
 * Définit les leviers créatifs pour l'enrichissement des prompts d'image.
 * L'externalisation de ces concepts permet de les maintenir et de les faire évoluer facilement.
 */
export const realismLevers = {
  CAMERA: `**Technique (Caméra)** : Spécifiez un type de photo, un appareil, un objectif, et une ouverture (ex: "ultra-photorealistic, shot on a Canon R5 with a 50mm f/1.2 lens, shallow depth of field, beautiful bokeh").`,
  LIGHTING: `**Lumière (Âme)** : Décrivez la lumière avec précision (ex: "soft window light from the side", "dramatic cinematic rim lighting", "warm golden hour glow").`,
  EMOTION: `**Émotion (Humain)** : Capturez une action ou une émotion authentique (ex: "candid moment of genuine laughter", "eyes filled with determination", "a quiet moment of introspection").`,
  CONTEXT: `**Contexte (Histoire)** : Immergez le sujet dans un environnement riche (ex: "in a bustling, vibrant street market", "in a cozy, cluttered artist's studio").`,
  IMPERFECTION: `**Imperfection (Réalité)** : Ajoutez une touche de réalisme qui brise la perfection numérique (ex: "subtle film grain", "a single stray hair catching the light", "a slight, natural lens flare", "realistic skin texture with visible pores").`,
  STORYTELLING: `**Micro-Histoire (Narration)** : Quelle est l'histoire qui se déroule dans cette fraction de seconde ? (ex: "a chef tastes his creation, a mix of pride and anxiety in his eyes", "an artist stares at her blank canvas, the weight of possibility upon her", "two traders in a silent, tense negotiation").`
};
