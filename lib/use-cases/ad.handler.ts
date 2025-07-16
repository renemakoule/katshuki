// lib/use-cases/ad.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getAdPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { objective, targetAudience, offer, companyName, dates, style } = choices;

  let instructions = `L'utilisateur veut créer une publicité commerciale.`;
  if (objective) instructions += `\n- Objectif principal de la publicité : "${objective}".`;
  if (companyName) instructions += `\n- Nom de l'entreprise : "${companyName}".`;
  if (offer) instructions += `\n- Offre ou message principal : "${offer}".`;
  if (dates) instructions += `\n- Période de validité de l'offre : ${dates}.`;
  if (targetAudience) instructions += `\n- Le public cible est : ${targetAudience}.`;
  if (style) instructions += `\n- Le style publicitaire souhaité est : "${style}".`;

  return instructions.trim();
}