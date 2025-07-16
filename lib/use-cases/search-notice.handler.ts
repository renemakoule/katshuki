// lib/use-cases/search-notice.handler.ts (VERSION GÉNÉRIQUE ET COMPLÈTE)

import { UserChoices, UseCaseType } from "@/lib/types";

export function getSearchNoticePrompt(choices: UserChoices, useCase: UseCaseType): string {
  // On attend un champ "searchType" pour savoir quoi faire.
  const { 
    searchType, // 'animal', 'person', ou 'object'
    disappearanceDate, 
    location, 
    circumstances, 
    contact, 
    reward 
  } = choices;

  // Instruction de base, commune à tous les types de recherche
  let instructions = `URGENT : L'utilisateur a besoin d'une affiche très visible et claire pour un avis de recherche. L'objectif est de maximiser la visibilité et l'efficacité.`;
  instructions += `\nLe sujet de la recherche est : un(e) "${searchType || 'élément non spécifié'}".`;

  // Logique dynamique basée sur le type de recherche
  switch (searchType) {
    case 'animal':
      const { animalType, name, breed, color, distinguishingMarks } = choices;
      instructions += `\n\n### Détails sur l'animal ###`;
      if (animalType) instructions += `\n- Type : ${animalType}.`;
      if (name) instructions += `\n- Nom : "${name}".`;
      if (breed) instructions += `\n- Race : ${breed}.`;
      if (color) instructions += `\n- Couleur(s) : ${color}.`;
      if (distinguishingMarks && Array.isArray(distinguishingMarks) && distinguishingMarks.length > 0) {
        instructions += `\n- Signes distinctifs importants :\n` + distinguishingMarks.map(mark => `  - ${mark}`).join('\n');
      }
      break;

    case 'person':
      const { personName, age, height, lastSeenWearing, personDistinguishingMarks } = choices;
      instructions += `\n\n### Détails sur la personne (TRAITER AVEC SÉRIEUX ET RESPECT) ###`;
      if (personName) instructions += `\n- Nom : "${personName}".`;
      if (age) instructions += `\n- Âge : ${age}.`;
      if (height) instructions += `\n- Taille approximative : ${height}.`;
      if (lastSeenWearing) instructions += `\n- Dernière tenue vestimentaire connue : "${lastSeenWearing}".`;
      if (personDistinguishingMarks && Array.isArray(personDistinguishingMarks) && personDistinguishingMarks.length > 0) {
        instructions += `\n- Signes distinctifs :\n` + personDistinguishingMarks.map(mark => `  - ${mark}`).join('\n');
      }
      break;
      
    case 'object':
      const { objectName, brand, objectColor, objectDescription } = choices;
      instructions += `\n\n### Détails sur l'objet ###`;
      if (objectName) instructions += `\n- Nom de l'objet : "${objectName}".`;
      if (brand) instructions += `\n- Marque : ${brand}.`;
      if (objectColor) instructions += `\n- Couleur principale : ${objectColor}.`;
      if (objectDescription) instructions += `\n- Description/Signes particuliers : "${objectDescription}".`;
      break;

    default:
      instructions += `\n- L'utilisateur n'a pas spécifié de catégorie claire, veuillez créer un modèle générique d'avis de recherche.`;
  }
  
  // Ajout des informations communes à la fin
  instructions += `\n\n### Circonstances et Contact ###`;
  if (disappearanceDate) instructions += `\n- Date de perte/disparition : ${disappearanceDate}.`;
  if (location) instructions += `\n- Lieu de perte/disparition : ${location}.`;
  if (circumstances) instructions += `\n- Circonstances : ${circumstances}.`;
  instructions += `\n- Contact en cas de découverte : ${contact || 'Information de contact à ajouter'}.`;
  if (reward) instructions += `\n- Une récompense est offerte : ${reward}.`;

  return instructions.trim();
}