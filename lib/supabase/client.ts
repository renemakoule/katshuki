// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// Supposons que vous ayez un fichier de types généré :
// import type { Database } from './database.types'; // Ajustez le chemin

export const createSupabaseBrowserClient = () =>
  createClientComponentClient/*<Database>*/( // Décommentez <Database> si vous avez les types
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );