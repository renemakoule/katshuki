// lib/use-cases/index.ts (MODIFIÉ)

import { UserChoices, UseCaseType } from "@/lib/types";

import { getFlyerPrompt } from "./flyer.handler";
import { getMenuPrompt } from "./menu.handler";
import { getAdPrompt } from "./ad.handler";
import { getSearchNoticePrompt } from "./search-notice.handler";
import { getProductSheetPrompt } from "./product-sheet.handler";
import { getAvatarPrompt } from "./avatar.handler";
import { getBusinessCardPrompt } from "./business-card.handler";
import { getGreetingCardPrompt } from "./greeting-card.handler";
import { getCvPrompt } from "./cv.handler";
import { getLogoPrompt } from "./logo.handler";
import { getMusicCompositionPrompt } from "./music-composition.handler";
import { getContentWritingPrompt } from "./content-writing.handler";

const handlers: Record<UseCaseType, (choices: UserChoices, useCase: UseCaseType) => string> = {
  // Existant
  flyer: getFlyerPrompt,
  menu: getMenuPrompt,
  ad: getAdPrompt,
  'search-notice': getSearchNoticePrompt,
  'product-sheet': getProductSheetPrompt,
  // Nouveaux
  avatar: getAvatarPrompt,
  'business-card': getBusinessCardPrompt,
  'birthday-card': getGreetingCardPrompt,
  'wedding-card': getGreetingCardPrompt,
  cv: getCvPrompt,
  'lost-pet': getSearchNoticePrompt,
  logo: getLogoPrompt,
  'music-composition': getMusicCompositionPrompt,
  // Rédaction de contenu
  'social-post': getContentWritingPrompt,
  'cover-letter': getContentWritingPrompt,
  'internship-letter': getContentWritingPrompt,
  'job-app-letter': getContentWritingPrompt,
  'official-letter': getContentWritingPrompt,
};

export function getUseCaseInstructions(useCase: UseCaseType, choices: UserChoices): string {
  const handler = handlers[useCase];
  if (!handler) {
    throw new Error(`Cas d'usage non supporté : ${useCase}`);
  }
  return handler(choices, useCase);
}