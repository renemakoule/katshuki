// lib/use-cases/business-card.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getBusinessCardPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { fullName, jobTitle, companyName, phone, email, website, address, style, logoConcept } = choices;

  let instructions = `L'utilisateur veut créer une carte de visite professionnelle. Le design doit être clair, lisible et refléter l'identité de la marque.`;
  
  instructions += `\n\n### Informations à inclure IMPÉRATIVEMENT :`;
  if (fullName) instructions += `\n- Nom complet : ${fullName}`;
  if (jobTitle) instructions += `\n- Titre / Poste : ${jobTitle}`;
  if (companyName) instructions += `\n- Nom de l'entreprise : ${companyName}`;
  if (phone) instructions += `\n- Téléphone : ${phone}`;
  if (email) instructions += `\n- Email : ${email}`;
  if (website) instructions += `\n- Site Web : ${website}`;
  if (address) instructions += `\n- Adresse : ${address}`;

  instructions += `\n\n### Directives de Design :`;
  if (style) instructions += `\n- Style général : "${style}". (ex: Minimalist and clean, Corporate and bold, Creative and artistic, Luxurious and elegant).`;
  if (logoConcept) instructions += `\n- Concept pour le logo (si aucun n'est fourni) : "${logoConcept}". (ex: a minimalist 'A' for 'Atelier', a stylized lion for 'Lion Corp').`;
  
  instructions += `\n- La typographie doit être parfaitement lisible. Assurer une hiérarchie visuelle claire entre le nom, le titre et les coordonnées.`;

  return instructions.trim();
}