import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key.
 * The browser never talks to Supabase directly — RLS blocks the anon
 * role entirely, and every read/write goes through our route handlers.
 */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. See .env.example.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type RsvpRow = {
  id: string;
  code: string;
  name: string;
  name_key: string;
  attending: boolean;
  party_size: number;
  note: string | null;
  locale: string;
  cancelled: boolean;
  created_at: string;
  updated_at: string;
};
