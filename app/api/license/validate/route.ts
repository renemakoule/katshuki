// app/api/license/validate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface LicenseValidationRequest {
  domain: string;
  licenseId?: string;
  userAgent: string;
  timestamp: number;
}

interface LicenseValidationResponse {
  valid: boolean;
  reason?: string;
  remainingDays?: number;
  features: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: LicenseValidationRequest = await request.json();
    const { domain, licenseId, userAgent, timestamp } = body;

    // Vérifications de base
    if (!domain || !userAgent || !timestamp) {
      return NextResponse.json({
        valid: false,
        reason: 'Paramètres manquants',
        features: []
      } as LicenseValidationResponse);
    }

    // Vérifier si la requête n'est pas trop ancienne (5 minutes max)
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      return NextResponse.json({
        valid: false,
        reason: 'Requête expirée',
        features: []
      } as LicenseValidationResponse);
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Si pas de licenseId, vérifier si c'est un domaine autorisé pour la version d'essai
    if (!licenseId) {
      const trialDomains = ['localhost', '127.0.0.1', 'financial-landing-demo.vercel.app'];
      
      if (trialDomains.includes(domain)) {
        return NextResponse.json({
          valid: true,
          remainingDays: 30,
          features: ['basic', 'trial']
        } as LicenseValidationResponse);
      }

      return NextResponse.json({
        valid: false,
        reason: 'Licence requise pour ce domaine',
        features: []
      } as LicenseValidationResponse);
    }

    // Vérifier la licence dans la base de données
    const { data: license, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('id', licenseId)
      .eq('domain', domain)
      .eq('status', 'active')
      .single();

    if (error || !license) {
      return NextResponse.json({
        valid: false,
        reason: 'Licence non trouvée ou inactive',
        features: []
      } as LicenseValidationResponse);
    }

    // Vérifier l'expiration
    const expiresAt = new Date(license.expires_at);
    const now2 = new Date();
    
    if (expiresAt < now2) {
      return NextResponse.json({
        valid: false,
        reason: 'Licence expirée',
        features: []
      } as LicenseValidationResponse);
    }

    // Calculer les jours restants
    const remainingDays = Math.ceil((expiresAt.getTime() - now2.getTime()) / (1000 * 60 * 60 * 24));

    // Enregistrer l'utilisation
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
                     
    await supabase
      .from('license_usage')
      .insert({
        license_id: licenseId,
        domain,
        user_agent: userAgent,
        ip_address: clientIP,
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({
      valid: true,
      remainingDays,
      features: license.features || ['basic']
    } as LicenseValidationResponse);

  } catch (error) {
    console.error('Erreur de validation de licence:', error);
    return NextResponse.json({
      valid: false,
      reason: 'Erreur serveur',
      features: []
    } as LicenseValidationResponse, { status: 500 });
  }
}
