// lib/use-cases/menu.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getMenuPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { restaurantName, restaurantStyle, priceRange, visualAmbiance, menuItems } = choices;

  let instructions = `L'utilisateur veut créer un menu pour un établissement de restauration.`;
  if (restaurantName) instructions += `\n- Nom de l'établissement : "${restaurantName}".`;
  if (restaurantStyle) instructions += `\n- Style de cuisine : "${restaurantStyle}".`;
  if (priceRange) instructions += `\n- Gamme de prix : ${priceRange}.`;
  if (visualAmbiance) instructions += `\n- L'ambiance visuelle souhaitée est : "${visualAmbiance}".`;

  if (menuItems && typeof menuItems === 'object') {
    instructions += `\n\n- Contenu du menu :`;
    for (const [category, items] of Object.entries(menuItems)) {
      if (Array.isArray(items) && items.length > 0) {
        instructions += `\n  - ${category.toUpperCase()}:`;
        instructions += items.map((item: any) => `\n    - ${item.name} - ${item.price}`).join('');
      }
    }
  }

  return instructions.trim();
}