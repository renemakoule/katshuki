// lib/use-cases/greeting-card.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getGreetingCardPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { theme, personalMessage, senderName } = choices;

  let instructions = `L'utilisateur veut créer une carte de vœux personnalisée.`;
  instructions += `\n- Type de carte : ${useCase}`;

  switch (useCase) {
    case 'birthday-card':
      const { recipientName, age } = choices;
      instructions += `\n- Destinataire : ${recipientName}.`;
      if (age) instructions += `\n- Âge célébré : ${age} ans.`;
      if (!personalMessage) instructions += `\n- Le message principal doit être un joyeux et chaleureux "Joyeux Anniversaire !".`;
      break;

    case 'wedding-card':
      const { coupleNames, weddingDate } = choices;
      instructions += `\n- Noms des mariés : ${coupleNames}.`;
      if (weddingDate) instructions += `\n- Date du mariage : ${weddingDate}.`;
      if (!personalMessage) instructions += `\n- Le message principal doit être des félicitations pour leur union.`;
      break;

    // Ajoutez d'autres cas ici (ex: 'thank-you', 'congratulations')

    default:
      instructions += `\n- C'est une carte de vœux générique.`;
      break;
  }

  if (theme) instructions += `\n- Thème de la carte : "${theme}".`;
  
  instructions += `\n\n### Contenu du Message :`;
  if (personalMessage) instructions += `\n- Message personnel à inclure : "${personalMessage}"`;
  if (senderName) instructions += `\n- Signé par : ${senderName}.`;

  instructions += `\n- Le design doit être élégant et correspondre au thème et à l'événement. La lisibilité est primordiale.`;
  
  return instructions.trim();
}