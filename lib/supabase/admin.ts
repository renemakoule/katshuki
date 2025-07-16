// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

// This client is intended for backend use only, with administrative privileges.
// It uses the SERVICE_ROLE_KEY, which should be kept secret and never exposed to the client-side.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // In a production environment, you might want to throw an error.
  // For now, we log a warning to avoid crashing the server during development if keys are missing.
  console.warn('Supabase admin client not initialized. Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
}

// Note: We are not using generated types here (<Database>) for simplicity,
// but you could add them for enhanced type safety.
export const supabaseAdmin = createClient(
  supabaseUrl!,
  supabaseServiceRoleKey!
);
