// app/api/license/track/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface UsageTrackingRequest {
  domain: string;
  userAgent: string;
  timestamp: number;
  licenseId: string;
  features: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: UsageTrackingRequest = await request.json();
    const { domain, userAgent, timestamp, licenseId, features } = body;

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Obtenir l'adresse IP du client
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Enregistrer l'utilisation pour les analytics
    await supabase
      .from('license_analytics')
      .insert({
        license_id: licenseId,
        domain,
        user_agent: userAgent,
        ip_address: clientIP,
        features_used: features,
        session_timestamp: new Date(timestamp).toISOString(),
        created_at: new Date().toISOString()
      });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur de tracking d\'utilisation:', error);
    // Ne pas faire échouer l'application pour un problème de tracking
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
