// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Si l'utilisateur n'est pas authentifié
  if (!session) {
    // S'il essaie d'accéder à /my_account ou des sous-routes, rediriger vers la page d'accueil
    if (pathname.startsWith('/my_account')) {
      console.log('[Middleware] No session, trying to access /my_account. Redirecting to /');
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    // Si l'utilisateur est authentifié et essaie d'accéder à la page d'accueil (ou une page de login/signup spécifique)
    // on le redirige vers son compte.
    // Modifiez '/' si votre page de connexion est ailleurs.
    if (pathname === '/') {
        console.log('[Middleware] Session found, on /. Redirecting to /my_account');
        return NextResponse.redirect(new URL('/my_account', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, y compris auth/callback)
     * - auth (pour notre route /auth/callback)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|auth/).*)',
  ],
};