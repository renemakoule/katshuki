// lib/use-cases/logo.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getLogoPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { companyName, slogan, industry, style, colors } = choices;

  let instructions = `L'utilisateur souhaite une série de propositions de design pour un logo d'entreprise. L'objectif est de créer une identité visuelle forte, mémorable et adaptée à son secteur d'activité.`;

  instructions += `\n\n### BRIEF CRÉATIF ###`;
  if (companyName) instructions += `\n- Nom de l'entreprise à intégrer : ${companyName}`;
  if (slogan) instructions += `\n- Slogan (peut être inclus ou non) : ${slogan}`;
  if (industry) instructions += `\n- Secteur d'activité : ${industry}`;
  
  instructions += `\n\n### DIRECTIVES DE DESIGN ###`;
  if (style) instructions += `\n- Style de design souhaité : "${style}". (ex: Minimaliste, Moderne, Luxueux, Ludique, Vintage, Corporate, Abstrait).`;
  if (colors) instructions += `\n- Palette de couleurs : ${colors}. (ex: Tons bleus et blancs, Couleurs chaudes, Noir et or).`;
  instructions += `\n- Le logo doit être déclinable en plusieurs formats (icône, version complète avec nom, etc.).`;
  instructions += `\n- Proposer plusieurs concepts variés (basés sur une icône, une typographie, ou une combinaison).`;

  return instructions.trim();
}
