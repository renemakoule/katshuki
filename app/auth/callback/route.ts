// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error) {
    console.error(`Auth Callback Error: ${error} - ${errorDescription}`);
    // Rediriger vers la page d'accueil avec un message d'erreur pour afficher un toast
    return NextResponse.redirect(`${requestUrl.origin}/?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    try {
      await supabase.auth.exchangeCodeForSession(code);
       // Rediriger vers /my_account avec un message de succès pour afficher un toast
      return NextResponse.redirect(`${requestUrl.origin}/my_account?success=Login successful!`);
    } catch (exchangeError: any) {
      console.error("Error exchanging code for session:", exchangeError.message);
      return NextResponse.redirect(`${requestUrl.origin}/?error=${encodeURIComponent(exchangeError.message || 'Failed to process login.')}`);
    }
  }

  // Fallback: si pas de code et pas d'erreur (ne devrait pas arriver)
  console.warn("Auth Callback: No code or error parameter found.");
  return NextResponse.redirect(`${requestUrl.origin}/?error=Invalid authentication callback.`);
}