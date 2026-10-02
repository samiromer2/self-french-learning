import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authPathWithNext } from "@/lib/safe-next-path";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component render — safe to ignore since
          // middleware refreshes the session on every request.
        }
      },
    },
  });
}

// Replacement for Auth.js's `auth()`. Uses getUser() (not getSession())
// because it revalidates the JWT against the Supabase Auth server rather
// than trusting an unverified decoded cookie — required for server code.
// cache() = one Auth round-trip per request, shared by header + page.
export const getCurrentUser = cache(async (): Promise<{
  id: string;
  email: string;
  name: string | null;
} | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email!,
    name: (user.user_metadata?.name as string | undefined) ?? null,
  };
});

// Auth guard for the account-only pages: redirects to /login when signed
// out, otherwise returns the non-null user. Pass `next` to send the visitor
// back to where they were headed once they log in. Thanks to the cache()
// above, the layout and page calling this in the same request share a
// single Auth round-trip.
//
// Public pages (the whole app/(learn) area) must use getCurrentUser()
// instead, which returns null for guests rather than redirecting.
export async function requireUser(next?: string) {
  const user = await getCurrentUser();
  if (!user) redirect(authPathWithNext("/login", next));
  return user;
}
