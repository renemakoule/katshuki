// lib/use-cases/flyer.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getFlyerPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { eventName, eventType, date, location, targetAudience, style, program, services } = choices;

  let instructions = `L'utilisateur veut créer un flyer pour un événement.`;
  if (eventName) instructions += `\n- Nom de l'événement : "${eventName}".`;
  if (eventType) instructions += `\n- Type d'événement : "${eventType}".`;
  if (date) instructions += `\n- Date et Heure : ${date}.`;
  if (location) instructions += `\n- Lieu : ${location}.`;
  if (targetAudience) instructions += `\n- Le public cible est : ${targetAudience}.`;
  if (style) instructions += `\n- L'ambiance et le style visuel souhaités sont : "${style}".`;
  
  if (program && Array.isArray(program) && program.length > 0) {
    instructions += `\n- Programme de l'événement :\n` + program.map(item => `  - ${item}`).join('\n');
  }
  
  if (services && Array.isArray(services) && services.length > 0) {
    instructions += `\n- Services disponibles : ${services.join(', ')}.`;
  }

  return instructions.trim();
}