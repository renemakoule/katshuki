// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
// import type { Database } from './database.types'; // Ajustez si vous avez des types DB

// Pour Server Components et Server Actions
export const createSupabaseServerClient = () => {
  const cookieStore = cookies(); // Ceci est ReadonlyRequestCookies
  return createServerComponentClient/*<Database>*/({ // Décommentez <Database> si vous avez les types
    cookies: () => cookieStore, // La fonction attend une fonction qui retourne le cookieStore
    // PAS BESOIN DE supabaseUrl et supabaseKey ici, ils sont lus depuis process.env
  });
};

// Pour les Route Handlers (comme app/auth/callback/route.ts)
// createRouteHandlerClient fonctionne de la même manière (lit process.env)
// Exemple :
/*
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore }); // Lit aussi process.env
  // ...
}
*/

// Pour le Middleware
// createMiddlewareClient fonctionne aussi de la même manière (lit process.env)
// Exemple :
/*
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res }); // Lit aussi process.env
  // ...
}
*/