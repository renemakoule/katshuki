// app/api/clarify/route.ts

import { NextResponse } from "next/server";
import { ClarificationPayload } from "@/lib/types";
import { runClarificationPipeline } from "@/lib/services/clarification.service";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ClarificationPayload;

    if (!payload.idea || typeof payload.idea !== 'string' || payload.idea.trim() === '') {
      return NextResponse.json(
        { error: "Payload invalide. Une 'idea' non vide est requise." },
        { status: 400 }
      );
    }

    // On exécute le pipeline de clarification
    const result = await runClarificationPipeline(payload);
    
    // On retourne le plan d'action au frontend
    return NextResponse.json(result);

  } catch (error) {
    console.error("Erreur dans /api/clarify:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue.";
    return NextResponse.json(
      { error: "Erreur interne du serveur.", details: errorMessage },
      { status: 500 }
    );
  }
}