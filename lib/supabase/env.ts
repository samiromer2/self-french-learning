// Accepts either naming convention: Vercel's native Supabase integration
// populates NEXT_PUBLIC_SUPABASE_ANON_KEY; our own .env uses the newer
// NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY name. Both hold the same kind of
// value (a public, anon-scoped API key) and work interchangeably here.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;
