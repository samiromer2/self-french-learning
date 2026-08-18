import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

function isPublicGet(request: NextRequest) {
  if (request.method !== "GET") return false;
  const path = request.nextUrl.pathname;
  if (path === "/" || path === "/login" || path === "/signup") return true;
  if (path.startsWith("/analytics/learning")) return false;
  if (path === "/analytics" || path.startsWith("/analytics/")) return true;
  return false;
}

// Refreshes the Supabase auth cookie so sessions don't silently expire.
// Public GET pages skip the Auth round-trip so the first paint is not
// blocked on a network hop to Supabase. Protected routes still refresh.
export async function updateSession(request: NextRequest) {
  if (isPublicGet(request)) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Required: this call refreshes the session and must not be removed or
  // reordered relative to the response construction above.
  await supabase.auth.getUser();

  return supabaseResponse;
}
