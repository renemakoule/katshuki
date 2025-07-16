// lib/use-cases/avatar.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getAvatarPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { style, mood, background, clothing, specificInstructions } = choices;

  let instructions = `L'utilisateur veut créer une nouvelle photo de profil ou un avatar percutant. L'objectif est de générer un portrait de haute qualité qui peut être utilisé sur les réseaux sociaux professionnels ou personnels.`;
  
  if (style) instructions += `\n- Le style visuel principal est : "${style}". (ex: Photorealistic, Digital painting, Anime, 3D character, Cartoon, Vintage).`;
  if (mood) instructions += `\n- L'émotion ou l'ambiance à transmettre est : "${mood}". (ex: Professional and confident, Friendly and approachable, Mysterious and artistic, Energetic and fun).`;
  if (clothing) instructions += `\n- La tenue vestimentaire est : "${clothing}". (ex: Business suit, Casual t-shirt, Fantasy armor, Futuristic outfit).`;
  if (background) instructions += `\n- L'arrière-plan doit être : "${background}". (ex: Neutral studio background (grey/white), Blurred office environment, Abstract colorful shapes, Nature landscape).`;
  if (specificInstructions) instructions += `\n- Instructions spécifiques de l'utilisateur : "${specificInstructions}".`;

  instructions += `\n- Le cadrage doit être un portrait serré (headshot) ou un buste (chest-up), focalisé sur le visage et les expressions.`;

  return instructions.trim();
}