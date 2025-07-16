// lib/use-cases/cv.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getCvPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { fullName, jobTitle, contact, summary, experience, education, skills, designStyle } = choices;

  let instructions = `L'utilisateur veut créer un CV professionnel et visuellement attractif au format A4. L'objectif est de présenter ses informations de manière claire, structurée et professionnelle pour un recruteur.`;

  instructions += `\n\n### CONTENU DU CV ###`;
  if (fullName) instructions += `\n\n--- SECTION EN-TÊTE ---`;
  if (fullName) instructions += `\n- Nom complet (très visible) : ${fullName}`;
  if (jobTitle) instructions += `\n- Titre du poste visé : ${jobTitle}`;
  if (contact && typeof contact === 'object') {
    instructions += `\n- Coordonnées (regroupées et discrètes) : Téléphone: ${contact.phone}, Email: ${contact.email}, LinkedIn: ${contact.linkedin}, Ville: ${contact.city}`;
  }

  if (summary) instructions += `\n\n--- SECTION RÉSUMÉ / PROFIL ---`;
  if (summary) instructions += `\n- ${summary}`;

  if (experience && Array.isArray(experience) && experience.length > 0) {
    instructions += `\n\n--- SECTION EXPÉRIENCE PROFESSIONNELLE ---`;
    instructions += experience.map((exp: any) => 
      `\n- Poste : ${exp.title} chez ${exp.company} (${exp.location})` +
      `\n  Période : ${exp.dates}` +
      `\n  Missions : ${exp.duties.join(', ')}`
    ).join('\n');
  }

  if (education && Array.isArray(education) && education.length > 0) {
    instructions += `\n\n--- SECTION FORMATION ---`;
    instructions += education.map((edu: any) => 
      `\n- Diplôme : ${edu.degree} - ${edu.institution}` +
      `\n  Année : ${edu.year}`
    ).join('\n');
  }

  if (skills && Array.isArray(skills) && skills.length > 0) {
    instructions += `\n\n--- SECTION COMPÉTENCES ---`;
    instructions += `\n- ${skills.join(' | ')}`;
  }
  
  instructions += `\n\n### DIRECTIVES DE DESIGN ###`;
  if (designStyle) instructions += `\n- Style du design : "${designStyle}". (ex: Modern and clean with 2 columns, Classic and traditional (serif font), Creative with graphic elements, Minimalist and typography-focused).`;
  instructions += `\n- Le document doit être parfaitement lisible, aéré, et utiliser une hiérarchie de l'information impeccable (titres, sous-titres, corps de texte).`;

  return instructions.trim();
}