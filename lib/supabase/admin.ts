import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

// Service-role client — bypasses RLS and Auth restrictions (including email
// confirmation requirements). Only ever import this from server-only code
// (Route Handlers, Server Actions), never from anything that could end up
// in a client bundle.
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not set.");
  }

  return createSupabaseClient(SUPABASE_URL, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
