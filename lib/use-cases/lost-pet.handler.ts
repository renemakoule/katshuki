// lib/use-cases/lost-pet.handler.ts
import { UserChoices } from "@/lib/types";

export function getLostPetPrompt(choices: UserChoices): string {
  const { animalType, name, breed, color, distinguishingMarks, disappearanceDate, location, circumstances, contact, reward } = choices;

  let instructions = `URGENT : L'utilisateur a besoin d'une affiche très visible et claire pour retrouver un animal perdu.`;
  instructions += `\n- Type d'animal : ${animalType || 'Non précisé'}.`;
  instructions += `\n- Nom de l'animal : "${name || 'Non précisé'}".`;
  if (breed) instructions += `\n- Race : ${breed}.`;
  if (color) instructions += `\n- Couleur(s) : ${color}.`;
  if (distinguishingMarks && Array.isArray(distinguishingMarks) && distinguishingMarks.length > 0) {
    instructions += `\n- Signes distinctifs importants :\n` + distinguishingMarks.map(mark => `  - ${mark}`).join('\n');
  }
  instructions += `\n- Date de disparition : ${disappearanceDate || 'Non précisée'}.`;
  instructions += `\n- Lieu de disparition : ${location || 'Non précisé'}.`;
  if (circumstances) instructions += `\n- Circonstances : ${circumstances}.`;
  instructions += `\n- Contact en cas de découverte : ${contact || 'Non précisé'}.`;
  if (reward) instructions += `\n- Une récompense est offerte : ${reward}.`;

  return instructions.trim();
}