// lib/use-cases/music-composition.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getMusicCompositionPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { genre, mood, theme, instruments } = choices;

  let instructions = `L'utilisateur souhaite générer une idée de composition musicale structurée. L'objectif est de fournir une base solide pour un musicien ou un producteur, incluant des paroles, une progression d'accords, une structure et des suggestions d'instrumentation. La sortie doit être au format JSON, en respectant le schéma fourni.`;

  instructions += `\n\n### BRIEF MUSICAL ###`;
  if (genre) instructions += `\n- Genre musical principal : ${genre}. (ex: Pop, Rock, Lofi, Electro, Folk)`;
  if (mood) instructions += `\n- Ambiance / Mood : ${mood}. (ex: Mélancolique, Énergique, Épique, Rêveur)`;
  if (theme) instructions += `\n- Thème des paroles : ${theme}. (ex: Amour perdu, Aventure, Réflexion sur le temps qui passe)`;
  if (instruments) instructions += `\n- Instruments suggérés : ${instruments}. (ex: Piano, guitare acoustique, synthétiseurs, section de cordes)`;

  instructions += `\n\n### DIRECTIVES DE COMPOSITION ###`;
  instructions += `\n- Proposer un titre accrocheur.`;
  instructions += `\n- Définir une progression d'accords simple mais efficace pour le couplet et le refrain.`;
  instructions += `\n- Écrire les paroles pour au moins un couplet et un refrain.`;
  instructions += `\n- Suggérer une structure de chanson classique (ex: Intro, Couplet, Refrain, Couplet, Refrain, Pont, Refrain, Outro).`;
  instructions += `\n- Décrire l'instrumentation idéale pour donner vie à la chanson.`;

  return instructions.trim();
}
