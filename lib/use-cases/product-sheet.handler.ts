// lib/use-cases/product-sheet.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getProductSheetPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { productName, category, price, keyFeatures, marketingPositioning, salesInfo } = choices;
  
  let instructions = `L'utilisateur veut créer une fiche produit pour mettre en valeur un article à vendre.`;
  if (productName) instructions += `\n- Nom du produit : "${productName}".`;
  if (category) instructions += `\n- Catégorie : ${category}.`;
  if (price) instructions += `\n- Prix : ${price}.`;
  
  if (keyFeatures && Array.isArray(keyFeatures) && keyFeatures.length > 0) {
    instructions += `\n- Points forts principaux du produit :\n` + keyFeatures.map(feature => `  - ${feature}`).join('\n');
  }
  
  if (marketingPositioning) instructions += `\n- Positionnement marketing souhaité : "${marketingPositioning}".`;
  
  if (salesInfo && typeof salesInfo === 'object') {
    instructions += `\n- Informations de vente :`;
    for (const [key, value] of Object.entries(salesInfo)) {
      if (value) instructions += `\n  - ${key}: ${value}`;
    }
  }

  return instructions.trim();
}