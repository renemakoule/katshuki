// lib/use-cases/content-writing.handler.ts
import { UserChoices, UseCaseType } from "@/lib/types";

export function getContentWritingPrompt(choices: UserChoices, useCase: UseCaseType): string {
  const { contentType, topic, platform, tone, callToAction, senderInfo, recipientInfo, context, subject } = choices;

  let instructions = `L'utilisateur souhaite rédiger un contenu textuel de haute qualité. L'objectif est de produire un texte clair, bien structuré et adapté à la cible et au contexte spécifiés. La sortie doit être le texte final, prêt à l'emploi.`;

  instructions += `\n\n### TYPE DE CONTENU : ${contentType} ###`;

  switch (contentType) {
    case 'social-post':
      if (topic) instructions += `\n- Sujet du post : ${topic}`;
      if (platform) instructions += `\n- Plateforme de destination : ${platform}`;
      if (tone) instructions += `\n- Ton à adopter : ${tone}`;
      if (callToAction) instructions += `\n- Appel à l'action à inclure : ${callToAction}`;
      instructions += `\n- Le post doit être concis, engageant et inclure des hashtags pertinents.`;
      break;

    case 'cover-letter':
    case 'internship-letter':
    case 'job-app-letter':
      instructions += `\n- Type de lettre : ${contentType === 'cover-letter' ? 'Lettre de motivation' : (contentType === 'internship-letter' ? 'Demande de stage' : "Candidature à un emploi")}`;
      if (senderInfo) instructions += `\n- Informations sur l'expéditeur : ${senderInfo}`;
      if (recipientInfo) instructions += `\n- Informations sur le destinataire : ${recipientInfo}`;
      if (context) instructions += `\n- Contexte (poste visé, entreprise) : ${context}`;
      if (tone) instructions += `\n- Ton à adopter : ${tone}`;
      instructions += `\n- La lettre doit suivre la structure formelle (en-tête, corps, salutations) et mettre en avant les compétences et la motivation du candidat.`;
      break;
      
    case 'official-letter':
        if (subject) instructions += `\n- Objet de la lettre : ${subject}`;
        if (senderInfo) instructions += `\n- Informations sur l'expéditeur : ${senderInfo}`;
        if (recipientInfo) instructions += `\n- Informations sur le destinataire : ${recipientInfo}`;
        if (context) instructions += `\n- Contexte et points clés à aborder : ${context}`;
        instructions += `\n- Ton à adopter : Formel, respectueux et clair.`;
        instructions += `\n- La lettre doit être rédigée dans un langage administratif ou formel, sans ambiguïté.`;
        break;

    default:
      // Retourne une instruction générique si le type n'est pas reconnu par le switch
      instructions += `\n- L'utilisateur veut rédiger un document de type '${contentType}'. Les détails sont les suivants : ${JSON.stringify(choices, null, 2)}`;
      break;
  }

  return instructions.trim();
}
